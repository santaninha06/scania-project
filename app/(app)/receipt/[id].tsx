import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Image, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { LoadingView, ErrorView } from '@/components/StateViews';
import { ReceiptForm } from '@/components/ReceiptForm';
import {
  useDeleteReceipt,
  useReceipt,
  useReceiptImageUrl,
  useUpdateReceipt,
} from '@/hooks/useReceipts';
import { formatMoney } from '@/utils/money';
import { colors } from '@/theme';
export default function ReceiptDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    router = useRouter(),
    q = useReceipt(id),
    img = useReceiptImageUrl(q.data?.image_path),
    update = useUpdateReceipt(),
    del = useDeleteReceipt();
  if (q.isLoading) return <LoadingView />;
  if (q.isError || !q.data)
    return <ErrorView message="Nota não encontrada." onRetry={() => q.refetch()} />;
  const r = q.data;
  return (
    <Screen>
      <Text
        style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 15 }}
      >
        Detalhes da nota
      </Text>
      <Card>
        {img.data ? (
          <Image
            source={{ uri: img.data }}
            style={{ width: '100%', height: 220 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={{ color: colors.muted }}>Imagem da nota indisponível.</Text>
        )}
        <Text
          style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 10 }}
        >
          {r.merchant ?? 'Nota enviada'}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>
          {r.status === 'done' && r.total !== null
            ? formatMoney(r.total)
            : (r.error_message ?? 'Aguardando leitura')}
        </Text>
      </Card>
      {r.status === 'done' ? (
        <Card>
          <Text
            style={{
              fontWeight: '800',
              fontSize: 18,
              color: colors.text,
              marginBottom: 12,
            }}
          >
            Revisar dados
          </Text>
          <ReceiptForm
            receipt={r}
            loading={update.isPending}
            onSave={(v) =>
              update.mutate(
                { id: r.id, input: v },
                {
                  onSuccess: () => Alert.alert('Salvo', 'Dados atualizados.'),
                  onError: (e) => Alert.alert('Erro', e.message),
                },
              )
            }
          />
        </Card>
      ) : null}
      {r.items?.length ? (
        <Card>
          <Text
            style={{
              fontWeight: '800',
              fontSize: 18,
              color: colors.text,
              marginBottom: 10,
            }}
          >
            Itens
          </Text>
          {r.items.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 7,
              }}
            >
              <Text style={{ color: colors.text, flex: 1 }}>
                {item.description} × {item.quantity}
              </Text>
              <Text style={{ color: colors.text, fontWeight: '700' }}>
                {formatMoney(item.total_price)}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}
      <Button
        title="Excluir nota"
        variant="danger"
        onPress={() =>
          Alert.alert('Excluir nota', 'Essa ação não pode ser desfeita.', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Excluir',
              style: 'destructive',
              onPress: () =>
                del.mutate(
                  { id: r.id, image_path: r.image_path },
                  {
                    onSuccess: () => router.replace('/'),
                    onError: (e) => Alert.alert('Erro', e.message),
                  },
                ),
            },
          ])
        }
      />
    </Screen>
  );
}
