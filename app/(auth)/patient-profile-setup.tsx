import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/common/Header';

export default function PatientProfileSetupScreen() {
  const { colors } = useTheme();
  const { user, updatePatientProfile, isLoading } = useAuth();
  
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [doctorCode, setDoctorCode] = useState('');
  
  const [errors, setErrors] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
  });
  
  // Handle profile submission
  const handleSubmit = async () => {
    // Reset errors
    setErrors({
      age: '',
      gender: '',
      weight: '',
      height: '',
    });
    
    // Validate inputs
    let hasError = false;
    
    if (age && (isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120)) {
      setErrors(prev => ({ ...prev, age: 'Please enter a valid age (1-120)' }));
      hasError = true;
    }
    
    if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase())) {
      setErrors(prev => ({ ...prev, gender: 'Please enter male, female, or other' }));
      hasError = true;
    }
    
    if (weight && (isNaN(Number(weight)) || Number(weight) <= 0)) {
      setErrors(prev => ({ ...prev, weight: 'Please enter a valid weight' }));
      hasError = true;
    }
    
    if (height && (isNaN(Number(height)) || Number(height) <= 0)) {
      setErrors(prev => ({ ...prev, height: 'Please enter a valid height in cm' }));
      hasError = true;
    }
    
    if (hasError) return;
    
    // Convert string inputs to appropriate types
    const ageNum = age ? parseInt(age) : undefined;
    const weightNum = weight ? parseFloat(weight) : undefined;
    const heightNum = height ? parseFloat(height) : undefined;
    
    // Split comma-separated values for allergies and conditions
    const allergiesArray = allergies
      ? allergies.split(',').map(item => item.trim()).filter(Boolean)
      : undefined;
    
    const conditionsArray = conditions
      ? conditions.split(',').map(item => item.trim()).filter(Boolean)
      : undefined;
    
    try {
      await updatePatientProfile({
        age: ageNum,
        gender: gender ? (gender.toLowerCase() as 'male' | 'female' | 'other') : undefined,
        weight: weightNum,
        height: heightNum,
        bloodType: bloodType || undefined,
        allergies: allergiesArray,
        conditions: conditionsArray,
        linkedDoctorId: doctorCode ? doctorCode : undefined,
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
          Hi, {user?.name}!
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Let's set up your health profile to get started
        </Text>
        
        <View style={styles.form}>
          <Input
            label="Age"
            placeholder="Enter your age"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            error={errors.age}
            containerStyle={styles.input}
          />
          
          <Input
            label="Gender"
            placeholder="Male, Female, or Other"
            value={gender}
            onChangeText={setGender}
            error={errors.gender}
            containerStyle={styles.input}
          />
          
          <View style={styles.row}>
            <Input
              label="Weight (kg)"
              placeholder="Weight"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              error={errors.weight}
              containerStyle={[styles.input, styles.halfInput]}
            />
            
            <Input
              label="Height (cm)"
              placeholder="Height"
              value={height}
              onChangeText={setHeight}
              keyboardType="decimal-pad"
              error={errors.height}
              containerStyle={[styles.input, styles.halfInput]}
            />
          </View>
          
          <Input
            label="Blood Type (Optional)"
            placeholder="E.g., A+, B-, O+"
            value={bloodType}
            onChangeText={setBloodType}
            containerStyle={styles.input}
          />
          
          <Input
            label="Allergies (Optional)"
            placeholder="Separate with commas"
            value={allergies}
            onChangeText={setAllergies}
            containerStyle={styles.input}
          />
          
          <Input
            label="Medical Conditions (Optional)"
            placeholder="Separate with commas"
            value={conditions}
            onChangeText={setConditions}
            containerStyle={styles.input}
          />
          
          <Input
            label="Doctor's Invitation Code (Optional)"
            placeholder="Enter code to connect with your doctor"
            value={doctorCode}
            onChangeText={setDoctorCode}
            containerStyle={styles.input}
          />
          
          <Text style={[styles.note, { color: colors.textSecondary }]}>
            You can update this information later in your profile settings.
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
            onPress={() => updatePatientProfile({})}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
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