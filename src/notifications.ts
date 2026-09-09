import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { api } from './api';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldPlaySound: true, shouldSetBadge: true, shouldShowBanner: true, shouldShowList: true }) });

export async function registerPushNotifications() {
  if (!Constants.isDevice || !['ios', 'android'].includes(Platform.OS)) return;
  const current = await Notifications.getPermissionsAsync();
  const permission = current.granted ? current : await Notifications.requestPermissionsAsync();
  if (!permission.granted) return;
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('operations', { name: 'Ordens de serviço', importance: Notifications.AndroidImportance.HIGH });
  const projectId = String(process.env.EXPO_PUBLIC_EAS_PROJECT_ID || '');
  if (!projectId) return;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await api.registerDevice(token, Platform.OS as 'ios' | 'android');
}
