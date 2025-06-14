import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  icon,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  
  // Get variant styles
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    const variants: Record<BadgeVariant, { bg: string; text: string }> = {
      default: { bg: colors.backgroundSecondary, text: colors.textSecondary },
      primary: { bg: colors.primaryLight, text: colors.primaryDark },
      secondary: { bg: colors.secondaryLight, text: colors.secondaryDark },
      success: { bg: colors.successLight, text: colors.successDark },
      warning: { bg: colors.warningLight, text: colors.warningDark },
      error: { bg: colors.errorLight, text: colors.errorDark },
    };
    
    const { bg, text } = variants[variant];
    
    return {
      container: { backgroundColor: bg },
      text: { color: text },
    };
  };
  
  // Get size styles
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    const sizes: Record<BadgeSize, { container: ViewStyle; text: TextStyle }> = {
      sm: { 
        container: { 
          paddingVertical: 2, 
          paddingHorizontal: 6, 
          borderRadius: 4 
        }, 
        text: { 
          fontSize: 10 
        } 
      },
      md: { 
        container: { 
          paddingVertical: 4, 
          paddingHorizontal: 8, 
          borderRadius: 6 
        }, 
        text: { 
          fontSize: 12 
        } 
      },
      lg: { 
        container: { 
          paddingVertical: 6, 
          paddingHorizontal: 10, 
          borderRadius: 8 
        }, 
        text: { 
          fontSize: 14 
        } 
      },
    };
    
    return sizes[size];
  };
  
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  
  return (
    <View
      style={[
        styles.container,
        variantStyles.container,
        sizeStyles.container,
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          variantStyles.text,
          sizeStyles.text,
          icon && styles.textWithIcon,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  icon: {
    marginRight: 4,
  },
  textWithIcon: {
    marginLeft: 2,
  },
});