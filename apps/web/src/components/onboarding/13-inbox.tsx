"use client";

import { Button } from "@doresume/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@doresume/ui/components/item";
import { QuestionnaireInput } from "@doresume/ui/components/questionnaire";
import { Spinner } from "@doresume/ui/components/spinner";
import { Gmail } from "@doresume/ui/socials/gmail";
import { Outlook } from "@doresume/ui/socials/outlook";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { client, orpc } from "@/utils/orpc";

const INBOX_TOOLKITS = [
  {
    description: "Read verification codes and confirmation emails.",
    icon: <Gmail />,
    label: "Gmail",
    toolkit: "gmail" as const,
  },
  {
    description: "Read verification codes and confirmation emails.",
    icon: <Outlook />,
    label: "Outlook",
    toolkit: "outlook" as const,
  },
];

export const InboxFields = () => {
  // Composio's connection check is slow, and this step lives while the user
  // tabs away to complete OAuth and back — default window-focus refetching
  // would hammer it on every tab switch.
  const { data } = useQuery({
    ...orpc.getConnections.queryOptions(),
    refetchOnWindowFocus: false,
  });
  const [connecting, setConnecting] = useState<"gmail" | "outlook" | null>(
    null
  );

  const connect = async (toolkit: "gmail" | "outlook") => {
    try {
      setConnecting(toolkit);
      const { redirectUrl } = await client.connectIntegration({
        returnTo: "/onboarding?step=inbox",
        toolkit,
      });
      window.location.assign(redirectUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Could not connect ${toolkit}.`
      );
      setConnecting(null);
    }
  };

  return (
    <>
      <div className="sr-only">
        <QuestionnaireInput
          key={JSON.stringify(data ?? {})}
          aria-label="Inbox connections"
          defaultValue={JSON.stringify(data ?? {})}
          readOnly
        />
      </div>
      <ItemGroup>
        {INBOX_TOOLKITS.map((inbox) => {
          const connected = data?.[inbox.toolkit].connected ?? false;
          const isConnecting = connecting === inbox.toolkit;

          return (
            <Item key={inbox.toolkit} variant="outline">
              <ItemMedia variant="icon">{inbox.icon}</ItemMedia>
              <ItemContent>
                <ItemTitle>{inbox.label}</ItemTitle>
                <ItemDescription>{inbox.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  disabled={connected || isConnecting}
                  onClick={() => {
                    connect(inbox.toolkit);
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {isConnecting ? <Spinner data-icon="inline-start" /> : null}
                  {connected ? "Connected" : "Connect"}
                </Button>
              </ItemActions>
            </Item>
          );
        })}
      </ItemGroup>
    </>
  );
};
