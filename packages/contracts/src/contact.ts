import { z } from "zod";

const LINKEDIN_PROFILE_URL =
  /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9._-]+\/?$/iu;
const PHONE_DIGITS = /[\s()-]/gu;
const PHONE_WITH_COUNTRY_CODE = /^\+[1-9]\d{6,14}$/u;

export const contactSchema = z.object({
  linkedin: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || LINKEDIN_PROFILE_URL.test(value),
      "Enter a LinkedIn profile URL."
    ),
  phone: z
    .string()
    .trim()
    .refine((value) => {
      if (value.length === 0) {
        return true;
      }

      const normalized = value.replaceAll(PHONE_DIGITS, "");

      return PHONE_WITH_COUNTRY_CODE.test(normalized);
    }, "Enter a phone number starting with + and a country code."),
});

export type Contact = z.infer<typeof contactSchema>;
