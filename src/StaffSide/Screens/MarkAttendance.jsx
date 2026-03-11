import { RefreshControl, Dimensions, ScrollView, StyleSheet, Text, Alert, View, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import colors from '../../colors';
import React, { useCallback, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const MarkAttendance = () => {
    const [isloading, setIsLoading] = useState(false)
    const [lectures, setLectures] = useState([])
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState('')
    const [order, setOrder] = useState('')
    const [refreshing, setRefreshing] = useState(false);
    const [datePickerVisibility, setDatePickerVisibility] = useState(false);
    const todayDate = new Date()
    const [startDate, setStartDate] = useState(todayDate);
    const [attendance, setAttendance] = useState([])

    const navigation = useNavigation()
    // ///////////////////////////// Groups come from api ////////////////////////////////// //
    const getGroup = async () => {
        setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const group = await fetch(`${BASE_URL}/staff/courseGroups`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    },
                })
                const groupDetails = await group.json()
                // console.log('data from api examGroup :::',examGroupDetails['data'])
                let groupArray = groupDetails['data'].map((item, i) => {
                    return { key: item['Sgroup'], value: item['Sgroup'] }
                })
                setGroups(groupArray)
                setIsLoading(false)
            } catch (error) {
                console.log('Error fetching form data:examForm:', error)
                setIsLoading(false)
                errorModel(ALERT_TYPE.WARNING, "Oops!!!", `Something went wrong !!`)
                // setShowModal2(true)
            }
        }
    }

    const dailyLecturesData = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                setIsLoading(true)
                const dailyLectures = await fetch(`${BASE_URL}/Staff/dailyAttendance/${startDate}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                })
                const DailyLecturesDataDetail = await dailyLectures.json()
                console.log('Lecture Data is ::::::', DailyLecturesDataDetail['data']);
                if (DailyLecturesDataDetail['data'].length > 0) {
                    setLectures(DailyLecturesDataDetail['data']);
                    const markedLectures = await fetch(`${BASE_URL}/Staff/checkAttendance/${startDate}`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${session}`
                        }
                    })
                    const markedLecturesData = await markedLectures.json();
                    console.log("markedLecturesData:::", markedLecturesData);
                    setAttendance(markedLecturesData['data'])
                }
                else {
                    errorModel(ALERT_TYPE.WARNING, "No Data Found", `No Time Table for You`)
                }
                setIsLoading(false)
            } catch (error) {
                console.log('Mark Attenadance api error ::', error);
                errorModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `Please try again after sometime`)
            }
        }
    }

    const getDate = (date) => {
        if (!date) return '';
        let tempDate = date.toString().split(' ');
        return `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`;
    };

    const startdatehandleConfirm = (date) => {
        setStartDate(date);
        setDatePickerVisibility(false);
    };

    const lectureClick = (lecture) => {
        // console.log("each lecture data is",lecture);
        navigation.navigate('MarkLectureAttendance', { lecture: lecture, selectedGroup: selectedGroup, order: order, selectedDate: startDate.toISOString() })
    }
    useEffect(() => {
        getGroup();
        dailyLecturesData();
    }, [startDate])

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
            onHide: () => navigation.goBack()
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
                <View style={styles.formContainer}>
                    <View style={styles.formSelectors}>

                        <View style={{ alignSelf: 'flex-start' }}>
                            <Text style={[styles.label]}>Select Group</Text>
                            <SelectList boxStyles={{ padding: 10, width: 200, overflow: 'hidden' }}
                                setSelected={(val) => setSelectedGroup(val)}
                                fontFamily='time'
                                data={groups}
                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                search={false}
                                defaultOption={{ key: 'NA', value: 'NA' }}
                                inputStyles={{ color: 'black' }}
                                dropdownTextStyles={{ color: 'black', width: 155 }}
                            />
                        </View>
                        <View style={{ alignSelf: 'flex-start' }}>
                            <Text style={styles.label}>OrderBy</Text>
                            <SelectList boxStyles={{ width: 150 }}
                                setSelected={(val) => setOrder(val)}
                                fontFamily='time'
                                data={
                                    [
                                        { key: 'UniRollNo', value: 'UniRollNo' },
                                        { key: 'ClassRollNo', value: 'ClassRollNo' }
                                    ]
                                }
                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                search={false}
                                defaultOption={{ key: 'ClassRollNo', value: 'ClassRollNo' }}
                                inputStyles={{ color: 'black' }}
                                dropdownTextStyles={{ color: 'black' }}
                            />
                        </View>
                        <View style={{ backgroundColor: 'white', marginTop: 26 }}>
                            <Text>Select Date</Text>
                            <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                                <View pointerEvents="none">
                                    <TextInput
                                        style={styles.textInput}
                                        value={getDate(startDate)}
                                        placeholder="Date..."
                                        editable={false}
                                        inputStyles={{ color: 'black' }}
                                        placeholderTextColor="#000"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            isVisible={datePickerVisibility}
                            mode="date"
                            onConfirm={startdatehandleConfirm}
                            onCancel={() => setDatePickerVisibility(false)}
                            maximumDate={moment().toDate()}
                        />
                    </View>

                </View>
                <View style={styles.cardOuter}>
                    {
                        isloading ? <ActivityIndicator /> :
                            lectures.map((lecture, index) => {
                                const isAttendanceMarked = attendance.some(
                                    (record) =>
                                        record.LectureNumber == lecture.LectureNumber
                                );
                                return (
                                    <TouchableOpacity key={index} style={styles.card} onPress={() => { lectureClick(lecture) }}>
                                        <View style={{ rowGap: 4 }}>
                                            <Text style={[styles.cardTxt, { color: colors.uniRed }]}>Lecture Number : {lecture["LectureNumber"]}</Text>
                                            <Text style={styles.cardTxt}>Subect Name : {`${lecture["SubjectName"]} (${lecture["SubjectCode"]})`}</Text>
                                            <Text style={styles.smallTxt}>Course : {lecture["Course"]}</Text>
                                            {/* <Text style={styles.smallTxt}>College : {lecture["CollegeName"]}</Text> */}
                                            <Text style={styles.smallTxt}>{`Semester - ${lecture['SemesterID']} Batch : ${lecture['Batch']}`}</Text>

                                            <View style={{ backgroundColor: isAttendanceMarked ? colors.uniBlue : colors.uniRed, padding: 8 }}>
                                                <Text style={[styles.smallTxt, { color: 'white' }]}>Attendance Status : {isAttendanceMarked ? 'Marked' : 'Not Marked'}</Text>

                                            </View>
                                        </View>
                                    </TouchableOpacity>)
                            })
                    }
                </View>
            </ScrollView>
        </AlertNotificationRoot>
    )
}

export default MarkAttendance

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
})