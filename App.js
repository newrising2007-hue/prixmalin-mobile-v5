import './i18n';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import GamingHubScreen from './screens/GamingHubScreen';
import PartenairesScreen from './screens/PartenairesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#16a34a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Restaurants"
          component={RestaurantScreen}
          options={{ title: 'Restaurants' }}
        />
        <Stack.Screen
          name="GamingHub"
          component={GamingHubScreen}
          options={{ title: 'Gaming' }}
        />
        <Stack.Screen
          name="Partenaires"
          component={PartenairesScreen}
          options={{ title: 'Partenaires locaux' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
