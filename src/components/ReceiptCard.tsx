import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { categoryInfo } from '@/constants/categories';
import { colors, radius, spacing } from '@/theme';
import type { Receipt } from '@/types';
import { isoToBr } from '@/utils/date';
import { formatMoney } from '@/utils/money';
import { receiptDate } from '@/utils/summary';
import { StatusBadge } from './StatusBadge';
export function ReceiptCard({
  receipt,
  onPress,
}: {
  receipt: Receipt;
  onPress: () => void;
}) {
  const info = categoryInfo(receipt.category),
    done = receipt.status === 'done';
  return (
    <Pressable onPress={onPress} style={s.row}>
      <View style={[s.icon, { backgroundColor: `${info.color}22` }]}>
        <Ionicons
          name={done ? 'receipt' : 'time-outline'}
          size={22}
          color={done ? info.color : colors.muted}
        />
      </View>
      <View style={s.info}>
        <Text style={s.merchant} numberOfLines={1}>
          {receipt.merchant ?? 'Nota enviada'}
        </Text>
        {done ? (
          <Text style={s.meta}>
            {isoToBr(receiptDate(receipt))} · {info.name}
          </Text>
        ) : (
          <StatusBadge status={receipt.status} />
        )}
      </View>
      {done && receipt.total !== null ? (
        <Text style={s.total}>{formatMoney(receipt.total)}</Text>
      ) : null}
    </Pressable>
  );
}
const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 4 },
  merchant: { fontSize: 16, fontWeight: '600', color: colors.text },
  meta: { fontSize: 13, color: colors.muted },
  total: { fontSize: 15, fontWeight: '700', color: colors.text },
});
