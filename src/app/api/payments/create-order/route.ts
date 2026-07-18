import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import razorpay from "@/lib/payments/razorpay";

const schema = z.object({
  orderId: z.string().min(1),
});

// This API route creates a Razorpay order and a Payment record for an existing Order.
// It is called after the user clicks the payment button and an Order row is already created.
export async function POST(req: NextRequest) {
  // 1. Ensure the user is authenticated
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

  const { orderId } = parsed.data;

  // 3. Fetch the order and check ownership
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  // Only allow payment for PENDING orders
  if (order.status !== "PENDING") {
    return NextResponse.json({ error: "Order already processed" }, { status: 409 });
  }

  // 4. Check if a PENDING payment already exists for this order (user retried payment)
  const existingPayment = await prisma.payment.findFirst({
    where: { orderId: order.id, status: "PENDING" },
  });

  // If a Razorpay order already exists, return its details (idempotency)
  if (existingPayment?.razorpayOrderId) {
    return NextResponse.json({
      razorpayOrderId: existingPayment.razorpayOrderId,
      paymentId: existingPayment.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  }

  // 5. Create a new Razorpay order via the SDK
  //    This returns a unique Razorpay order ID
  const rzpOrder = await razorpay.orders.create({
    amount: order.amount, // in paise
    currency: order.currency,
    receipt: order.id, // your internal order ID
  });

  // 6. Create or update the Payment record in your DB
  //    Save the Razorpay order ID for later verification
  const payment = existingPayment
    ? await prisma.payment.update({
        where: { id: existingPayment.id },
        data: { razorpayOrderId: rzpOrder.id },
      })
    : await prisma.payment.create({
        data: {
          userId: session.user.id,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          status: "PENDING",
          razorpayOrderId: rzpOrder.id,
        },
      });

  // 7. Return all details needed to open the Razorpay modal in the browser
  return NextResponse.json({
    razorpayOrderId: rzpOrder.id,
    paymentId: payment.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
}
