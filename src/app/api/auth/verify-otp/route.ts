import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOtp } from "@/lib/auth/otp";
import { signIn } from "@/lib/auth/auth";

const schema = z.object({
  mobile: z.string().regex(/^\d{10}$/),
  otp: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mobile, otp } = schema.parse(body);

    const fullMobile = `+91${mobile}`;
    const result = await verifyOtp(fullMobile, otp);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Sign in the user via the OTP credentials provider
    await signIn("otp", {
      userId: result.userId,
      redirect: false,
    });

    return NextResponse.json({
      success: true,
      isNewUser: result.isNewUser,
      redirectTo: result.isNewUser ? "/profile-setup" : "/vehicle-numerology",
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }
    console.error("[verify-otp]", err);
    return NextResponse.json(
      { success: false, error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
