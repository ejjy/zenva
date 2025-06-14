import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/common/Header';
import { VitalsCard } from '@/components/patient/VitalsCard';
import { Card } from '@/components/ui/Card';
import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Calendar, Plus, Filter, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { format, subDays, addDays } from 'date-fns';

// Mock vitals data
const mockVitalsData = [
  {
    id: '1',
    title: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    time: new Date(Date.now() - 3600000), // 1 hour ago
    type: 'bp' as const,
    trend: 'stable' as const,
    trendValue: 'Normal',
  },
  {
    id: '2',
    title: 'Blood Sugar',
    value: '110',
    unit: 'mg/dL',
    time: new Date(Date.now() - 7200000), // 2 hours ago
    type: 'sugar' as const,
    trend: 'down' as const,
    trendValue: '-5%',
  },
  {
    id: '3',
    title: 'Weight',
    value: '75',
    unit: 'kg',
    time: new Date(Date.now() - 86400000), // 1 day ago
    type: 'weight' as const,
    trend: 'stable' as const,
    trendValue: 'Stable',
  },
  {
    id: '4',
    title: 'Pulse',
    value: '72',
    unit: 'bpm',
    time: new Date(Date.now() - 3600000), // 1 hour ago
    type: 'pulse' as const,
    trend: 'down' as const,
    trendValue: '-3',
  },
];

// Chart data for blood pressure
const bpChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [120, 118, 125, 122, 119, 121, 120],
      color: (opacity = 1) => `rgba(82, 113, 255, ${opacity})`, // Primary color
      strokeWidth: 2,
    },
    {
      data: [80, 78, 82, 81, 79, 80, 80],
      color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`, // Secondary color
      strokeWidth: 2,
    },
  ],
  legend: ['Systolic', 'Diastolic'],
};

// Chart data for blood sugar
const sugarChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [110, 115, 108, 120, 105, 112, 110],
      color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`, // Warning color
      strokeWidth: 2,
    },
  ],
  legend: ['Blood Sugar'],
};

// Screen width for chart
const screenWidth = Dimensions.get('window').width - 32; // Adjust for padding

// Chart config
const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 0.6) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
  },
};

