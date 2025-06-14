import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { AppointmentCard } from '@/components/common/AppointmentCard';
import { VitalsCard } from '@/components/patient/VitalsCard';
import { MedicationCard } from '@/components/patient/MedicationCard';
import { Calendar, Clock, Plus, FilePlus } from 'lucide-react-native';
import { format } from 'date-fns';

// Mock data for the dashboard
const upcomingAppointment = {
  doctorName: 'Dr. Jane Smith',
  specialty: 'Cardiology',
  dateTime: new Date(Date.now() + 86400000), // Tomorrow
  location: 'Heart Care Clinic, Floor 3',
  status: 'scheduled' as const,
};

const latestVitals = [
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
];

const medications = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    status: 'upcoming' as const,
    time: '8:00 AM',
    instructions: 'Take with water before breakfast',
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    status: 'taken' as const,
    time: '2:00 PM',
  },
];

// Mock data for AI insights
const aiInsight = {
  title: 'Weekly Health Summary',
  message: 'Your blood pressure readings have been stable this week. Continue taking your medication regularly and maintain your exercise routine.',
  date: new Date(),
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, patientProfile, doctorProfile } = useAuth();
  const [greeting, setGreeting] = useState('');
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);
  
  // Handle floating action button press
  const handleFabPress = () => {
    if (user?.role === 'doctor') {
      // Navigate to prescription creation
    } else {
      // Navigate to log vitals
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              {greeting},
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.role === 'doctor' ? 'Dr. ' : ''}{user?.name}
            </Text>
          </View>
          
          <TouchableOpacity>
            <Image 
              source={{ uri: user?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        
        {user?.role === 'patient' ? (
          // Patient Dashboard
          <>
            {/* AI Insight Card */}
            <Card 
              style={[styles.aiInsightCard, { backgroundColor: colors.primaryLight }]}
              elevation={0}
            >
              <View style={styles.aiInsightHeader}>
                <Text style={[styles.aiInsightTitle, { color: colors.primaryDark }]}>
                  {aiInsight.title}
                </Text>
                <Text style={[styles.aiInsightDate, { color: colors.primaryDark }]}>
                  {format(aiInsight.date, 'MMM d')}
                </Text>
              </View>
              <Text style={[styles.aiInsightMessage, { color: colors.primaryDark }]}>
                {aiInsight.message}
              </Text>
            </Card>
            
            {/* Upcoming Appointment */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Upcoming Appointment
              </Text>
              <Link href="/(app)/appointments" asChild>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            <AppointmentCard 
              doctorName={upcomingAppointment.doctorName}
              specialty={upcomingAppointment.specialty}
              dateTime={upcomingAppointment.dateTime}
              location={upcomingAppointment.location}
              status={upcomingAppointment.status}
            />
            
            {/* Latest Vitals */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Latest Vitals
              </Text>
              <Link href="/(app)/vitals" asChild>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            {latestVitals.map((vital) => (
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
            ))}
            
            {/* Medications */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Today's Medications
              </Text>
              <Link href="/(app)/medications" asChild>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            {medications.map((medication) => (
              <MedicationCard
                key={medication.id}
                name={medication.name}
                dosage={medication.dosage}
                frequency={medication.frequency}
                status={medication.status}
                time={medication.time}
                instructions={medication.instructions}
                onMarkAsTaken={() => {}}
              />
            ))}
          </>
        ) : (
          // Doctor Dashboard
          <>
            {/* Doctor's Stats Card */}
            <View style={styles.statsCardsContainer}>
              <Card style={styles.statsCard}>
                <View style={styles.statsCardContent}>
                  <Text style={[styles.statsNumber, { color: colors.primary }]}>12</Text>
                  <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Patients</Text>
                </View>
              </Card>
              
              <Card style={styles.statsCard}>
                <View style={styles.statsCardContent}>
                  <Text style={[styles.statsNumber, { color: colors.secondary }]}>5</Text>
                  <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Appointments</Text>
                </View>
              </Card>
              
              <Card style={styles.statsCard}>
                <View style={styles.statsCardContent}>
                  <Text style={[styles.statsNumber, { color: colors.accent }]}>3</Text>
                  <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Pending</Text>
                </View>
              </Card>
            </View>
            
            {/* Today's Schedule */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Today's Schedule
              </Text>
              <Link href="/(app)/appointments" asChild>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            <Card style={styles.todayScheduleCard}>
              <View style={styles.scheduleHeader}>
                <Calendar size={20} color={colors.primary} />
                <Text style={[styles.todayText, { color: colors.text }]}>
                  Today, {format(new Date(), 'MMMM d')}
                </Text>
              </View>
              
              <View style={styles.scheduleItem}>
                <View style={[styles.timeIndicator, { backgroundColor: colors.primary }]}>
                  <Clock size={16} color="#FFFFFF" />
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={[styles.appointmentTime, { color: colors.text }]}>9:00 AM</Text>
                  <Text style={[styles.appointmentPatient, { color: colors.text }]}>John Doe</Text>
                  <Text style={[styles.appointmentType, { color: colors.textSecondary }]}>
                    Follow-up Consultation
                  </Text>
                </View>
              </View>
              
              <View style={styles.scheduleItem}>
                <View style={[styles.timeIndicator, { backgroundColor: colors.secondary }]}>
                  <Clock size={16} color="#FFFFFF" />
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={[styles.appointmentTime, { color: colors.text }]}>11:30 AM</Text>
                  <Text style={[styles.appointmentPatient, { color: colors.text }]}>Emily Johnson</Text>
                  <Text style={[styles.appointmentType, { color: colors.textSecondary }]}>
                    Initial Consultation
                  </Text>
                </View>
              </View>
              
              <View style={styles.scheduleItem}>
                <View style={[styles.timeIndicator, { backgroundColor: colors.accent }]}>
                  <Clock size={16} color="#FFFFFF" />
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={[styles.appointmentTime, { color: colors.text }]}>2:15 PM</Text>
                  <Text style={[styles.appointmentPatient, { color: colors.text }]}>Michael Brown</Text>
                  <Text style={[styles.appointmentType, { color: colors.textSecondary }]}>
                    Medication Review
                  </Text>
                </View>
              </View>
            </Card>
            
            {/* Recent Patients */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recent Patients
              </Text>
              <Link href="/(app)/(tabs)/patients" asChild>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            <Card>
              <View style={styles.patientItem}>
                <Image 
                  source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                  style={styles.patientImage}
                />
                <View style={styles.patientInfo}>
                  <Text style={[styles.patientName, { color: colors.text }]}>John Doe</Text>
                  <Text style={[styles.patientDetails, { color: colors.textSecondary }]}>
                    35 yrs • Hypertension
                  </Text>
                </View>
                <TouchableOpacity style={[styles.viewButton, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.viewButtonText, { color: colors.primary }]}>View</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <View style={styles.patientItem}>
                <Image 
                  source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
                  style={styles.patientImage}
                />
                <View style={styles.patientInfo}>
                  <Text style={[styles.patientName, { color: colors.text }]}>Emily Johnson</Text>
                  <Text style={[styles.patientDetails, { color: colors.textSecondary }]}>
                    28 yrs • Diabetes
                  </Text>
                </View>
                <TouchableOpacity style={[styles.viewButton, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.viewButtonText, { color: colors.primary }]}>View</Text>
                </TouchableOpacity>
              </View>
            </Card>
            
            {/* Patient Invite Card */}
            <Card style={[styles.inviteCard, { borderColor: colors.primary }]} border>
              <Text style={[styles.inviteTitle, { color: colors.text }]}>
                Invite Your Patients
              </Text>
              <Text style={[styles.inviteCode, { color: colors.primary }]}>
                {doctorProfile?.patientCode || 'DOC1234'}
              </Text>
              <Text style={[styles.inviteDescription, { color: colors.textSecondary }]}>
                Share this code with your patients to connect them to your practice.
              </Text>
              <Button
                title="Copy Invite Code"
                variant="outline"
                size="sm"
                style={styles.copyButton}
              />
            </Card>
          </>
        )}
      </ScrollView>
      
      <FloatingActionButton
        icon={
          user?.role === 'doctor' 
            ? <FilePlus size={24} color="#FFFFFF" />
            : <Plus size={24} color="#FFFFFF" />
        }
        label={user?.role === 'doctor' ? 'New Prescription' : 'Log Vitals'}
        onPress={handleFabPress}
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
    paddingTop: 60,
    paddingBottom: 100, // Extra space for FAB
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  aiInsightCard: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  aiInsightDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  aiInsightMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  statsCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  statsCard: {
    width: '30%',
  },
  statsCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  statsNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  todayScheduleCard: {
    marginBottom: 8,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  todayText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTime: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  appointmentPatient: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  patientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  patientDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  inviteCard: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  inviteTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  inviteCode: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  inviteDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  copyButton: {
    minWidth: 140,
  },
});