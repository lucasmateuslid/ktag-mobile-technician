import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../authStore';
import { colors } from '../theme';

export function BiometricGate({ children }: PropsWithChildren) {
  const user = useAuthStore(state => state.user); const [locked, setLocked] = useState(false);
  const unlock = useCallback(async () => { const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Desbloquear K-Tag Técnicos', cancelLabel: 'Cancelar', disableDeviceFallback: false }); if (result.success) setLocked(false); }, []);
  useEffect(() => { let active = true; void (async () => { const enabled = await SecureStore.getItemAsync('biometric_enabled'); const available = await LocalAuthentication.hasHardwareAsync() && await LocalAuthentication.isEnrolledAsync(); if (active && user && enabled === 'true' && available) { setLocked(true); await unlock(); } else if (active) setLocked(false); })(); return () => { active = false; }; }, [user?.uid, unlock]);
  if (!locked) return children;
  return <View style={styles.page}><Text style={styles.title}>Aplicativo bloqueado</Text><Text style={styles.body}>Confirme sua identidade para acessar as ordens de serviço.</Text><TouchableOpacity onPress={unlock} style={styles.button}><Text style={styles.buttonText}>USAR BIOMETRIA</Text></TouchableOpacity></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14, padding: 30, backgroundColor: colors.background }, title: { color: colors.text, fontSize: 24, fontWeight: '900' }, body: { color: colors.muted, textAlign: 'center' }, button: { backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 15 }, buttonText: { color: '#052e16', fontWeight: '900' } });
