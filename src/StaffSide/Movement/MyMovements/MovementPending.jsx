import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Modal, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import colors from '../../../colors';
import MyModal from '../../components/MyModal';
const screenWidth = Dimensions.get('window').width;

const MovementPending = () => {
  const [isOutside, setIsOutside] = useState(false);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selfCancelId, setSelfCancelId] = useState('')


  const recordTime = () => {
    const currentTime = new Date().toTimeString().split(' ')[0];
    console.log(currentTime);
    setIsOutside(!isOutside)
  }

  const openModal = (movementId) => {
    setModalVisibility(true)
    setSelfCancelId(movementId)
  }
  const yesHandle = (id) => {
    setModalVisibility(false)
    selfCancelHandle(id)
    // Alert.alert("cool yes from parent")
  }
  const noHandle = () => {
    setModalVisibility(false)
    // Alert.alert("no from parent")
  }

  const selfCancelHandle = async (movemetnId) => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const selfCancel = await fetch(BASE_URL + `/staff/mymovementcencel/${movemetnId}`, {
          method: "post",
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const selfCancelData = await selfCancel.json();
        myMovements();
        console.log(selfCancelData);

      } catch (error) {
        console.log(" self cancel button error::");
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`);
      }

    }
  }

  const myMovements = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const movementDetails = await fetch(BASE_URL + `/staff/mymovement`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const movementDetailsData = await movementDetails.json();
        setMovements(movementDetailsData);
        // console.log('from api movement pending', movementDetailsData);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching movementPending Api ::', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
      }
    }
  }

  const sendCheckoutTime = async (movemetnId) => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const movementDetails = await fetch(BASE_URL + `/staff/checkout/${movemetnId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const movementDetailsData = await movementDetails.json()
        setMovements(movementDetailsData);        
        const requesterID = movementDetailsData['movementData'][0]['Supervisor']      
        notificationfunction(requesterID, '6');
        myMovements()
        // console.log('pending movements',movementDetailsData);
        setLoading(false)
      } catch (error) {
        console.log('Error fetching sendCheckoutTime request ::', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong in Checkout.`)
      }
    }
  }

  const sendCheckinTime = async (movemetnId, checkoutTime) => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const movementDetails = await fetch(BASE_URL + `/staff/checkin/${movemetnId}/${checkoutTime}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const movementDetailsData = await movementDetails.json()
        setMovements(movementDetailsData);
        const requesterID = movementDetailsData['movementData'][0]['Supervisor']      
        notificationfunction(requesterID, '5');
        myMovements()
        console.log('report of movements', movementDetailsData);
        setLoading(false)
      } catch (error) {
        console.log('Error fetching sendCheckinTime request ::', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong in checkIn.`)
        // setShowModal(true)
      }
    }
  }

  // ///////////////////////// Notification Function ///////////////////////////////////

  const notificationfunction = async (recipient, notificationId) => {
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
            screenPath: 'SupervisorMovements',
            notificationId: notificationId,
            pagePath: 'MyMovements.php'
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
  useEffect(() => {
    myMovements();
  }, [])
  const onRefresh = useCallback(() => {
    myMovements()
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
      <View>
        <MyModal content={'Are you sure to cancel ?'} yesHandle={yesHandle} visibility={modalVisibility} noHandle={noHandle} cardId={selfCancelId} />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? <ActivityIndicator /> :
            // console.log(movements);
            movements["data"] ? movements["data"].map((item, i) => (
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
                                    : item['Status'] == 'Check-in' && item['LocationType'] == "Outside Campus" ? 'Outside Approved'
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
                    <Text style={[styles.textSmall,{color : item.Comments && 'red'}]}>{item.Comments ? 'Rescheduled Time' : 'Requested Time'}</Text>
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
                    item['Status'] == 'Ack' && item['LocationType'] == "Inside Campus" ?
                      <View style={[styles.transaction, { marginTop: 16 }]}>
                        <View style={{ justifyContent: 'center' }}>
                          <TouchableOpacity style={{ paddingHorizontal: 24, paddingVertical: 8, backgroundColor: colors.uniRed, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                            onPress={() => sendCheckoutTime(item['RequestNo'])}
                          >
                            <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Checking Out</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      : item['Status'] == 'check-out' && item['LocationType'] == "Inside Campus" ?
                        <View style={[styles.transaction, { marginTop: 16 }]}>
                          <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity style={{ paddingHorizontal: 24, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                              onPress={() => sendCheckinTime(item['RequestNo'], item["ActualExittime"])}
                            >
                              <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Checking In</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        : item['Status'] == 'Check-in' && item['LocationType'] == "Inside Campus" ?
                          <View style={[styles.transaction]}>
                            <View style={{ justifyContent: 'center' }}>
                              <TouchableOpacity style={{ paddingHorizontal: 24, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}>
                                <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>{item['TimeCount'] ? item['TimeCount'] : 'N/A'}</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          : item['Status'] == 'draft' ?
                            <View style={[styles.transaction]}>
                              <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity style={{ paddingHorizontal: 24, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }} onPress={() => openModal(item["RequestNo"])} >
                                  <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Self Cancel</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            : null}
                </View>
                {
                  item.Comments && 
                    <View>
                      <Text style={{color:'red', fontSize:12}}>Comment: {item.Comments}</Text>

                    </View>
                }
              </View>
            )
            ) : <Text style={{ fontSize: 14, fontWeight: '600', color: 'black', alignSelf: 'center' }}>No Records Found</Text>
          }
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  )
}

export default MovementPending

const styles = StyleSheet.create({
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
    fontSize: 12
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