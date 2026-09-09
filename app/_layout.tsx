import { useEffect } from 'react';
import { router, Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { initializeDatabase } from '@/database';
import { subscribeConnectivitySync } from '@/sync';
import { useAppStore } from '@/store';
import { useAuthStore } from '@/authStore';
import { registerPushNotifications } from '@/notifications';
import { BiometricGate } from '@/components/BiometricGate';

initializeDatabase();
const queryClient = new QueryClient();

export default function RootLayout() {
  const refreshLocal = useAppStore(state => state.refreshLocal);
  const user = useAuthStore(state => state.user);
  useEffect(() => { refreshLocal(); const unsubscribe = subscribeConnectivitySync(); return unsubscribe; }, [refreshLocal]);
  useEffect(() => { if (user) void registerPushNotifications().catch(() => undefined); }, [user]);
  useEffect(() => Notifications.addNotificationResponseReceivedListener(response => { const url = response.notification.request.content.data?.url; if (typeof url === 'string' && url.startsWith('/')) router.push(url as any); }).remove, []);
  return <QueryClientProvider client={queryClient}><BiometricGate><StatusBar style="light"/><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#09090b' } }}/></BiometricGate></QueryClientProvider>;
}
