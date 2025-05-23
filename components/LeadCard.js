import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Linking } from 'react-native';
import { useTheme } from './ThemeContext';

const statusColors = {
  'Qualified': { bg: '#dcfce7', text: '#166534' },
  'New': { bg: '#dbeafe', text: '#1e40af' },
  'Converted': { bg: '#f3e8ff', text: '#6b21a8' },
  'Follow-Up': { bg: '#fef9c3', text: '#854d0e' },
};

const handleCall = async (number) => {
  try {
    await Clipboard.setStringAsync(number);
    Linking.openURL(`tel:${number}`);
    Alert.alert('Success', 'Number copied and dialer opened!');
  } catch (e) {
    Alert.alert('Error', 'Could not open dialer.');
  }
};

const LeadCard = ({ lead, onViewDetails }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.name, { color: theme.text }]}>{lead.name}</Text>
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
        <TouchableOpacity 
          onPress={() => handleCall(lead.contact)} 
          style={[styles.callButton, { backgroundColor: theme.buttonSecondary }]}
        >
          <Ionicons name="call" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Contact</Text>
          <Text style={[styles.value, { color: theme.text }]}>{lead.contact}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Qualification</Text>
          <Text style={[styles.value, { color: theme.text }]}>{lead.qualification}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Interest</Text>
          <Text style={[styles.value, { color: theme.text }]}>{lead.interest}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Source</Text>
          <Text style={[styles.value, { color: theme.text }]}>{lead.source}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Assigned To</Text>
          <Text style={[styles.value, { color: theme.text }]}>{lead.assignedTo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Updated</Text>
          <Text style={[styles.value, { color: theme.text }]}>{lead.updatedAt}</Text>
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => onViewDetails && onViewDetails(lead)} 
        style={[styles.detailsButton, { backgroundColor: theme.buttonSecondary }]}
      >
        <Ionicons name="open-outline" size={18} color={theme.primary} style={styles.detailsButtonIcon} />
        <Text style={[styles.detailsButtonText, { color: theme.primary }]}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  callButton: {
    padding: 8,
    borderRadius: 8,
  },
  content: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 100,
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    flex: 1,
    fontSize: 14,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  detailsButtonIcon: {
    marginRight: 6,
  },
  detailsButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default LeadCard; 