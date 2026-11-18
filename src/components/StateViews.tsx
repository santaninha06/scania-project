import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors, spacing } from '@/theme';
export function LoadingView() {
  return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={s.text}>Carregando...</Text>
    </View>
  );
}
export function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={s.center}>
      <Text style={s.title}>Não foi possível carregar</Text>
      <Text style={s.text}>{message}</Text>
      <Button title="Tentar novamente" onPress={onRetry} />
    </View>
  );
}
export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View style={s.center}>
      <Text style={s.title}>{title}</Text>
      <Text style={s.text}>{message}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  text: { fontSize: 14, color: colors.muted, textAlign: 'center' },
});
