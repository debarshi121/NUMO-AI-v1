import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { processOrder } from "@/lib/orders/process-order";

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

// This API route verifies the Razorpay payment after the user completes checkout.
// It checks the payment signature, updates the Payment and Order rows, and triggers fulfillment.
export async function POST(req: NextRequest) {
  // 1. Authenticate the user
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse and validate the request body
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  // 3. Verify the payment signature using HMAC SHA256
  //    This ensures the payment is genuine and not tampered with
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  // 4. Find the Payment record and ensure it belongs to the user
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId: razorpay_order_id },
    include: { order: true },
  });

  if (!payment || payment.userId !== session.user.id) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  // 5. If already paid, return success (idempotency)
  if (payment.status === "PAID") {
    return NextResponse.json({ success: true, referenceId: payment.order.referenceId });
  }

  // 6. Atomically update Payment and Order, and trigger fulfillment
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });
    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: "COMPLETED" },
    });
    await processOrder(payment.orderId, tx);
  });

  return NextResponse.json({ success: true, referenceId: payment.order.referenceId });
}
