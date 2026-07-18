
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

type TransactionClient = Prisma.TransactionClient;

// This file contains the logic to fulfill an order after successful payment.
// Each product type can have its own fulfillment logic (e.g., generate a report, unlock content, etc.)

// Fulfillment logic for NEW_VEHICLE_REPORT
async function generateVehicleReport(
    {
        userId,
        orderId,
        referenceId,
    }: {
        userId: string;
        orderId: string;
        referenceId: string;
    },
    tx: TransactionClient,
) {
    // Link the vehicle report to the paid order
    await tx.report.updateMany({
        where: { id: referenceId, userId },
        data: { orderId },
    });
}


// Main function to process an order after payment
// This is always called inside a DB transaction for atomicity
export async function processOrder(orderId: string, tx: TransactionClient = prisma) {
    // 1. Fetch the order
    const order = await tx.order.findUnique({
        where: { id: orderId },
    });

    if (!order) throw new Error(`Order not found: ${orderId}`);

    // 2. Route to the correct fulfillment logic based on product type
    switch (order.productType) {
        case "NEW_VEHICLE_REPORT":
            if (!order.referenceId) throw new Error("referenceId required for vehicle report");
            await generateVehicleReport(
                { userId: order.userId, orderId: order.id, referenceId: order.referenceId },
                tx,
            );
            break;

        case "OLD_VEHICLE_REPORT":
            if (!order.referenceId) throw new Error("referenceId required for vehicle report");
            await generateVehicleReport(
                { userId: order.userId, orderId: order.id, referenceId: order.referenceId },
                tx,
            );
            break;

        default:
            throw new Error(`Unknown productType: ${order.productType}`);
    }
}
