import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';
import colors from '../../colors';
import { Checkbox } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('screen')

const MarkLectureAttendance = ({ route }) => {
    const { lecture, selectedGroup, order, selectedDate } = route.params;
    // console.log("selectedDate::", selectedDate);

    const [student, setStudent] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState();
    const [checkboxStatesAll, setCheckboxStatesAll] = useState(false);

    const dateToSend = selectedDate
    // console.log("dateToSend::",dateToSend);


    const navigation = useNavigation()

    // console.log('inside attendance mark :::', lecture, selectedGroup, order);

    const studentsinLecture = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                setIsLoading(true)
                const students = await fetch(`${BASE_URL}/staff/lectureAttendance/${order}/${selectedGroup}/${lecture.CollegeID}/${lecture.CourseID}/${lecture.SemesterID}/${lecture.Batch}/${lecture.SubjectCode}/${lecture.Examination}/${lecture.Section}/${lecture.GroupName}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                })
                const studentDetails = await students.json()
                console.log('Class Data is ::::::', studentDetails);
                if (studentDetails['data'].length > 0) {
                    setStudent(studentDetails['data']);
                    setCheckboxStates(studentDetails['data'].map(() => ({ attendance: 'absent' })))
                }
                else {
                    errorModel(ALERT_TYPE.WARNING, "No Data Found", `No Time Table for You`)
                }
                setIsLoading(false)
            } catch (error) {
                console.log('studentsinLecture ::', error);
                errorModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `Please try again after sometime`)
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
                        commonData: lecture,
                        attendanceDate: dateToSend
                    }),
                })
                const DailyLecturesDataDetail = await dailyLectures.json()
                // console.log(DailyLecturesDataDetail);
                if (DailyLecturesDataDetail['flag'] == 1) {
                    errorModel(ALERT_TYPE.SUCCESS, "Done", "Attenedance Marked Successfully")
                } else {
                    errorModel(ALERT_TYPE.SUCCESS, "Done", "Please mark again")
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
            <View style={{ marginHorizontal: 4 }}>
                <ScrollView>
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
                    <View style={{ flexDirection: 'row', width: '96%', alignSelf: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <TouchableOpacity style={{ padding: Platform.OS == 'ios' ? 16 : 8, backgroundColor: colors.uniBlue, width: width / 3, alignItems: 'center', marginVertical: 16, borderRadius: 8, flexDirection: 'column', justifyContent: 'center' }} onPress={() => submitHandle()}>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }} >Submit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: Platform.OS == 'ios' ? 16 : 8, backgroundColor: colors.uniRed, width: width / 3, alignItems: 'center', marginVertical: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-around' }} onPress={() => handleAllCheckbox()}>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }} >Check All</Text>
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
                </ScrollView>
            </View>
        </AlertNotificationRoot>
    )
}

export default MarkLectureAttendance

