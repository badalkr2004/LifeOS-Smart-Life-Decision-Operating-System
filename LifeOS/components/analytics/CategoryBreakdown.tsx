import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { COLORS, SPACING, RADII, SHADOWS, TYPOGRAPHY } from '@/utils/designTokens';
import { getCategoryColor, getCategoryBg } from '@/utils/helpers';

interface CategoryBreakdownProps {
  data: Array<{ category: string; count: number }>;
}

const CHART_HEIGHT = 200;
const BAR_HEIGHT = 20;
const BAR_GAP = 8;
const LABEL_WIDTH = 90;

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const chartWidth = 300;

  return (
    <View style={{ backgroundColor: COLORS.surfaceLowest, borderRadius: RADII.xl, padding: SPACING.xl, ...SHADOWS.card }}>
      <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted, marginBottom: SPACING.md }]}>Categories</Text>
      <Svg width="100%" height={data.length * (BAR_HEIGHT + BAR_GAP)} viewBox={`0 0 ${chartWidth} ${data.length * (BAR_HEIGHT + BAR_GAP)}`}>
        {data.map((item, i) => {
          const barWidth = (item.count / maxCount) * (chartWidth - LABEL_WIDTH - 20);
          const y = i * (BAR_HEIGHT + BAR_GAP);
          const color = getCategoryColor(item.category);
          return (
            <React.Fragment key={item.category}>
              <Rect x={LABEL_WIDTH} y={y} width={barWidth} height={BAR_HEIGHT} rx={4} fill={color} opacity={0.8} />
            </React.Fragment>
          );
        })}
      </Svg>
      {data.map((item, i) => {
        const color = getCategoryColor(item.category);
        return (
          <View
            key={item.category}
            style={{
              position: 'absolute',
              left: SPACING.xl,
              top: SPACING.xl + 20 + i * (BAR_HEIGHT + BAR_GAP),
              flexDirection: 'row',
              alignItems: 'center',
              height: BAR_HEIGHT,
              gap: 4,
            }}
          >
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
            <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textSecondary, textTransform: 'capitalize' }]} numberOfLines={1}>
              {item.category.replace(/_/g, ' ')}
            </Text>
            <Text style={[TYPOGRAPHY.bodySmall, { color: COLORS.textMuted }]}>{item.count}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default CategoryBreakdown;
