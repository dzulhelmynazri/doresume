import { env } from "@doresume/env/server";
import { Autumn } from "autumn-js";

export const autumn = new Autumn({
  secretKey: env.AUTUMN_SECRET_KEY,
});

/**
 * Check if the user has remaining balance for a feature.
 * Returns `{ allowed: true }` if the user can proceed.
 */
export const checkFeatureAccess = async (
  customerId: string,
  featureId: string,
  requiredBalance = 1
) => {
  const { allowed } = await autumn.check({
    customerId,
    featureId,
    requiredBalance,
  });
  return { allowed };
};

/**
 * Record usage after a successful action.
 * Only call after the protected action has completed.
 */
export const trackUsage = async (
  customerId: string,
  featureId: string,
  value = 1
) => {
  await autumn.track({
    customerId,
    featureId,
    value,
  });
};

export interface BalanceInfo {
  granted: number;
  remaining: number;
  unlimited: boolean;
  usage: number;
}

/**
 * Get the balance for a specific feature using the backend SDK.
 * Returns usage, granted, remaining, and unlimited status.
 */
export const getFeatureBalance = async (
  customerId: string,
  featureId: string
): Promise<BalanceInfo | null> => {
  const customer = await autumn.customers.get({ customerId });
  const balance = customer.balances?.[featureId];

  if (!balance) {
    return null;
  }

  return {
    granted: balance.granted,
    remaining: balance.remaining,
    unlimited: balance.unlimited,
    usage: balance.usage,
  };
};
