import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
export function Screen({
  children,
  scroll = true,
}: {
  children: ReactNode;
  scroll?: boolean;
}) {
  return scroll ? (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[s.screen, s.content]}>{children}</View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 40 },
});
