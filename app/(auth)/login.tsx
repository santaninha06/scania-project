import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/theme';
import { friendlyError } from '@/utils/errors';
export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true);
    setError('');
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen>
      <View style={s.head}>
        <Text style={s.logo}>ScanIA</Text>
        <Text style={s.sub}>Suas notas fiscais, lidas por IA</Text>
      </View>
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="voce@email.com"
        keyboardType="email-address"
      />
      <Input
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="Sua senha"
        secureTextEntry
      />
      {!!error && <Text style={s.error}>{error}</Text>}
      <Button title="Entrar" onPress={submit} loading={busy} />
      <Link href="/register" style={s.link}>
        Não tem conta? Cadastre-se
      </Link>
    </Screen>
  );
}
const s = StyleSheet.create({
  head: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl },
  logo: { fontSize: 36, fontWeight: '900', color: colors.primary },
  sub: { fontSize: 15, color: colors.muted },
  error: { color: colors.danger, textAlign: 'center' },
  link: {
    marginTop: spacing.lg,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '700',
  },
});
