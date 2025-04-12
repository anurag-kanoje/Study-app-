import { Stack } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View } from 'react-native';
import { Toaster } from '../components/ui/toaster';

export default function RootLayout() {
  const { session, loading, error } = useAuth();

  if (loading) {
    return <View className="flex-1 justify-center items-center">Loading...</View>;
  }

  if (error) {
    return <View className="flex-1 justify-center items-center">Error: {error.message}</View>;
  }

  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/signup"
          options={{ headerShown: false }}
        />
      </Stack>
      <Toaster />
    </View>
  );
}
