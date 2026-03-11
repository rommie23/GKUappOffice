import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Modal, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL, IMAGE_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
import colors from '../../../colors';
import { images } from '../../../images';
const screenWidth = Dimensions.get('window').width;

const SupervisorMovementGranted = () => {
  // const [isOutside, setIsOutside] = useState(false);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const ImageUrl = `${IMAGE_URL}/Images/Staff/`;
  const ImageExtensions = ".JPG";

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
        const movementDetails = await fetch(BASE_URL + `/staff/authsidemovementgranted`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const movementDetailsData = await movementDetails.json()
        setMovements(movementDetailsData);
        // console.log('from api supervisorMovement granted',movementDetailsData);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching supervisorMovement granted Api ::', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
        // setShowModal(true)
      }
    }
  }
  useEffect(()=>{
    comingMovements();
  },[])
  const onRefresh = useCallback(() => {
    comingMovements()
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
      <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
      >
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

            </View> 
          ) 
          ): <Text style={{fontSize:14, fontWeight:'600', color:'black', alignSelf:'center' }}>{movements['Message']}</Text>
          
        }
      </ScrollView>
    </View>
  </AlertNotificationRoot>
  )
}

export default SupervisorMovementGranted

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