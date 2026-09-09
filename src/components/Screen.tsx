import type { PropsWithChildren, ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function Screen({ title, right, children, scroll = true }: PropsWithChildren<{ title: string; right?: ReactNode; scroll?: boolean }>) {
  const content = <View style={styles.body}>{children}</View>;
  return <SafeAreaView style={styles.safe}><View style={styles.header}><View><Text style={styles.eyebrow}>K-TAG TÉCNICOS</Text><Text style={styles.title}>{title}</Text></View>{right}</View>{scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}</SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, header: { padding: 20, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 2 }, title: { color: colors.text, fontSize: 28, fontWeight: '900' }, scroll: { paddingBottom: 80 }, body: { flex: 1, padding: 16, gap: 12 } });
