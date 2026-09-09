import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen'; import { Card } from '@/components/Card'; import { useAppStore } from '@/store'; import { colors } from '@/theme';

export default function Orders() {
  const { schedules, syncing, sync } = useAppStore(); const [search, setSearch] = useState('');
  useEffect(() => { void sync(); }, [sync]);
  const items = useMemo(() => schedules.filter(s => `${s.vehiclePlate} ${s.clientName || ''} ${s.osNumber || ''}`.toLowerCase().includes(search.toLowerCase())), [schedules, search]);
  return <Screen title="Minhas OS" scroll={false}><TextInput value={search} onChangeText={setSearch} placeholder="Buscar placa, cliente ou OS" placeholderTextColor={colors.muted} style={styles.search}/><ScrollView refreshControl={<RefreshControl refreshing={syncing} onRefresh={sync} tintColor={colors.primary}/>} contentContainerStyle={{ gap: 10, paddingBottom: 90 }}>{items.map(item => <TouchableOpacity key={item.id} onPress={() => router.push(`/os/${item.id}`)}><Card><Text style={styles.status}>{item.status}</Text><Text style={styles.plate}>{item.vehiclePlate}</Text><Text style={styles.model}>{item.vehicleModel} · {item.serviceType}</Text><Text style={styles.client}>{item.clientName || 'Cliente não informado'}</Text><Text style={styles.date}>{item.confirmedDate || item.preferredDate} às {item.confirmedTime || item.preferredTime}</Text></Card></TouchableOpacity>)}{!items.length && <Text style={styles.empty}>Nenhuma ordem de serviço encontrada.</Text>}</ScrollView></Screen>;
}
const styles = StyleSheet.create({ search: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, color: colors.text }, status: { color: colors.primary, fontWeight: '900', fontSize: 10 }, plate: { color: colors.text, fontWeight: '900', fontSize: 25 }, model: { color: colors.muted }, client: { color: colors.text, fontWeight: '700' }, date: { color: colors.muted, fontSize: 12 }, empty: { color: colors.muted, textAlign: 'center', marginTop: 50 } });
