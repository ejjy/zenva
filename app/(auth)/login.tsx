import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  
  const handleLogin = async () => {
    setErrors({ email: '', password: '' });
    
    let hasError = false;
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
    }
    
    if (hasError) return;
    
    try {
      await signIn(email, password);
    } catch (error) {
      setErrors({ 
        email: 'Invalid email or password', 
        password: 'Invalid email or password'
      });
    }
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
          style={styles.logo}
        />
        <Text style={[styles.appName, { color: colors.primary }]}>Zenva</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Your health companion</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to your account to continue</Text>
        
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
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          leftIcon={<Lock size={20} color={colors.textSecondary} />}
          isPassword
          error={errors.password}
          containerStyle={styles.inputContainer}
        />
        
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <Button 
          title="Sign In" 
          onPress={handleLogin}
          loading={isLoading}
          style={styles.loginButton}
          fullWidth
        />
        
        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={[styles.registerLink, { color: colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      
      <TouchableOpacity style={styles.helpButton}>
        <Text style={[styles.helpText, { color: colors.textSecondary }]}>Need help?</Text>
      </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  loginButton: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  registerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  registerLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  helpButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});