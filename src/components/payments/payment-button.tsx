"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, any>) => { open(): void };
  }
}

interface PaymentButtonProps {
  productType: "NEW_VEHICLE_REPORT" | "OLD_VEHICLE_REPORT";
  referenceId?: string;
  label?: ReactNode;
  className?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== "undefined") {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// PaymentButton handles the full Razorpay checkout flow:
// 1. Creates an order in your DB
// 2. Creates a Razorpay order and Payment record
// 3. Opens the Razorpay modal for payment
// 4. Verifies the payment server-side and unlocks the report
export default function PaymentButton({
  productType,
  referenceId,
  label = "Unlock — ₹99",
  className,
  prefill,
}: PaymentButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Main handler for the payment button click
  async function handlePayment() {
    setLoading(true);

    try {
      // Ensure Razorpay checkout script is loaded
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        return;
      }

      // 1. Create an order in your database (PENDING)
      //    Returns: { orderId }
      const { data: orderData } = await axios.post<{ orderId: string; error?: string }>(
        "/api/orders/create",
        { productType, referenceId },
      );

      // 2. Create a Razorpay order and Payment record (PENDING)
      //    Returns: { razorpayOrderId, amount, currency, key }
      const { data: payData } = await axios.post<{
        razorpayOrderId: string;
        amount: number;
        currency: string;
        key: string;
        error?: string;
      }>("/api/payments/create-order", { orderId: orderData.orderId });

      // 3. Open Razorpay checkout modal in the browser
      //    User completes payment in the modal
      const rzp = new window.Razorpay({
        key: payData.key, // Public Razorpay key
        amount: payData.amount, // Amount in paise
        currency: payData.currency,
        order_id: payData.razorpayOrderId, // Razorpay order ID
        name: "NUMO AI",
        description: productType.replaceAll("_", " "),
        theme: { color: "#f2ca50" },
        prefill: {
          name: prefill?.name ?? "",
          email: prefill?.email ?? "",
          contact: prefill?.contact ?? "",
        },
        // Handler is called after successful payment
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 4. Verify payment server-side (signature check)
          //    This unlocks the report if payment is valid
          const { data: verifyData } = await axios.post<{ success: boolean; referenceId: string }>(
            "/api/payments/verify",
            response,
          );

          if (!verifyData.success) {
            toast.error("Payment verification failed. Contact support.");
            return;
          }

          toast.success("Payment successful! Loading your report…");
          // Redirect to the unlocked report
          router.push(`/report/${verifyData.referenceId}`);
        },
        // Called if user closes the modal without paying
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled.");
            setLoading(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      // Handles both network and API errors
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error ?? "Something went wrong. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={className}
    >
      {loading ? "Processing…" : label}
    </Button>
  );
}
