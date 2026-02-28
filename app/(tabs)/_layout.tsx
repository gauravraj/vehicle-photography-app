import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Single-screen app — hide tab bar
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Car Inspector' }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
