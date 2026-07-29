import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SelectList } from 'react-native-dropdown-select-list';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import colors from '../../../colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import { BASE_URL } from '@env'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';


const StudentMovement = () => {
  const [movementTime, setMovementTime] = useState(null);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const [movementType, setMovementType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [allMovements, setAllMovements] = useState([])

  const movementTypes = [
    { key: '1', value: 'Inside Campus' },
    { key: '2', value: 'Outside Campus' },
  ];

  const quickPurposes = [
    {
      title: 'Grocery',
      icon: 'cart-outline',
      value: 'Going to buy groceries.',
    },
    {
      title: 'Food',
      icon: 'food-outline',
      value: 'Going for food.',
    },
    {
      title: 'ATM',
      icon: 'cash-fast',
      value: 'Going to ATM.',
    },
    {
      title: 'Medical',
      icon: 'hospital-box-outline',
      value: 'Medical purpose.',
    },
    {
      title: 'Library',
      icon: 'library',
      value: 'Visiting library.',
    },
    {
      title: 'Sports',
      icon: 'basketball',
      value: 'Sports activity.',
    }
  ];

  const handleTimeConfirm = date => {
    setMovementTime(moment(date).format('hh:mm A'));
    setTimePickerVisible(false);
  };

  const submitMovement = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const res = await axios.post(`${BASE_URL}/student/applyMovement`,
          {
            checkOutTime: movementTime,
            locationType: movementType,
            remarks
          },
          {
            headers: {
              Authorization: `Bearer ${session}`,
              Accept: "application/json",
              'Content-Type': "application/json"
            }
          })
        console.log("submitMovement::", res);
        if (res.data.flag == 1) {
          submitModel(ALERT_TYPE.SUCCESS, "Movement Applied", res.data.message)
          await dailyMovements();
        }
      } catch (error) {
        console.log(error);
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      } finally {
        setIsLoading(false)
      }
    }
  };

  const dailyMovements = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")

    if (session != null) {
      try {
        console.log("dailyMovements");
        const res = await axios.get(`${BASE_URL}/student/allStudentMovements`,
          {
            headers: {
              Authorization: `Bearer ${session}`,
              Accept: "application/json",
              'Content-Type': "application/json"
            }
          })
        console.log(res.data.data);

        if (res.data.flag == 1) {
          setAllMovements(res.data.data)
        }
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.log(error);
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      }
    }
  };

  useEffect(() => {
    dailyMovements();
  }, [])

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
      style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ padding: 18 }}
          showsVerticalScrollIndicator={false}>

          <View style={styles.card}>

            <Text style={styles.heading}>Student Movement</Text>

            {/* Today's Date */}

            <Text style={styles.label}>Today's Date</Text>

            <View style={styles.inputBox}>
              <MaterialCommunityIcons
                name="calendar-month"
                size={22}
                color={colors.uniBlue}
              />

              <Text style={styles.inputText}>
                {moment().format('DD-MM-YYYY')}
              </Text>
            </View>

            {/* Time */}

            <Text style={[styles.label, { marginTop: 18 }]}>
              Time of Movement
            </Text>

            <Pressable
              style={styles.inputBox}
              onPress={() => setTimePickerVisible(true)}>

              <MaterialCommunityIcons
                name="clock-outline"
                size={22}
                color={colors.uniBlue}
              />

              <Text
                style={[
                  styles.inputText,
                  !movementTime && { color: '#999' },
                ]}>
                {movementTime || 'Select Time'}
              </Text>
            </Pressable>

            <DateTimePickerModal
              isVisible={timePickerVisible}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={() => setTimePickerVisible(false)}
            />

            {/* Movement Type */}

            <Text style={[styles.label, { marginTop: 18 }]}>
              Movement Type
            </Text>

            <SelectList
              data={movementTypes}
              setSelected={setMovementType}
              save="value"
              search={false}
              placeholder="Select Movement Type"
              boxStyles={styles.selectBox}
              inputStyles={{
                color: '#222',
                fontSize: 15,
              }}
              dropdownStyles={{
                borderColor: '#ddd',
              }}
            />

            {/* Quick Purpose */}
            <Text style={[styles.label, { marginTop: 20 }]}>
              Quick Purpose
            </Text>

            <View style={styles.chipContainer}>
              {quickPurposes.map(item => (
                <Pressable
                  key={item.title}
                  style={[
                    styles.chip,
                    remarks === item.value &&
                    item.title !== 'Other' &&
                    styles.selectedChip,
                  ]}
                  onPress={() => setRemarks(item.value)}>

                  <MaterialCommunityIcons
                    name={item.icon}
                    size={18}
                    color={
                      remarks === item.value && item.title !== 'Other'
                        ? '#FFF'
                        : colors.uniBlue
                    }
                  />

                  <Text
                    style={[
                      styles.chipText,
                      remarks === item.value &&
                      item.title !== 'Other' &&
                      styles.selectedChipText,
                    ]}>
                    {' '}
                    {item.title}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Remarks */}

            <Text style={styles.label}>Purpose / Remarks</Text>

            <TextInput
              value={remarks}
              onChangeText={setRemarks}
              multiline
              textAlignVertical="top"
              placeholder="Enter movement purpose..."
              placeholderTextColor="#999"
              style={styles.remarks}
            />

            {/* Button */}

            <TouchableOpacity
              disabled={!movementTime || !movementType || !remarks || isLoading}
              style={[
                styles.submitButton,
                (!movementTime || !movementType || !remarks || isLoading) && {
                  opacity: 0.5,
                },
              ]}
              onPress={submitMovement}>

              <MaterialCommunityIcons
                name="send"
                color="#FFF"
                size={20}
              />

              <Text style={styles.submitText}>
                Submit Movement
              </Text>
            </TouchableOpacity>

          </View>
          <Text style={styles.historyHeading}>Recent Movement Requests</Text>

          {allMovements.length > 0 ? (
            allMovements.map((item, index) => (
              <View key={index} style={styles.movementCard}>
                {/* Header */}
                <View style={styles.movementHeader}>
                  <View style={styles.typeBadge}>
                    <MaterialCommunityIcons
                      name={
                        item.LocationType === 'Outside Campus'
                          ? 'map-marker-radius-outline'
                          : 'office-building-outline'
                      }
                      size={16}
                      color="#FFF"
                    />
                    <Text style={styles.typeText}>{item.LocationType}</Text>
                  </View>

                  <View style={[styles.pendingBadge, { backgroundColor: item.Status != 'Pending' ? colors.approved : colors.pending }]}>
                    <Text style={styles.pendingText}>
                      {item.Status || 'NA'}
                    </Text>
                  </View>
                </View>

                {/* Time */}
                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={18}
                    color={colors.uniBlue}
                  />
                  <Text style={styles.rowText}>
                    {item.RequestedCheckOut}
                  </Text>
                </View>

                {/* Purpose */}
                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name="text-box-outline"
                    size={18}
                    color={colors.uniBlue}
                  />
                  <Text style={styles.rowText}>
                    {item.Purpose}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyMovementCard}>
              <MaterialCommunityIcons
                name="walk"
                size={42}
                color="#BBB"
              />

              <Text style={styles.emptyTitle}>
                No Movement Requests
              </Text>

              <Text style={styles.emptySubTitle}>
                Your recent movement requests will appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
};

export default StudentMovement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    elevation: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.uniBlue,
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#222',
  },
  selectBox: {
    borderRadius: 12,
    borderColor: '#E2E6EA',
    backgroundColor: '#F7F8FA',
    minHeight: 50,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#EEF4FF',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D7E4FA',
  },
  selectedChip: {
    backgroundColor: colors.uniBlue,
    borderColor: colors.uniBlue,
  },
  chipText: {
    color: colors.uniBlue,
    fontWeight: '600',
  },
  selectedChipText: {
    color: '#FFF',
  },
  remarks: {
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    backgroundColor: '#F7F8FA',
    padding: 14,
    fontSize: 15,
    color: '#222',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: colors.uniBlue,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },

  historyHeading: {
    marginTop: 30,
    marginBottom: 14,
    fontSize: 20,
    fontWeight: '700',
    color: colors.uniBlue,
  },
  movementCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },
  movementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.uniBlue,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  typeText: {
    color: '#FFF',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 13,
  },
  pendingBadge: {
    backgroundColor: '#FFF3D8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
  },
  pendingText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rowText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 15,
    flex: 1,
  },
  emptyMovementCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    elevation: 2,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: '#444',
  },
  emptySubTitle: {
    marginTop: 6,
    color: '#888',
    textAlign: 'center',
  },
});