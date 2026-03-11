import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const StaffWeeklyTimeTable = () => {
    const navigation = useNavigation()
    const [accordionSelected, setaccordionSelected] = useState(null)
    const [days, setDays] = useState([])

    const [schedule, setSchedule] = useState([])
    const [isloading, setIsLoading] = useState(false)
    const [isloadingNew, setIsLoadingNew] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const workingDays = async()=>{
        const session = await EncryptedStorage.getItem("user_session")
        try {
            setIsLoading(true)
            const days = await fetch(BASE_URL + '/Staff/weekDays', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session}`
            }
            })
            const allDays = await days.json()
            // console.log('Days are ::::::',allDays);
            if (allDays['sortedData'].length > 0) {
                setDays(allDays['sortedData']);
            }
            else{
                newModel(ALERT_TYPE.WARNING,"No Data Found", `No Time Table for You`)
            }
            setIsLoading(false)
        } catch (error) {
            console.log('inout api error ::', error);
            newModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `Please try again after sometime`)
        }
    }

    const getSchedule = async(day)=>{
        const session = await EncryptedStorage.getItem("user_session")
        try {
            setIsLoadingNew(true)
            const scheduleData = await fetch(`${BASE_URL}/Staff/dayWiseTimeTable/${day}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session}`
            }
            })
            const scheduleDetail = await scheduleData.json()
            // console.log('Schedule is ::::::',scheduleDetail);
            if (scheduleDetail['data'].length > 0) {
                setSchedule(scheduleDetail['data']);
            }
            else{
                newModel(ALERT_TYPE.WARNING,"No Data Found", `No Time Table for You`)
            }
            setIsLoadingNew(false)
        } catch (error) {
            console.log('inout api error ::', error);
            newModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `Please try again after sometime`)
        }
    }
    


    useEffect(()=>{
        workingDays();
    },[])

    const toggle = (i) => {
        if (accordionSelected == i) {
          return setaccordionSelected(null)
        }
        setaccordionSelected(i)
      }

    const accordianClick = (i, day) => {
        getSchedule(day)
        toggle(i)
      }


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        workingDays()
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);
    
    const newModel = (type, title, message)=> {
        Dialog.show({
            type: type ,
            title: title,
            textBody: message,
            button: 'close',
            onHide : ()=>navigation.goBack()
        })
    }
  return (
    <AlertNotificationRoot>
      <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      >
        {isloading ? <ActivityIndicator/> : days.map((item, i) => (
          <View key={i} style={[styles.card]} >
            <TouchableOpacity style={styles.topCard} onPress={() => accordianClick(i, item['Day'])}>
              <Text style={[styles.textStyle]}>Schedule for : {item.Day}</Text>
              <TouchableOpacity style={styles.touchBtn} onPress={() => accordianClick(i, item['Day'])}>
                {
                  accordionSelected === i ?
                    (<Feather name='chevron-up' size={24} color={'#1b1b1b'} />) :
                    (<Feather name='chevron-down' size={24} color={'#1b1b1b'} />)
                }
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={{height:accordionSelected != i ? 0:null}}>

                      <>
                      {
                      accordionSelected == i && isloadingNew ? <ActivityIndicator/> :
                        schedule.map((lecture, i)=>(
                        <View key={i} style={{marginBottom:20}}>
                            <View style={{rowGap:6}}>
                                <Text style={styles.SubjectTxt}>Lecture Number : {lecture['LectureNumber']}</Text>
                                <Text style={styles.SubjectTxt}>Subject : {lecture['SubjectName']}</Text>
                            </View>
                            <View style={styles.subjectDetails}>
                                <View style={styles.SubjectTabs} >
                                    <Text style={styles.smallText}>SEM - {lecture['SemesterID']}</Text>
                                </View>
                                <View style={styles.SubjectTabs} >
                                    <Text style={styles.smallText}>{lecture['Course']}</Text>
                                </View>
                                {/* <View style={styles.SubjectTabs} >
                                <Text style={styles.smallText}>Code</Text>
                                </View> */}
                            </View>
                        </View>
                        ))
                      }
                      
                      </>
                    </View>

              </View>
        ))}

      </ScrollView>
    </AlertNotificationRoot>
  )
}

export default StaffWeeklyTimeTable

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    width: screenWidth - 24,
    marginVertical: 12,
    borderRadius: 16,
    alignSelf: 'center',
    padding: 16,
    overflow: 'hidden',
    elevation: 2
  },
  topCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomColor: 'lightgray',
    // borderBottomWidth: 0.5,
    paddingVertical: 6
  },
  textStyle: {
    color: '#1b1b1b',
  },
  notificationText: {
    color: 'gray'
  },
  SubjectView: {
    height:null,
    width: screenWidth - 32,
    paddingHorizontal: 16,
    alignSelf: 'center',
    paddingVertical:18,
    backgroundColor:'white'
  },
  SubjectTxt: {
    fontSize: 14,
    color: '#000'
  },
  smallText: {
    fontSize: 10,
    color: 'green'
  },
  subjectDetails: {
    flex: 1,
    flexDirection: 'row',
    columnGap:12
  },
  SubjectTabs: {
    backgroundColor: '#FFF7D4',
    padding: 8,
    marginTop: 16,
    borderRadius: 12,
  },
  centeredView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 12,
  },
})