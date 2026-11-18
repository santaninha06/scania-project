import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Button } from './Button';
import { Input } from './Input';
import { CATEGORIES } from '@/constants/categories';
import { colors } from '@/theme';
import { formatMoney, parseMoney } from '@/utils/money';
import { isoToBr, brToISO } from '@/utils/date';
import type { Receipt, ReceiptUpdate } from '@/types';
export function ReceiptForm({
  receipt,
  onSave,
  loading,
}: {
  receipt: Receipt;
  onSave: (v: ReceiptUpdate) => void;
  loading: boolean;
}) {
  const [merchant, setMerchant] = useState(receipt.merchant ?? ''),
    [date, setDate] = useState(
      receipt.purchase_date ? isoToBr(receipt.purchase_date) : '',
    ),
    [total, setTotal] = useState(
      receipt.total === null ? '' : String(receipt.total).replace('.', ','),
    ),
    [category, setCategory] = useState(receipt.category ?? 'Outros'),
    [error, setError] = useState('');
  useEffect(() => {
    setMerchant(receipt.merchant ?? '');
    setDate(receipt.purchase_date ? isoToBr(receipt.purchase_date) : '');
    setTotal(receipt.total === null ? '' : String(receipt.total).replace('.', ','));
    setCategory(receipt.category ?? 'Outros');
  }, [receipt]);
  function save() {
    const n = parseMoney(total),
      iso = date ? brToISO(date) : null;
    if (merchant.trim().length < 2 || !Number.isFinite(n) || n <= 0 || (date && !iso)) {
      setError('Confira estabelecimento, data e valor.');
      return;
    }
    setError('');
    onSave({ merchant: merchant.trim(), purchase_date: iso, total: n, category });
  }
  return (
    <>
      {<Input label="Estabelecimento" value={merchant} onChangeText={setMerchant} />}
      <Input
        label="Data (DD/MM/AAAA)"
        value={date}
        onChangeText={setDate}
        placeholder="18/09/2026"
      />
      <Input
        label="Valor total (R$)"
        value={total}
        onChangeText={setTotal}
        keyboardType="decimal-pad"
      />
      <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 8 }}>
        Categoria
      </Text>
      {CATEGORIES.map((c) => (
        <Text
          key={c.name}
          onPress={() => setCategory(c.name)}
          style={{
            padding: 10,
            marginBottom: 5,
            borderRadius: 8,
            backgroundColor: category === c.name ? colors.primarySoft : '#fff',
            color: colors.text,
          }}
        >
          {category === c.name ? '✓ ' : ''}
          {c.name}
        </Text>
      ))}
      {!!error && (
        <Text style={{ color: colors.danger, marginVertical: 8 }}>{error}</Text>
      )}
      <Button title="Salvar correções" onPress={save} loading={loading} />
    </>
  );
}
