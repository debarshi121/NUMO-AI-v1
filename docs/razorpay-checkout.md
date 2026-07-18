# Razorpay Checkout — How It Works

## Overview

Razorpay uses a **two-server model**. Your server talks to Razorpay's API to create orders and verify payments. The user's browser loads Razorpay's checkout UI (a modal) directly from Razorpay's servers.

```
Your Server ←→ Razorpay API      (backend: create order, verify signature)
User Browser ←→ Razorpay Modal   (frontend: card/UPI input, OTP, etc.)
```

---

## The Full Flow Step by Step

```
User clicks "Pay ₹99"
        │
        ▼
[1] POST /api/orders/create
    → Creates an Order row in YOUR database (status: PENDING)
    ← Returns: { orderId }
        │
        ▼
[2] POST /api/payments/create-order
    → Validates the order belongs to this user
    → Calls Razorpay API: razorpay.orders.create({ amount: 9900, currency: "INR" })
    → Razorpay returns a razorpayOrderId (e.g. "order_xyz123")
    → Creates a Payment row in YOUR database (status: PENDING, razorpayOrderId saved)
    ← Returns: { razorpayOrderId, amount, currency, key }
        │
        ▼
[3] Browser opens Razorpay Modal
    → Loads checkout.razorpay.com/v1/checkout.js
    → new window.Razorpay({ key, amount, order_id: razorpayOrderId, ... }).open()
    → User enters card / UPI / netbanking details
    → Razorpay handles OTP, 3D Secure, bank redirects internally
        │
        ▼ (after user completes payment)
[4] Razorpay calls handler() in your browser
    → Passes: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    → These three values PROVE payment was successful
        │
        ▼
[5] POST /api/payments/verify
    → Verifies the signature using HMAC-SHA256
    → Updates Payment row: status=PAID, saves razorpayPaymentId + razorpaySignature
    → Updates Order row: status=COMPLETED
    → Calls processOrder() → unlocks the report
    ← Returns: { success: true, referenceId }
        │
        ▼
[6] Browser redirects to /report?reportId=...
```

---

## Why Two Orders? (Your Order vs Razorpay Order)

| | Your `Order` (database) | Razorpay Order |
|---|---|---|
| **Purpose** | Track what product was purchased | Enable the payment transaction |
| **Created by** | Your server | Razorpay's API |
| **ID format** | `cuid()` e.g. `cmpj...` | `order_xyz...` |
| **Lives in** | Your PostgreSQL | Razorpay's servers |
| **Contains** | userId, productType, referenceId | amount, currency, receipt |

Your `Order` is the business record. The Razorpay order is only needed to open the checkout modal.

---

## The Signature — Why It Matters

After payment, Razorpay sends three values to the browser:

```
razorpay_order_id    — the Razorpay order ID
razorpay_payment_id  — the payment ID (e.g. pay_abc...)
razorpay_signature   — HMAC-SHA256 of (order_id + "|" + payment_id)
```

Your server recomputes the signature using your **secret key**:

```ts
const expected = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest("hex");

if (expected !== razorpay_signature) → reject (tampered/fake)
if (expected === razorpay_signature) → genuine Razorpay payment
```

**Why this is critical:** Without signature verification, anyone could call your `/api/payments/verify` with a fake payment ID and unlock reports for free. The signature can only be produced by someone who knows your `RAZORPAY_KEY_SECRET`, which only Razorpay and your server know.

---

## The Webhook — Backup for When the Browser Fails

The browser-side `handler()` in Step 4 can fail silently if:
- User's phone dies after payment
- Network drops between payment success and your verify call
- User closes the browser tab at the wrong moment

In these cases, Razorpay sends a `payment.captured` event **from their servers directly to yours**:

```
Razorpay Servers → POST /api/webhooks/razorpay
```

Your webhook handler:
1. Verifies the webhook signature (different from payment signature — uses `RAZORPAY_WEBHOOK_SECRET`)
2. Checks if payment is already PAID (idempotency — in normal flow, verify already ran)
3. If not already PAID, runs the same update + processOrder() logic

This means money is **never deducted without the report being unlocked**, even if the browser crashes.

---

## Environment Variables Explained

```env
RAZORPAY_KEY_ID       # Public key — sent to the browser to open the modal (safe to expose)
RAZORPAY_KEY_SECRET   # Private key — used ONLY on your server to sign/verify (never expose)
RAZORPAY_WEBHOOK_SECRET # Webhook secret — used to verify Razorpay webhook calls are genuine
```

---

## Amount in Paise

Razorpay uses **paise** (smallest currency unit), not rupees.

```
₹99 = 9900 paise
₹1  = 100 paise
```

Always store and send amounts in paise. Convert to rupees only for display.

---

## Key Files in This Project

```
src/
  components/payments/
    payment-button.tsx        # Steps 1–6: the full client-side orchestration

  app/api/
    orders/create/route.ts    # Step 1: create your Order record
    payments/
      create-order/route.ts   # Step 2: call Razorpay API, create Payment record
      verify/route.ts         # Step 5: verify signature, unlock the product
    webhooks/
      razorpay/route.ts       # Backup: handles payment.captured from Razorpay servers

  lib/
    payments/razorpay.ts      # Configured Razorpay SDK instance
    orders/process-order.ts   # Product fulfillment logic (unlocks report, etc.)
```

---

## Test Cards (Razorpay Test Mode)

Use these in test mode — no real money is charged:

| Card Number | Network | Result |
|---|---|---|
| 4111 1111 1111 1111 | Visa | Success |
| 5267 3181 8797 5449 | Mastercard | Success |
| 4000 0000 0000 0002 | Visa | Failure |

Expiry: any future date. CVV: any 3 digits. OTP: `1234` (test mode).

For UPI test: use `success@razorpay` (success) or `failure@razorpay` (failure).
