import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";


// Maps product types to their prices in paise (1 INR = 100 paise)
const PRODUCT_AMOUNTS: Record<string, number> = {
  NEW_VEHICLE_REPORT: 9900, // ₹99 in paise
  OLD_VEHICLE_REPORT: 9900,
};


// Zod schema to validate the incoming request body
const schema = z.object({
  productType: z.enum(["NEW_VEHICLE_REPORT", "OLD_VEHICLE_REPORT"]),
  referenceId: z.string().optional(),
});


// This API route creates a new Order row for a product purchase, or reuses an existing PENDING order
// to ensure idempotency and avoid duplicate orders on retries.
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

  const { productType, referenceId } = parsed.data;
  // 3. Look up the price for the selected product type
  const amount = PRODUCT_AMOUNTS[productType];

  // 4. Try to find an existing PENDING order for this user/product/reference
  //    This prevents duplicate orders if the user retries the flow
  const existing = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      productType,
      referenceId: referenceId ?? null,
      status: "PENDING",
    },
  });

  // 5. If found, reuse it; otherwise, create a new order
  const order =
    existing ??
    (await prisma.order.create({
      data: {
        userId: session.user.id,
        productType,
        referenceId: referenceId ?? null,
        amount,
        status: "PENDING",
      },
    }));

  // 6. Return the order ID to the client
  return NextResponse.json({ orderId: order.id });
}
