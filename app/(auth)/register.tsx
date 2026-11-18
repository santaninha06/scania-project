import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text } from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { friendlyError } from '@/utils/errors';
import { colors } from '@/theme';
export default function Register() {
  const { signUp } = useAuth(),
    router = useRouter();
  const [name, setName] = useState(''),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [confirm, setConfirm] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  async function submit() {
    setError('');
    if (
      name.trim().length < 2 ||
      !email.includes('@') ||
      password.length < 6 ||
      password !== confirm
    ) {
      setError('Confira nome, e-mail e senha (mínimo 6 caracteres; senhas iguais).');
      return;
    }
    setBusy(true);
    try {
      const r = await signUp(name.trim(), email.trim(), password);
      if (r.needsConfirmation) {
        Alert.alert(
          'Confirme seu e-mail',
          'Enviamos um link de confirmação. Depois, faça login.',
        );
        router.replace('/login');
      }
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen>
      <Text
        style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 20 }}
      >
        Criar conta
      </Text>
      <Input label="Nome" value={name} onChangeText={setName} />
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <Input
        label="Confirmar senha"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />
      {!!error && <Text style={{ color: colors.danger, marginBottom: 10 }}>{error}</Text>}
      <Button title="Cadastrar" onPress={submit} loading={busy} />
      <Link
        href="/login"
        style={{ textAlign: 'center', marginTop: 20, color: colors.primary }}
      >
        Já tenho conta · Entrar
      </Link>
    </Screen>
  );
}
