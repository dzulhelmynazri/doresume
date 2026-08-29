"use client";

import { Button } from "@doresume/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { orpc } from "@/utils/orpc";

const CreditUsage = () => {
  const { data: balance } = useQuery(
    orpc.getApplicationsBalance.queryOptions()
  );

  if (!balance) {
    return null;
  }

  const { granted, unlimited, usage } = balance;

  return (
    <Link href="/billing">
      <Button variant="outline">
        {usage}
        {unlimited ? " / ∞" : ` / ${granted}`}
      </Button>
    </Link>
  );
};

export { CreditUsage };
