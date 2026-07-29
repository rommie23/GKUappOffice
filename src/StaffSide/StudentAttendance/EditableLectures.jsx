import { RefreshControl, Dimensions, ScrollView, StyleSheet, Text, Alert, View, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import colors from '../../colors';
import React, { useCallback, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const EditableLectures = () => {
  const [isloading, setIsLoading] = useState(false)
  const [lectures, setLectures] = useState([])
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [order, setOrder] = useState('')
  const [refreshing, setRefreshing] = useState(false);
  const [datePickerVisibility, setDatePickerVisibility] = useState(false);
  const todayDate = new Date()
  const [startDate, setStartDate] = useState(todayDate);
  const [adjustmentLectures, setAdjustmentLectures] = useState([]);
  // const [attendance, setAttendance] = useState([])

  const navigation = useNavigation()
  // ///////////////////////////// Groups come from api ////////////////////////////////// //


  const dailyLecturesData = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        setIsLoading(true)
        const dailyLectures = await fetch(`${BASE_URL}/Staff/updateLecturesList`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const DailyLecturesDataDetail = await dailyLectures.json()
        console.log('Lecture Data is:::', DailyLecturesDataDetail)
        if (DailyLecturesDataDetail.flag === 1) {
          setLectures(DailyLecturesDataDetail['regularLectures'])
          setAdjustmentLectures(DailyLecturesDataDetail['adjustmentLectures'])
        }
        setIsLoading(false)
      } catch (error) {
        console.log('Mark Attenadance api error ::', error);
        errorModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `Please try again after sometime`)
      }
    }
  }


  const lectureClick = (lecture) => {
    // console.log("each lecture data is",lecture);
    navigation.navigate('UpdateLectureAttendance', { lecture: lecture, selectedGroup: selectedGroup, order: order, selectedDate: startDate.toISOString() })
  }


  useFocusEffect(useCallback(() => {
    setLectures([]);
    dailyLecturesData();
  }, []))

  const handleClick = () => {
    setLectures([]);
    dailyLecturesData();
  }


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dailyLecturesData()
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
    })
  }

  // console.log("startDate ::", startDate);
  // console.log("defauDate ::", todayDate);

  return (
    <AlertNotificationRoot>
      <ScrollView
        style={{ backgroundColor: '#f1f1f1' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.cardOuter}>
          {
            isloading ? <ActivityIndicator /> :
              lectures.length > 0 ? lectures.map((lecture, index) => {
                return (
                  <TouchableOpacity key={index} style={styles.card} onPress={() => { lectureClick(lecture) }}>
                    <View style={{ rowGap: 4 }}>
                      <Text style={[styles.cardTxt, { color: colors.uniRed }]}>Lecture Number : {lecture["LectureNumber"]}</Text>
                      <Text style={styles.cardTxt}>Subect Name : {`${lecture["SubjectName"]} (${lecture["SubjectCode"]})`}</Text>
                      <Text style={styles.smallTxt}>Course : {lecture["Course"]}</Text>
                      {/* <Text style={styles.smallTxt}>College : {lecture["CollegeName"]}</Text> */}
                      <Text style={styles.smallTxt}>{`Semester - ${lecture['SemesterID']} Batch : ${lecture['Batch']}`}</Text>
                      <Text style={styles.smallTxt}>{`Date of Lecture - ${lecture['DateOfLecture'].split("T")[0].split('-').reverse().join('-')}`}</Text>

                      <View style={{ backgroundColor: lecture.AttendanceTaken == 1 ? colors.uniBlue : colors.uniRed, padding: 8, width: screenWidth * 0.7 }}>
                        <Text style={[styles.smallTxt, { color: 'white' }]}>Attendance Status : {lecture.AttendanceTaken == 1 ? 'Marked' : 'Not Marked'}</Text>

                      </View>
                    </View>
                  </TouchableOpacity>)
              }) :
                <Text style={{ color: 'black', fontSize: 14, fontWeight: '600' }}>No Regular Lectures for Update</Text>
          }
        </View>
        <View>
          <Text style={styles.headerText}>Adjusted Lectures</Text>
        </View>
        <View style={styles.cardOuter}>
          {
            isloading ? <ActivityIndicator /> :
              adjustmentLectures.length > 0 ? adjustmentLectures.map((lecture, index) => {
                return (
                  <TouchableOpacity key={index} style={styles.card} onPress={() => { lectureClick(lecture) }}>
                    <View style={{ rowGap: 4 }}>
                      <Text style={[styles.cardTxt, { color: colors.uniRed }]}>Lecture Number : {lecture["OriginalLecture"]}</Text>
                      <Text style={styles.cardTxt}>Subect Name : {`${lecture["OriginalSubjectName"]} (${lecture["OriginalSubject"]})`}</Text>
                      <Text style={styles.smallTxt}>Course : {lecture["OriginalCourse"]}</Text>
                      {/* <Text style={styles.smallTxt}>College : {lecture["CollegeName"]}</Text> */}
                      <Text style={styles.smallTxt}>{`Semester - ${lecture['OriginalSemester']} Batch : ${lecture['Batch']}`}</Text>
                      <Text style={styles.smallTxt}>{`Date of Lecture - ${lecture['DateOfLecture'].split("T")[0].split('-').reverse().join('-')}`}</Text>

                      <View style={{ backgroundColor: lecture.AttendanceTaken == 1 ? colors.uniBlue : colors.uniRed, padding: 8, width: screenWidth * 0.7 }}>
                        <Text style={[styles.smallTxt, { color: 'white' }]}>Attendance Status : {lecture.AttendanceTaken == 1 ? 'Marked' : 'Not Marked'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>)
              }) :
                <Text style={{ color: 'black', fontSize: 14, fontWeight: '600' }}>No Adjustment or Merge Lectures for Update</Text>
          }
        </View>
      </ScrollView>
    </AlertNotificationRoot>
  )
}

export default EditableLectures

const styles = StyleSheet.create({
  formContainer: {
    padding: 8,
    width: screenWidth,
    elevation: 2,
  },
  formSelectors: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 4,
    backgroundColor: 'white',
    elevation: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    flexWrap: 'wrap'
  },
  cardOuter: {
    width: screenWidth,
    alignItems: 'center',
    padding: 8,

  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: "row",
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
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
  textSmall: {
    color: 'black',
    fontSize: 12
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 5,
    padding: 10,
    borderRadius: 10,
    color: '#000'
  },
  headerText: {
    color: colors.uniBlue,
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 12
  },

  filterCard: {
    backgroundColor: "#FFF",
    margin: 10,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  half: {
    width: "48%",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },

  selectBox: {
    minHeight: 42,
    borderRadius: 8,
    borderColor: "#DDD",
    paddingHorizontal: 8,
  },

  selectInput: {
    color: "#222",
    fontSize: 14,
  },

  dropdownText: {
    color: "#222",
    fontSize: 14,
  },

  dateInput: {
    height: 42,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#222",
    backgroundColor: "#FFF",
  },

  searchBtn: {
    marginTop: 12,
    height: 42,
    backgroundColor: "#223260",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: '45%'
  },

  searchText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
})