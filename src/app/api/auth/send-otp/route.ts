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

    // No real SMS goes out on the mock provider, so surface the OTP in the
    // response — otherwise there'd be no way to get it at all.
    if (process.env.SMS_PROVIDER === "mock") {
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
