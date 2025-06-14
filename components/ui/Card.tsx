import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  onPress?: () => void;
  elevation?: number; // 0-5, controls shadow intensity
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  onPress,
  elevation = 2,
  border = false,
}) => {
  const { colors, isDark } = useTheme();
  
  // Calculate shadow based on elevation
  const getShadowStyle = (): ViewStyle => {
    // No shadow in dark mode - use border instead
    if (isDark) {
      return border ? { borderWidth: 1, borderColor: colors.border } : {};
    }
    
    // Light mode shadow
    const shadowOpacity = Math.min(0.1 + (elevation * 0.05), 0.3); // 0.1 to 0.3
    const shadowRadius = 2 + (elevation * 2); // 2 to 12
    const shadowOffset = {
      width: 0,
      height: elevation, // 0 to 5
    };
    
    return {
      shadowColor: '#000',
      shadowOffset,
      shadowOpacity,
      shadowRadius,
      elevation: elevation + 1,
      ...(border && { borderWidth: 1, borderColor: colors.border }),
    };
  };
  
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[
        styles.card,
        getShadowStyle(),
        { backgroundColor: colors.card },
        style,
      ]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text
              style={[
                styles.title,
                { color: colors.text },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: colors.textSecondary },
                subtitleStyle,
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    marginHorizontal: 0,
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  content: {
    padding: 16,
  },
});