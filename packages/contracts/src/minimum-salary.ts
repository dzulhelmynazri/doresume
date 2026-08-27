import { z } from "zod";

export const SALARY_PERIODS = ["hourly", "monthly", "yearly"] as const;
export const SALARY_CURRENCIES = [
  "MYR",
  "USD",
  "SGD",
  "IDR",
  "THB",
  "PHP",
  "BND",
] as const;

export const SALARY_CURRENCY_OPTIONS = [
  { label: "MYR", value: "MYR" },
  { label: "USD", value: "USD" },
  { label: "SGD", value: "SGD" },
  { label: "IDR", value: "IDR" },
  { label: "THB", value: "THB" },
  { label: "PHP", value: "PHP" },
  { label: "BND", value: "BND" },
] as const satisfies readonly {
  label: string;
  value: (typeof SALARY_CURRENCIES)[number];
}[];

export const SALARY_BAR_COUNT = 24;
export const SALARY_HOURS_PER_YEAR = 2080;
export const SALARY_MONTHS_PER_YEAR = 12;

export const SALARY_PERIOD_OPTIONS = [
  { label: "Hourly", value: "hourly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
] as const satisfies readonly {
  label: string;
  value: (typeof SALARY_PERIODS)[number];
}[];

export const SALARY_PERIOD_UNITS = {
  hourly: "hr",
  monthly: "mo",
  yearly: "yr",
} as const;

export const SALARY_RANGES = {
  hourly: { default: 36, max: 240, min: 10 },
  monthly: { default: 6250, max: 42_000, min: 1700 },
  yearly: { default: 75_000, max: 500_000, min: 20_000 },
} as const;

const salaryDistributionPeak = 0.22;
const salaryDistributionRisePower = 1.75;
const salaryDistributionTailDecay = 1.75;
const salaryDistributionFloor = 0.12;

export const SALARY_DISTRIBUTION = Array.from(
  { length: SALARY_BAR_COUNT },
  (_, index) => {
    const position = index / (SALARY_BAR_COUNT - 1);

    if (position <= salaryDistributionPeak) {
      const rise = position / salaryDistributionPeak;

      return (
        salaryDistributionFloor +
        (1 - salaryDistributionFloor) * rise ** salaryDistributionRisePower
      );
    }

    const tail =
      (position - salaryDistributionPeak) / (1 - salaryDistributionPeak);

    return Math.exp(-tail * salaryDistributionTailDecay);
  }
);

const salaryDistributionMax = Math.max(...SALARY_DISTRIBUTION);

export const SALARY_DISTRIBUTION_BAR_HEIGHTS = SALARY_DISTRIBUTION.map(
  (height) => `${Math.round((height / salaryDistributionMax) * 1000) / 10}%`
);

export const minimumSalarySchema = z.object({
  amount: z.number().int().positive({ error: "Enter a minimum salary." }),
  currency: z.enum(SALARY_CURRENCIES),
  period: z.enum(SALARY_PERIODS),
});

export type MinimumSalary = z.infer<typeof minimumSalarySchema>;
export type SalaryCurrency = (typeof SALARY_CURRENCIES)[number];
export type SalaryPeriod = (typeof SALARY_PERIODS)[number];

export const formatSalaryCurrencyLabel = (
  currency: SalaryCurrency,
  period: SalaryPeriod
) => `${currency}/${SALARY_PERIOD_UNITS[period]}`;

export const getSalaryRange = (period: SalaryPeriod) => SALARY_RANGES[period];

export const salaryAmountToIndex = (
  amount: number,
  period: SalaryPeriod
): number => {
  const { min, max } = getSalaryRange(period);
  const clamped = Math.max(min, Math.min(max, amount));

  return Math.round(((clamped - min) / (max - min)) * (SALARY_BAR_COUNT - 1));
};

export const salaryIndexToAmount = (
  index: number,
  period: SalaryPeriod
): number => {
  const { min, max } = getSalaryRange(period);
  const clampedIndex = Math.max(0, Math.min(SALARY_BAR_COUNT - 1, index));

  return Math.round(
    min + (clampedIndex / (SALARY_BAR_COUNT - 1)) * (max - min)
  );
};

export const convertSalaryAmount = (
  amount: number,
  from: SalaryPeriod,
  to: SalaryPeriod
): number => {
  if (from === to) {
    return amount;
  }

  let yearly = amount;

  if (from === "hourly") {
    yearly = amount * SALARY_HOURS_PER_YEAR;
  } else if (from === "monthly") {
    yearly = amount * SALARY_MONTHS_PER_YEAR;
  }

  if (to === "hourly") {
    return Math.round(yearly / SALARY_HOURS_PER_YEAR);
  }

  if (to === "monthly") {
    return Math.round(yearly / SALARY_MONTHS_PER_YEAR);
  }

  return yearly;
};

export const formatSalaryAmount = (amount: number): string =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);

export const parseSalaryInput = (value: string): number | null => {
  const digits = value.replaceAll(/\D/gu, "");

  if (!digits) {
    return null;
  }

  const parsed = Math.trunc(Number(digits));

  return Number.isFinite(parsed) ? parsed : null;
};

export const clampSalaryAmount = (
  amount: number,
  period: SalaryPeriod
): number => {
  const { min, max } = getSalaryRange(period);

  return Math.max(min, Math.min(max, amount));
};
