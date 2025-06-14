import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Switch, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Moon,
  ChevronRight,
  Settings,
  FileText,
  MessageSquare,
  Calendar,
  Heart,
  Pill
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { user, patientProfile, doctorProfile, signOut } = useAuth();
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Profile" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: user?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profileImage}
          />
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user?.role === 'doctor' ? 'Dr. ' : ''}{user?.name}
            </Text>
            
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user?.email}
            </Text>
            
            <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.editButtonText, { color: colors.primary }]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Role-specific Info Card */}
        {user?.role === 'patient' ? (
          <Card style={styles.infoCard}>
            <View style={styles.infoCardRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Age</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {patientProfile?.age || 'Not set'}
              </Text>
            </View>
            
            <View style={styles.infoCardRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Gender</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {patientProfile?.gender || 'Not set'}
              </Text>
            </View>
            
            <View style={styles.infoCardRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Blood Type</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {patientProfile?.bloodType || 'Not set'}
              </Text>
            </View>
            
            <View style={styles.infoCardRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Primary Doctor</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                Dr. Jane Smith
              </Text>
            </View>
          </Card>
        ) : (
          <Card style={styles.infoCard}>
            <View style={styles.infoCardRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Specialization</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {doctorProfile?.specialization || 'Not set'}
              </Text>
            </View>
            
            <View style={styles.infoCardRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Experience</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {doctorProfile?.experience ? `${doctorProfile.experience} years` : 'Not set'}
              </Text>
            </View>
            
            <View style={styles.infoCardRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Patient Code</Text>
              <Text style={[styles.infoValue, { color: colors.primary, fontFamily: 'Inter-SemiBold' }]}>
                {doctorProfile?.patientCode || 'Not set'}
              </Text>
            </View>
            
            <View style={styles.infoCardRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Clinic Info</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {doctorProfile?.clinicInfo || 'Not set'}
              </Text>
            </View>
          </Card>
        )}
        
        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        
        <View style={styles.quickActionsGrid}>
          {user?.role === 'patient' ? (
            <>
              <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLight }]}>
                  <Heart size={20} color={colors.primary} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>Vitals</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.secondaryLight }]}>
                  <Pill size={20} color={colors.secondary} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>Medications</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.warningLight }]}>
                  <FileText size={20} color={colors.warning} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>Prescriptions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.errorLight }]}>
                  <Calendar size={20} color={colors.error} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>Appointments</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLight }]}>
                  <User size={20} color={colors.primary} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>Patients</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.secondaryLight }]}>
                  <Calendar size={20} color={colors.secondary} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>Schedule</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.warningLight }]}>
                  <FileText size={20} color={colors.warning} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>Prescriptions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.quickActionItem, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.errorLight }]}>
                  <MessageSquare size={20} color={colors.error} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>Messages</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        
        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
        
        <Card style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIcon, { backgroundColor: colors.primaryLight }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingsText, { color: colors.text }]}>Notifications</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIcon, { backgroundColor: colors.secondaryLight }]}>
                <Shield size={20} color={colors.secondary} />
              </View>
              <Text style={[styles.settingsText, { color: colors.text }]}>Privacy & Security</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIcon, { backgroundColor: colors.warningLight }]}>
                <Moon size={20} color={colors.warning} />
              </View>
              <Text style={[styles.settingsText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDark ? '#FFFFFF' : '#F3F4F6'}
              ios_backgroundColor={colors.border}
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIcon, { backgroundColor: colors.errorLight }]}>
                <Settings size={20} color={colors.error} />
              </View>
              <Text style={[styles.settingsText, { color: colors.text }]}>App Settings</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>
        
        {/* Support */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
        
        <Card style={styles.supportCard}>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIcon, { backgroundColor: colors.primaryLight }]}>
                <HelpCircle size={20} color={colors.primary} />
              </View>
              <Text style={[styles.settingsText, { color: colors.text }]}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>
        
        {/* Logout Button */}
        <Button
          title="Log Out"
          variant="outline"
          icon={<LogOut size={20} color={colors.error} />}
          textStyle={{ color: colors.error }}
          style={[styles.logoutButton, { borderColor: colors.error }]}
          onPress={signOut}
          fullWidth
        />
        
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
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
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  infoCard: {
    marginBottom: 24,
  },
  infoCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionItem: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  settingsCard: {
    marginBottom: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
  },
  supportCard: {
    marginBottom: 24,
  },
  logoutButton: {
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
});