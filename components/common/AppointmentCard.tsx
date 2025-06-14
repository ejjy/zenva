import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, User, MapPin } from 'lucide-react-native';
import { format } from 'date-fns';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

interface AppointmentCardProps {
  doctorName?: string;
  patientName?: string;
  specialty?: string;
  dateTime: Date;
  location?: string;
  status: AppointmentStatus;
  duration?: number; // in minutes
  onPress?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  doctorName,
  patientName,
  specialty,
  dateTime,
  location,
  status,
  duration = 30,
  onPress,
}) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  
  // Format date and time
  const formattedDate = format(dateTime, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(dateTime, 'h:mm a');
  const endTime = new Date(dateTime.getTime() + duration * 60000);
  const formattedEndTime = format(endTime, 'h:mm a');
  
  // Get status badge variant and label
  const getStatusBadge = () => {
    switch (status) {
      case 'scheduled':
        return {
          variant: 'primary' as const,
          label: 'Scheduled',
        };
      case 'confirmed':
        return {
          variant: 'success' as const,
          label: 'Confirmed',
        };
      case 'cancelled':
        return {
          variant: 'error' as const,
          label: 'Cancelled',
        };
      case 'completed':
        return {
          variant: 'secondary' as const,
          label: 'Completed',
        };
      default:
        return {
          variant: 'default' as const,
          label: 'Unknown',
        };
    }
  };
  
  const { variant, label } = getStatusBadge();
  
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.name, { color: colors.text }]}>
              {isDoctor ? patientName : doctorName}
            </Text>
            {specialty && (
              <Text style={[styles.specialty, { color: colors.textSecondary }]}>
                {specialty}
              </Text>
            )}
          </View>
          
          <Badge 
            variant={variant}
            label={label}
            size="sm"
          />
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Calendar size={16} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {formattedDate}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={16} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {formattedTime} - {formattedEndTime} ({duration} min)
            </Text>
          </View>
          
          {location && (
            <View style={styles.detailRow}>
              <MapPin size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {location}
              </Text>
            </View>
          )}
        </View>
        
        {status === 'scheduled' && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.actionButtonText}>
                {isDoctor ? 'Confirm' : 'Join'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton, { borderColor: colors.error }]}
            >
              <Text style={[styles.cancelButtonText, { color: colors.error }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  container: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  specialty: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    marginRight: 8,
  },
  cancelButton: {
    marginLeft: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});