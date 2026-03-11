import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height


const MovementReports = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const navigation = useNavigation();

  const myMovementsReport = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const movementDetails = await fetch(BASE_URL + `/staff/mymovementreports`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const movementDetailsData = await movementDetails.json()
        setMovements(movementDetailsData["data"]);
        // console.log('report of movements', movementDetailsData);
        setLoading(false)
      } catch (error) {
        console.log('Error fetching movement request ::', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
        // setShowModal(true)
      }
    }
  }
  useEffect(() => {
    myMovementsReport();
    // filterMovement();
  }, [])


  const filterMovement = async () => {
    const start = JSON.stringify(new Date(startDate)).substring(1,11)
    const end = JSON.stringify(new Date(endDate)).substring(1,11)
    // console.log(typeof(JSON.stringify(new Date(startDate))));
    // console.log(JSON.stringify(new Date(startDate)).substring(1,11));
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    
    if (session != null) {
      try {
        const movementDetails = await fetch(BASE_URL + `/staff/mymovementReports/${start}/${end}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const movementDetailsData = await movementDetails.json()
        // console.log('report of filtered movements',movementDetailsData["submitsubjects"]["recordset"]);
        setMovements(movementDetailsData["submitsubjects"]["recordset"]);
        setLoading(false)
      } catch (error) {
        console.log('Error fetching filterd movemnt ::', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
        // setShowModal(true)
      }
    }
  }

  // console.log("start date is:::", startDate);
  // console.log("end date is:::", endDate);
  
  const getDate = (date) => {
    if (!date) return '';
    let tempDate = date.toString().split(' ');
    return `${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`;
  };

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

  const onRefresh = useCallback(() => {
    myMovementsReport()
    setStartDate('')
    setEndDate('')
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
    <AlertNotificationRoot>
      <View style={{flex:1}}>
        <View style={{ height:35, marginHorizontal:32, flexDirection:'row', columnGap:16, justifyContent:'space-evenly', alignItems:'center', marginTop:12, marginBottom:6}}>
          <TouchableOpacity onPress={showDatePicker}>
            <TextInput
              style={styles.textInput}
              value={getDate(startDate)}
              placeholder="Select Start Date..."
              editable={false}
              inputStyles={{color:'black'}}
              placeholderTextColor="#000"
            />
          </TouchableOpacity>
          <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={startdatehandleConfirm}
          onCancel={() => setStartDatePickerVisibility(false)}
          />
          <TouchableOpacity onPress={showEndDatePicker}>
            <TextInput
              style={styles.textInput}
              value={getDate(endDate)}
              placeholder="Select End Date..."
              editable={false}
              placeholderTextColor="#000" 
            />
          </TouchableOpacity>
          
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={enddatehandleConfirm}
            onCancel={() => setEndDatePickerVisibility(false)}
          />
          <TouchableOpacity style={{backgroundColor:colors.uniBlue, borderRadius:8, height:35, width:35, justifyContent:'center', alignItems:'center'}} onPress={()=> filterMovement()}>
            <FontAwesome5 name='search' color="white" size={16} />
          </TouchableOpacity>
        
  </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? <ActivityIndicator /> :
            // console.log(movements);
            movements ? movements.map((item, i) => (
              <View key={i} style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={styles.bottomCardTop}>
                    <FontAwesome5 name='walking' size={24} color={colors.uniBlue} />
                    <Text style={styles.textStyle}>Ref No. {item['RequestNo']}</Text>
                  </View>
                  <View style={[styles.bottomCardTop, { width: '40%' }]}>
                    <FontAwesome5
                      name={
                        item['Status'] == "draft" ? "clock"
                          : item['Status'] == "Self Canceled" ? "exclamation-circle"
                            : item['Status'] == "Refused" ? "window-close"
                              : item['Status'] == "Ack" ? "check"
                                : item['Status'] == "check-out" ? "clock"
                                  : item['Status'] == "Check-in" ? "check"
                                    : null

                      } size={24} color={item['Status'] == 'draft' ? colors.uniBlue
                        : item['Status'] == 'Self Canceled' ? '#eed202'
                          : item['Status'] == 'Refused' ? 'red'
                            : item['Status'] == 'Ack' ? 'green'
                              : item['Status'] == "Check-in" ? "green"
                                : colors.uniBlue} />
                    <Text style={[styles.textStyle, {
                      fontWeight: '600', color: item['Status'] == 'draft' ? colors.uniBlue
                        : item['Status'] == 'Self Canceled' ? '#eed202'
                          : item['Status'] == 'Refused' ? 'red'
                            : item['Status'] == 'Ack' ? 'green'
                              : item['Status'] == "Check-in" ? "green"
                                : colors.uniBlue
                    }]}>

                      {item['Status'] == 'draft' ? 'Waiting'
                        : item['Status'] == 'Self Canceled' ? 'Self Canceled'
                          : item['Status'] == 'Refused' ? 'Refused'
                            : item['Status'] == 'Ack' && item['LocationType'] == "Outside Campus" ? 'Approved'
                              : item['Status'] == 'Ack' && item['LocationType'] == "Inside Campus" ? 'Inside Approved'
                                : item['Status'] == 'check-out' && item['LocationType'] == "Inside Campus" ? 'Checked Out'
                                  : item['Status'] == 'Check-in' && item['LocationType'] == "Inside Campus" ? 'Completed'
                                    : null}
                    </Text>
                  </View>

                </View>
                <View style={styles.transaction}>
                  <View style={{ width: '40%' }}>
                    <Text style={[styles.textSmall]}>Request Date/Time</Text>
                    <Text style={[styles.textStyle, styles.rowMiddle]}>{item['RequestTime'] && item['RequestTime'].split("T")[0].split("-").reverse().join("-")},{item['RequestTime'] && item['RequestTime'].substr(11, 5)}</Text>
                  </View>
                  <View style={{ width: '30%' }}>
                    <Text style={[styles.textSmall]}>Purpose</Text>
                    <Text style={styles.textStyle}>{item["Purpose"]}</Text>
                  </View>
                  <View style={{ width: '30%' }}>
                    <Text style={[styles.textSmall]}>Location</Text>
                    <Text style={styles.textStyle}>{item["LocationType"]}</Text>
                  </View>

                </View>
                <View style={styles.transaction}>
                  <View style={{ width: '40%' }}>
                    <Text style={styles.textSmall}>Requested Time</Text>
                    <Text style={[styles.textStyle]}>{item['CheckOut']}</Text>
                  </View>
                  <View style={{ width: '30%' }}>
                    <Text style={[styles.textSmall]}>Actual Out Time</Text>
                    <Text style={styles.textStyle}>{item["ActualExittime"] ? item["ActualExittime"].substr(11, 5) : 'N/A'}</Text>
                  </View>
                  <View style={{ width: '30%' }}>
                    <Text style={[styles.textSmall]}>Actual In Time</Text>
                    <Text style={styles.textStyle}>{item["CheckIn"] ? item["CheckIn"].substr(11, 5) : 'N/A'}</Text>
                  </View>
                </View>
                <View style={[styles.transaction]}>
                  <View style={{ width: '50%' }}>
                    <Text style={[styles.textSmall]}>Remarks</Text>
                    <Text style={[styles.textStyle]}>{item["Reason"]}</Text>
                  </View>
                  <View style={{ width: '30%' }}>
                    <Text style={[styles.textSmall]}>Supervisor</Text>
                    <Text style={[styles.textStyle]}>{item["Supervisor"]}</Text>
                  </View>
                </View>
                <View style={styles.transaction}>
                  {
                    item['Status'] == 'Check-in' && item['LocationType'] == "Inside Campus" ?
                      <View style={[styles.transaction]}>
                        <View style={{ justifyContent: 'center' }}>
                          <TouchableOpacity style={{ paddingHorizontal: 24, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}>
                            <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>{item['TimeCount'] ? item['TimeCount'] : 'N/A'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View> : null
                  }
                </View>
              </View>
            )
            ) : <Text style={{ fontSize: 14, fontWeight: '600', color: 'black', alignSelf: 'center' }}>No Records Found</Text>
          }
        </ScrollView>
        {/* <TouchableOpacity style={{position: 'absolute', backgroundColor:colors.uniBlue, borderRadius:30, height:50, width:50, bottom:30, right:30, justifyContent:'center', alignItems:'center'}}>
          <FontAwesome5 name='filter' color="white" size={20} />

        </TouchableOpacity> */}
      </View>
    </AlertNotificationRoot>
  )
}

export default MovementReports

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 5,
    paddingHorizontal:15,
    borderRadius: 10,
    color:'#000',
    height:38,
    backgroundColor:'white'
  },
  // Common CSS for every card 
  card: {
    backgroundColor: 'white',
    width: screenWidth - 24,
    marginVertical: 12,
    borderRadius: 16,
    alignSelf: 'center',
    padding: 16,
    elevation: 2
  },

  // CSS for images inside the cards
  topCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems:'center',
    paddingVertical: 12
  },
  textStyle: {
    color: '#1b1b1b',
    fontSize: 12,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  bottomCardTop: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomCardMiddle: {
    flexDirection: 'row',
    paddingVertical: 6,
    justifyContent: 'space-between'
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 10
  },

  //////////////// CSS of madal ////////////////
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: 'black',
    elevation: 2,
    alignItems: 'center',
    width: '80%',
    paddingTop: 48
  },
  modalBtn: {
    backgroundColor: colors.uniBlue,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8
  },
})