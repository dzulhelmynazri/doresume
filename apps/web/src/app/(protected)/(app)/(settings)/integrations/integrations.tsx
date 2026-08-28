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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { LoadingImage } from "@/components/loading-image";
import { client, orpc } from "@/utils/orpc";

const SETTINGS_STALE_TIME_MS = 5 * 60 * 1000;

type IntegrationToolkit = "gmail" | "linkedin" | "outlook";

export const Integrations = () => {
  const { data, isPending } = useQuery(
    orpc.getConnections.queryOptions({
      staleTime: SETTINGS_STALE_TIME_MS,
    })
  );
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [connectToolkit, setConnectToolkit] =
    useState<IntegrationToolkit | null>(null);
  const [disconnectToolkit, setDisconnectToolkit] =
    useState<IntegrationToolkit | null>(null);
  const [isConnecting, startConnecting] = useTransition();
  const [isDisconnecting, startDisconnecting] = useTransition();

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

  if (isPending || !data) {
    return (
      <div className="py-6">
        <LoadingImage />
      </div>
    );
  }

  const { gmail, linkedin, outlook } = data;

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

  const connect = (toolkit: IntegrationToolkit, title: string) => {
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

  const disconnect = (toolkit: IntegrationToolkit, title: string) => {
    startDisconnecting(async () => {
      try {
        await client.disconnectIntegration({ toolkit });
        setDisconnectToolkit(null);
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
    <div className="flex max-w-md flex-col gap-4 py-4">
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Connect services your AI agent can use on your behalf.
        </CardDescription>
      </CardHeader>
      <ItemGroup>
        {integrations.map((integration) => (
          <Item key={integration.toolkit} variant="outline">
            <ItemMedia variant="icon">{integration.icon}</ItemMedia>
            <ItemContent>
              <ItemTitle>{integration.title}</ItemTitle>
              <ItemDescription>{integration.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              {integration.connection.connected ? (
                <AlertDialog
                  onOpenChange={(open) => {
                    if (isDisconnecting) {
                      return;
                    }
                    setDisconnectToolkit(open ? integration.toolkit : null);
                  }}
                  open={disconnectToolkit === integration.toolkit}
                >
                  <AlertDialogTrigger
                    render={
                      <Button size="sm" type="button" variant="outline" />
                    }
                  >
                    Connected
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Disconnect {integration.title}?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        The agent will no longer be able to use this account on
                        your behalf.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDisconnecting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isDisconnecting}
                        onClick={() =>
                          disconnect(integration.toolkit, integration.title)
                        }
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
                <Dialog
                  onOpenChange={(open) =>
                    setConnectToolkit(open ? integration.toolkit : null)
                  }
                  open={connectToolkit === integration.toolkit}
                >
                  <DialogTrigger
                    render={
                      <Button size="sm" type="button" variant="outline" />
                    }
                  >
                    Connect
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Connect {integration.title}</DialogTitle>
                      <DialogDescription>
                        You&apos;ll be redirected to authorize access so the
                        agent can use {integration.title} on your behalf.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose
                        disabled={isConnecting}
                        render={<Button type="button" variant="outline" />}
                      >
                        Cancel
                      </DialogClose>
                      <Button
                        disabled={isConnecting}
                        onClick={() =>
                          connect(integration.toolkit, integration.title)
                        }
                        type="button"
                      >
                        {isConnecting ? (
                          <Spinner data-icon="inline-start" />
                        ) : null}
                        Continue
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
};
