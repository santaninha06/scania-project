import { useRouter } from 'expo-router';
import { RefreshControl, Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { ReceiptCard } from '@/components/ReceiptCard';
import { EmptyState, ErrorView, LoadingView } from '@/components/StateViews';
import { useReceipts } from '@/hooks/useReceipts';
import { colors } from '@/theme';
export default function Home() {
  const q = useReceipts(),
    router = useRouter();
  if (q.isLoading) return <LoadingView />;
  if (q.isError)
    return <ErrorView message="Verifique sua conexão." onRetry={() => q.refetch()} />;
  return (
    <Screen>
      <Text
        style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 6 }}
      >
        Minhas notas
      </Text>
      <Text style={{ color: colors.muted, marginBottom: 18 }}>
        Acompanhe as notas fiscais que você escaneou.
      </Text>
      {q.data?.length ? (
        q.data.map((r) => (
          <ReceiptCard
            key={r.id}
            receipt={r}
            onPress={() => router.push(`/receipt/${r.id}`)}
          />
        ))
      ) : (
        <EmptyState
          title="Nenhuma nota por aqui"
          message="Use a aba Escanear para fotografar sua primeira nota fiscal."
        />
      )}
    </Screen>
  );
}
