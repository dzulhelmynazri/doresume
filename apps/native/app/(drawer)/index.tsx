import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Chip, useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";

const getConnectionDescription = (
  isConnected: boolean,
  isLoading: boolean | undefined
) => {
  if (isLoading) {
    return "Checking connection...";
  }

  if (isConnected) {
    return "Connected to API";
  }

  return "API Disconnected";
};

const Home = () => {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  const privateData = useQuery(orpc.privateData.queryOptions());
  const isConnected = healthCheck?.data === "OK";
  const isLoading = healthCheck?.isLoading;
  const { data: session } = authClient.useSession();
  const connectionDescription = getConnectionDescription(
    isConnected,
    isLoading
  );

  const mutedColor = useThemeColor("muted");
  const successColor = useThemeColor("success");
  const dangerColor = useThemeColor("danger");

  return (
    <Container className="p-6">
      <View className="mb-6 py-4">
        <Text className="text-foreground mb-2 text-4xl font-bold">
          BETTER T STACK
        </Text>
      </View>

      {session?.user ? (
        <Card variant="secondary" className="mb-6 p-4">
          <Text className="text-foreground mb-2 text-base">
            Welcome, <Text className="font-medium">{session.user.name}</Text>
          </Text>
          <Text className="text-muted mb-4 text-sm">{session.user.email}</Text>
          <Pressable
            className="bg-danger self-start rounded-lg px-4 py-3 active:opacity-70"
            onPress={() => {
              authClient.signOut();
              queryClient.invalidateQueries();
            }}
          >
            <Text className="text-foreground font-medium">Sign Out</Text>
          </Pressable>
        </Card>
      ) : null}

      <Card variant="secondary" className="p-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Card.Title>System Status</Card.Title>
          <Chip
            variant="secondary"
            color={isConnected ? "success" : "danger"}
            size="sm"
          >
            <Chip.Label>{isConnected ? "LIVE" : "OFFLINE"}</Chip.Label>
          </Chip>
        </View>

        <Card className="p-4">
          <View className="flex-row items-center">
            <View
              className={`mr-3 h-3 w-3 rounded-full ${isConnected ? "bg-success" : "bg-muted"}`}
            />
            <View className="flex-1">
              <Text className="text-foreground mb-1 font-medium">
                ORPC Backend
              </Text>
              <Card.Description>{connectionDescription}</Card.Description>
            </View>
            {isLoading ? (
              <Ionicons name="hourglass-outline" size={20} color={mutedColor} />
            ) : null}
            {!isLoading && isConnected ? (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={successColor}
              />
            ) : null}
            {!isLoading && !isConnected ? (
              <Ionicons name="close-circle" size={20} color={dangerColor} />
            ) : null}
          </View>
        </Card>
      </Card>

      <Card variant="secondary" className="mt-6 p-4">
        <Card.Title className="mb-3">Private Data</Card.Title>
        {privateData ? (
          <Card.Description>{privateData.data?.message}</Card.Description>
        ) : null}
      </Card>

      {session?.user ? null : (
        <>
          <SignIn />
          <SignUp />
        </>
      )}
    </Container>
  );
};

export default Home;
