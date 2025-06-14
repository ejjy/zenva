import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onMenuPress?: () => void;
  rightComponent?: React.ReactNode;
  titleAlign?: 'left' | 'center';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showMenuButton = false,
  onMenuPress,
  rightComponent,
  titleAlign = 'center',
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  
  // Handle back button press
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/(tabs)');
    }
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
              <ChevronLeft color={colors.text} size={24} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text 
          style={[
            styles.title, 
            { color: colors.text },
            titleAlign === 'left' && styles.titleLeft,
            titleAlign === 'center' && styles.titleCenter,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        
        <View style={styles.rightContainer}>
          {rightComponent}
          
          {showMenuButton && (
            <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
              <MoreVertical color={colors.text} size={24} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    minWidth: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  titleLeft: {
    textAlign: 'left',
    marginLeft: 16,
  },
  titleCenter: {
    textAlign: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
  },
});