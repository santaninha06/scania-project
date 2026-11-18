import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useScanReceipt } from '@/hooks/useReceipts';
import { pickReceiptImage, prepareForUpload } from '@/services/imagePicker';
import type { PickedImage } from '@/services/imagePicker';
import { colors, spacing } from '@/theme';
import { friendlyError } from '@/utils/errors';
export default function Scan() {
  const { user } = useAuth(),
    router = useRouter(),
    scan = useScanReceipt();
  const [image, setImage] = useState<PickedImage | null>(null),
    [step, setStep] = useState<'upload' | 'analyze' | null>(null);
  async function choose(source: 'camera' | 'library') {
    try {
      const p = await pickReceiptImage(source);
      if (p) setImage(p);
    } catch (e) {
      Alert.alert('Não foi possível abrir', friendlyError(e));
    }
  }
  async function send() {
    if (!image || !user) return;
    try {
      const base64 = await prepareForUpload(image);
      const result = await scan.mutateAsync({ userId: user.id, base64, onStep: setStep });
      if (result.error) Alert.alert('Leitura não concluída', result.error);
      else
        Alert.alert('Nota lida', 'Confira os dados extraídos.', [
          { text: 'Ver nota', onPress: () => router.push(`/receipt/${result.id}`) },
        ]);
      setImage(null);
      router.replace('/');
    } catch (e) {
      Alert.alert('Erro', friendlyError(e));
    } finally {
      setStep(null);
    }
  }
  return (
    <Screen>
      <Text style={s.title}>Escanear nota</Text>
      <Text style={s.sub}>
        Fotografe uma nota fiscal ou escolha uma imagem da galeria.
      </Text>
      <View style={s.actions}>
        <Button title="Abrir câmera" onPress={() => choose('camera')} />
        <Button
          title="Escolher da galeria"
          variant="secondary"
          onPress={() => choose('library')}
        />
      </View>
      {image && (
        <Card>
          <Image source={{ uri: image.uri }} style={s.preview} resizeMode="contain" />
          <Button title="Enviar para leitura" onPress={send} loading={scan.isPending} />
          <Button
            title="Remover imagem"
            variant="secondary"
            onPress={() => setImage(null)}
          />
        </Card>
      )}
      {scan.isPending && (
        <Text style={s.sub}>
          {step === 'upload' ? 'Enviando imagem...' : 'A IA está lendo sua nota...'}
        </Text>
      )}
    </Screen>
  );
}
const s = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  sub: { color: colors.muted, marginTop: 8, marginBottom: 20 },
  actions: { gap: 8 },
  preview: { width: '100%', height: 300, marginBottom: 12 },
});
