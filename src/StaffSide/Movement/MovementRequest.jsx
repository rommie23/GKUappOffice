import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL,IMAGE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';


const MovementRequest = () => {

  const navigation = useNavigation()
  const [purpose, setPurpose] = useState('')
  const [leaveType, setLeaveType] = useState('0')
  const [location, setLocation] = useState('')
  const [remarks, setRemarks] = useState('')
  const [startTime, setStartTime] = useState('');
  const [startTimePickerVisible, setStartTimePickerVisibility] = useState(false);

  const getTime = (time) => {
    // console.log(time);

    if (!time) return '';
    let tempTime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${tempTime}`;
  };

  // show the time picker on screen
  const showDatePicker = () => {
    setStartTimePickerVisibility(true);
  };
  // movement

  // time selected and giving response
  const starttimehandleConfirm = (time) => {
    setStartTime(time);
    setStartTimePickerVisibility(false);
  };

  // const notificationfunction =async(recipient)=>{
  //   console.log("notificationfunction");
  //   const session = await EncryptedStorage.getItem("user_session");
  //   try {
  //     if (session != null) {
  //         console.log("recipient ::: ",recipient);
  //         const res = await fetch(Config.BASE_URL + '/notifiaction/sendNotification',{
  //           method:'POST',
  //           headers:{
  //             Authorization: `Bearer ${session}`,
  //             Accept: "application/json",
  //             'Content-Type': "application/json"
  //           },
  //           body: JSON.stringify({
  //             receipients : [recipient],
  //             screenPath : 'SupervisorMovements',
  //             notificationId: '3',
  //             pagePath: 'movement_approve.php'
  //           })
  //         })
  //         const response = await res.json()
  //         console.log(response);
  //         submitModel(ALERT_TYPE.SUCCESS,"Success", 'Updated Successfully')
  //       }
  //     } catch (error) {
  //       console.log("error in Notification::", error);
        
  //     }
  //   };

      const notificationfunction =async(recipient)=>{
        console.log("notificationfunction");
        const session = await EncryptedStorage.getItem("user_session");
        try {
          if (session != null) {
              console.log("recipient ::: ",recipient);
              const res = await fetch(BASE_URL + '/notifiaction/sendNotification',{
                method:'POST',
                headers:{
                  Authorization: `Bearer ${session}`,
                  Accept: "application/json",
                  'Content-Type': "application/json"
                },
                body: JSON.stringify({
                  receipients : [recipient],
                  screenPath : 'SupervisorMovements',
                  notificationId: '3',
                  pagePath: 'SupervisorMovements.php'
                })
              })
              const response = await res.json()
              console.log(response);
            }
          } catch (error) {
            console.log("error in Notification::", error);
            
          }
        };
  

  // seinding the movement to backend
  const sendMovementRequest = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {    
        const movement = await fetch(BASE_URL + `/staff/movment/${purpose}/${location}/${startTime}/${remarks}/${leaveType}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const movementData = await movement.json()
        console.log(movementData);
        if (movementData['submitMovement']['rowsAffected'] > 0 ) {
          notificationfunction(movementData['Authority'])
          
          submitModel(ALERT_TYPE.SUCCESS,"Done", "Movement Submitted Succesfully")
        }
      } catch (error) {
        console.log('Error fetching movement request ::', error);
        // errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
        // setShowModal(true)
      }
    }
  }

  const submitModel = (type, title, message)=> {
    Dialog.show({
        type: type ,
        title: title,
        textBody: message,
        button: 'close',
        onHide: ()=>navigation.goBack()
        })
        
}

  return (
    <AlertNotificationRoot>
    <View style={{ flex: 1, paddingTop:-40}}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View>
          <View style={[styles.innerContainer]}>

            {/* selecting purpose of the movement */}
            <View style={[styles.eachInput]}>
              <Text style={styles.txtStyle}>Purpose</Text>
              <SelectList boxStyles={{ padding: 10, width: "100%" }}
                setSelected={(val) => setPurpose(val)}
                fontFamily='time'
                data={[
                  { key: 'Official', value: 'Official' },
                  { key: 'Personal', value: 'Personal' },
                  { key: 'Leave', value: 'Leave' },
                ]}
                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                search={false}
                defaultOption={{ key: '0', value: 'Select Purpose' }}
                inputStyles={{ color: 'black' }}
                dropdownTextStyles={{ color: 'black' }}
              />
            </View>
            {
              // if the purpose is leave then show below input of asking type of leave
            }
            {purpose == "Leave" ?
              <View style={[styles.eachInput]}>
                <Text style={styles.txtStyle}>Leave Type</Text>
                <SelectList boxStyles={{ padding: 10, width: "100%" }}
                  setSelected={(val) => setLeaveType(val)}
                  fontFamily='time'
                  data={[
                    { key: 'Short', value: 'Short' },
                    { key: 'Full', value: 'Full' },
                  ]}
                  arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                  search={false}
                  defaultOption={{ key: '0', value: 'Select Leave Type' }}
                  inputStyles={{ color: 'black' }}
                  dropdownTextStyles={{ color: 'black' }}
                />
              </View> : null

            }


            {/* selecting movement inside or outside */}

            <View style={styles.eachInput}>
              <Text style={styles.txtStyle}>Location</Text>
              <SelectList boxStyles={{ padding: 10, width: "100%" }}
                setSelected={(val) => setLocation(val)}
                fontFamily='time'
                data={[
                  { key: 'Inside Campus', value: 'Inside Campus' },
                  { key: 'Outside Campus', value: 'Outside Campus' },
                ]}
                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                search={false}
                defaultOption={{ key: '0', value: 'Select Location' }}
                inputStyles={{ color: 'black' }}
                dropdownTextStyles={{ color: 'black' }}
              />
            </View>

            {/* time picker */}
            <View style={styles.eachInput}>
              <Text style={styles.txtStyle}>Select Check-Out Time</Text>
              <TouchableOpacity onPress={showDatePicker}>
                <View pointerEvents="none">
                <TextInput
                  style={[styles.inputBox, { width: '100%' }]}
                  value={getTime(startTime)}
                  placeholder="Time..."
                  editable={false}
                  inputStyles={{ color: 'black' }}
                  placeholderTextColor="#000"
                />
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={startTimePickerVisible}
                mode="time"
                onConfirm={starttimehandleConfirm}
                onCancel={() => setStartTimePickerVisibility(false)}
              />
            </View>
                {/* to write down remarks */}
            <View style={styles.eachInput}>
              <Text style={styles.txtStyle}>Remarks</Text>
              <TextInput
                value={remarks}
                style={[styles.inputBox, { color: 'black' }]}
                onChangeText={setRemarks}
              />
            </View>
            {
              purpose != 0 && purpose != 'Leave' && location != 0 && startTime != "" && remarks.trim() != "" ?
                <View style={styles.eachInput}>
                  <TouchableOpacity style={styles.btn} onPress={() => {
                    sendMovementRequest();
                  }
                  }>
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Submit</Text>
                  </TouchableOpacity>
                </View>
                : purpose == 'Leave' && leaveType != 0 && location != 0 && startTime != "" && remarks.trim() != ""?
                  <View style={styles.eachInput}>
                    <TouchableOpacity style={styles.btn} onPress={() => {
                      sendMovementRequest();
                    }
                  }>
                      <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Submit</Text>
                    </TouchableOpacity>
                  </View> : null
            }

          </View>
        </View>
      </ScrollView>
    </View>
    </AlertNotificationRoot>
  )
}

export default MovementRequest

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f1f1f1',

  },
  innerContainer: {
    backgroundColor: 'white',
    marginTop: 24,
    elevation: 2,
    // borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 16
  },
  eachInput: {
    marginTop: 16,
    rowGap: 4
  },
  inputBox: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    color: 'black',
    backgroundColor: '#fffafa'
  },

  btn: {
    marginVertical: 4,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.uniBlue,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  txtStyle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600'
  },
})