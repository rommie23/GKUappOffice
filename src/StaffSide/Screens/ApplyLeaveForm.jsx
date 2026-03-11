import { SelectList } from 'react-native-dropdown-select-list'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity, Image, Alert, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardProvider, KeyboardAvoidingView } from "react-native-keyboard-controller";

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import { StudentContext } from '../../context/StudentContext';
let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import moment from 'moment';
import colors from '../../colors';
import { useNavigation } from '@react-navigation/native';

const ApplyLeaveForm = () => {
  const { StaffIDNo } = useContext(StudentContext)
  const [selectedImage, setSelectedImage] = useState(null);
  const [typeSelect, setTypeSelect] = useState('');
  const [durationSelect, setDurationSelect] = useState('');
  const [leaveDuration, setLeaveDuration] = useState('fullMulti')
  const [leaveShift, setLeaveShift] = useState(1)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [getOnlyDate, setOnlyDate] = useState('');
  const [data, setLeaveName] = useState('');
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isOnlyDatePickerVisible, setOnlyDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [showSecondRadio, setShowSecondRadio] = useState('');
  const [shiftTimings, setShiftTimings] = useState([])
  // const [duration, setDuration] = useState('')
  const [showFirstSecondTab, setshowFirstSecondTab] = useState(true);
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [ImgSizeError, setImgSizeError] = useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fileResponse, setFileResponse] = useState([]);

  const navigation = useNavigation()

  const handleLeaveHalfShortChange = (selection) => {
    console.log("selection::::", selection);

    setShowSecondRadio(selection === 'halfShort');
    if (selection === 'halfShort') {
      setLeaveDuration('halfShort')
    }
    else {
      setLeaveDuration('fullMulti')
    }
  };
  const handleLeaveSecondFirstChange = (selection) => {
    setshowFirstSecondTab(selection === 'F');
    if (selection === 'F') {
      setLeaveShift(1)
    } else {
      setLeaveShift(2)
    }
  };
  const startdatehandleConfirm = (date) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
  };

  const enddatehandleConfirm = (date) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
  };
  const OnlydatehandleConfirm = (date) => {
    setOnlyDate(date);
    setOnlyDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    console.log("showDatePickershowDatePicker");

    setStartDatePickerVisibility(true);
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };
  const showOnlyDatePicker = () => {
    console.log("showOnlyDatePickershowOnlyDatePicker");

    setOnlyDatePickerVisibility(true);
  };
  const clearState = () => {
    setStartDate('');
    setEndDate('');
    setOnlyDate('');
    setText('')
    setSelectedImage('')
  };

  useEffect(() => {
    getLeaveTypes();
    if (showSecondRadio) {
      clearState();
    }
  }, [showSecondRadio]);

  const getDate = (date) => {
    if (!date) return '';
    let tempDate = date.toString().split(' ');
    return `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`;
  };
  const getLeaveTypes = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    try {
      setIsLoading(true);
      const PendingDetails = await fetch(BASE_URL + '/Staff/balance', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`
        }
      });
      let getLeaveTypes = await PendingDetails.json();

      const leavtypeArray = getLeaveTypes['array']
      const generatedArray = leavtypeArray.map(item => ({
        key: item.Id.toString(),
        value: item.Balance ? `${item.Name} ${'(' + item.Balance + ')'}` : `${item.Name} `
      }));
      setLeaveName(generatedArray)
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
    } finally {
      setIsLoading(false);
    }
  };


  duration = [
    { key: 0.25, value: 0.25 },
    { key: 0.50, value: 0.50 },
    { key: 0.75, value: 0.75 },]

  const handleResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      let imageUri = response.uri || response.assets?.[0]?.uri;
      setSelectedImage(imageUri);
    }
  }

  //  to be editted for leave application (coming form studentDetailsCorrection)

  const options = {
    title: 'Select Image',
    type: 'library',
    options: {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    }
  }

  const openImagePicker = async () => {
    const images = await launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        const { uri, fileSize, fileName } = response.assets[0];
        const sizeInKB = fileSize / 1024;
        // console.log(uri);
        if (sizeInKB <= 500) {
          setImageUri(uri);
          setImageName(fileName);
          setImgSizeError(false);
        } else {
          setImgSizeError(true);
          submitModel(ALERT_TYPE.DANGER, "Image Size", "Image size should be less than 500kb")
        }
      }

    });
    console.log("image assets are here", images.assets[0]);
    const formData = new FormData();
    formData.append('image', {
      uri: images.assets[0].uri,
      type: images.assets[0].type,
      name: images.assets[0].fileName
    })
  };

  const notificationfunction = async (recipient) => {
    console.log("notificationfunction called");

    const session = await EncryptedStorage.getItem("user_session");
    if (!session) return;

    // Helper: timeout wrapper for fetch
    const fetchWithTimeout = (url, options, timeout = 5000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ]);
    };

    try {
      const res = await fetchWithTimeout(`${BASE_URL}/notifiaction/sendNotification`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          Accept: "application/json",
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          receipients: [recipient],
          notificationId: '4',
        })
      });

      const response = await res.json();
      console.log("Notification API response:", response);
      console.log("you have to un-comment notification function ");


      if (res.ok) {
        // errorModel(ALERT_TYPE.SUCCESS, "Success", "Notification sent successfully");
        errorModel(ALERT_TYPE.SUCCESS, "Succeess", "Application submitted");
      } else {
        console.warn("Notification failed but continuing...");
        errorModel(ALERT_TYPE.SUCCESS, "Succeess", "Application submitted");
      }

    } catch (error) {
      if (error.message === "Timeout") {
        console.warn("Notification timeout — proceeding anyway.");
        // errorModel(ALERT_TYPE.SUCCESS, "Timeout", "Notification delayed, leave submitted");
      } else {
        console.error("Notification error:", error);
        // errorModel(ALERT_TYPE.WARNING, "Error", "Notification service unavailable");
      }
    }
  };


  const submitLeaveFormFull = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session");
    if (!imageUri) return;
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: StaffIDNo + '.jpg',
    });
    try {
      // const url = `${BASE_URL}/Staff/leaveapply/${typeSelect}/${durationSelect}/${text}/0.35`;
      const url = `${BASE_URL}/Staff/leaveapply/${typeSelect}/0/${text}/0/0/${startDate}/${endDate}/${leaveDuration}`;
      console.log(`1${typeSelect}/2${durationSelect}/3${text}/4${leaveShift}/5${getOnlyDate}/6${startDate}/7${endDate}/8${leaveDuration}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'enctype': 'multipart/form-data',
        },
        body: formData
      });
      const data = await response.json();
      console.log("submitLeaveFormFull::", data);

      data['Response'] == 5 ?
        submitModel(ALERT_TYPE.DANGER, "Insufficient Balance", 'Balance of leaves is not sufficient') :
        data['Response'] == 7 ?
          await notificationfunction(data["RecomendingAuthority"])
          :
          data['Response'] == 2 ?
            submitModel(ALERT_TYPE.WARNING, "Pending", 'Leave Already pending')
            :
            data['Response'] == 4 ?
              submitModel(ALERT_TYPE.WARNING, "Pending", 'Leave Already Exist') :
              data['Response'] == 9 ?
                submitModel(ALERT_TYPE.WARNING, "Wrong Date Select", "Please select today's date or upcoming dates") :
                data['Response'] == 10 ?
                  submitModel(ALERT_TYPE.WARNING, "Check Number of days", data['Message']) :
                  data['Response'] == 11 ?
                    submitModel(ALERT_TYPE.WARNING, "Check Number of days", data['Message']) :
                    submitModel(ALERT_TYPE.WARNING, "Newtwork Issue", 'Try Again Later')
      setIsLoading(false);
      console.log(data['Response']);

    } catch (error) {
      if (error instanceof TypeError && error.message === 'Network slow plaese try again') {
        console.error('Network slow plaese try again:', error);
        submitModel(ALERT_TYPE.WARNING, " Error", "Network slow plaese try again")
      } else {
        console.error('Error fetching data:', error);
        submitModel(ALERT_TYPE.WARNING, " Error", "Network slow plaese try again")
      }
      setIsLoading(false);
    }
    setIsLoading(false)
  };
  const submitLeaveFormShort = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session");
    if (!imageUri) return;
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: StaffIDNo + '.jpg',
    });
    setIsLoading(true);
    try {
      // const url = `${BASE_URL}/Staff/leaveapply/${typeSelect}/${durationSelect}/${text}/0.35`;
      const url = `${BASE_URL}/Staff/leaveapply/${typeSelect}/${durationSelect}/${text}/${leaveShift}/${getOnlyDate}/0/0/${leaveDuration}`;
      console.log(`1${typeSelect}/2${typeof (durationSelect)}/3${text}/4${leaveShift}/5${getOnlyDate}/6na/7na/8${leaveDuration}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'enctype': 'multipart/form-data',
        },
        body: formData
      });
      const data = await response.json();

      data['Response'] == 5 ?
        submitModel(ALERT_TYPE.DANGER, "Insufficient Balance", 'Balance of leaves is not sufficient') :
        data['Response'] == 7 ?
          await notificationfunction(data["RecomendingAuthority"]) :
          data['Response'] == 2 ?
            submitModel(ALERT_TYPE.WARNING, "Pending", 'Leave Already pending') :
            data['Response'] == 4 ?
              submitModel(ALERT_TYPE.WARNING, "Pending", 'Leave Already Exist') :
              data['Response'] == 9 ?
                submitModel(ALERT_TYPE.WARNING, "Wrong Date Select", "Please select today's date or upcoming dates") :
                data['Response'] == 10 ?
                  submitModel(ALERT_TYPE.WARNING, "Check Number of days", data['Message']) :
                  data['Response'] == 11 ?
                    submitModel(ALERT_TYPE.WARNING, "Check Number of days", data['Message']) :
                    submitModel(ALERT_TYPE.WARNING, "Newtwork Issue", 'Try Again Later')
      setIsLoading(false);
      console.log(data['Response']);

    } catch (error) {
      setIsLoading(false);
      if (error instanceof TypeError && error.message === 'Network slow plaese try again') {
        console.error('Network slow plaese try again:', error);
        submitModel(ALERT_TYPE.WARNING, "Error", "Network slow plaese try again")
      } else {
        console.error('Error fetching data:', error);
        submitModel(ALERT_TYPE.WARNING, "Error", "Network slow plaese try again")
      }
    }
    setIsLoading(false)
  };

  const ShiftTimings = async () => {
    const session = await EncryptedStorage.getItem("user_session")

    if (session != null) {
      try {
        const timings = await fetch(BASE_URL + '/staff/shifttime', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
          }
        })
        const timingsData = await timings.json()
        setShiftTimings(timingsData['shift'][0])
        // console.log(timingsData);

      } catch (error) {
        console.log('Error fetching timings data:applyleave:', error)
      }
    }
  }
  useEffect(() => {
    ShiftTimings()
  }, [])

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }

  const errorModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: () => navigation.goBack()
    })
  }

  return (
    <KeyboardProvider>
      <AlertNotificationRoot>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="height"
        >
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            {isLoading &&
              <Spinner
                visible={isLoading}
              />
            }
            <View>
              <View style={{ padding: 20, backgroundColor: '#ffff' }}>
                {
                  shiftTimings.length == 0 ? null :
                    <Text style={{ color: 'black', alignSelf: 'center', fontWeight: '700' }}>{`0.25 -> ${shiftTimings['Intime1'].slice(0, 5)} || 0.5 -> ${shiftTimings['Intime2'].slice(0, 5)} || 0.75 -> ${shiftTimings['Intime3'].slice(0, 5)}`}</Text>
                }


                <Text>Type</Text>
                <View style={styles.rowSpacer} />
                <SelectList
                  value={typeSelect}
                  setSelected={setTypeSelect}
                  fontFamily='time'
                  data={data}
                  arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} />}
                  searchicon={<FontAwesome5Icon name="search" size={12} color={'black'} />}
                  search={false}
                  defaultOption={{ key: '', value: 'Type' }}
                  dropdownTextStyles={{ color: 'black' }}
                  inputStyles={{ color: 'black' }}
                />

                <View style={styles.rowSpacer} />
                <Text>Duration</Text>
                <View style={styles.rowSpacer} />
                <View style={styles.radioContainer}>
                  <TouchableOpacity
                    style={[styles.radioButton, !showSecondRadio && styles.radioButtonSelected]}
                    onPress={() => handleLeaveHalfShortChange('halfShort')}>
                    <Text style={styles.radioText}>Half/Short</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.radioButton, showSecondRadio && styles.radioButtonSelected]}
                    onPress={() => handleLeaveHalfShortChange('fullMulti')}>
                    <Text style={styles.radioText}>Full/Multiple</Text>
                  </TouchableOpacity>
                </View>
                {showSecondRadio && (
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                      <View style={styles.radioContainer}>
                        <TouchableOpacity
                          style={[styles.radioButton, showFirstSecondTab || styles.radioButtonSelected]}
                          onPress={() => handleLeaveSecondFirstChange('F')}
                        >
                          <Text style={styles.radioTextFirstSecond}>F</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.radioButton, !showFirstSecondTab || styles.radioButtonSelected]}
                          onPress={() => handleLeaveSecondFirstChange('S')}
                        >
                          <Text style={styles.radioTextFirstSecond}>S</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ flex: 2 }}>
                      <SelectList
                        setSelected={setDurationSelect}
                        fontFamily='time'
                        data={duration}
                        arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} />}
                        searchicon={<FontAwesome5Icon name="search" size={12} color={'black'} />}
                        search={false}
                        defaultOption={{ key: '0', value: 'Duration' }}
                        dropdownTextStyles={{ color: 'black' }}
                        inputStyles={{ color: 'black' }}
                      />
                    </View>
                  </View>
                )}
                {showSecondRadio || (
                  <View>
                    <View style={styles.rowSpacer} />
                    <View style={{ backgroundColor: 'white' }}>
                      <Text>Start Date</Text>
                      <View style={styles.rowSpacer} />
                      <Pressable onPress={() => showDatePicker()}>
                        <View pointerEvents="none">
                          <TextInput
                            style={styles.textInput}
                            value={getDate(startDate)}
                            placeholder="Date..."
                            editable={false}
                            inputStyles={{ color: 'black' }}
                            placeholderTextColor="#000"
                            pointerEvents="none"
                          />
                        </View>
                      </Pressable>
                    </View>
                    <DateTimePickerModal
                      isVisible={isStartDatePickerVisible}
                      mode="date"
                      onConfirm={startdatehandleConfirm}
                      onCancel={() => setStartDatePickerVisibility(false)}
                      minimumDate={moment().toDate()}
                      display='inline'
                    />
                    <View style={styles.rowSpacer} />
                    <View style={{ backgroundColor: 'white' }}>
                      <Text>End Date</Text>
                      <View style={styles.rowSpacer} />
                      <Pressable onPress={showEndDatePicker}>
                        <View pointerEvents="none">
                          <TextInput
                            style={styles.textInput}
                            value={getDate(endDate)}
                            placeholder="Date..."
                            editable={false}
                            placeholderTextColor="#000"
                            pointerEvents="none"
                          />
                        </View>
                      </Pressable>
                    </View>
                    <DateTimePickerModal
                      isVisible={isEndDatePickerVisible}
                      mode="date"
                      onConfirm={enddatehandleConfirm}
                      onCancel={() => setEndDatePickerVisibility(false)}
                      minimumDate={moment().toDate()}
                      display='inline'
                    />
                  </View>
                )}
                {showSecondRadio && (
                  <View>
                    <View style={{ backgroundColor: 'white' }}>
                      <Text>Date</Text>
                      <View style={styles.rowSpacer} />
                      <Pressable onPress={showOnlyDatePicker}>
                        <View pointerEvents="none">
                          <TextInput
                            style={styles.textInput}
                            value={getDate(getOnlyDate)}
                            placeholder="Date....."
                            editable={false}
                            placeholderTextColor="#000"
                          />
                        </View>
                      </Pressable>
                    </View>
                    <DateTimePickerModal
                      isVisible={isOnlyDatePickerVisible}
                      mode="date"
                      onConfirm={OnlydatehandleConfirm}
                      onCancel={() => setOnlyDatePickerVisibility(false)}
                      minimumDate={moment().toDate()}
                      display='inline'
                    />
                  </View>
                )}

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  {selectedImage && (
                    <Image
                      source={{ uri: selectedImage }}
                      style={{ flex: 1 }}
                      resizeMode="contain"
                    />
                  )}

                  <Text style={{ marginTop: 10, color: 'black' }}>{imageName}</Text>
                  <TouchableOpacity style={{ marginTop: 4, backgroundColor: imageUri ? colors.uniBlue : '#778DA9', borderRadius: 10 }} onPress={openImagePicker}>
                    <Text style={{ color: '#fff', padding: 10 }}>Choose Adjustment File</Text>
                  </TouchableOpacity>
                  {
                    imageName == null &&
                    <Text style={{ marginTop: 10, color: 'red', fontSize: 12 }}>Image size should be 500kb or less*</Text>
                  }
                  {/* <View style={{ marginTop: 20, marginBottom: 50 }}>
        <Button title="Open Camera" onPress={handleCameraLaunch} />
      </View> */}
                </View>


                <View style={styles.rowSpacer} />
                <Text>Reason</Text>
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
                  leaveDuration == 'fullMulti' && typeSelect != '' && text != '' && startDate != '' && endDate != '' && imageName != null ?
                    <TouchableOpacity style={styles.bottomBtn} onPress={() => submitLeaveFormFull()}>
                      <Text style={styles.btnTxt}>Submit</Text>
                    </TouchableOpacity> : leaveDuration == 'halfShort' && typeSelect != '' && text != '' && leaveShift != '' && getOnlyDate != '' && imageName != null ?
                      <TouchableOpacity style={styles.bottomBtn} onPress={() => submitLeaveFormShort()}>
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
    </KeyboardProvider>
  );
};

export default ApplyLeaveForm;

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
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 44,
    backgroundColor: '#a62535',
    color: '#fff',
    flex: 1,
    textAlignVertical: "center"
  },
  radioButtonSelected: {
    backgroundColor: '#223260',
  },
  radioText: {
    color: '#fff',
    textAlign: 'center',
    padding: 5,
    fontWeight: '800'
  },
  radioTextFirstSecond: {
    color: '#fff',
    textAlign: 'center',
    padding: 5,
    fontSize: 15,
    fontWeight: '800'
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
    backgroundColor: '#223260',
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
