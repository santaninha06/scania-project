import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/theme';
export function Button({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'danger'
        ? colors.danger
        : colors.primarySoft;
  const fg = variant === 'secondary' ? colors.primary : '#fff';
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        { backgroundColor: bg, opacity: pressed || disabled ? 0.7 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[s.text, { color: fg }]}>{title}</Text>
      )}
    </Pressable>
  );
}
const s = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
    minHeight: 50,
  },
  text: { fontWeight: '700', fontSize: 15 },
});
