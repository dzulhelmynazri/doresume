import { z } from "zod";

export const locationSchema = z.object({
  address: z.string().trim().min(1, "Enter your address."),
  city: z.string().trim().min(1, "Enter your city."),
  country: z.string().trim().min(1, "Enter your country."),
  state: z.string().trim().min(1, "Enter your state."),
  zip: z.string().trim().min(1, "Enter your zip code."),
});

export type Location = z.infer<typeof locationSchema>;
