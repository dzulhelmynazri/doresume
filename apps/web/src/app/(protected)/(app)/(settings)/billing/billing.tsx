"use client";

import { Badge } from "@doresume/ui/components/badge";
import { Button } from "@doresume/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@doresume/ui/components/card";
import { Spinner } from "@doresume/ui/components/spinner";
import { Tabs, TabsList, TabsTrigger } from "@doresume/ui/components/tabs";
import { cn } from "@doresume/ui/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";

import { LoadingImage } from "@/components/loading-image";
import { orpc } from "@/utils/orpc";

type BillingPeriod = "annual" | "monthly" | "quarterly";

const BILLING_PERIODS: {
  discount: string | null;
  label: string;
  value: BillingPeriod;
}[] = [
  { discount: null, label: "Monthly", value: "monthly" },
  { discount: "32% off", label: "Quarterly", value: "quarterly" },
  { discount: "39% off", label: "Yearly", value: "annual" },
];

const SUFFIX: Record<BillingPeriod, string> = {
  annual: "-annual",
  monthly: "",
  quarterly: "-quarterly",
};

interface PlanConfig {
  features: string[];
  id: string;
  name: string;
  price: Record<BillingPeriod, number>;
}

const PLANS: PlanConfig[] = [
  {
    features: ["20 applications", "Gmail & Outlook integration"],
    id: "free",
    name: "Free",
    price: { annual: 0, monthly: 0, quarterly: 0 },
  },
  {
    features: ["300 applications", "Gmail & Outlook integration"],
    id: "starter",
    name: "Starter",
    price: { annual: 9, monthly: 19, quarterly: 12 },
  },
  {
    features: ["1000 applications", "Gmail & Outlook integration"],
    id: "pro",
    name: "Pro",
    price: { annual: 19, monthly: 39, quarterly: 24 },
  },
];

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(amount);

const Billing = () => {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery(orpc.getBillingCustomer.queryOptions());
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [isActing, startAction] = useTransition();

  const invalidateCustomer = () => {
    void queryClient.invalidateQueries({
      queryKey: orpc.getBillingCustomer.queryKey(),
    });
  };

  const handleAttach = (planId: string) => {
    startAction(async () => {
      const result = await orpc.billingAttach.call({ planId });
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      }
      invalidateCustomer();
    });
  };

  const handleOpenPortal = () => {
    startAction(async () => {
      const result = await orpc.billingOpenPortal.call({
        returnUrl: `${window.location.origin}/settings/billing`,
      });
      if (result.url) {
        window.location.href = result.url;
      }
    });
  };

  const activeSub = data?.subscriptions?.find((s) => s.status === "active");
  const activePlanId: string | null = activeSub?.planId ?? null;

  const getPlanId = (plan: PlanConfig) => {
    if (plan.id === "free") {
      return "free";
    }
    return `${plan.id}${SUFFIX[period]}`;
  };

  const isCurrentPlan = (plan: PlanConfig) => {
    if (!activePlanId) {
      return plan.id === "free";
    }
    return activePlanId === plan.id || activePlanId.startsWith(`${plan.id}-`);
  };

  if (isPending) {
    return (
      <div className="py-6">
        <LoadingImage />
      </div>
    );
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6 py-4">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>
          Choose a plan and billing period. Upgrade anytime.
        </CardDescription>
      </CardHeader>

      <Tabs
        className="self-start"
        onValueChange={(val: string) => {
          setPeriod(val as BillingPeriod);
        }}
        value={period}
      >
        <TabsList>
          {BILLING_PERIODS.map((bp) => (
            <TabsTrigger key={bp.value} value={bp.value}>
              {bp.label}
              {bp.discount && (
                <span className="text-primary text-xs font-semibold">
                  {bp.discount}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 overflow-visible py-1 md:grid-cols-3">
        {PLANS.map((plan) => {
          const currentPlan = isCurrentPlan(plan);
          const planId = getPlanId(plan);
          const price = plan.price[period];
          const isFree = plan.id === "free";
          const isFeatured = plan.id === "starter";

          return (
            <Card
              className={cn(
                "relative overflow-visible",
                isFeatured && "ring-primary/40 bg-primary/5"
              )}
              key={plan.id}
            >
              {isFeatured && (
                <Badge className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 font-semibold tracking-wide uppercase">
                  Popular
                </Badge>
              )}

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {currentPlan && <Badge variant="outline">Current</Badge>}
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col">
                <div className="mt-1 mb-5">
                  {isFree ? (
                    <span className="text-2xl font-bold">Free</span>
                  ) : (
                    <span className="text-2xl font-bold">
                      {formatPrice(price)}
                      <span className="text-muted-foreground ml-0.5 text-sm font-normal">
                        /mo
                      </span>
                    </span>
                  )}
                </div>

                <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircleIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {currentPlan && activePlanId ? (
                  <Button
                    className="w-full"
                    disabled={isActing}
                    onClick={() => {
                      handleOpenPortal();
                    }}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {isActing ? <Spinner data-icon="inline-start" /> : null}
                    Manage
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    disabled={isActing}
                    onClick={() => {
                      handleAttach(planId);
                    }}
                    size="sm"
                    type="button"
                    variant={isFeatured ? "default" : "outline"}
                  >
                    {isActing ? <Spinner data-icon="inline-start" /> : null}
                    {activePlanId ? "Switch" : "Upgrade"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export { Billing };
