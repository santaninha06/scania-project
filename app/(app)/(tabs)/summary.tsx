import { useState } from 'react';
import { Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { MonthSwitcher } from '@/components/MonthSwitcher';
import { DonutChart } from '@/components/DonutChart';
import { EmptyState, LoadingView, ErrorView } from '@/components/StateViews';
import { useReceipts } from '@/hooks/useReceipts';
import { currentYearMonth } from '@/utils/date';
import { filterByMonth, summarizeReceipts } from '@/utils/summary';
import { formatMoney } from '@/utils/money';
import { colors } from '@/theme';
export default function Summary() {
  const q = useReceipts();
  const [month, setMonth] = useState(currentYearMonth());
  if (q.isLoading) return <LoadingView />;
  if (q.isError)
    return (
      <ErrorView
        message="Não foi possível carregar o resumo."
        onRetry={() => q.refetch()}
      />
    );
  const summary = summarizeReceipts(filterByMonth(q.data ?? [], month));
  return (
    <Screen>
      <Text
        style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 18 }}
      >
        Resumo mensal
      </Text>
      <MonthSwitcher value={month} onChange={setMonth} />
      <Card>
        <Text style={{ color: colors.muted }}>Total gasto</Text>
        <Text
          style={{ fontSize: 30, fontWeight: '900', color: colors.text, marginTop: 5 }}
        >
          {formatMoney(summary.total)}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>
          {summary.count} notas lidas · média {formatMoney(summary.average)}
        </Text>
      </Card>
      {summary.byCategory.length ? (
        <Card>
          <View style={{ alignItems: 'center' }}>
            <DonutChart
              data={summary.byCategory.map((c) => ({ value: c.total, color: c.color }))}
            >
              <Text style={{ fontWeight: '800', color: colors.text }}>Categorias</Text>
            </DonutChart>
          </View>
          {summary.byCategory.map((c) => (
            <View
              key={c.category}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: colors.text }}>
                {c.category} · {c.percent.toFixed(0)}%
              </Text>
              <Text style={{ fontWeight: '700', color: colors.text }}>
                {formatMoney(c.total)}
              </Text>
            </View>
          ))}
        </Card>
      ) : (
        <EmptyState
          title="Sem gastos neste mês"
          message="As notas lidas aparecerão aqui."
        />
      )}
    </Screen>
  );
}
