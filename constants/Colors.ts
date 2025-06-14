const tintColorLight = '#5271FF';
const tintColorDark = '#75A1FF';

// Base color palettes
const blues = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#5271FF', // Primary blue
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
};

const purples = {
  50: '#FAF5FF',
  100: '#F3E8FF',
  200: '#E9D5FF',
  300: '#D8B4FE',
  400: '#C084FC',
  500: '#A855F7',
  600: '#9333EA',
  700: '#7E22CE',
  800: '#6B21A8',
  900: '#581C87',
};

const greens = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  300: '#86EFAC',
  400: '#4ADE80',
  500: '#22C55E',
  600: '#16A34A',
  700: '#15803D',
  800: '#166534',
  900: '#14532D',
};

const reds = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444',
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
};

const yellows = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B',
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
};

const grays = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

export default {
  light: {
    text: grays[900],
    textSecondary: grays[600],
    background: '#FFFFFF',
    backgroundSecondary: grays[50],
    tint: tintColorLight,
    tabIconDefault: grays[500],
    tabIconSelected: tintColorLight,
    
    // Primary semantic colors
    primary: blues[500],
    primaryLight: blues[300],
    primaryDark: blues[700],
    
    // Secondary semantic colors
    secondary: purples[500],
    secondaryLight: purples[300],
    secondaryDark: purples[700],
    
    // Accent
    accent: '#FFB240',
    
    // Success states
    success: greens[500],
    successLight: greens[300],
    successDark: greens[700],
    
    // Warning states
    warning: yellows[500],
    warningLight: yellows[300],
    warningDark: yellows[700],
    
    // Error states
    error: reds[500],
    errorLight: reds[300],
    errorDark: reds[700],
    
    // Other UI elements
    card: '#FFFFFF',
    border: grays[200],
    notification: reds[500],
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    text: grays[100],
    textSecondary: grays[300],
    background: grays[900],
    backgroundSecondary: grays[800],
    tint: tintColorDark,
    tabIconDefault: grays[400],
    tabIconSelected: tintColorDark,
    
    // Primary semantic colors
    primary: blues[400],
    primaryLight: blues[300],
    primaryDark: blues[600],
    
    // Secondary semantic colors
    secondary: purples[400],
    secondaryLight: purples[300],
    secondaryDark: purples[600],
    
    // Accent
    accent: '#FFB240',
    
    // Success states
    success: greens[400],
    successLight: greens[300],
    successDark: greens[600],
    
    // Warning states
    warning: yellows[400],
    warningLight: yellows[300],
    warningDark: yellows[600],
    
    // Error states
    error: reds[400],
    errorLight: reds[300],
    errorDark: reds[600],
    
    // Other UI elements
    card: grays[800],
    border: grays[700],
    notification: reds[400],
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  // Common colors (same in both themes)
  common: {
    transparent: 'transparent',
    white: '#FFFFFF',
    black: '#000000',
  }
};