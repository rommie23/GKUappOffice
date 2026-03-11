import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Modal, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL,IMAGE_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
import colors from '../../../colors';
import { images } from '../../../images';
const screenWidth = Dimensions.get('window').width;

const SupervisorMovementsPending = () => {
  // const [isOutside, setIsOutside] = useState(false);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const ImageUrl = `${IMAGE_URL}/Images/Staff/`;

  const navigation = useNavigation();

  const recordTime = ()=>{
    const currentTime = new Date().toTimeString().split(' ')[0];
    console.log(currentTime);
    setIsOutside(!isOutside)
  }

  const comingMovements = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const movementDetails = await fetch(BASE_URL + `/staff/authsidemovementpending`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const movementDetailsData = await movementDetails.json()
        setMovements(movementDetailsData);
        // console.log('from api supervisorMovement pending',movementDetailsData);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching supervisorMovement Pending Api ::', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
        // setShowModal(true)
      }
    }
  }
  useFocusEffect(useCallback(()=>{
    comingMovements();
  },[]))
  const onRefresh = useCallback(() => {
    comingMovements()
    setTimeout(() => {
        setRefreshing(false);
    }, 2000);
}, []);

////////////////////  accept the movement of underlings ///////////////////////////////////
const AcceptMovement = async (movementId) => {
  setLoading(true)
  const session = await EncryptedStorage.getItem("user_session")
  if (session != null) {
    try {
      const movementDetails = await fetch(BASE_URL + `/staff/authmovementApproved/${movementId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`
        }
      })
      const movementDetailsData = await movementDetails.json()
      setMovements(movementDetailsData);
      console.log('from api supervisorMovement pending',movementDetailsData);
      const requesterID = movementDetailsData['movementData'][0]['EmpID']
      console.log(requesterID);
      notificationfunction(requesterID, '1')
      comingMovements()
      setLoading(false);
    } catch (error) {
      console.log('Error fetching supervisorMovement Pending Api ::', error);
      setLoading(false)
      errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
      // setShowModal(true)
    }
  }
}

////////////////////  Reject the movement of underlings ///////////////////////////////////
const RejectMovement = async (movementId) => {
  setLoading(true)
  const session = await EncryptedStorage.getItem("user_session")
  if (session != null) {
    try {
      const movementDetails = await fetch(BASE_URL + `/staff/authmovementReject/${movementId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`
        }
      })
      const movementDetailsData = await movementDetails.json()
      setMovements(movementDetailsData);
      // console.log('from api supervisorMovement rejected',movementDetailsData);
      const requesterID = movementDetailsData['movementData'][0]['EmpID']      
      notificationfunction(requesterID, '2');
      comingMovements()
      setLoading(false);

    } catch (error) {
      console.log('Error fetching supervisorMovement Pending Api ::', error);
      setLoading(false)
      errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
      // setShowModal(true)
    }
  }
}

// ///////////////////////// Notification Function ///////////////////////////////////

  const notificationfunction =async(recipient, notificationId)=>{
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
              screenPath : 'MyMovements',
              notificationId: notificationId,
              pagePath: 'MyMovements.php'
            })
          })
          const response = await res.json()
          console.log(response);
          submitModel(ALERT_TYPE.SUCCESS,"Success", 'Updated Successfully')
        }
      } catch (error) {
        console.log("error in Notification::", error);
        
      }
    };

