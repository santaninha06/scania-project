import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  error?: string;
}) {
  return (
    <View style={s.wrap}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={s.input}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 13,
    color: colors.text,
  },
  error: { color: colors.danger, marginTop: 4 },
});
