import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import { Pressable, Text } from "react-native";
import type { ColorValue } from "react-native";

import { ThemeToggle } from "@/components/theme-toggle";

interface DrawerIconProps {
  color: ColorValue;
  focused: boolean;
  size: number;
}

interface DrawerLabelProps {
  color: ColorValue;
  focused: boolean;
}

const HomeDrawerIcon = ({ color, focused, size }: DrawerIconProps) => {
  const themeColorForeground = useThemeColor("foreground");

  return (
    <Ionicons
      name="home-outline"
      size={size}
      color={focused ? color : themeColorForeground}
    />
  );
};

const HomeDrawerLabel = ({ color, focused }: DrawerLabelProps) => {
  const themeColorForeground = useThemeColor("foreground");

  return (
    <Text style={{ color: focused ? color : themeColorForeground }}>Home</Text>
  );
};

const TabsDrawerIcon = ({ color, focused, size }: DrawerIconProps) => {
  const themeColorForeground = useThemeColor("foreground");

  return (
    <MaterialIcons
      name="border-bottom"
      size={size}
      color={focused ? color : themeColorForeground}
    />
  );
};

const TabsDrawerLabel = ({ color, focused }: DrawerLabelProps) => {
  const themeColorForeground = useThemeColor("foreground");

  return (
    <Text style={{ color: focused ? color : themeColorForeground }}>Tabs</Text>
  );
};

const TabsHeaderRight = () => {
  const themeColorForeground = useThemeColor("foreground");

  return (
    <Link href="/modal" asChild>
      <Pressable className="mr-4">
        <Ionicons name="add-outline" size={24} color={themeColorForeground} />
      </Pressable>
    </Link>
  );
};

const DrawerLayout = () => {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  return (
    <Drawer
      screenOptions={{
        drawerStyle: { backgroundColor: themeColorBackground },
        headerRight: ThemeToggle,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTintColor: themeColorForeground,
        headerTitleStyle: {
          color: themeColorForeground,
          fontWeight: "600",
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerIcon: HomeDrawerIcon,
          drawerLabel: HomeDrawerLabel,
          headerTitle: "Home",
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerIcon: TabsDrawerIcon,
          drawerLabel: TabsDrawerLabel,
          headerRight: TabsHeaderRight,
          headerTitle: "Tabs",
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
