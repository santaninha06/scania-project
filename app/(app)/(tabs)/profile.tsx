import { Alert, Text } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/theme';
export default function Profile() {
  const { user, signOut } = useAuth();
  return (
    <Screen>
      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          color: colors.text,
          marginBottom: spacing.lg,
        }}
      >
        Perfil
      </Text>
      <Text style={{ color: colors.muted, marginBottom: 6 }}>Conta conectada</Text>
      <Text style={{ fontSize: 16, color: colors.text, marginBottom: spacing.xl }}>
        {user?.email}
      </Text>
      <Text style={{ color: colors.muted, marginBottom: spacing.lg }}>
        Suas imagens ficam em um bucket privado e suas notas são protegidas por políticas
        RLS.
      </Text>
      <Button
        title="Sair da conta"
        variant="danger"
        onPress={() =>
          Alert.alert('Sair', 'Deseja encerrar a sessão?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: () => signOut() },
          ])
        }
      />
    </Screen>
  );
}
