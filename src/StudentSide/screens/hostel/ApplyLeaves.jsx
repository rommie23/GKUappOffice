
import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity, Image, Alert, KeyboardAvoidingView } from 'react-native';
import { Text } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL, LIMS_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';

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
        const res = await fetch(LIMS_URL + '/student/studentApplyLeave', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            Accept: "application/json",
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            studentId: studentIDNo,
            startDate: startDate,
            endDate: endDate,
            remarks: text
          })
        })
        const response = await res.json()
        // console.log(response);
        setIsLoading(false)
        submitModel(ALERT_TYPE.SUCCESS, "Success", 'Updated Successfully')
      }
    } catch (error) {
      console.log(error);
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
          <View>
            <View style={{ padding: 20, backgroundColor: '#ffff' }}>
              <View style={styles.rowSpacer} />
              <View style={styles.rowSpacer} />
              <View>
                <View style={styles.rowSpacer} />
                <View style={{ backgroundColor: 'white' }}>
                  <Text>Start Date</Text>
                  <View style={styles.rowSpacer} />
                  <TouchableOpacity onPress={showDatePicker}>
                    <TextInput
                      style={styles.textInput}
                      value={getDate(startDate)}
                      placeholder="Date..."
                      editable={false}
                      inputStyles={{ color: 'black' }}
                      placeholderTextColor="#000"
                    />
                  </TouchableOpacity>
                </View>
                <View pointerEvents="none">
                  <DateTimePickerModal
                    isVisible={isStartDatePickerVisible}
                    mode="date"
                    onConfirm={startdatehandleConfirm}
                    onCancel={() => setStartDatePickerVisibility(false)}
                    minimumDate={moment().toDate()}
                  />
                </View>
                <View style={styles.rowSpacer} />
                <View style={{ backgroundColor: 'white' }}>
                  <Text>End Date</Text>
                  <View style={styles.rowSpacer} />
                  <TouchableOpacity onPress={showEndDatePicker}>
                    <TextInput
                      style={styles.textInput}
                      value={getDate(endDate)}
                      placeholder="Date..."
                      editable={false}
                      placeholderTextColor="#000"
                    />
                  </TouchableOpacity>
                </View>
                <View pointerEvents="none">
                  <DateTimePickerModal
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    onConfirm={enddatehandleConfirm}
                    onCancel={() => setEndDatePickerVisibility(false)}
                    minimumDate={moment().toDate()}
                  />
                </View>
              </View>

              <View style={{ flex: 1, justifyContent: 'center' }}>
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ flex: 1 }}
                    resizeMode="contain"
                  />
                )}
              </View>


              <View style={styles.rowSpacer} />
              <Text>Remarks</Text>
              <View style={styles.rowSpacer} />
              <TextInput
                style={[styles.inputTextArea, { color: 'black' }]}
                onChangeText={setText}
                value={text}
                placeholder="Enter reason..."
                placeholderTextColor="#000"
              />
              <View style={styles.rowSpacer} />
              {
                text != '' && startDate != '' && endDate != '' ?
                  <TouchableOpacity style={styles.bottomBtn} onPress={() => submitLeave()}>
                    <Text style={styles.btnTxt}>Submit</Text>
                  </TouchableOpacity> :
                  <View>
                    <Text style={{ color: 'red' }}>All Fields are required **</Text>
                    <TouchableOpacity style={[styles.bottomBtn, { opacity: 0.5 }]} disabled>
                      <Text style={styles.btnTxt}>Submit</Text>
                    </TouchableOpacity>
                  </View>
              }
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
};

export default ApplyLeaves;

const styles = StyleSheet.create({
  rowSpacer: {
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 5,
    padding: 10,
    borderRadius: 10,
    color: '#000'
  },

  inputTextArea: {
    height: 100,
    margin: 0,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10
  },
  bottomBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 0,
    height: 44,
    backgroundColor: `${colors.uniBlue}`,
    color: '#fff',
    textAlignVertical: "center"
  },
  btnTxt: {
    color: '#fff',
    textAlign: 'center',
    padding: 5
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
