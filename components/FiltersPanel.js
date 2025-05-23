import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const statusOptions = ['New', 'Qualified', 'Converted', 'Follow-Up'];
const qualificationOptions = ['High School', 'Bachelors', 'Masters', 'PhD', 'Other'];
const interestOptions = ['Web Development', 'Mobile Development', 'UI/UX Design', 'Data Science', 'Digital Marketing'];
const sourceOptions = ['Website', 'Email Campaign', 'Social Media', 'Cold Call'];
const assignedToOptions = ['John Doe', 'Jane Smith', 'Emily Davis', 'Robert Johnson'];

export const filterFields = [
  { label: 'Status', value: 'status', options: statusOptions },
  { label: 'Qualification', value: 'qualification', options: qualificationOptions },
  { label: 'Interest', value: 'interest', options: interestOptions },
  { label: 'Source', value: 'source', options: sourceOptions },
  { label: 'Assigned To', value: 'assignedTo', options: assignedToOptions },
];

const FiltersPanel = ({ filters, setFilters, filterLogic, setFilterLogic, onApply, onClear }) => {
  const { theme } = useTheme();
  const addFilter = () => setFilters([...filters, { field: 'status', value: '' }]);
  const updateFilter = (idx, key, value) => {
    const updated = filters.map((f, i) => i === idx ? { ...f, [key]: value } : f);
    setFilters(updated);
  };
  const removeFilter = idx => setFilters(filters.filter((_, i) => i !== idx));

  return (
    <View style={[styles.panel, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Filters</Text>
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Text style={[styles.clearButtonText, { color: theme.textSecondary }]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.logicContainer, { borderBottomColor: theme.border }]}>
        <Text style={[styles.logicLabel, { color: theme.textSecondary }]}>Match</Text>
        <View style={[styles.logicButtons, { backgroundColor: theme.buttonSecondary }]}>
          <TouchableOpacity 
            onPress={() => setFilterLogic('AND')} 
            style={[
              styles.logicButton,
              filterLogic === 'AND' && [styles.logicButtonActive, { backgroundColor: theme.surface }]
            ]}
          >
            <Text style={[
              styles.logicButtonText,
              { color: theme.textSecondary },
              filterLogic === 'AND' && [styles.logicButtonTextActive, { color: theme.primary }]
            ]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilterLogic('OR')} 
            style={[
              styles.logicButton,
              filterLogic === 'OR' && [styles.logicButtonActive, { backgroundColor: theme.surface }]
            ]}
          >
            <Text style={[
              styles.logicButtonText,
              { color: theme.textSecondary },
              filterLogic === 'OR' && [styles.logicButtonTextActive, { color: theme.primary }]
            ]}>
              Any
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
        showsVerticalScrollIndicator={false}
      >
        {filters.map((f, idx) => (
          <View key={idx} style={styles.filterRow}>
            <View style={[styles.filterFieldContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
              <Picker
                selectedValue={f.field}
                onValueChange={v => updateFilter(idx, 'field', v)}
                style={styles.picker}
                dropdownIconColor={theme.primary}
              >
                {filterFields.map(opt => (
                  <Picker.Item 
                    key={opt.value} 
                    label={opt.label} 
                    value={opt.value}
                    color={theme.text}
                  />
                ))}
              </Picker>
            </View>
            <View style={[styles.filterValueContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
              <Picker
                selectedValue={f.value}
                onValueChange={v => updateFilter(idx, 'value', v)}
                style={styles.picker}
                dropdownIconColor={theme.primary}
              >
                <Picker.Item 
                  label={`Select ${filterFields.find(ff => ff.value === f.field)?.label || ''}`} 
                  value=""
                  color={theme.textSecondary}
                />
                {(filterFields.find(ff => ff.value === f.field)?.options || []).map(opt => (
                  <Picker.Item 
                    key={opt} 
                    label={opt} 
                    value={opt}
                    color={theme.text}
                  />
                ))}
              </Picker>
            </View>
            <TouchableOpacity 
              onPress={() => removeFilter(idx)} 
              style={[styles.removeButton, { backgroundColor: theme.error + '20' }]}
            >
              <Ionicons name="close" size={20} color={theme.error} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
        <TouchableOpacity 
          onPress={addFilter} 
          style={[styles.addButton, { backgroundColor: theme.buttonSecondary }]}
        >
          <Ionicons name="add" size={20} color={theme.primary} />
          <Text style={[styles.addButtonText, { color: theme.primary }]}>Add Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onApply} 
          style={[styles.applyButton, { backgroundColor: theme.buttonPrimary }]}
        >
          <Text style={[styles.applyButtonText, { color: theme.buttonText }]}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    flex: 1,
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  logicContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  logicLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  logicButtons: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  logicButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  logicButtonActive: {
    ...Platform.select({
      web: {
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      default: {
        elevation: 1,
      },
    }),
  },
  logicButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  logicButtonTextActive: {
    fontWeight: '600',
  },
  filtersContainer: {
    flex: 1,
  },
  filtersContent: {
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filterFieldContainer: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  filterValueContainer: {
    flex: 2,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  applyButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  applyButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FiltersPanel; 