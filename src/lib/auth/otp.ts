import crypto from "crypto";
import prisma from "@/lib/prisma";
import { getSmsProvider } from "@/lib/sms";

const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;

/** Generate a cryptographically secure random 6-digit OTP */
function generateOtp(): string {
  const bytes = crypto.randomBytes(4);
  const num = bytes.readUInt32BE(0) % 1_000_000;
  return num.toString().padStart(OTP_LENGTH, "0");
}

/** Hash OTP using SHA-256 before storing */
function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/** Send OTP to the given mobile number */
export async function sendOtp(mobile: string): Promise<string> {
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Upsert: overwrite any existing OTP for this mobile
  await prisma.otpVerification.upsert({
    where: { mobile },
    update: { otpHash, expiresAt, verified: false },
    create: { mobile, otpHash, expiresAt },
  });

  const smsProvider = getSmsProvider();
  await smsProvider.sendOtp(mobile, otp);

  return otp;
}

export type VerifyOtpResult =
  | { success: true; userId: string; isNewUser: boolean }
  | { success: false; error: string };

/** Verify OTP, create/find user, mark as verified */
export async function verifyOtp(
  mobile: string,
  otp: string
): Promise<VerifyOtpResult> {
  const record = await prisma.otpVerification.findFirst({
    where: { mobile },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return { success: false, error: "No OTP found for this number. Request a new one." };
  }

  if (record.verified) {
    return { success: false, error: "OTP already used. Request a new one." };
  }

  if (new Date() > record.expiresAt) {
    return { success: false, error: "OTP has expired. Request a new one." };
  }

  const inputHash = hashOtp(otp);
  if (inputHash !== record.otpHash) {
    return { success: false, error: "Invalid OTP. Please try again." };
  }

  // Mark OTP as used
  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { verified: true },
  });

  // Find or create user
  let user = await prisma.user.findUnique({ where: { mobile } });
  let isNewUser = false;

  if (!user) {
    user = await prisma.user.create({ data: { mobile } });
    isNewUser = true;
  }

  return { success: true, userId: user.id, isNewUser };
}
