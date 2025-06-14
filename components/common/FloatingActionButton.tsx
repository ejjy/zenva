import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface FABProps {
  icon: React.ReactNode;
  label?: string;
  onPress: () => void;
  style?: ViewStyle;
  position?: 'bottomRight' | 'bottomCenter';
  visible?: boolean;
}

export const FloatingActionButton: React.FC<FABProps> = ({
  icon,
  label,
  onPress,
  style,
  position = 'bottomRight',
  visible = true,
}) => {
  const { colors } = useTheme();
  
  // Animation for visibility - only use on native platforms
  const animatedStyle = useAnimatedStyle(() => {
    if (Platform.OS === 'web') {
      // Simple visibility for web to avoid transform issues
      return {
        opacity: visible ? 1 : 0,
        display: visible ? 'flex' : 'none',
      };
    }
    
    return {
      transform: [
        { 
          scale: withSpring(visible ? 1 : 0, {
            damping: 15,
            stiffness: 120,
          }) 
        },
        { 
          translateY: withSpring(visible ? 0 : 100, {
            damping: 15,
            stiffness: 120,
          }) 
        }
      ],
      opacity: withSpring(visible ? 1 : 0)
    };
  });
  
  // Position styles
  const positionStyle = position === 'bottomCenter' ? styles.bottomCenter : styles.bottomRight;
  
  return (
    <Animated.View style={[styles.fabContainer, positionStyle, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: colors.primary, shadowColor: colors.primary },
          label ? styles.fabWithLabel : null,
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {icon}
        {label && (
          <Text style={styles.fabLabel}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    zIndex: 999,
  },
  bottomRight: {
    bottom: 24,
    right: 24,
  },
  bottomCenter: {
    bottom: 24,
    alignSelf: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
  },
  fabWithLabel: {
    width: 'auto',
    paddingHorizontal: 20,
  },
  fabLabel: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});