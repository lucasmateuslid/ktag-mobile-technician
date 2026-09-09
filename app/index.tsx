import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/authStore';
import { colors } from '@/theme';
export default function Index() { const { user, ready } = useAuthStore(); if (!ready) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}><ActivityIndicator color={colors.primary}/></View>; return <Redirect href={user ? '/(tabs)' : '/login'}/>; }
