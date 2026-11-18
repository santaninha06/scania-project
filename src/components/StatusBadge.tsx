import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme';
import type { ReceiptStatus } from '@/types';
const cfg: Record<ReceiptStatus, { label: string; color: string; background: string }> = {
  pending: { label: 'Processando', color: '#B45309', background: '#FEF3C7' },
  done: { label: 'Lida', color: '#15803D', background: '#DCFCE7' },
  error: { label: 'Falhou', color: colors.danger, background: '#FEE2E2' },
};
export function StatusBadge({ status }: { status: ReceiptStatus }) {
  const c = cfg[status];
  return (
    <View style={[s.badge, { backgroundColor: c.background }]}>
      <Text style={[s.label, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  label: { fontSize: 12, fontWeight: '700' },
});
