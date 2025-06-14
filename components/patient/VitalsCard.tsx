import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Heart, BarChart2, TrendingUp, Clock } from 'lucide-react-native';
import { format } from 'date-fns';

interface VitalsCardProps {
  title: string;
  value: string | number;
  unit: string;
  time: Date;
  type: 'bp' | 'sugar' | 'weight' | 'pulse';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  onPress?: () => void;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({
  title,
  value,
  unit,
  time,
  type,
  trend,
  trendValue,
  onPress,
}) => {
  const { colors } = useTheme();
  
  // Get icon based on vitals type
  const getIcon = () => {
    const iconSize = 20;
    
    switch (type) {
      case 'bp':
        return <BarChart2 size={iconSize} color={colors.error} />;
      case 'sugar':
        return <TrendingUp size={iconSize} color={colors.warning} />;
      case 'weight':
        return <BarChart2 size={iconSize} color={colors.primary} />;
      case 'pulse':
        return <Heart size={iconSize} color={colors.error} />;
      default:
        return <BarChart2 size={iconSize} color={colors.primary} />;
    }
  };
  
  // Get trend color
  const getTrendColor = (): string => {
    switch (trend) {
      case 'up':
        return colors.error;
      case 'down':
        return colors.success;
      case 'stable':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.textSecondary }]}>
            {title}
          </Text>
          
          <View style={styles.valueContainer}>
            <Text style={[styles.value, { color: colors.text }]}>
              {value}
              <Text style={[styles.unit, { color: colors.textSecondary }]}>
                {' '}{unit}
              </Text>
            </Text>
            
            {trend && trendValue && (
              <View style={[styles.trendContainer, { backgroundColor: getTrendColor() + '20' }]}>
                <Text style={[styles.trendValue, { color: getTrendColor() }]}>
                  {trendValue}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.timeContainer}>
            <Clock size={12} color={colors.textSecondary} />
            <Text style={[styles.time, { color: colors.textSecondary }]}>
              {format(time, 'h:mm a, MMM d')}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  unit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  trendContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  trendValue: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
});