export default function VitalsScreen() {
  const { colors } = useTheme();
  const [activeVitalType, setActiveVitalType] = useState<'bp' | 'sugar' | 'weight' | 'pulse'>('bp');
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 6),
    end: new Date(),
  });
  
  // Navigate date range
  const navigateDate = (direction: 'prev' | 'next') => {
    const days = 7;
    if (direction === 'prev') {
      setDateRange({
        start: subDays(dateRange.start, days),
        end: subDays(dateRange.end, days),
      });
    } else {
      setDateRange({
        start: addDays(dateRange.start, days),
        end: addDays(dateRange.end, days),
      });
    }
  };
  
  // Filter vitals by type
  const filteredVitals = mockVitalsData.filter(vital => vital.type === activeVitalType);
  
  // Get chart data based on active vital type
  const getChartData = () => {
    switch (activeVitalType) {
      case 'bp':
        return bpChartData;
      case 'sugar':
        return sugarChartData;
      case 'weight':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              data: [75, 75.2, 74.8, 74.5, 74.7, 75, 75.2],
              color: (opacity = 1) => `rgba(82, 113, 255, ${opacity})`, // Primary color
              strokeWidth: 2,
            },
          ],
          legend: ['Weight'],
        };
      case 'pulse':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              data: [72, 75, 68, 70, 72, 71, 72],
              color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Error color
              strokeWidth: 2,
            },
          ],
          legend: ['Pulse'],
        };
      default:
        return bpChartData;
    }
  };
  
  // Get vital type title
  const getVitalTypeTitle = () => {
    switch (activeVitalType) {
      case 'bp':
        return 'Blood Pressure';
      case 'sugar':
        return 'Blood Sugar';
      case 'weight':
        return 'Weight';
      case 'pulse':
        return 'Pulse Rate';
      default:
        return 'Blood Pressure';
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Vitals Tracking" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Vital Type Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.vitalTypeScroll}
          contentContainerStyle={styles.vitalTypeContainer}
        >
          <TouchableOpacity
            style={[
              styles.vitalTypeButton,
              activeVitalType === 'bp' && [styles.activeVitalTypeButton, { backgroundColor: colors.primaryLight }],
            ]}
            onPress={() => setActiveVitalType('bp')}
          >
            <Text
              style={[
                styles.vitalTypeText,
                { color: colors.text },
                activeVitalType === 'bp' && { color: colors.primary },
              ]}
            >
              Blood Pressure
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.vitalTypeButton,
              activeVitalType === 'sugar' && [styles.activeVitalTypeButton, { backgroundColor: colors.warningLight }],
            ]}
            onPress={() => setActiveVitalType('sugar')}
          >
            <Text
              style={[
                styles.vitalTypeText,
                { color: colors.text },
                activeVitalType === 'sugar' && { color: colors.warning },
              ]}
            >
              Blood Sugar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.vitalTypeButton,
              activeVitalType === 'weight' && [styles.activeVitalTypeButton, { backgroundColor: colors.primaryLight }],
            ]}
            onPress={() => setActiveVitalType('weight')}
          >
            <Text
              style={[
                styles.vitalTypeText,
                { color: colors.text },
                activeVitalType === 'weight' && { color: colors.primary },
              ]}
            >
              Weight
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.vitalTypeButton,
              activeVitalType === 'pulse' && [styles.activeVitalTypeButton, { backgroundColor: colors.errorLight }],
            ]}
            onPress={() => setActiveVitalType('pulse')}
          >
            <Text
              style={[
                styles.vitalTypeText,
                { color: colors.text },
                activeVitalType === 'pulse' && { color: colors.error },
              ]}
            >
              Pulse
            </Text>
          </TouchableOpacity>
        </ScrollView>
        
        {/* Chart Card */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              {getVitalTypeTitle()} Trends
            </Text>
            
            <View style={styles.dateNavigator}>
              <TouchableOpacity 
                style={[styles.dateNavButton, { borderColor: colors.border }]} 
                onPress={() => navigateDate('prev')}
              >
                <ArrowLeft size={16} color={colors.text} />
              </TouchableOpacity>
              
              <View style={[styles.dateRangeContainer, { backgroundColor: colors.backgroundSecondary }]}>
                <Calendar size={14} color={colors.primary} />
                <Text style={[styles.dateRangeText, { color: colors.text }]}>
                  {format(dateRange.start, 'MMM d')} - {format(dateRange.end, 'MMM d')}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.dateNavButton, { borderColor: colors.border }]} 
                onPress={() => navigateDate('next')}
                disabled={format(dateRange.end, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
              >
                <ArrowRight size={16} color={format(dateRange.end, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? colors.border : colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={getChartData()}
              width={screenWidth - 32} // Adjust for card padding
              height={220}
              chartConfig={{
                ...chartConfig,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 0.6) => `rgba(${colors.text === '#FFFFFF' ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
              }}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={true}
              withShadow={false}
              withDots={true}
              withVerticalLines={false}
              withHorizontalLines={true}
              formatYLabel={(value) => `${value}`}
              fromZero={false}
              segments={5}
            />
          </View>
          
          <View style={styles.legendContainer}>
            {getChartData().legend.map((label, index) => (
              <View key={index} style={styles.legendItem}>
                <View 
                  style={[
                    styles.legendColor, 
                    { 
                      backgroundColor: getChartData().datasets[index].color(1) 
                    }
                  ]} 
                />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </Card>
        
        {/* Recent Readings */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Readings
          </Text>
          
          <TouchableOpacity style={[styles.filterButton, { borderColor: colors.border }]}>
            <Filter size={16} color={colors.text} />
            <Text style={[styles.filterText, { color: colors.text }]}>Filter</Text>
          </TouchableOpacity>
        </View>
        
        {filteredVitals.length > 0 ? (
          filteredVitals.map(vital => (
            <VitalsCard
              key={vital.id}
              title={vital.title}
              value={vital.value}
              unit={vital.unit}
              time={vital.time}
              type={vital.type}
              trend={vital.trend}
              trendValue={vital.trendValue}
            />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No recent readings for {getVitalTypeTitle().toLowerCase()}.
            </Text>
          </Card>
        )}
      </ScrollView>
      
      <FloatingActionButton
        icon={<Plus size={24} color="#FFFFFF" />}
        label="Log Vitals"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for FAB
  },
  vitalTypeScroll: {
    marginTop: 16,
    marginBottom: 8,
  },
  vitalTypeContainer: {
    paddingRight: 16,
  },
  vitalTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeVitalTypeButton: {
    borderWidth: 0,
  },
  vitalTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  chartCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateNavButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  dateRangeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chart: {
    borderRadius: 8,
    paddingRight: 0,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});