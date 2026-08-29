import { z } from "zod";

import {
  attachPlan,
  getCustomerData,
  getFeatureBalance,
  openBillingPortal,
} from "../autumn";
import { protectedProcedure } from "../index";

/** Get the current customer's subscriptions and balances. */
export const getBillingCustomer = protectedProcedure.handler(({ context }) => {
  const userId = context.session.user.id;
  return getCustomerData(userId);
});

/** Get the applications feature balance for the header badge. */
export const getApplicationsBalance = protectedProcedure.handler(
  ({ context }) => {
    const userId = context.session.user.id;
    return getFeatureBalance(userId, "applications");
  }
);

/** Attach a plan to the current customer. Returns a payment URL. */
export const billingAttach = protectedProcedure
  .input(z.object({ planId: z.string() }))
  .handler(({ context, input }) => {
    const userId = context.session.user.id;
    return attachPlan(userId, input.planId);
  });

/** Open the Stripe billing portal. Returns a portal URL. */
export const billingOpenPortal = protectedProcedure
  .input(z.object({ returnUrl: z.string() }))
  .handler(({ context, input }) => {
    const userId = context.session.user.id;
    return openBillingPortal(userId, input.returnUrl);
  });
