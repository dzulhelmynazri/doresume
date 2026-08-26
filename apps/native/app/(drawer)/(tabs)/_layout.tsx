import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";
import type { ColorValue } from "react-native";

interface TabBarIconProps {
  color: ColorValue;
  size: number;
}

const HomeTabBarIcon = ({ color, size }: TabBarIconProps) => (
  <Ionicons name="home" size={size} color={color} />
);

const ExploreTabBarIcon = ({ color, size }: TabBarIconProps) => (
  <Ionicons name="compass" size={size} color={color} />
);

const TabLayout = () => {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: themeColorBackground,
        },
        headerTintColor: themeColorForeground,
        headerTitleStyle: {
          color: themeColorForeground,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: themeColorBackground,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: HomeTabBarIcon,
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarIcon: ExploreTabBarIcon,
          title: "Explore",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
