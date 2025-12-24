import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFD700", // Altın sarısı aktif renk
        tabBarInactiveTintColor: "#888",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: "#1a0033", // Koyu mor tab bar
            borderTopWidth: 0,
            position: "absolute",
          },
          default: {
            backgroundColor: "#1a0033",
            borderTopWidth: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Günün Mesajı",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={28}
              name="crystal-ball"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="numerology" // Yeni dosyamızın adı bu olacak
        options={{
          title: "İsim Analizi",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="auto-fix" color={color} />
          ),
        }}
      />
      {/* Eski explore sekmesini gizliyoruz veya silebilirsin */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Bu satır sekmeyi gizler
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Günlük",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={28}
              name="book-open-variant"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