const errorModel = (type, title, message) => {
  Dialog.show({
    type: type,
    title: title,
    textBody: message,
    button: 'close',
    onHide: () => navigation.goBack()
  })
}
  const submitModel = (type, title, message)=> {
    Dialog.show({
        type: type ,
        title: title,
        textBody: message,
        button: 'close',
        })
}

  return (
    <AlertNotificationRoot>
      <View>
      <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
      >
        {/* each card which has data of movement */}
        {loading ? <ActivityIndicator/>
        :
          // console.log(movements);
          movements["data"] ? movements["data"].map((item, i)=>(
            <View key={i} style={styles.card}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                  <View style={styles.bottomCardTop}>
                    <Image source={{uri: ImageUrl + item["StaffImage"]}} style={{height:35, width:35, borderRadius:20}} alt="profile"/>
                    <View>
                      <Text style={styles.textStyle}>Name : {item["StaffName"].trim()}</Text>
                      <Text style={styles.textStyle}>Emp. ID : {item["EmpID"]}</Text>

                    </View>
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
                <View style={styles.topCard}>
                  
                  <View style={{width:'30%'}}>
                    <Text style={[styles.textSmall]}>Request Date/Time</Text>
                    <Text style={[styles.textStyle, styles.rowMiddle]}>{item['RequestTime'].split("T")[0].split("-").reverse().join("-")},{item['RequestTime'].substr(11,5)}</Text>
                  </View>
                  <View style={{width:'30%'}}>
                      <Text style={[styles.textSmall]}>Purpose</Text>
                      <Text style={styles.textStyle}>{item["Purpose"]}</Text>
                    </View>
                    <View style={{width:'30%', marginBottom:8}}>
                      <Text style={[styles.textSmall]}>Location</Text>
                      <Text style={styles.textStyle}>{item["LocationType"]}</Text>
                    </View>

                </View>
                <View style={styles.transaction}>
                  <View style={{width:'30%'}} >
                      <Text style={styles.textSmall}>Requested Time</Text>
                      <Text style={[styles.textStyle]}>{item['CheckOut']}</Text>
                    </View>
                    <View style={{width:'30%'}}>
                      <Text style={[styles.textSmall]}>Actual Out Time</Text>
                      <Text style={[styles.textStyle]}>{item["ActualExittime"] ? item["ActualExittime"].substr(11,5) : 'N/A'}</Text>
                    </View>
                    <View style={{width:'30%'}}>
                      <Text style={[styles.textSmall]}>Actual In Time</Text>
                      <Text style={[styles.textStyle]}>{item["CheckIn"] ? item["CheckIn"].substr(11,5) : 'N/A'}</Text>
                    </View>                  
                </View>
                <View style={[styles.transaction, {marginTop:4}]}>
                  <View style={{width:'30%'}} >
                    <Text style={styles.textSmall}>Remarks</Text>
                    <Text style={[styles.textStyle]}>{item['Reason']}</Text>
                  </View>                 
                </View>
                <View style={[styles.transaction, {borderTopWidth:0.5, marginTop:8, paddingTop:8, justifyContent:"space-around"}]}>
                  <TouchableOpacity style={{paddingHorizontal:24, paddingVertical:8, backgroundColor: colors.uniRed, alignItems:'center', alignSelf:'center', borderRadius:6}}
                  onPress={()=> RejectMovement(item["RequestNo"])}>
                    <Text style={[styles.textStyle, {color:'white', fontWeight:'600'}]}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{paddingHorizontal:24, paddingVertical:8, backgroundColor: colors.uniRed, alignItems:'center', alignSelf:'center', borderRadius:6}}
                  onPress={()=> navigation.navigate('RescheduleMovement', {data1:item})}>
                    <Text style={[styles.textStyle, {color:'white', fontWeight:'600'}]}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{paddingHorizontal:24, paddingVertical:8, backgroundColor: colors.uniBlue, alignItems:'center', alignSelf:'center', borderRadius:6}}
                  onPress={()=> AcceptMovement(item["RequestNo"])}>
                    <Text style={[styles.textStyle, {color:'white', fontWeight:'600'}]}>Accept</Text>
                  </TouchableOpacity>
                </View>

            </View> 
          ) 
          ): <Text style={{fontSize:14, fontWeight:'600', color:'black', alignSelf:'center' }}>{movements['Message']}</Text>
          
        }
      </ScrollView>
    </View>
  </AlertNotificationRoot>
  )
}

export default SupervisorMovementsPending

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
    justifyContent: 'space-between'
  },
  bottomCardTop: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
    justifyContent:'center'
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 10
  },

  //////////////// CSS of madal ////////////////
  centeredView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  modalView:{
    backgroundColor:'white',
    padding:20,
    borderRadius:20,
    shadowColor:'black',
    elevation:2,
    alignItems:'center',
    width:'80%',
    paddingTop:48
  },
  modalBtn:{
    backgroundColor:colors.uniBlue,
    alignItems:'center',
    paddingHorizontal:16,
    paddingVertical:8,
    marginVertical:8
  },
})