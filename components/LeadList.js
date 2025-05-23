import React from 'react';
import { View, FlatList, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LeadCard from './LeadCard';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const COLUMN_WIDTH = isWeb ? 150 : 120;
const ACTION_COLUMN_WIDTH = 100;
const CALL_COLUMN_WIDTH = 60;

const tableHeaders = [
  { key: 'name', label: 'Name' },
  { key: 'contact', label: 'Contact' },
  { key: 'call', label: '' },
  { key: 'status', label: 'Status' },
  { key: 'qualification', label: 'Qualification' },
  { key: 'interest', label: 'Interest' },
  { key: 'source', label: 'Source' },
  { key: 'assignedTo', label: 'Assigned To' },
  { key: 'updatedAt', label: 'Updated At' },
  { key: 'actions', label: 'Actions' },
];

const statusColors = {
  'Qualified': { bg: '#dcfce7', text: '#166534' },
  'New': { bg: '#dbeafe', text: '#1e40af' },
  'Converted': { bg: '#f3e8ff', text: '#6b21a8' },
  'Follow-Up': { bg: '#fef9c3', text: '#854d0e' },
};

const LeadList = ({ leads, onAddPress, viewMode, onViewModeChange, onViewDetails }) => {
  const { theme } = useTheme();

  const handleCall = async (number) => {
    try {
      await Clipboard.setStringAsync(number);
      Linking.openURL(`tel:${number}`);
      Alert.alert('Success', 'Number copied and dialer opened!');
    } catch (e) {
      Alert.alert('Error', 'Could not open dialer.');
    }
  };

  const renderTableHeader = () => (
    <View style={[styles.tableHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      {tableHeaders.map(h => (
        <Text 
          key={h.key} 
          style={[
            styles.tableHeaderCell, 
            { color: theme.textSecondary },
            h.key === 'actions' && { width: ACTION_COLUMN_WIDTH },
            h.key === 'call' && { width: CALL_COLUMN_WIDTH }
          ]}
        >
          {h.label}
        </Text>
      ))}
    </View>
  );

  const renderTableRow = (lead) => (
    <View key={lead.id} style={[styles.tableRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <Text style={[styles.tableCell, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{lead.name}</Text>
      <Text style={[styles.tableCell, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{lead.contact}</Text>
      <View style={[styles.tableCell, { width: CALL_COLUMN_WIDTH }]}> 
        <TouchableOpacity 
          onPress={() => handleCall(lead.contact)} 
          style={[styles.callButton, { backgroundColor: theme.buttonSecondary }]}
        >
          <Ionicons name="call" size={18} color={theme.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.tableCell}>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: statusColors[lead.status]?.bg || theme.buttonSecondary }
        ]}>
          <Text style={[
            styles.statusText,
            { color: statusColors[lead.status]?.text || theme.text }
          ]}>
            {lead.status}
          </Text>
        </View>
      </View>
      <Text style={[styles.tableCell, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{lead.qualification}</Text>
      <Text style={[styles.tableCell, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{lead.interest}</Text>
      <Text style={[styles.tableCell, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{lead.source}</Text>
      <Text style={[styles.tableCell, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{lead.assignedTo}</Text>
      <Text style={[styles.tableCell, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{lead.updatedAt}</Text>
      <View style={[styles.tableCell, { width: ACTION_COLUMN_WIDTH }]}> 
        <TouchableOpacity 
          onPress={() => onViewDetails && onViewDetails(lead)} 
          style={[styles.viewButton, { backgroundColor: theme.buttonSecondary }]}
        >
          <Ionicons name="open-outline" size={16} color={theme.primary} style={styles.viewButtonIcon} />
          <Text style={[styles.viewButtonText, { color: theme.primary }]}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={[styles.viewToggle, { backgroundColor: theme.buttonSecondary }]}>
          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              viewMode === 'card' && [styles.viewToggleActive, { backgroundColor: theme.surface }]
            ]}
            onPress={() => onViewModeChange('card')}
          >
            <Ionicons 
              name="grid" 
              size={22} 
              color={viewMode === 'card' ? theme.primary : theme.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              viewMode === 'table' && [styles.viewToggleActive, { backgroundColor: theme.surface }]
            ]}
            onPress={() => onViewModeChange('table')}
          >
            <Ionicons 
              name="list" 
              size={22} 
              color={viewMode === 'table' ? theme.primary : theme.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'card' ? (
        <FlatList
          data={leads}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <LeadCard lead={item} onViewDetails={onViewDetails} />}
          contentContainerStyle={styles.cardList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>No leads found</Text>
            </View>
          }
        />
      ) : (
        <ScrollView 
          horizontal 
          style={styles.tableContainer}
          contentContainerStyle={styles.tableContent}
        >
          <View>
            {renderTableHeader()}
            <ScrollView style={styles.tableBody}>
              {leads.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={48} color={theme.textSecondary} />
                  <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>No leads found</Text>
                </View>
              ) : (
                leads.map(renderTableRow)
              )}
            </ScrollView>
          </View>
        </ScrollView>
      )}

      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: theme.buttonPrimary }]} 
        onPress={onAddPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={22} color={theme.buttonText} style={styles.addButtonIcon} />
        <Text style={[styles.addButtonText, { color: theme.buttonText }]}>Add Lead</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  viewToggleBtn: {
    padding: 8,
    borderRadius: 6,
  },
  viewToggleActive: {
    ...Platform.select({
      web: {
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  cardList: {
    padding: 16,
    gap: 16,
  },
  tableContainer: {
    flex: 1,
  },
  tableContent: {
    minWidth: tableHeaders.length * COLUMN_WIDTH + ACTION_COLUMN_WIDTH + CALL_COLUMN_WIDTH,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tableHeaderCell: {
    width: COLUMN_WIDTH,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'left',
  },
  tableBody: {
    maxHeight: isWeb ? 'calc(100vh - 200px)' : 350,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tableCell: {
    width: COLUMN_WIDTH,
    fontSize: 14,
    textAlign: 'left',
  },
  callButton: {
    padding: 8,
    borderRadius: 6,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  viewButtonIcon: {
    marginRight: 4,
  },
  viewButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      default: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  addButtonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default LeadList; 
