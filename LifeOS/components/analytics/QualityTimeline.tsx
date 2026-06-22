import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';

interface QualityTimelineProps {
  data: Array<{ month: string; avgSatisfaction: number; outcomeCount: number }>;
}

const CHART_W = 300;
const CHART_H = 180;
const PAD_TOP = 20;
const PAD_BOTTOM = 30;
const PAD_LEFT = 40;
const PAD_RIGHT = 20;
const PLOT_W = CHART_W - PAD_LEFT - PAD_RIGHT;
const PLOT_H = CHART_H - PAD_TOP - PAD_BOTTOM;

const QualityTimeline: React.FC<QualityTimelineProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, alignItems: 'center', ...SHADOWS.card }}>
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted, marginBottom: SPACING.sm }]}>Satisfaction Over Time</Text>
        <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginTop: SPACING.md }]}>Not enough data yet</Text>
      </View>
    );
  }

  const maxSat = Math.max(...data.map((d) => d.avgSatisfaction), 8);
  const minSat = Math.min(...data.map((d) => d.avgSatisfaction), 2);

  const getX = (i: number) => PAD_LEFT + (i / Math.max(data.length - 1, 1)) * PLOT_W;
  const getY = (v: number) => PAD_TOP + PLOT_H - ((v - minSat) / Math.max(maxSat - minSat, 1)) * PLOT_H;

  const points = data.map((d, i) => `${getX(i)},${getY(d.avgSatisfaction)}`).join(' ');

  return (
    <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, ...SHADOWS.card }}>
      <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted, marginBottom: SPACING.sm }]}>Satisfaction Over Time</Text>
      <Svg width="100%" height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
        {/* Grid lines */}
        {[1, 2, 3].map((i) => (
          <Line key={i} x1={PAD_LEFT} y1={PAD_TOP + (PLOT_H / 4) * i} x2={CHART_W - PAD_RIGHT} y2={PAD_TOP + (PLOT_H / 4) * i} stroke={COLORS.surfaceDim} strokeWidth={1} />
        ))}
        {/* Line */}
        <Polyline points={points} fill="none" stroke={COLORS.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {/* Dots */}
        {data.map((d, i) => (
          <Circle key={i} cx={getX(i)} cy={getY(d.avgSatisfaction)} r={4} fill={COLORS.primary} />
        ))}
      </Svg>
      {/* Month labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, paddingHorizontal: PAD_LEFT }}>
        {data.map((d, i) => (
          <Text key={i} style={{ fontSize: 9, color: COLORS.textSecondary, fontFamily: 'Inter_400Regular' }}>{d.month.slice(-2)}</Text>
        ))}
      </View>
    </View>
  );
};

export default QualityTimeline;
