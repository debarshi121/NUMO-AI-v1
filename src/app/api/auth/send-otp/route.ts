import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendOtp } from "@/lib/auth/otp";

const schema = z.object({
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mobile } = schema.parse(body);

    const fullMobile = `+91${mobile}`;
    const otp = await sendOtp(fullMobile);

    const response: Record<string, unknown> = { success: true };

    // Expose OTP in response for easy testing — local dev (`next dev`) and
    // Vercel Preview deployments, but never Vercel Production. NODE_ENV alone
    // can't distinguish these on Vercel: `next build`/`next start` always run
    // with NODE_ENV=production, for Preview and Production alike. VERCEL_ENV
    // is the signal Vercel actually sets per deployment type.
    const isProdDeployment = process.env.VERCEL_ENV === "production";
    if (process.env.NODE_ENV === "development" || (!!process.env.VERCEL_ENV && !isProdDeployment)) {
      response.otp = otp;
    }

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }
    console.error("[send-otp]", err);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
