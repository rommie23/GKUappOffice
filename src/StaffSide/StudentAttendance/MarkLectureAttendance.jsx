import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';
import colors from '../../colors';
import { Checkbox } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';

const { width, height } = Dimensions.get('screen')

const MarkLectureAttendance = ({ route }) => {
  const { lecture, selectedGroup, order, selectedDate } = route.params;

  const [student, setStudent] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState();
  const [checkboxStatesAll, setCheckboxStatesAll] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const attendanceDate = moment(selectedDate).format("YYYY-MM-DD");
  // console.log("dateToSend::",attendanceDate);
  console.log({lecture});
  


  const navigation = useNavigation()
  const lectureData = {
    ...lecture,

    CollegeID: lecture.CollegeID ?? lecture.OriginalCollegeID,
    CourseID: lecture.CourseID ?? lecture.OriginalCourseID,
    SemesterID: lecture.SemesterID ?? lecture.OriginalSemester,
    Batch: lecture.Batch ?? lecture.OriginalBatch,
    SubjectCode: lecture.SubjectCode ?? lecture.OriginalSubject,
    Section: lecture.Section ?? lecture.OriginalSection,
    GroupName: lecture.GroupName ?? lecture.OriginalGroupName,
    LectureNumber: lecture.LectureNumber ?? lecture.OriginalLecture,
  };
  const studentsinLecture = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        setIsLoading(true)
        const students = await fetch(`${BASE_URL}/staff/lectureAttendance`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order: order,
            sGroup: selectedGroup,
            attendanceDate: attendanceDate,
            collegeId: lectureData.CollegeID,
            courseId: lectureData.CourseID,
            semId: lectureData.SemesterID,
            batch: lectureData.Batch,
            subjectCode: lectureData.SubjectCode,
            examination: lectureData.Examination,
            section: lectureData.Section,
            cGroup: lectureData.GroupName,
            LectureNumber: lectureData.LectureNumber
          })
        })
        const studentDetails = await students.json()
        // console.log('Class Data is ::::::', studentDetails);
        if (studentDetails.flag == 1) {
          setStudent(studentDetails['data']);
          setCheckboxStates(studentDetails['data'].map((attendance) => ({ attendance: attendance.AttendanceStatus == '1' ? 'present' : 'absent' })))
        }
        else {
          errorModel(ALERT_TYPE.WARNING, "No Data Found", studentDetails.message)
        }
        setIsLoading(false)
      } catch (error) {
        console.log('studentsinLecture ::', error);
        errorModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `!!!!Please try again after sometime`)
      }
    }
  }

  const submitAttendance = async (arrToSend) => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        setIsLoading(true)
        const dailyLectures = await fetch(BASE_URL + '/Staff/submitAttendance', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            attendanceData: arrToSend,
            commonData: lectureData,
            attendanceDate: attendanceDate
          }),
        })
        const DailyLecturesDataDetail = await dailyLectures.json()
        // console.log(DailyLecturesDataDetail);
        if (DailyLecturesDataDetail['flag'] == 1) {
          errorModel(ALERT_TYPE.SUCCESS, "Done", DailyLecturesDataDetail.message)
        } else {
          errorModel(ALERT_TYPE.INFO, "Failed", DailyLecturesDataDetail.message)
        }
      }

      catch (error) {
        console.log('Mark Attenadance Lecture api error ::', error);
        errorModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `Please try again after sometime`)
      }
    }
  }

  useEffect(() => {
    studentsinLecture()
  }, [])

  // Function to handle checkbox toggle
  const handleCheckboxChange = (index) => {
    setCheckboxStates((prevState) =>
      prevState.map((item, i) =>
        i === index
          ? { ...item, attendance: item.attendance === 'present' ? 'absent' : 'present' }
          : item
      )
    )
    setCheckboxStatesAll(false)
  };
  // console.log(checkboxStates);
  const handleAllCheckbox = () => {
    setCheckboxStatesAll(!checkboxStatesAll)
    if (checkboxStatesAll) {
      setCheckboxStates(student.map(() => ({ attendance: 'absent' })))
    } else {
      setCheckboxStates(student.map(() => ({ attendance: 'present' })))
    }
  }

  const submitHandle = async () => {
    const arrToSend = [];
    for (let j = 0; j < student.length; j++) {
      student[j]['attendance'] = checkboxStates[j]['attendance']
      arrToSend.push({ IDNo: student[j]['IDNo'], Attendance: `${student[j]['attendance'] == 'present' ? 1 : 0}` })
    }
    console.log(arrToSend);
    submitAttendance(arrToSend)
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
    <AlertNotificationRoot>
      <View style={{ marginHorizontal: 4, marginBottom:8 }}>
        <Text style={{ color: '#555', fontSize: 13, margin:8 }}>
          🟥 Absent Student &nbsp;&nbsp; 🟩 Present Student
        </Text>
        {
          isloading && <ActivityIndicator/>
        }
        <ScrollView
        contentContainerStyle={{paddingBottom : 32}}>
          <View style={{ rowGap: 8, marginTop: 16 }}>
            {
              !isloading ?
                student.map((student, i) => (
                  <TouchableOpacity key={i} style={{ flexDirection: 'row', width: '96%', alignSelf: 'center', backgroundColor: checkboxStates[i].attendance === 'present' ? '#BDE7BD' : '#FFB6B3', elevation: 1, padding: 16, borderRadius: 16, alignItems: 'center' }} onPress={() => handleCheckboxChange(i)}>

                    <View style={{ width: '88%' }}>
                      <Text style={{ fontSize: 14, color: 'black' }}>Name: <Text style={{ fontSize: 14, color: 'black', fontWeight: 600 }}>{student['StudentName']}</Text></Text>
                      <Text style={{ fontSize: 14, color: 'black' }}>Roll No:
                        <Text style={{ fontSize: 14, color: 'black', fontWeight: 600 }}>
                          {
                            ` ${order === 'ClassRollNo' ?
                              student['ClassRollNo']
                              : order === 'UniRollNo' ?
                                student['UniRollNo']
                                : null}`
                          }
                        </Text>
                      </Text>
                      {/* <Text style={{fontSize:12, color:'black'}}>{`Subject: ${lecture["SubjectName"]}(${lecture["SubjectCode"]})`}</Text> */}
                    </View>
                    <View style={{ width: '12%', paddingVertical: 8, paddingHorizontal: 2 }}>
                      <Checkbox
                        status={checkboxStates[i].attendance === 'present' ? 'checked' : 'unchecked'}
                        onPress={() => handleCheckboxChange(i)}
                      />
                    </View>
                  </TouchableOpacity>
                )) :
                null
            }
          </View>
          {
            lecture.AttendanceTaken != 1 &&
            <View style={{ flexDirection: 'row', width: '96%', alignSelf: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity style={{ padding: Platform.OS == 'ios' ? 16 : 8, backgroundColor: colors.uniBlue, width: width / 3, alignItems: 'center', marginTop: 16, borderRadius: 8, flexDirection: 'column', justifyContent: 'center' }} onPress={() => setShowConfirm(true)}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }} >Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ padding: Platform.OS == 'ios' ? 16 : 8, backgroundColor: `${checkboxStatesAll ? colors.uniRed : colors.uniBlue}`, width: width / 3, alignItems: 'center', marginTop: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-around' }} onPress={() => handleAllCheckbox()}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }} >{checkboxStatesAll ? 'Absent All' : 'Present All'}</Text>
                {
                  Platform.OS == 'android' ?
                    <Checkbox
                      status={checkboxStatesAll ? 'checked' : 'unchecked'}
                      color='white'
                      onPress={() => handleAllCheckbox()}
                    /> :
                    null
                }
              </TouchableOpacity>
            </View>
          }
        </ScrollView>
      </View>
      <ConfirmationDialog
  visible={showConfirm}
  onCancel={() => setShowConfirm(false)}
  onConfirm={() => {
    setShowConfirm(false);
    submitHandle();
  }}
/>
    </AlertNotificationRoot>
  )
}


const ConfirmationDialog = ({ visible, onCancel, onConfirm }) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            Confirmation
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: '#555',
              marginBottom: 20,
            }}
          >
            Are you sure you want to submit?
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              style={{ marginRight: 20 }}
            >
              <Text style={{ color: 'red', fontWeight: '600' }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm}>
              <Text
                style={{
                  color: colors.uniBlue,
                  fontWeight: '600',
                }}
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MarkLectureAttendance

