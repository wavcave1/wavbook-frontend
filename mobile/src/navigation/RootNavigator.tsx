import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';
import { BrowseScreen } from '@/screens/BrowseScreen';
import { BookingScreen } from '@/screens/BookingScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { StudioDetailsScreen } from '@/screens/StudioDetailsScreen';

export type MarketplaceStackParamList = {
  Home: undefined;
  Browse: undefined;
  StudioDetails: { slug: string };
  Booking: { slug: string };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<MarketplaceStackParamList>();

function MarketplaceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Browse" component={BrowseScreen} />
      <Stack.Screen name="StudioDetails" component={StudioDetailsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#171a24', borderTopColor: '#262b3a' }, tabBarActiveTintColor: '#8f7cff' }}>
      <Tab.Screen name="Marketplace" component={MarketplaceStack} />
      {isAuthenticated ? <Tab.Screen name="Dashboard" component={DashboardScreen} /> : <Tab.Screen name="Login" component={LoginScreen} />}
    </Tab.Navigator>
  );
}
