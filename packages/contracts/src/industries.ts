import { z } from "zod";

export const INDUSTRIES = [
  "it_and_software",
  "healthcare",
  "finance_insurance",
  "sales_bizdev",
  "marketing_pr",
  "retail_wholesale",
  "education",
  "hr_recruiting",
  "hospitality_tourism",
  "manufacturing_trades",
  "logistics_transport",
  "entertainment_media",
  "architecture_construction",
  "real_estate",
  "government",
  "energy_utilities",
  "home_services",
  "nonprofit",
  "environmental",
  "aerospace",
  "science_rd",
  "agriculture_fishing",
  "defense_military",
  "public_safety",
  "private_security",
  "mining",
  "sports_athletics",
] as const;

export const INDUSTRY_OPTIONS = [
  { label: "IT & Software", value: "it_and_software" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Finance & Insurance", value: "finance_insurance" },
  { label: "Sales & BizDev", value: "sales_bizdev" },
  { label: "Marketing & PR", value: "marketing_pr" },
  { label: "Retail & Wholesale", value: "retail_wholesale" },
  { label: "Education", value: "education" },
  { label: "HR & Recruiting", value: "hr_recruiting" },
  { label: "Hospitality & Tourism", value: "hospitality_tourism" },
  { label: "Manufacturing & Trades", value: "manufacturing_trades" },
  { label: "Logistics & Transport", value: "logistics_transport" },
  { label: "Entertainment & Media", value: "entertainment_media" },
  { label: "Architecture & Construction", value: "architecture_construction" },
  { label: "Real Estate", value: "real_estate" },
  { label: "Government", value: "government" },
  { label: "Energy & Utilities", value: "energy_utilities" },
  { label: "Home Services", value: "home_services" },
  { label: "Nonprofit", value: "nonprofit" },
  { label: "Environmental", value: "environmental" },
  { label: "Aerospace", value: "aerospace" },
  { label: "Science & R&D", value: "science_rd" },
  { label: "Agriculture & Fishing", value: "agriculture_fishing" },
  { label: "Defense & Military", value: "defense_military" },
  { label: "Public Safety", value: "public_safety" },
  { label: "Private Security", value: "private_security" },
  { label: "Mining", value: "mining" },
  { label: "Sports & Athletics", value: "sports_athletics" },
] as const satisfies readonly {
  label: string;
  value: (typeof INDUSTRIES)[number];
}[];

export const industriesSchema = z
  .object({
    industries: z.array(z.enum(INDUSTRIES)),
    openToAny: z.boolean(),
  })
  .refine((value) => value.openToAny || value.industries.length > 0, {
    message: "Select at least one industry, or choose open to any.",
    path: ["industries"],
  });

export type Industries = z.infer<typeof industriesSchema>;
export type Industry = (typeof INDUSTRIES)[number];
