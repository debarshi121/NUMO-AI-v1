import type { SmsProvider } from "./sms-provider";

export class MockSmsProvider implements SmsProvider {
  async sendOtp(mobile: string, otp: string): Promise<void> {
    // In development, log the OTP to the console instead of sending a real SMS.
    // Replace this class with a real provider (Twilio, MSG91, etc.) when ready.
    console.log(`[MockSmsProvider] OTP for ${mobile} = ${otp}`);
  }
}
