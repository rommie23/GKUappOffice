import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  pick,
  types,
  isCancel,
} from '@react-native-documents/picker';
import colors from '../../../colors';

const PlacementsForm = () => {
  const [employmentStatus, setEmploymentStatus] = useState(null);

  const [organizationName, setOrganizationName] = useState('');
  const [sector, setSector] = useState('');
  const [workNature, setWorkNature] = useState('');
  const [notEmployedReason, setNotEmployedReason] = useState('');

  const [offerLetter, setOfferLetter] = useState(null);
  const [workplacePhoto, setWorkplacePhoto] = useState(null);
  const [additionalPhoto, setAdditionalPhoto] = useState(null);

  const pickDocument = useCallback(async setter => {
    try {
      const response = await pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.images],
        multi: false,
      });

      const file = response[0];

      if (!file) {
        return;
      }

      if (file.size > 5000000) {
        Alert.alert(
          'File Size',
          'File size should be less than 5 MB.',
        );
        return;
      }

      setter(file);

      console.log('Selected File:', file);
    } catch (err) {
      if (isCancel(err)) {
        console.log('User cancelled document picker');
        return;
      }

      console.log('Document Picker Error:', err);

      Alert.alert(
        'Error',
        'Unable to select the file. Please try again.',
      );
    }
  }, []);

  const handleSubmit = () => {
    if (!employmentStatus) {
      Alert.alert(
        'Required',
        'Please select your current employment status.',
      );
      return;
    }

    if (employmentStatus === 'EMPLOYED') {
      if (!organizationName.trim()) {
        Alert.alert(
          'Required',
          'Please enter your organization name.',
        );
        return;
      }

      if (!sector.trim()) {
        Alert.alert(
          'Required',
          'Please enter your sector.',
        );
        return;
      }

      if (!offerLetter) {
        Alert.alert(
          'Required',
          'Please upload your offer letter.',
        );
        return;
      }

      if (!workplacePhoto) {
        Alert.alert(
          'Required',
          'Please upload a workplace photo.',
        );
        return;
      }
    }

    if (employmentStatus === 'SELF_EMPLOYED') {
      if (!workNature.trim()) {
        Alert.alert(
          'Required',
          'Please enter your nature of work or business.',
        );
        return;
      }

      if (!sector.trim()) {
        Alert.alert(
          'Required',
          'Please enter your sector.',
        );
        return;
      }

      if (!workplacePhoto) {
        Alert.alert(
          'Required',
          'Please upload a workplace photo.',
        );
        return;
      }
    }

    if (
      employmentStatus === 'NOT_EMPLOYED' &&
      !notEmployedReason.trim()
    ) {
      Alert.alert(
        'Required',
        'Please tell us about your current situation.',
      );
      return;
    }

    console.log({
      employmentStatus,
      organizationName,
      sector,
      workNature,
      notEmployedReason,
      offerLetter,
      workplacePhoto,
      additionalPhoto,
    });

    Alert.alert(
      'Success',
      'Placement information is ready to submit.',
    );
  };

  const OptionButton = ({
    label,
    value,
    selected,
    onPress,
  }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(value)}
      style={[
        styles.option,
        selected && styles.optionSelected,
      ]}>
      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
        ]}>
        {selected && <View style={styles.radioInner} />}
      </View>

      <Text
        style={[
          styles.optionText,
          selected && styles.optionTextSelected,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
      />
    </View>
  );

  const UploadBox = ({
    label,
    file,
    onPress,
    optional = false,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {label}
        {optional && (
          <Text style={styles.optional}> (Optional)</Text>
        )}
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.uploadBox,
          file && styles.uploadBoxSelected,
        ]}>
        <Text
          style={[
            styles.uploadIcon,
            file && styles.uploadIconSelected,
          ]}>
          {file ? '✓' : '＋'}
        </Text>

        <View style={{flex: 1}}>
          <Text
            style={[
              styles.uploadText,
              file && styles.uploadTextSelected,
            ]}
            numberOfLines={1}>
            {file
              ? file.name || 'File Selected'
              : 'Select PDF or Image'}
          </Text>

          {!file && (
            <Text style={styles.uploadHint}>
              Maximum file size: 5 MB
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <Text style={styles.title}>
          Alumni Information
        </Text>

        <Text style={styles.subtitle}>
          Help us keep your current professional information
          up to date.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Current Status
        </Text>

        <Text style={styles.question}>
          What is your current employment status?
        </Text>

        <OptionButton
          label="Employed"
          value="EMPLOYED"
          selected={employmentStatus === 'EMPLOYED'}
          onPress={value => {
            setEmploymentStatus(value);
            setNotEmployedReason('');
          }}
        />

        <OptionButton
          label="Self Employed"
          value="SELF_EMPLOYED"
          selected={employmentStatus === 'SELF_EMPLOYED'}
          onPress={value => {
            setEmploymentStatus(value);
            setOrganizationName('');
            setOfferLetter(null);
            setNotEmployedReason('');
          }}
        />

        <OptionButton
          label="Not Employed"
          value="NOT_EMPLOYED"
          selected={employmentStatus === 'NOT_EMPLOYED'}
          onPress={value => {
            setEmploymentStatus(value);
            setOrganizationName('');
            setSector('');
            setWorkNature('');
            setOfferLetter(null);
            setWorkplacePhoto(null);
            setAdditionalPhoto(null);
          }}
        />

        {/* EMPLOYED */}
        {employmentStatus === 'EMPLOYED' && (
          <View style={styles.dynamicSection}>
            <Input
              label="Organization Name"
              value={organizationName}
              onChangeText={setOrganizationName}
              placeholder="Enter organization name"
            />

            <Input
              label="Sector"
              value={sector}
              onChangeText={setSector}
              placeholder="e.g. IT, Banking, Healthcare"
            />

            <UploadBox
              label="Offer Letter"
              file={offerLetter}
              onPress={() =>
                pickDocument(setOfferLetter)
              }
            />

            <UploadBox
              label="Workplace Photo"
              file={workplacePhoto}
              onPress={() =>
                pickDocument(setWorkplacePhoto)
              }
            />

            <UploadBox
              label="Additional Workplace Photo"
              file={additionalPhoto}
              optional
              onPress={() =>
                pickDocument(setAdditionalPhoto)
              }
            />
          </View>
        )}

        {/* SELF EMPLOYED */}
        {employmentStatus === 'SELF_EMPLOYED' && (
          <View style={styles.dynamicSection}>
            <Input
              label="Nature of Work / Business"
              value={workNature}
              onChangeText={setWorkNature}
              placeholder="e.g. Freelancing, Business, Consultancy"
            />

            <Input
              label="Sector"
              value={sector}
              onChangeText={setSector}
              placeholder="e.g. IT, Agriculture, Retail"
            />

            <UploadBox
              label="Workplace Photo"
              file={workplacePhoto}
              onPress={() =>
                pickDocument(setWorkplacePhoto)
              }
            />

            <UploadBox
              label="Additional Workplace Photo"
              file={additionalPhoto}
              optional
              onPress={() =>
                pickDocument(setAdditionalPhoto)
              }
            />
          </View>
        )}

        {/* NOT EMPLOYED */}
        {employmentStatus === 'NOT_EMPLOYED' && (
          <View style={styles.dynamicSection}>
            <Input
              label="Current Situation"
              value={notEmployedReason}
              onChangeText={setNotEmployedReason}
              placeholder="Tell us about your current situation"
              multiline
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSubmit}
        style={styles.submitButton}>
        <Text style={styles.submitText}>
          Submit Information
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Please provide accurate information for university
        alumni records.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 35,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  question: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  optionText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#1D4ED8',
  },
  dynamicSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  inputContainer: {
    marginTop: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 7,
  },
  optional: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 13,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  uploadBox: {
    minHeight: 62,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
  },
  uploadBoxSelected: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
  },
  uploadIcon: {
    fontSize: 22,
    color: '#64748B',
    marginRight: 10,
  },
  uploadIconSelected: {
    color: '#16A34A',
  },
  uploadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  uploadTextSelected: {
    color: '#15803D',
  },
  uploadHint: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  submitButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.uniBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 12,
    lineHeight: 17,
  },
});

export default PlacementsForm;