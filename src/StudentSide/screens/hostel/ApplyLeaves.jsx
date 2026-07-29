
import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL, LIMS_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import { StudentContext } from '../../../context/StudentContext';

import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import moment from 'moment';
import colors from '../../../colors';
import { useNavigation } from '@react-navigation/native';

const ApplyLeaves = () => {
  const { studentIDNo } = useContext(StudentContext)
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const navigation = useNavigation()

  const startdatehandleConfirm = (date) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
  };

  const enddatehandleConfirm = (date) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    console.log("showDatePickershowDatePicker");

    setStartDatePickerVisibility(true);
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const clearState = () => {
    setStartDate('');
    setEndDate('');
    setText('')
    setSelectedImage('')
  };


  const getDate = (date) => {
    if (!date) return '';
    let tempDate = date.toString().split(' ');
    return `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`;
  };

  const notificationfunction = async (recipient) => {
    console.log("notificationfunction");
    const session = await EncryptedStorage.getItem("user_session");
    try {
      if (session != null) {
        console.log("recipient ::: ", recipient);
        const res = await fetch(BASE_URL + '/notifiaction/sendNotification', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            Accept: "application/json",
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            receipients: [recipient],
            screenPath: 'approveLeaves',
            notificationId: '2',
            pagePath: 'leave_approve.php'
          })
        })
        const response = await res.json()
        console.log(response);
        submitModel(ALERT_TYPE.SUCCESS, "Success", 'Updated Successfully')
      }
    } catch (error) {
      console.log("error in Notification::", error);

    }
  };

  const submitLeave = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session");
    try {
      if (session != null) {
        const res = await fetch(BASE_URL + '/student/studentApplyLeave', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            Accept: "application/json",
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            startDate: startDate,
            endDate: endDate,
            remarks: text
          })
        })
        const response = await res.json()
        // console.log(response);
        setIsLoading(false)
        if (response.flag == 1) {
          submitModel(ALERT_TYPE.SUCCESS, "Success", response.message)
          clearState();
        } else {
          inModel(ALERT_TYPE.DANGER, "Failed", response.message)
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false)
    }
  }

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: () => navigation.goBack()
    })
  }
  const inModel = (type, title, message) => {
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          {isLoading &&
            <Spinner
              visible={isLoading}
            />
          }
          <View style={styles.container}>
            <View style={styles.card}>

              <Text style={styles.heading}>Apply Hostel Leave</Text>

              {/* Start Date */}
              <Text style={styles.label}>Start Date</Text>

              <Pressable style={styles.inputBox} onPress={showDatePicker}>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={22}
                  color={colors.uniBlue}
                />
                <Text style={styles.inputText}>
                  {getDate(startDate) || "Select Start Date"}
                </Text>
              </Pressable>

              <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={startdatehandleConfirm}
                onCancel={() => setStartDatePickerVisibility(false)}
                minimumDate={moment().toDate()}
              />

              {/* End Date */}
              <Text style={[styles.label, { marginTop: 18 }]}>End Date</Text>

              <Pressable style={styles.inputBox} onPress={showEndDatePicker}>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={22}
                  color={colors.uniBlue}
                />
                <Text style={styles.inputText}>
                  {getDate(endDate) || "Select End Date"}
                </Text>
              </Pressable>

              <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                onConfirm={enddatehandleConfirm}
                onCancel={() => setEndDatePickerVisibility(false)}
                minimumDate={moment().toDate()}
              />

              {/* Remarks */}
              <Text style={[styles.label, { marginTop: 18 }]}>
                Reason / Remarks
              </Text>

              <TextInput
                style={styles.remarks}
                value={text}
                onChangeText={setText}
                placeholder="Why are you applying for leave?"
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
              />

              {/* Button */}
              <TouchableOpacity
                disabled={!text || !startDate || !endDate}
                onPress={submitLeave}
                style={[
                  styles.submitButton,
                  (!text || !startDate || !endDate) && { opacity: 0.5 }
                ]}
              >
                <Text style={styles.submitText}>
                  Submit Leave Request
                </Text>
              </TouchableOpacity>

              {!text || !startDate || !endDate ? (
                <Text style={styles.errorText}>
                  * Please fill all fields.
                </Text>
              ) : null}

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
};

export default ApplyLeaves;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F5F9",
  },

  card: {
    margin: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    elevation: 4,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.uniBlue,
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E6EA",
  },

  inputText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#222",
  },

  remarks: {
    height: 120,
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E6EA",
    padding: 12,
    color: "#222",
    fontSize: 15,
  },

  submitButton: {
    backgroundColor: colors.uniBlue,
    marginTop: 24,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  errorText: {
    marginTop: 10,
    color: "#D32F2F",
    textAlign: "center",
    fontSize: 13,
  },
});
