import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import { colors } from '@/theme';
export interface DonutSlice {
  value: number;
  color: string;
}
export function DonutChart({
  data,
  size = 190,
  strokeWidth = 28,
  children,
}: {
  data: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}) {
  const center = size / 2,
    radius = (size - strokeWidth) / 2,
    circ = 2 * Math.PI * radius,
    total = data.reduce((s, x) => s + x.value, 0);
  let consumed = 0;
  const arcs = data.map((slice) => {
    const length = total > 0 ? (slice.value / total) * circ : 0,
      a = { ...slice, length, offset: consumed };
    consumed += length;
    return a;
  });
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${center}, ${center}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {arcs.map((a, i) => (
            <Circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              stroke={a.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${a.length} ${circ - a.length}`}
              strokeDashoffset={-a.offset}
            />
          ))}
        </G>
      </Svg>
      <View style={[StyleSheet.absoluteFill, s.center]} pointerEvents="none">
        {children}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
