import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { processOrder } from "@/lib/orders/process-order";

// This API route handles Razorpay webhooks (e.g., payment.captured events).
// It verifies the webhook signature, updates Payment/Order, and triggers fulfillment atomically.
export async function POST(req: NextRequest) {
  // 1. Read the raw request body and signature header
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  // 2. Verify the webhook signature using HMAC SHA256
  //    This ensures the webhook is genuine and not tampered with
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // 3. Parse the webhook event
  const event = JSON.parse(rawBody) as {
    event: string;
    payload: { payment: { entity: { order_id: string; id: string } } };
  };

  // 4. Handle payment.captured event (other events are ignored)
  if (event.event === "payment.captured") {
    const { order_id: razorpayOrderId, id: razorpayPaymentId } = event.payload.payment.entity;

    // 5. Find the Payment record for this Razorpay order
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId },
    });

    // 6. If already processed or unknown, acknowledge silently (idempotency)
    if (!payment || payment.status === "PAID") {
      return NextResponse.json({ received: true });
    }

    // 7. Atomically update Payment and trigger fulfillment
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", razorpayPaymentId },
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: "COMPLETED" },
      });
      await processOrder(payment.orderId, tx);
    });
  }

  return NextResponse.json({ received: true });
}
