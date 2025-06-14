import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/common/Header';

export default function DoctorProfileSetupScreen() {
  const { colors } = useTheme();
  const { user, updateDoctorProfile, isLoading } = useAuth();
  
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [clinicInfo, setClinicInfo] = useState('');
  const [education, setEducation] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  const [errors, setErrors] = useState({
    specialization: '',
    experience: '',
  });
  
  // Handle profile submission
  const handleSubmit = async () => {
    // Reset errors
    setErrors({
      specialization: '',
      experience: '',
    });
    
    // Validate inputs
    let hasError = false;
    
    if (!specialization) {
      setErrors(prev => ({ ...prev, specialization: 'Specialization is required' }));
      hasError = true;
    }
    
    if (experience && (isNaN(Number(experience)) || Number(experience) < 0)) {
      setErrors(prev => ({ ...prev, experience: 'Please enter a valid number of years' }));
      hasError = true;
    }
    
    if (hasError) return;
    
    // Generate a unique patient code (in a real app, this would be generated on the server)
    const patientCode = 'DOC' + Math.floor(1000 + Math.random() * 9000);
    
    try {
      await updateDoctorProfile({
        specialization,
        experience: experience ? parseInt(experience) : undefined,
        clinicInfo: clinicInfo || undefined,
        education: education || undefined,
        licenseNumber: licenseNumber || undefined,
        patientCode,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Complete Your Profile" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Welcome, Dr. {user?.name}!
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Complete your professional profile to get started
        </Text>
        
        <View style={styles.form}>
          <Input
            label="Specialization"
            placeholder="E.g., Cardiology, Neurology"
            value={specialization}
            onChangeText={setSpecialization}
            error={errors.specialization}
            containerStyle={styles.input}
          />
          
          <Input
            label="Years of Experience"
            placeholder="Enter number of years"
            value={experience}
            onChangeText={setExperience}
            keyboardType="number-pad"
            error={errors.experience}
            containerStyle={styles.input}
          />
          
          <Input
            label="Clinic/Hospital Information"
            placeholder="Name and address of your practice"
            value={clinicInfo}
            onChangeText={setClinicInfo}
            containerStyle={styles.input}
          />
          
          <Input
            label="Education & Qualifications"
            placeholder="E.g., MD, Harvard Medical School"
            value={education}
            onChangeText={setEducation}
            containerStyle={styles.input}
          />
          
          <Input
            label="License Number"
            placeholder="Your medical license number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            containerStyle={styles.input}
          />
          
          <Text style={[styles.note, { color: colors.textSecondary }]}>
            After setup, you'll receive a unique code that patients can use to connect with you.
          </Text>
          
          <Button
            title="Complete Profile"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.button}
            fullWidth
          />
          
          <Button
            title="Skip for Now"
            variant="outline"
            onPress={() => updateDoctorProfile({ patientCode: 'DOC' + Math.floor(1000 + Math.random() * 9000) })}
            style={styles.skipButton}
            fullWidth
          />
        </View>
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
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    marginBottom: 16,
  },
  skipButton: {
    marginBottom: 24,
  },
});