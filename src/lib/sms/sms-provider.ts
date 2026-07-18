export interface SmsProvider {
  sendOtp(mobile: string, otp: string): Promise<void>;
}
