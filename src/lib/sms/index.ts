import type { SmsProvider } from "./sms-provider";
import { MockSmsProvider } from "./mock-sms-provider";

/**
 * Returns the SMS provider based on the SMS_PROVIDER env variable.
 * To add a new provider (e.g. Twilio), create a new class implementing
 * SmsProvider and add it as a case here.
 */
export function getSmsProvider(): SmsProvider {
  const provider = process.env.SMS_PROVIDER ?? "mock";

  switch (provider) {
    case "mock":
      return new MockSmsProvider();
    // case "twilio":
    //   return new TwilioSmsProvider();
    // case "msg91":
    //   return new Msg91SmsProvider();
    default:
      console.warn(`Unknown SMS_PROVIDER "${provider}", falling back to mock`);
      return new MockSmsProvider();
  }
}
