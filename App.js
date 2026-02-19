import './i18n';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import CodeBonusScreen from './screens/CodeBonusScreen';
import CouponsScreen from './screens/CouponsScreen';
import AlertsScreen from './screens/AlertsScreen';
import GamingCodesScreen from './screens/GamingCodesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'PrixMalin',
            headerShown: false // Cache le header sur la page d'accueil
          }}
        />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
          options={{ title: 'Rechercher' }}
        />
<Stack.Screen 
          name="Gaming" 
          component={GamingCodesScreen}
          options={{ title: 'Codes Gaming' }}
        />
        <Stack.Screen 
          name="CodeBonus" 
          component={CodeBonusScreen}
          options={{ title: 'Code Bonus' }}
        />
        <Stack.Screen 
          name="Coupons" 
          component={CouponsScreen}
          options={{ title: 'Coupons & Promos' }}
        />
        <Stack.Screen 
          name="Alerts" 
          component={AlertsScreen}
          options={{ title: 'Alertes Prix' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
