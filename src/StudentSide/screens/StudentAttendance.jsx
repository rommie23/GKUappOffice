// import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, TouchableHighlight, ActivityIndicator, Modal } from 'react-native'
// import { ScrollView } from 'react-native-gesture-handler';
// import React, { useCallback, useContext, useEffect, useState } from 'react'
// import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
// import {BASE_URL} from '@env'
// import EncryptedStorage from 'react-native-encrypted-storage';
// import { useNavigation } from '@react-navigation/native';
// import colors from '../../colors';
// import { ProgressCircle } from 'react-native-progress-circle'

// const screenHeight = Dimensions.get('window').height;
// const screenWidth = Dimensions.get('window').width;

// let attended = 75;
// let delivered = 77;
// const percentage = Math.round((attended / delivered) * 100)
// let percentage2 = 60
// const StudentAttendance = () => {
//   const [allSubjects, setAllSubjects] = useState([])
//   const [isloadingNew, setIsLoadingNew] = useState(false)
//   const [refreshing, setRefreshing] = useState(false);

//   const navigation = useNavigation()
//   // get all the subjects form the backend
//   const getSubjects = async () => {
//     setIsLoadingNew(true)
//     const session = await EncryptedStorage.getItem("user_session")
//     if (session != null) {
//       try {
//         const subjects = await fetch(BASE_URL + '/Student/allAttendance/', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${session}`
//           }
//         })
//         const subjectsData = await subjects.json()
//         console.log('total sem data ::',subjectsData['data1']);
//         if (subjectsData['data1'].length == 0) {
//           newModel(ALERT_TYPE.WARNING, "No Data Found", "Please check examform status");
//           setIsLoadingNew(false)
//         }else{
//           setAllSubjects(subjectsData['data1']);
//           setIsLoadingNew(false)
//         }

//       } catch (error) {
//         newModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!");
//         setIsLoadingNew(false)
//         console.log('Error fetching Guri data:AllsubjectsSemwise:', error);
//       }
//     }
//   }
//   useEffect(() => {
//     getSubjects()
//   }, [])
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     getSemesters()
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 2000);
//   }, []);
//   const newModel = (type, title, message) => {
//     Dialog.show({
//       type: type,
//       title: title,
//       textBody: message,
//       button: 'close',
//       onHide: () => navigation.goBack()
//     })
//   }
//   return (
//     <AlertNotificationRoot>
//     <View>
//       { isloadingNew ? <ActivityIndicator/>: 
//       <ScrollView>
//         {
//           allSubjects && allSubjects.map((item,i)=>(
//             <View key={i} style={styles.card}>
//               <View style={styles.topCard}>
//                 <Text style={[styles.textStyle]}>{`${item['SubjectName']} (${item['SubjectCode']})`}</Text>
//               </View>
//                 <View style={styles.bottomCardTop}>
//                   <Text style={styles.textSmall}>Faculty Name</Text>
//                   <Text style={styles.textStyle}>{item['Name']}</Text>
//                 </View>
//                 <View style={styles.bottomCardBottom}>
//                   <View style={styles.bottomCardBottomLeft}>
//                     <View style={styles.bottomCardTop}>
//                       <Text style={styles.textSmall}>Semester</Text>
//                       <Text style={styles.textStyle}>{item['SemesterId']}</Text>
//                     </View>
//                     <View style={styles.transaction}>
//                       <Text style={[styles.textSmall, styles.textStyle]}>Attended/Delivered</Text>
//                       <Text style={styles.textStyle}>{attended}/{delivered}</Text>
//                     </View>
//                   </View>
//                   <View style={styles.percentageIcon}>
//                     <ProgressCircle
//                       percent={percentage}
//                       radius={25}
//                       borderWidth={6}
//                       color={percentage >= 75 ? "green" : percentage < 75 && percentage >= 50 ? "yellow" : 'red'}
//                       shadowColor="#999"
//                       bgColor="#fff"
//                     >
//                       <Text style={{ fontSize: 14, color: 'black' }}>{percentage}%</Text>
//                     </ProgressCircle>
//                   </View>

//                 </View>
//             </View>
//           ))
//         }
//         <View>

//         </View>

//       </ScrollView>
//       }

//     </View>
//     </AlertNotificationRoot>
//   )
// }
// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: 'white',
//     width: screenWidth - 24,
//     marginVertical: 12,
//     borderRadius: 16,
//     alignSelf: 'center',
//     paddingHorizontal: 16
//   },
//   topCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomColor: 'lightgray',
//     borderBottomWidth: 0.5,
//     paddingVertical: 12
//   },
//   textStyle: {
//     color: '#1b1b1b',
//     fontSize: 15,
//     fontWeight: '500'
//   },
//   transaction: {
//     marginBottom: 16,
//     borderBottomColor: 'lightgray',
//   },
//   bottomCardTop: {
//     flexDirection: 'row',
//     columnGap: 16,
//     alignItems: 'center',
//     paddingBottom:8
//   },
//   bottomCardMiddle: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     justifyContent: 'space-between'
//   },
//   textSmall: {
//     color: '#4C4E52',
//     fontSize: 10
//   },
//   rowMiddle: {
//     width: '60%'
//   },
//   bottomCardBottom: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between'
//   },
//   bottomCardBottomLeft: {
//     width: '85%'
//   },
//   percentageIcon: {
//     width: '15%',
//     elevation: 1,
//   },
//   percentageText: {
//     color: colors.uniBlue,
//     alignSelf: 'center'
//   }
// })

// export default StudentAttendance

/////////////// PROGRESS CIRCLE LIBRARY CAUSE ISSUE /////////////

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const StudentAttendance = () => {
  return (
    <View>
      <Text>StudentAttendance</Text>
    </View>
  )
}

export default StudentAttendance

const styles = StyleSheet.create({})