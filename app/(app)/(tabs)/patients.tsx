import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, Filter, Heart, Plus, Users } from 'lucide-react-native';

// Mock patients data
const mockPatients = [
  {
    id: '1',
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    conditions: ['Hypertension', 'Asthma'],
    lastVisit: '2 days ago',
    upcomingAppointment: true,
  },
  {
    id: '2',
    name: 'Emily Johnson',
    age: 28,
    gender: 'Female',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    conditions: ['Diabetes Type 2'],
    lastVisit: '1 week ago',
    upcomingAppointment: false,
  },
  {
    id: '3',
    name: 'Michael Brown',
    age: 52,
    gender: 'Male',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    conditions: ['Heart Disease', 'High Cholesterol'],
    lastVisit: '3 days ago',
    upcomingAppointment: true,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    age: 41,
    gender: 'Female',
    image: 'https://randomuser.me/api/portraits/women/67.jpg',
    conditions: ['Arthritis'],
    lastVisit: '2 weeks ago',
    upcomingAppointment: false,
  },
  {
    id: '5',
    name: 'David Miller',
    age: 63,
    gender: 'Male',
    image: 'https://randomuser.me/api/portraits/men/91.jpg',
    conditions: ['COPD', 'Hypertension'],
    lastVisit: '1 month ago',
    upcomingAppointment: true,
  },
];

export default function PatientsScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'upcoming'>('all');
  
  // Filter patients based on search query and active filter
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'recent') return matchesSearch && patient.lastVisit.includes('day');
    if (activeFilter === 'upcoming') return matchesSearch && patient.upcomingAppointment;
    
    return matchesSearch;
  });
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="My Patients" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Search and Stats */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search patients..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity style={[styles.filterIconButton, { borderColor: colors.border }]}>
            <Filter size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Patient Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={[styles.statsCard, { backgroundColor: colors.primaryLight }]}>
            <View style={styles.statsCardContent}>
              <View style={styles.statsIconContainer}>
                <Users size={24} color={colors.primary} />
              </View>
              <Text style={[styles.statsNumber, { color: colors.primaryDark }]}>12</Text>
              <Text style={[styles.statsLabel, { color: colors.primaryDark }]}>Total Patients</Text>
            </View>
          </Card>
          
          <Card style={[styles.statsCard, { backgroundColor: colors.errorLight }]}>
            <View style={styles.statsCardContent}>
              <View style={styles.statsIconContainer}>
                <Heart size={24} color={colors.error} />
              </View>
              <Text style={[styles.statsNumber, { color: colors.errorDark }]}>5</Text>
              <Text style={[styles.statsLabel, { color: colors.errorDark }]}>Critical Cases</Text>
            </View>
          </Card>
        </View>
        
        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'all' && [styles.activeFilterTab, { borderBottomColor: colors.primary }],
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                { color: colors.textSecondary },
                activeFilter === 'all' && { color: colors.primary },
              ]}
            >
              All Patients
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'recent' && [styles.activeFilterTab, { borderBottomColor: colors.primary }],
            ]}
            onPress={() => setActiveFilter('recent')}
          >
            <Text
              style={[
                styles.filterTabText,
                { color: colors.textSecondary },
                activeFilter === 'recent' && { color: colors.primary },
              ]}
            >
              Recent Visits
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'upcoming' && [styles.activeFilterTab, { borderBottomColor: colors.primary }],
            ]}
            onPress={() => setActiveFilter('upcoming')}
          >
            <Text
              style={[
                styles.filterTabText,
                { color: colors.textSecondary },
                activeFilter === 'upcoming' && { color: colors.primary },
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Patient List */}
        <View style={styles.patientListContainer}>
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <Card key={patient.id} style={styles.patientCard} onPress={() => {}}>
                <View style={styles.patientCardContent}>
                  <Image source={{ uri: patient.image }} style={styles.patientImage} />
                  
                  <View style={styles.patientInfo}>
                    <Text style={[styles.patientName, { color: colors.text }]}>
                      {patient.name}
                    </Text>
                    
                    <Text style={[styles.patientDetails, { color: colors.textSecondary }]}>
                      {patient.age} yrs • {patient.gender}
                    </Text>
                    
                    <View style={styles.conditionTags}>
                      {patient.conditions.map((condition, index) => (
                        <Badge
                          key={index}
                          label={condition}
                          variant="primary"
                          size="sm"
                          style={styles.conditionBadge}
                        />
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.patientActions}>
                    <Text style={[styles.lastVisitText, { color: colors.textSecondary }]}>
                      {patient.lastVisit}
                    </Text>
                    
                    {patient.upcomingAppointment && (
                      <Badge
                        label="Upcoming"
                        variant="success"
                        size="sm"
                        style={styles.upcomingBadge}
                      />
                    )}
                    
                    <TouchableOpacity style={[styles.viewButton, { backgroundColor: colors.primaryLight }]}>
                      <Text style={[styles.viewButtonText, { color: colors.primary }]}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No patients found. Try a different search term or filter.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Add Patient FAB */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => {}}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    width: '48%',
    borderRadius: 12,
  },
  statsCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeFilterTab: {
    borderBottomWidth: 2,
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  patientListContainer: {
    marginBottom: 80, // Space for FAB
  },
  patientCard: {
    marginBottom: 12,
  },
  patientCardContent: {
    flexDirection: 'row',
    padding: 0,
  },
  patientImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  patientDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
  },
  conditionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  conditionBadge: {
    marginRight: 4,
    marginBottom: 4,
  },
  patientActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  lastVisitText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  upcomingBadge: {
    marginBottom: 8,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});