import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Mail, User, Lock, ChevronLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { signUp, isLoading } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  
  // Handle role selection
  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setErrors(prev => ({ ...prev, role: '' }));
  };
  
  // Handle registration submission
  const handleRegister = async () => {
    // Reset errors
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    });
    
    // Validate inputs
    let hasError = false;
    
    if (!name) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
      hasError = true;
    }
    
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      hasError = true;
    }
    
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      hasError = true;
    } else if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      hasError = true;
    }
    
    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      hasError = true;
    }
    
    if (!role) {
      setErrors(prev => ({ ...prev, role: 'Please select a role' }));
      hasError = true;
    }
    
    if (hasError) return;
    
    try {
      await signUp(email, password, name, role as UserRole);
    } catch (error) {
      setErrors(prev => ({ ...prev, email: 'Registration failed. Please try again.' }));
    }
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <ChevronLeft color={colors.text} size={24} />
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Join Zenelva to manage your health journey
      </Text>
      
      <View style={styles.roleContainer}>
        <Text style={[styles.roleTitle, { color: colors.text }]}>I am a</Text>
        
        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'patient' && [styles.activeRoleButton, { borderColor: colors.primary }],
            ]}
            onPress={() => handleRoleSelect('patient')}
          >
            <Text
              style={[
                styles.roleButtonText,
                { color: colors.text },
                role === 'patient' && { color: colors.primary },
              ]}
            >
              Patient
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'doctor' && [styles.activeRoleButton, { borderColor: colors.primary }],
            ]}
            onPress={() => handleRoleSelect('doctor')}
          >
            <Text
              style={[
                styles.roleButtonText,
                { color: colors.text },
                role === 'doctor' && { color: colors.primary },
              ]}
            >
              Doctor
            </Text>
          </TouchableOpacity>
        </View>
        
        {errors.role ? (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.role}
          </Text>
        ) : null}
      </View>
      
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        leftIcon={<User size={20} color={colors.textSecondary} />}
        error={errors.name}
        containerStyle={styles.inputContainer}
      />
      
      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Mail size={20} color={colors.textSecondary} />}
        error={errors.email}
        containerStyle={styles.inputContainer}
      />
      
      <Input
        label="Password"
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        leftIcon={<Lock size={20} color={colors.textSecondary} />}
        isPassword
        error={errors.password}
        containerStyle={styles.inputContainer}
      />
      
      <Input
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        leftIcon={<Lock size={20} color={colors.textSecondary} />}
        isPassword
        error={errors.confirmPassword}
        containerStyle={styles.inputContainer}
      />
      
      <Button 
        title="Create Account" 
        onPress={handleRegister}
        loading={isLoading}
        style={styles.registerButton}
        fullWidth
      />
      
      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, { color: colors.textSecondary }]}>
          Already have an account?
        </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={[styles.loginLink, { color: colors.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.termsContainer}>
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeRoleButton: {
    borderWidth: 2,
  },
  roleButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  termsContainer: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});