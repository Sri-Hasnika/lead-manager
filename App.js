import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert, Modal, Text, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LeadList from './components/LeadList';
import AddLeadModal from './components/AddLeadModal';
import FiltersPanel from './components/FiltersPanel';
import { ThemeProvider, useTheme } from './components/ThemeContext';

// Mock data for leads
const initialLeads = [
  {
    id: '1',
    name: 'Rahul Sharma',
    contact: '9876543210',
    status: 'Qualified',
    qualification: 'Bachelors',
    interest: 'Web Development',
    source: 'Website',
    assignedTo: 'John Doe',
    updatedAt: 'May 22, 2024 11:02 PM',
  },
  {
    id: '2',
    name: 'Priya Patel',
    contact: '8765432109',
    status: 'New',
    qualification: 'Masters',
    interest: 'UI/UX Design',
    source: 'Social Media',
    assignedTo: 'Jane Smith',
    updatedAt: 'May 21, 2024 11:34 PM',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    contact: '7654321098',
    status: 'Converted',
    qualification: 'PhD',
    interest: 'Data Science',
    source: 'Email Campaign',
    assignedTo: 'Emily Davis',
    updatedAt: 'May 20, 2024 3:06 PM',
  },
  {
    id: '4',
    name: 'Neha Gupta',
    contact: '6543210987',
    status: 'Follow-Up',
    qualification: 'Bachelors',
    interest: 'Mobile Development',
    source: 'Cold Call',
    assignedTo: 'Robert Johnson',
    updatedAt: 'May 19, 2024 3:03 PM',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    contact: '5432109876',
    status: 'Qualified',
    qualification: 'Masters',
    interest: 'Digital Marketing',
    source: 'Website',
    assignedTo: 'John Doe',
    updatedAt: 'May 19, 2024 1:12 AM',
  },
  {
    id: '6',
    name: 'Ananya Reddy',
    contact: '4321098765',
    status: 'New',
    qualification: 'Bachelors',
    interest: 'Web Development',
    source: 'Social Media',
    assignedTo: 'Jane Smith',
    updatedAt: 'May 18, 2024 8:54 PM',
  },
  {
    id: '7',
    name: 'Rajesh Verma',
    contact: '3210987654',
    status: 'Converted',
    qualification: 'High School',
    interest: 'Mobile Development',
    source: 'Email Campaign',
    assignedTo: 'Emily Davis',
    updatedAt: 'May 18, 2024 5:19 PM',
  },
  {
    id: '8',
    name: 'Sneha Joshi',
    contact: '2109876543',
    status: 'Follow-Up',
    qualification: 'Masters',
    interest: 'UI/UX Design',
    source: 'Website',
    assignedTo: 'Robert Johnson',
    updatedAt: 'May 17, 2024 7:23 PM',
  },
  {
    id: '9',
    name: 'Arjun Mehta',
    contact: '1098765432',
    status: 'Qualified',
    qualification: 'PhD',
    interest: 'Data Science',
    source: 'Cold Call',
    assignedTo: 'John Doe',
    updatedAt: 'May 17, 2024 1:09 AM',
  },
  {
    id: '10',
    name: 'Pooja Shah',
    contact: '0987654321',
    status: 'New',
    qualification: 'Bachelors',
    interest: 'Digital Marketing',
    source: 'Social Media',
    assignedTo: 'Jane Smith',
    updatedAt: 'May 16, 2024 4:45 PM',
  },
];

function filterLeads(leads, filters, logic) {
  if (!filters.length) return leads;
  return leads.filter(lead => {
    const checks = filters.map(f => {
      if (!f.value) return true;
      return (lead[f.field] || '').toLowerCase() === f.value.toLowerCase();
    });
    return logic === 'AND' ? checks.every(Boolean) : checks.some(Boolean);
  });
}

function AppContent() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [leads, setLeads] = useState(initialLeads);
  const [filters, setFilters] = useState([]);
  const [filterLogic, setFilterLogic] = useState('AND');
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState(initialLeads);
  const [viewMode, setViewMode] = useState('card');
  const [selectedLead, setSelectedLead] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const handleAddLead = (form) => {
    setLeads(prev => [
      { ...form, id: (Math.random() * 100000).toFixed(0), contact: form.phone, updatedAt: new Date().toLocaleString() },
      ...prev,
    ]);
    setModalVisible(false);
    Alert.alert('Success', 'Lead added successfully!');
  };

  const handleApplyFilters = () => {
    setFilteredLeads(filterLeads(leads, filters, filterLogic));
  };

  const handleClearFilters = () => {
    setFilters([]);
    setFilteredLeads(leads);
  };

  React.useEffect(() => {
    setFilteredLeads(filterLeads(leads, filters, filterLogic));
  }, [leads, filters, filterLogic]);

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setDetailsVisible(true);
  };

  const closeDetails = () => {
    setDetailsVisible(false);
    setSelectedLead(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Lead Management</Text>
        <TouchableOpacity 
          onPress={toggleTheme} 
          style={[styles.themeToggle, { backgroundColor: theme.buttonSecondary }]}
        >
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={24} 
            color={theme.text} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.mainContent}>
        {isWeb ? (
          <>
            <View style={[styles.sidebar, { backgroundColor: theme.sidebarBg, borderRightColor: theme.border }]}>
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                filterLogic={filterLogic}
                setFilterLogic={setFilterLogic}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
            </View>
            <View style={styles.content}>
              <LeadList
                leads={filteredLeads}
                onAddPress={() => setModalVisible(true)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onViewDetails={handleViewDetails}
              />
            </View>
          </>
        ) : (
          <View style={styles.mobileContent}>
            <View style={[styles.mobileFilters, { borderBottomColor: theme.border }]}>
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                filterLogic={filterLogic}
                setFilterLogic={setFilterLogic}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
            </View>
            <View style={styles.mobileList}>
              <LeadList
                leads={filteredLeads}
                onAddPress={() => setModalVisible(true)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onViewDetails={handleViewDetails}
              />
            </View>
          </View>
        )}
      </View>

      <AddLeadModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleAddLead} />
      
      <Modal visible={detailsVisible} animationType="slide" onRequestClose={closeDetails} transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Lead Details</Text>
              <TouchableOpacity onPress={closeDetails} style={styles.closeButton}>
                <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedLead && Object.entries(selectedLead).map(([key, value]) => (
                <View key={key} style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.primary }]}>{key}</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{value}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeToggle: {
    padding: 8,
    borderRadius: 8,
  },
  mainContent: {
    flex: 1,
    flexDirection: isWeb ? 'row' : 'column',
  },
  sidebar: {
    width: isWeb ? 300 : '100%',
    borderRightWidth: isWeb ? 1 : 0,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 73,
        height: 'calc(100vh - 73px)',
      },
    }),
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mobileContent: {
    flex: 1,
  },
  mobileFilters: {
    height: 300,
    borderBottomWidth: 1,
  },
  mobileList: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    width: isWeb ? Math.min(width * 0.8, 600) : '92%',
    maxHeight: '90%',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 24,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  detailValue: {
    fontSize: 16,
  },
});
