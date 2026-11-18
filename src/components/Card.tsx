import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing, shadow } from '@/theme';
export function Card({ children }: { children: ReactNode }) {
  return <View style={s.card}>{children}</View>;
}
const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow,
  },
});
