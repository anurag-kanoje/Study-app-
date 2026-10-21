import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  RoleSelection: { email: string; password: string; displayName: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen
      name="RoleSelection"
      component={RoleSelectionScreen}
      options={{ headerShown: true, title: 'Choose your role' }}
    />
  </Stack.Navigator>
);
