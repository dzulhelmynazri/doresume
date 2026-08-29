import { env } from "@doresume/env/server";
import { Autumn } from "autumn-js";

const autumn = new Autumn({
  secretKey: env.AUTUMN_SECRET_KEY,
});

/**
 * Check if the user has remaining balance for a feature.
 */
export const checkFeatureAccess = async (
  customerId: string,
  featureId: string
) => {
  const { allowed } = await autumn.check({ customerId, featureId });
  return { allowed };
};

/**
 * Record usage after a successful action.
 */
export const trackUsage = async (
  customerId: string,
  featureId: string,
  value = 1
) => {
  await autumn.track({ customerId, featureId, value });
};

export interface BalanceInfo {
  granted: number;
  remaining: number;
  unlimited: boolean;
  usage: number;
}

/**
 * Get the balance for a specific feature.
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

// ── Billing ─────────────────────────────────────────────────────────

export interface CustomerSubscription {
  planId: string;
  status: string;
  canceledAt: number | null;
}

export interface CustomerData {
  balances: Record<string, BalanceInfo>;
  subscriptions: CustomerSubscription[];
}

/**
 * Get the full customer record for billing UI.
 */
export const getCustomerData = async (
  customerId: string
): Promise<CustomerData> => {
  const customer = await autumn.customers.get({ customerId });

  const subscriptions: CustomerSubscription[] =
    customer.subscriptions?.map((sub) => ({
      canceledAt: sub.canceledAt ?? null,
      planId: sub.planId,
      status: sub.status,
    })) ?? [];

  const balances: Record<string, BalanceInfo> = {};
  if (customer.balances) {
    for (const [key, bal] of Object.entries(customer.balances)) {
      balances[key] = {
        granted: bal.granted,
        remaining: bal.remaining,
        unlimited: bal.unlimited,
        usage: bal.usage,
      };
    }
  }

  return { balances, subscriptions };
};

/**
 * Attach a plan — returns a payment URL to redirect the customer to.
 */
export const attachPlan = async (
  customerId: string,
  planId: string
): Promise<{ paymentUrl: string | null }> => {
  const result = await autumn.billing.attach({ customerId, planId });
  return { paymentUrl: result.paymentUrl ?? null };
};

/**
 * Open the Stripe billing portal for managing subscriptions.
 */
export const openBillingPortal = async (
  customerId: string,
  returnUrl: string
): Promise<{ url: string }> => {
  const result = await autumn.billing.openCustomerPortal({
    customerId,
    returnUrl,
  });
  return { url: result.url };
};
