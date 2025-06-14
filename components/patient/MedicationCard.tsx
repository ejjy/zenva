import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Pill, Check, Clock, AlertCircle } from 'lucide-react-native';

export type MedicationStatus = 'taken' | 'missed' | 'upcoming';

interface MedicationCardProps {
  name: string;
  dosage: string;
  frequency: string;
  status: MedicationStatus;
  time: string;
  instructions?: string;
  onPress?: () => void;
  onMarkAsTaken?: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  name,
  dosage,
  frequency,
  status,
  time,
  instructions,
  onPress,
  onMarkAsTaken,
}) => {
  const { colors } = useTheme();
  
  // Get status badge variant and label
  const getStatusBadge = () => {
    switch (status) {
      case 'taken':
        return {
          variant: 'success' as const,
          label: 'Taken',
          icon: <Check size={12} color={colors.successDark} />,
        };
      case 'missed':
        return {
          variant: 'error' as const,
          label: 'Missed',
          icon: <AlertCircle size={12} color={colors.errorDark} />,
        };
      case 'upcoming':
        return {
          variant: 'warning' as const,
          label: 'Upcoming',
          icon: <Clock size={12} color={colors.warningDark} />,
        };
      default:
        return {
          variant: 'default' as const,
          label: 'Unknown',
          icon: null,
        };
    }
  };
  
  const { variant, label, icon } = getStatusBadge();
  
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
            <Pill size={20} color={colors.primary} />
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {name}
            </Text>
            <Text style={[styles.dosage, { color: colors.textSecondary }]}>
              {dosage} • {frequency}
            </Text>
          </View>
          
          <Badge 
            variant={variant}
            label={label}
            icon={icon}
            size="sm"
          />
        </View>
        
        <View style={styles.timeRow}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {time}
          </Text>
        </View>
        
        {instructions && (
          <Text style={[styles.instructions, { color: colors.textSecondary }]}>
            {instructions}
          </Text>
        )}
        
        {status === 'upcoming' && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]} 
            onPress={onMarkAsTaken}
          >
            <Check size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Mark as Taken</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
  },
  container: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  dosage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  instructions: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
});