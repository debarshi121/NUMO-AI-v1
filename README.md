# NUMO AI

NUMO AI is a vehicle numerology web app. Users sign in, share their date of birth, and get an AI-generated report that cross-references their personal numerology with a vehicle — surfacing lucky colors, ideal registration numbers, best buying dates, and hidden conflicts to avoid. Reports are available for both new (yet-to-be-registered) and existing (already registered) vehicles, can be unlocked via Razorpay payment, and downloaded as a PDF.

## Features

- **Mobile OTP + Google sign-in** — passwordless auth via NextAuth (Auth.js)
- **New & old vehicle reports** — numerology analysis for vehicles you're about to buy or already own
- **AI-powered analysis** — report generation backed by Google Gemini
- **Paid unlocks** — Razorpay checkout and webhook-driven order/payment tracking
- **PDF export** — download a generated report as a shareable PDF
- **Dark mode** support across the app

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) with React 19 and TypeScript
- **Styling/UI:** Tailwind CSS 4, Radix UI, shadcn, Framer Motion, lucide-react icons
- **Auth:** NextAuth (Auth.js) v5 with Google OAuth + mobile OTP, Prisma adapter
- **Database:** PostgreSQL via Prisma ORM 7 (`@prisma/adapter-pg`)
- **AI:** Google Gemini (`@google/generative-ai`)
- **Payments:** Razorpay
- **PDF generation:** `@react-pdf/renderer`
- **Forms/validation:** React Hook Form + resolvers
- **Analytics:** Vercel Analytics & Speed Insights

## Prerequisites

- Node.js 20+
- A PostgreSQL database
- API credentials for the services you intend to use: Google OAuth, Google Gemini, Razorpay, and (optionally) a real SMS provider for OTP delivery

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd NUMO-AI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and fill in your own values:

   ```bash
   cp env.example .env
   ```

   | Variable | Description |
   | --- | --- |
   | `DATABASE_URL` | PostgreSQL connection string |
   | `AUTH_SECRET` | NextAuth secret — generate with `openssl rand -base64 32` |
   | `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth credentials from the [Google Cloud Console](https://console.cloud.google.com) |
   | `SMS_PROVIDER` | `mock` \| `twilio` \| `msg91` \| `fast2sms` \| `aws_sns` — with `mock`, the OTP is echoed back in the API response/UI instead of being sent |
   | `GEMINI_API_KEY` | Google Gemini API key |
   | `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` | Razorpay credentials from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) |

4. **Set up the database**

   ```bash
   npm run db:generate   # generate the Prisma client
   npm run db:push       # push the schema to your database
   npm run db:seed       # (optional) seed initial data
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:migrate` | Run Prisma migrations in dev |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |
