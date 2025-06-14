import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle, 
  TouchableOpacityProps 
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
  disabled = false,
  ...rest
}) => {
  const { colors } = useTheme();
  
  // Button container styles based on variant
  const getContainerStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      ...styles.button,
      ...sizeStyles[size],
      ...(fullWidth && styles.fullWidth),
    };
    
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
      },
      secondary: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: colors.primary,
        borderWidth: 2,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      link: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        paddingHorizontal: 4,
      },
    };
    
    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...(disabled && {
        opacity: 0.6,
      }),
    };
  };
  
  // Text styles based on variant
  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      ...styles.text,
      ...textSizeStyles[size],
    };
    
    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: {
        color: '#FFFFFF',
      },
      secondary: {
        color: '#FFFFFF',
      },
      outline: {
        color: colors.primary,
      },
      ghost: {
        color: colors.primary,
      },
      link: {
        color: colors.primary,
        textDecorationLine: 'underline',
      },
    };
    
    return {
      ...baseStyles,
      ...variantTextStyles[variant],
    };
  };
  
  // Size styles for button
  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    md: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    lg: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 10,
    },
  };
  
  // Text size styles
  const textSizeStyles: Record<ButtonSize, TextStyle> = {
    sm: {
      fontSize: 14,
    },
    md: {
      fontSize: 16,
    },
    lg: {
      fontSize: 18,
    },
  };
  
  // Combine all styles
  const buttonStyle = { ...getContainerStyles(), ...style };
  const buttonTextStyle = { ...getTextStyles(), ...textStyle };
  
  // Loading indicator color
  const loaderColor = variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : colors.primary;
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={buttonStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={buttonTextStyle}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 8,
  },
  text: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
});