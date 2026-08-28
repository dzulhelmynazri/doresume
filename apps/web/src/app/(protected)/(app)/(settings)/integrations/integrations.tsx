"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@doresume/ui/components/alert-dialog";
import { Button } from "@doresume/ui/components/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@doresume/ui/components/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@doresume/ui/components/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@doresume/ui/components/item";
import { Spinner } from "@doresume/ui/components/spinner";
import { Gmail } from "@doresume/ui/socials/gmail";
import { LinkedIn } from "@doresume/ui/socials/linkedin";
import { Outlook } from "@doresume/ui/socials/outlook";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { client, orpc } from "@/utils/orpc";

export interface ToolkitConnectionState {
  connected: boolean;
  connectedAccountId: string | null;
}

type IntegrationToolkit = "gmail" | "linkedin" | "outlook";

const IntegrationItem = ({
  connection,
  description,
  icon,
  title,
  toolkit,
}: {
  connection: ToolkitConnectionState;
  description: string;
  icon: ReactNode;
  title: string;
  toolkit: IntegrationToolkit;
}) => {
  const queryClient = useQueryClient();
  const [connectOpen, setConnectOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [isConnecting, startConnecting] = useTransition();
  const [isDisconnecting, startDisconnecting] = useTransition();

  const connect = () => {
    startConnecting(async () => {
      try {
        const { redirectUrl } = await client.connectIntegration({ toolkit });
        window.location.assign(redirectUrl);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : `Could not connect ${title}.`
        );
      }
    });
  };

  const disconnect = () => {
    startDisconnecting(async () => {
      try {
        await client.disconnectIntegration({ toolkit });
        setDisconnectOpen(false);
        await queryClient.invalidateQueries({
          queryKey: orpc.getConnections.key(),
        });
        toast.success(`${title} disconnected.`);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : `Could not disconnect ${title}.`
        );
      }
    });
  };

  return (
    <Item variant="outline">
      <ItemMedia variant="icon">{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        {connection.connected ? (
          <AlertDialog
            onOpenChange={(open) => {
              if (isDisconnecting) {
                return;
              }
              setDisconnectOpen(open);
            }}
            open={disconnectOpen}
          >
            <AlertDialogTrigger
              render={<Button size="sm" type="button" variant="outline" />}
            >
              Connected
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect {title}?</AlertDialogTitle>
                <AlertDialogDescription>
                  The agent will no longer be able to use this account on your
                  behalf.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDisconnecting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDisconnecting}
                  onClick={disconnect}
                  variant="destructive"
                >
                  {isDisconnecting ? (
                    <Spinner data-icon="inline-start" />
                  ) : null}
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Dialog onOpenChange={setConnectOpen} open={connectOpen}>
            <DialogTrigger
              render={<Button size="sm" type="button" variant="outline" />}
            >
              Connect
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect {title}</DialogTitle>
                <DialogDescription>
                  You&apos;ll be redirected to authorize access so the agent can
                  use {title} on your behalf.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose
                  disabled={isConnecting}
                  render={<Button type="button" variant="outline" />}
                >
                  Cancel
                </DialogClose>
                <Button disabled={isConnecting} onClick={connect} type="button">
                  {isConnecting ? <Spinner data-icon="inline-start" /> : null}
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </ItemActions>
    </Item>
  );
};

export const Integrations = ({
  gmail,
  linkedin,
  outlook,
}: {
  gmail: ToolkitConnectionState;
  linkedin: ToolkitConnectionState;
  outlook: ToolkitConnectionState;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");

    if (!status) {
      return;
    }

    if (status === "success") {
      toast.success("Integration connected.");
    } else if (status === "failed") {
      toast.error("Integration connection failed.");
    }

    router.replace("/integrations");
    void queryClient.invalidateQueries({
      queryKey: orpc.getConnections.key(),
    });
  }, [queryClient, router, searchParams]);

  const integrations = [
    {
      connection: gmail,
      description: "Read verification codes and job emails.",
      icon: <Gmail />,
      title: "Gmail",
      toolkit: "gmail" as const,
    },
    {
      connection: outlook,
      description: "Read verification codes and job emails.",
      icon: <Outlook />,
      title: "Outlook",
      toolkit: "outlook" as const,
    },
    {
      connection: linkedin,
      description: "Use your profile for networking and applications.",
      icon: <LinkedIn />,
      title: "LinkedIn",
      toolkit: "linkedin" as const,
    },
  ];

  return (
    <div className="flex max-w-md flex-col gap-4 py-4">
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Connect services your AI agent can use on your behalf.
        </CardDescription>
      </CardHeader>
      <ItemGroup>
        {integrations.map((integration) => (
          <IntegrationItem key={integration.toolkit} {...integration} />
        ))}
      </ItemGroup>
    </div>
  );
};
