import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/authStore';
import { colors } from '@/theme';

export default function Login() {
  const { user, login } = useAuthStore();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  if (user) return <Redirect href="/(tabs)"/>;
  const submit = async () => { setLoading(true); setError(''); try { await login(email, password); } catch (cause: any) { setError(cause?.message || 'Falha ao entrar.'); } finally { setLoading(false); } };
  return <View style={styles.page}><View style={styles.brand}><Text style={styles.badge}>APP DO TÉCNICO</Text><Text style={styles.logo}>K-TAG</Text><Text style={styles.subtitle}>Suas ordens de serviço, do início ao pagamento.</Text></View><View style={styles.form}><TextInput autoCapitalize="none" keyboardType="email-address" placeholder="E-mail" placeholderTextColor={colors.muted} value={email} onChangeText={setEmail} style={styles.input}/><TextInput secureTextEntry placeholder="Senha" placeholderTextColor={colors.muted} value={password} onChangeText={setPassword} style={styles.input}/>{error ? <Text style={styles.error}>{error}</Text> : null}<TouchableOpacity disabled={loading || !email || !password} onPress={submit} style={styles.button}><Text style={styles.buttonText}>{loading ? 'ENTRANDO...' : 'ENTRAR'}</Text></TouchableOpacity></View></View>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between', padding: 28, paddingTop: 100, paddingBottom: 60 }, brand: { gap: 8 }, badge: { color: colors.primary, fontWeight: '900', fontSize: 11, letterSpacing: 3 }, logo: { color: colors.text, fontSize: 58, fontWeight: '900', letterSpacing: -4 }, subtitle: { color: colors.muted, fontSize: 16, maxWidth: 280 }, form: { gap: 12 }, input: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, color: colors.text, borderRadius: 16, padding: 18, fontSize: 16 }, button: { backgroundColor: colors.primary, borderRadius: 16, padding: 18, alignItems: 'center' }, buttonText: { color: '#052e16', fontWeight: '900' }, error: { color: colors.danger } });
