import { env } from "@doresume/env/server";
import { createEmailClient } from "@opencoredev/email-sdk";
import { resend } from "@opencoredev/email-sdk/resend";

export const email = createEmailClient({
  adapters: [resend({ apiKey: env.RESEND_API_KEY })],
});

export { EmailAdapterError } from "@opencoredev/email-sdk";
export type { EmailSendResult } from "@opencoredev/email-sdk";
