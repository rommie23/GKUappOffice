import { RefreshControl, Dimensions, ScrollView, StyleSheet, Text, Alert, View, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import colors from '../../colors';
import React, { useCallback, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const StaffTimeTable = () => {
    const [isloading, setIsLoading] = useState(false)
    const [lectures, setLectures] = useState([])
    const [specialLectures, setSpecialLectures] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation()

    const dailyLecturesData = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        try {
            setIsLoading(true)
            const dailyLectures = await fetch(BASE_URL + '/Staff/dailyTimeTable', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session}`
            }
            })
            const DailyLecturesDataDetail = await dailyLectures.json()
            // console.log(DailyLecturesDataDetail['data']);
            
            if (DailyLecturesDataDetail['data'].length > 0) {
                setLectures(DailyLecturesDataDetail['data']);
            }
            else{
                inModel(ALERT_TYPE.WARNING,"No Lecture", `No Regular Lecture for You`)
            }
            setIsLoading(false)
        } catch (error) {
            console.log('inout api error ::', error);
            errorModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `Please try again after sometime`)
        }
    }
    
    const adjustedLectures = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        try {
            setIsLoading(true)
            const res = await fetch(BASE_URL + '/Staff/adjustedLecturesList', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session}`
            }
            })
            const adjusted = await res.json()
            console.log('adjustedLectures Data is ::::::',adjusted['data']);
            if (adjusted.flag == 1) {
                setSpecialLectures(adjusted['data']);
            }
            setIsLoading(false)
        } catch (error) {
            console.log('inout api error ::', error);
            errorModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `Please try again after sometime`)
        }
    }

    useEffect(()=>{
        dailyLecturesData();
        adjustedLectures();
    },[])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dailyLecturesData()
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);

      const errorModel = (type, title, message)=> {
        Dialog.show({
            type: type ,
            title: title,
            textBody: message,
            button: 'close',
            onHide : ()=>navigation.goBack()
            })
      }
      const inModel = (type, title, message)=> {
        Dialog.show({
            type: type ,
            title: title,
            textBody: message,
            button: 'close',
            })
      }
  return (
        <AlertNotificationRoot>
        <ScrollView
          style={{ backgroundColor: '#f1f1f1'}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.cardOuter}>
          {
            isloading ? <ActivityIndicator/> : 
            lectures.map((lecture, index) => (
              <View key={index} style={styles.card}>
                <View style={{ rowGap: 4 }}>
                  <Text style={[styles.cardTxt, {color:colors.uniRed}]}>Lecture Number : {lecture["LectureNumber"]}</Text>
                  <Text style={styles.cardTxt}>Subect Name : {`${lecture["SubjectName"]} (${lecture["SubjectCode"]})`}</Text>
                  <Text style={styles.smallTxt}>Course : {lecture["Course"]}</Text>
                  <Text style={styles.smallTxt}>College : {lecture["CollegeName"]}</Text>
                  <Text style={styles.smallTxt}>{`Semester - ${lecture['SemesterID']} Batch: ${lecture['Batch']}`}</Text>
                </View>
              </View>
            ))
          } 
          </View>
          
          <Text style={styles.headerText}>Adjusted Lectures List</Text>
          <View style={styles.cardOuter}>
          {
            isloading ? <ActivityIndicator/> : 
            specialLectures.length > 0 ? specialLectures.map((lecture, index) => (
              <View key={index} style={styles.card}>
                {
                  lecture.AdjustmentType == 'Merge' ?
                  <View style={{ rowGap: 4 }}>
                    <Text style={[styles.cardTxt, {color:colors.uniRed}]}>Lecture Number : {lecture["OriginalLecture"]}</Text>
                    <Text style={styles.cardTxt}>Subect Name : {`${lecture["OriginalSubjectName"]} (${lecture["OriginalSubject"]})`}</Text>
                    <Text style={styles.smallTxt}>Course : {lecture["OriginalCourse"]}</Text>
                    <Text style={styles.smallTxt}>College : {lecture["CollegeName"]}</Text>
                    <Text style={styles.smallTxt}>{`Semester - ${lecture['OriginalSemester']} Batch: ${lecture['OriginalBatch']}`}</Text>
                  </View> :
                  <View style={{ rowGap: 4 }}>
                    <Text style={[styles.cardTxt, {color:colors.uniRed}]}>Lecture Number : {lecture["OriginalLecture"]}</Text>
                    <Text style={styles.cardTxt}>Subect Name : {`${lecture["OriginalSubjectName"]} (${lecture["OriginalSubject"]})`}</Text>
                    <Text style={styles.smallTxt}>Course : {lecture["OriginalCourse"]}</Text>
                    <Text style={styles.smallTxt}>College : {lecture["CollegeName"]}</Text>
                    <Text style={styles.smallTxt}>{`Semester - ${lecture['OriginalSemester']} Batch: ${lecture['OriginalBatch']}`}</Text>
                  </View>

                }
              </View>
            ))
            : <Text>No data Found</Text>
          } 
          </View>
        </ScrollView>
          <TouchableOpacity style={{backgroundColor:colors.uniBlue, width:'100%', paddingVertical:8, alignSelf:'flex-start', marginBottom:8, alignItems:'center'}} onPress={()=> navigation.navigate('AdjustmentRequests')}>
                <Text style={{color:'white', fontWeight:'600'}}>Lecture Adjustment Requests</Text>
            </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:colors.uniRed, width:'100%', paddingVertical:8, alignSelf:'flex-start', marginBottom:8, alignItems:'center'}} onPress={()=> navigation.navigate('StaffWeeklyTimeTable')}>
                <Text style={{color:'white', fontWeight:'600'}}>Weekly Time Table</Text>
            </TouchableOpacity>
        </AlertNotificationRoot>
  )
}

export default StaffTimeTable

const styles = StyleSheet.create({
  headerText: {
    color: colors.uniBlue,
    fontSize: 16,
    fontWeight:'600',
    alignSelf:'center',
    marginTop:12
  },
  cardOuter: {
    width:screenWidth,
    alignItems: 'center',
    padding: 8,

  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: "row",
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 8,
    borderRadius: 16,
    elevation: 1
  },
  cardTxt: {
    color: '#1b1b1b',
    fontSize: 16,
    fontWeight: '500'
  },
  smallTxt: {
    color: '#1b1b1b',
    fontSize: 14,
    fontWeight: '500'
  },
  textSmall:{
    color:'black',
    fontSize:12
  }
})