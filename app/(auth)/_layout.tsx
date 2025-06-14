import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="doctor-profile-setup" />
      <Stack.Screen name="patient-profile-setup" />
    </Stack>
  );
}