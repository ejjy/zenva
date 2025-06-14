import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Define user roles
export type UserRole = 'patient' | 'doctor';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

// Define patient profile
export interface PatientProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
  linkedDoctorId?: string;
}

// Define doctor profile
export interface DoctorProfile {
  specialization?: string;
  experience?: number;
  clinicInfo?: string;
  patientCode?: string;
  education?: string;
  licenseNumber?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  patientProfile: PatientProfile | null;
  doctorProfile: DoctorProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updatePatientProfile: (profile: Partial<PatientProfile>) => Promise<void>;
  updateDoctorProfile: (profile: Partial<DoctorProfile>) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  patientProfile: null,
  doctorProfile: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updatePatientProfile: async () => {},
  updateDoctorProfile: async () => {},
});

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Mock user data (in a real app, this would come from Firebase/Supabase)
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'patient@example.com',
    password: 'password',
    role: 'patient' as UserRole,
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Dr. Jane Smith',
    email: 'doctor@example.com',
    password: 'password',
    role: 'doctor' as UserRole,
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
];

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock patient profile
  const MOCK_PATIENT_PROFILE: PatientProfile = {
    age: 35,
    gender: 'male',
    weight: 75,
    height: 180,
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Hypertension', 'Asthma'],
    linkedDoctorId: '2',
  };

  // Mock doctor profile
  const MOCK_DOCTOR_PROFILE: DoctorProfile = {
    specialization: 'Cardiology',
    experience: 10,
    clinicInfo: 'Heart Care Clinic, New York',
    patientCode: 'DOC123',
    education: 'MD, Harvard Medical School',
    licenseNumber: 'NY12345',
  };

  // Check if user is logged in on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('@user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
          
          // Load appropriate profile based on user role
          if (userData.role === 'patient') {
            // In a real app, fetch this from backend
            setPatientProfile(MOCK_PATIENT_PROFILE);
          } else if (userData.role === 'doctor') {
            // In a real app, fetch this from backend
            setDoctorProfile(MOCK_DOCTOR_PROFILE);
          }
          
          // Redirect to the appropriate app screen
          router.replace('/(app)/(tabs)');
        } else {
          // If no user, redirect to auth screens
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to authenticate
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Create user object without the password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save user to state and AsyncStorage
      setUser(userWithoutPassword);
      await AsyncStorage.setItem('@user', JSON.stringify(userWithoutPassword));
      
      // Load appropriate profile
      if (userWithoutPassword.role === 'patient') {
        setPatientProfile(MOCK_PATIENT_PROFILE);
      } else if (userWithoutPassword.role === 'doctor') {
        setDoctorProfile(MOCK_DOCTOR_PROFILE);
      }
      
      // Navigate to the app
      router.replace('/(app)/(tabs)');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to register
      // Create a new user
      const newUser = {
        id: `${Date.now()}`, // Generate a unique ID
        name,
        email,
        role,
      };
      
      // Save user to state and AsyncStorage
      setUser(newUser);
      await AsyncStorage.setItem('@user', JSON.stringify(newUser));
      
      // Initialize appropriate profile
      if (role === 'patient') {
        const initialProfile: PatientProfile = {};
        setPatientProfile(initialProfile);
      } else if (role === 'doctor') {
        const initialProfile: DoctorProfile = {};
        setDoctorProfile(initialProfile);
      }
      
      // Redirect to profile setup
      if (role === 'patient') {
        router.replace('/(auth)/patient-profile-setup');
      } else {
        router.replace('/(auth)/doctor-profile-setup');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Clear state
      setUser(null);
      setPatientProfile(null);
      setDoctorProfile(null);
      
      // Clear storage
      await AsyncStorage.removeItem('@user');
      
      // Navigate to login
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Update patient profile
  const updatePatientProfile = async (profile: Partial<PatientProfile>) => {
    try {
      // In a real app, this would update the backend
      const updatedProfile = { ...patientProfile, ...profile };
      setPatientProfile(updatedProfile);
      
      // If this is the initial setup, navigate to the app
      if (router.canGoBack() && router.getCurrentOptions()?.pathname?.includes('profile-setup')) {
        router.replace('/(app)/(tabs)');
      }
    } catch (error) {
      console.error('Update patient profile error:', error);
      throw error;
    }
  };

  // Update doctor profile
  const updateDoctorProfile = async (profile: Partial<DoctorProfile>) => {
    try {
      // In a real app, this would update the backend
      const updatedProfile = { ...doctorProfile, ...profile };
      setDoctorProfile(updatedProfile);
      
      // If this is the initial setup, navigate to the app
      if (router.canGoBack() && router.getCurrentOptions()?.pathname?.includes('profile-setup')) {
        router.replace('/(app)/(tabs)');
      }
    } catch (error) {
      console.error('Update doctor profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        patientProfile,
        doctorProfile,
        isLoading,
        signIn,
        signUp,
        signOut,
        updatePatientProfile,
        updateDoctorProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};