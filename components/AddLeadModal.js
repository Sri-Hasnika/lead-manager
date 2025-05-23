import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const qualificationOptions = ['High School', 'Bachelors', 'Masters', 'PhD', 'Other'];
const interestOptions = ['Web Development', 'Mobile Development', 'UI/UX Design', 'Data Science', 'Digital Marketing'];
const sourceOptions = ['Website', 'Email Campaign', 'Social Media', 'Cold Call'];
const statusOptions = ['New', 'Qualified', 'Converted', 'Follow-Up'];
const assignedToOptions = ['John Doe', 'Jane Smith', 'Emily Davis', 'Robert Johnson'];

const AddLeadModal = ({ visible, onClose, onSubmit }) => {
  const { theme } = useTheme();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    altPhone: '',
    email: '',
    altEmail: '',
    status: '',
    qualification: '',
    interest: '',
    source: '',
    assignedTo: '',
    jobInterest: '',
    state: '',
    city: '',
    passoutYear: '',
    heardFrom: '',
  });
  const [touched, setTouched] = useState({});

  const handleChange = (key, value) => setForm({ ...form, [key]: value });
  const handleBlur = (key) => setTouched({ ...touched, [key]: true });

  const handleAdd = () => {
    if (!form.name || !form.phone) {
      Alert.alert('Validation', 'Name and Phone are required.');
      return;
    }
    onSubmit({
      ...form,
      status: form.status || 'New',
      qualification: form.qualification || 'High School',
      interest: form.interest || 'Web Development',
      source: form.source || 'Website',
      assignedTo: form.assignedTo || 'John Doe',
    });
    setForm({
      name: '', phone: '', altPhone: '', email: '', altEmail: '', status: '', qualification: '', interest: '', source: '', assignedTo: '', jobInterest: '', state: '', city: '', passoutYear: '', heardFrom: '',
    });
    setTouched({});
  };

  const renderPicker = (label, key, options) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View style={[styles.pickerContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
        <Picker
          selectedValue={form[key]}
          onValueChange={v => handleChange(key, v)}
          style={styles.picker}
          dropdownIconColor={theme.primary}
        >
          <Picker.Item 
            label={`Select ${label}`} 
            value="" 
            color={theme.textSecondary}
          />
          {options.map(opt => (
            <Picker.Item 
              key={opt} 
              label={opt} 
              value={opt}
              color={theme.text}
            />
          ))}
        </Picker>
        <Ionicons 
          name="chevron-down" 
          size={18} 
          color={theme.primary} 
          style={styles.pickerIcon} 
        />
      </View>
    </View>
  );

  const renderInput = (label, key, props = {}) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <TextInput
        placeholder={label}
        value={form[key]}
        onChangeText={t => handleChange(key, t)}
        style={[
          styles.input,
          { 
            backgroundColor: theme.inputBg,
            borderColor: theme.border,
            color: theme.text,
          }
        ]}
        onBlur={() => handleBlur(key)}
        placeholderTextColor={theme.textSecondary}
        {...props}
      />
    </View>
  );

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>Add New Lead</Text>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formGrid}>
              {renderInput('Name', 'name')}
              {renderInput('Phone', 'phone', { keyboardType: 'phone-pad' })}
              {renderInput('Alt. Phone', 'altPhone', { keyboardType: 'phone-pad' })}
              {renderInput('Email', 'email', { keyboardType: 'email-address' })}
              {renderInput('Alt. Email', 'altEmail', { keyboardType: 'email-address' })}
              {renderPicker('Status', 'status', statusOptions)}
              {renderPicker('Qualification', 'qualification', qualificationOptions)}
              {renderPicker('Interest Field', 'interest', interestOptions)}
              {renderPicker('Source', 'source', sourceOptions)}
              {renderPicker('Assigned To', 'assignedTo', assignedToOptions)}
              {renderInput('Job Interest', 'jobInterest')}
              {renderInput('State', 'state')}
              {renderInput('City', 'city')}
              {renderInput('Passout Year', 'passoutYear', { keyboardType: 'numeric' })}
              {renderInput('Heard From', 'heardFrom')}
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <TouchableOpacity 
              onPress={onClose} 
              style={[styles.cancelButton, { backgroundColor: theme.buttonSecondary }]}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleAdd} 
              style={[styles.addButton, { backgroundColor: theme.buttonPrimary }]}
            >
              <Text style={[styles.addButtonText, { color: theme.buttonText }]}>Add Lead</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    width: isWeb ? Math.min(width * 0.9, 600) : '96%',
    maxHeight: '96%',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  scrollView: {
    padding: 20,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  inputGroup: {
    width: isWeb ? 'calc(50% - 8px)' : '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    position: 'relative',
  },
  picker: {
    height: 40,
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    pointerEvents: 'none',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  cancelButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default AddLeadModal; 