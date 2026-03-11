import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Dimensions, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import colors from '../../../colors';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';


const screenWidth = Dimensions.get('window').width
const ReappearFormAgricultureDiploma = () => {
    const [selectedSemester, setSelectedSemester] = useState('');
    const [examFormData, setExamFormData] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    const [showModalSubmit, setShowModalSubmit] = useState(false)
    const [openSemesters, setOpenSemesters] = useState([])
    const [openSubjects, setOpenSubjects] = useState([])
    const [selectedValue, setSelectedValue] = useState([])
    const [showTable, setShowTable] = useState(false)
    const [showSubmitBtn, setShowSubmitBtn] = useState(false)
    const [valuesCheckModal, setValuesCheckModal] = useState(false)
    const [eligiblityModal, setEligiblityModal] = useState(false)

    const [studentDataArray, setStudentDataArray] = useState([])
    const [formSubmitionFlag, setFormSubmitionFlag] = useState('')
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCourseMedium, setSelectedCourseMedium] = useState(0)
    const [selectedSoi, setSelectedSoi] = useState([])

    const navigation = useNavigation()

    const getExamFormData = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const examForm = await fetch(BASE_URL + '/student/examdate/4', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    },
                })
                const examFormDetails = await examForm.json()
                setExamFormData(examFormDetails['statusopen'][0])
                if (examFormDetails['statusopen'][0]["formstatus"] == 2) {
                    errorModel(ALERT_TYPE.WARNING, "Oops!!!", `${examFormDetails['statusopen'][0]['message']}`);
                    // setEligiblityModal(true)
                } else if (examFormDetails['statusopen'][0]["formstatus"] == 1) {
                    errorModel(ALERT_TYPE.WARNING, "Oops!!!", `Last date to submit was ${examFormDetails['statusopen'][0]["enddate"].split("-").reverse().join("-")}`);
                    // setShowModal(true)
                } else if (examFormDetails['statusopen'][0]["formstatus"] != 0) {
                    errorModel(ALERT_TYPE.WARNING, "Oops!!!", `Something went wrong !!`)
                    // showModal2(true)
                }
                console.log('data froms api examForm diplomaAgri reappear:::', examFormDetails['statusopen'][0])
                setLoading(false)
                // console.log(transactions);
            } catch (error) {
                console.log('Error fetching form diplomaAgri data:examFrom phd reappear:', error)
                setLoading(false)
                errorModel(ALERT_TYPE.WARNING, "Oops!!!", `Something went wrong !!`)
                setShowModal2(true)
            }
        }
    }
    useEffect(() => {
        getExamFormData()
        openSemestersFunction()
    }, [selectedSemester])

    //  ///////////////////////////// open SEMESTERS ////////////////////////////////// //
    const openSemestersFunction = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const openSemestersData = await fetch(BASE_URL + '/student/reappearsemester', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    },
                })
                const openSemestersDataDetails = await openSemestersData.json()
                // console.log('data from api examGroup :::',examGroupDetails['data'])
                console.log("semesters open for examform", openSemestersDataDetails);
                if (openSemestersDataDetails['data1'].length > 0) {
                    let semesterArraySpecial = openSemestersDataDetails['data1'].map((item) => {
                        return { key: item['SemID'], value: item['SemID'] }
                    })
                    setOpenSemesters(semesterArraySpecial)
                } else {
                    let semesterArray = openSemestersDataDetails['data'].map((item) => {
                        return { key: item['SemesterID'], value: item['SemesterID'] }
                    })
                    setOpenSemesters(semesterArray)
                }
                setLoading(false)
                setShowTable(false)
                setShowSubmitBtn(false)
            } catch (error) {
                console.log('Error fetching form data:examForm:', error)
                setLoading(false)
                errorModel(ALERT_TYPE.WARNING, "Oops!!!", `Something went wrong !!`)
                // setShowModal2(true)
            }
        }
    }

    // const modalHandler = () => {
    //     setShowModal(false)
    //     setEligiblityModal(false)
    //     navigation.goBack()
    // }
    // const errorHandler = () => {
    //     setShowModal2(false)
    //     navigation.goBack()
    // }



    const searchHandler = () => {
        if (selectedSemester == 0 || selectedSemester == undefined) {
            submitModel(ALERT_TYPE.WARNING, "Check Values", `Please Select Semester and Group`)
            // setValuesCheckModal(true)
        } else {
            if (selectedSemester == 1) {
                getSubjects()
                setShowTable(true)
                setShowSubmitBtn(true)
            } else {
                getSubjects()
                setShowSubmitBtn(true)
                setShowTable(true)
            }
        }

        // console.log(selectedSemester);
    }
    // ////////////////////////// Subjects ARRAY (normal and elective) //////////////////////////////// //
    const getSubjects = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const examSemester = await fetch(`${BASE_URL}/student/reappear/${selectedSemester}/na`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    },
                })
                const examSemesterDetails = await examSemester.json()
                // console.log("semester is::::: ", selectedSemester)

                ////// normal subjects setting in state (setOpenSubjects) ////////////////////////////////
                setOpenSubjects(examSemesterDetails['data'])

                // console.log('data froms api examForm Subjects diplomaAgri reappear:::',examSemesterDetails['data'])
                setLoading(false)
            } catch (error) {
                console.log('Error fetching diplomaAgri form data:examFrom reappear:', error)
                setLoading(false)
                errorModel(ALERT_TYPE.WARNING, "Oops!!!", `Something went wrong !!`)
                // setShowModal2(true)
            }
        }
    }

    // selection of Y/N in subjects ////////////////////////
    const onSelect = (value, index) => {
        setSelectedValue(prev => {
            const updated = [...prev];

            // first time selection → build default structure
            if (updated.length === 0) {
                openSubjects.forEach(() => updated.push({ select: "Y" }));
            }
            updated[index].select = value;
            return updated;
        });
    };

    const onSelectSoi = (value, index) => {
        setSelectedSoi(prev => {
            const updated = [...prev];

            // first time selection → build default structure
            if (updated.length === 0) {
                openSubjects.forEach(() => updated.push({ soi: "English" }));
            }

            updated[index].soi = value;
            return updated;
        });
    };

    const onSubmit = async () => {
        if (selectedCourseMedium == 0) {
            submitModel(ALERT_TYPE.WARNING, "Medium of Instruction Required", `Insert Medium of Instruction and Try Again.`)
        } else {
            setStudentDataArray(studentDataArray.push({ "SemId": selectedSemester, "Examination": examFormData["examination"], "Type": "Reappear", "Group": "NA" }))

            console.log(studentDataArray);
            let arrToSend = []

            for (let j = 0; j < openSubjects.length; j++) {
                openSubjects[j]["select"] = selectedValue[j]['select']
                openSubjects[j]["soi"] = selectedSoi[j]['soi']
                arrToSend.push(openSubjects[j])
            }

            // ////////////// Array of student extradata to send /////////////////         

            const session = await EncryptedStorage.getItem("user_session")
            if (session != null) {
                console.log("examform subjects data to send", arrToSend);
                try {
                    const examFormSubmitData = await fetch(BASE_URL + '/student/examformsubmitr', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${session}`,
                            Accept: "application/json",
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify({
                            basicInfo: studentDataArray,
                            subjects: arrToSend,
                        }),
                    })

                    const examFormSubmitDataDetails = await examFormSubmitData.json()
                    // console.log("AFTER FROM SUBMISSION", examFormSubmitDataDetails)
                    setFormSubmitionFlag(examFormSubmitDataDetails["flag"])
                    setFormSubmitionFlag(examFormSubmitDataDetails["flag"])
                    if (examFormSubmitDataDetails["flag"] == '1') {
                        errorModel(ALERT_TYPE.WARNING, "Done", `Exam Form Already Submitted.`)
                    } else if (examFormSubmitDataDetails["flag"] == '2') {
                        errorModel(ALERT_TYPE.WARNING, "Pending", `Previous Exam From Pending.`)
                    } else if (examFormSubmitDataDetails["flag"] == '3') {
                        errorModel(ALERT_TYPE.SUCCESS, "Success", `Exam Form Submitted Successfully.`)
                    }
                    // setShowModalSubmit(true)
                    // console.log('data froms api examForm:::',examFormDetails['statusopen'][0])
                    setLoading(false)
                } catch (error) {
                    console.log('Error sending form data:examForm:', error)
                    setLoading(false)
                    errorModel(ALERT_TYPE.WARNING, "Oops!!!", `Something went wrong !!`)
                    // setShowModal2(true)
                }
            }
        }
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getExamFormData();
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
    const submitModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
        })
    }
    return (
        <AlertNotificationRoot>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.outerContainer} >
                    {
                        examFormData['formstatus'] == 0 ?
                            <ScrollView style={{ width: '100%' }}>
                                <Text style={{ flex: 1, fontSize: 24, color: '#1b1b1b', alignSelf: 'center' }}>{examFormData["examination"]} Reappear</Text>
                                <View style={styles.formContainer}>
                                    <View style={styles.formSelectors}>
                                        <Text style={styles.label}>Select Semester</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ width: '80%' }}>
                                                <SelectList boxStyles={{ padding: 4, alignSelf: 'flex-start', width: '100%' }}
                                                    setSelected={(val) => setSelectedSemester(val)}
                                                    fontFamily='time'
                                                    data={openSemesters}
                                                    arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} />}
                                                    search={false}
                                                    defaultOption={{ key: '0', value: 'Select Semester' }}
                                                    inputStyles={{ color: 'black' }}
                                                    dropdownTextStyles={{ color: 'black' }}
                                                />
                                            </View>
                                            <TouchableOpacity
                                                style={[styles.button, { alignSelf: 'flex-start' }]}
                                                onPress={() => searchHandler()}>
                                                <FontAwesome5Icon name="search" size={16} color={'white'} />
                                            </TouchableOpacity>
                                        </View>
                                        {
                                            showTable &&
                                            <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 16 }}>
                                                <Text style={styles.label}>Medium of Instruction</Text>
                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ width: '80%' }}>
                                                        <SelectList boxStyles={{ padding: 4, alignSelf: 'flex-start', width: '100%' }}
                                                            setSelected={(val) => setSelectedCourseMedium(val)}
                                                            fontFamily='time'
                                                            data={[
                                                                { key: 'English', value: 'English' },
                                                                { key: 'Punjabi', value: 'Punjabi' },
                                                                { key: 'Hindi', value: 'Hindi' },
                                                            ]}
                                                            arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} />}
                                                            search={false}
                                                            defaultOption={{ key: '0', value: 'Select Course Medium' }}
                                                            inputStyles={{ color: 'black' }}
                                                            dropdownTextStyles={{ color: 'black' }}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                                {loading ? <ActivityIndicator /> :
                                    showTable &&
                                    <View style={{ marginBottom: 24, alignSelf: 'center' }}>
                                        <View style={{ marginHorizontal: 20 }}>
                                            <Text style={{ color: '#1b1b1b' }}>MIO - Medium of Instruction</Text>
                                            <Text style={{ color: 'red' }}>E - English | P - Punjabi | H - Hindi</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', width: screenWidth - 24, justifyContent: 'space-between', backgroundColor: colors.uniBlue, alignSelf: 'center' }}>
                                            <View style={[styles.cellStyle, { flex: 0.5 }]}>
                                                <Text style={[styles.cardTxt, { color: 'white' }]}>Sno</Text>
                                            </View >
                                            <View style={[styles.cellStyle, { flex: 3.5 }]}>
                                                <Text style={[styles.cardTxt, { color: 'white' }]}>Subject Name/code</Text>
                                            </View>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'white' }]}>Select</Text>
                                            </View>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'white' }]}>MOI</Text>
                                            </View>
                                        </View>
                                        {openSubjects.map((subject, index) => (
                                            <View style={{ flexDirection: 'row', width: screenWidth - 24, justifyContent: 'space-between', backgroundColor: 'white', alignSelf: 'center' }} key={index}>
                                                <View style={[styles.cellStyle, { flex: 0.5 }]}>
                                                    <Text style={[styles.cardTxt, { color: 'black' }]}>{index + 1}</Text>
                                                </View >
                                                <View style={[styles.cellStyle, { flex: 3.5 }]}>
                                                    <Text style={[styles.cardTxt, { color: 'black' }]}>{`${subject['SubjectName']}/(${subject['SubjectCode']})`}</Text>
                                                </View>
                                                <View style={[styles.cellStyle, { flex: 1 }]}>
                                                    <SelectList
                                                        boxStyles={{ backgroundColor: 'white', borderWidth: 0, marginBottom: 0, height: 40, width: 52, top: -12 }}
                                                        setSelected={(val) => onSelect(val, index)}
                                                        fontFamily='time'
                                                        data={
                                                            [
                                                                { key: 'Y', value: 'Y' },
                                                                { key: 'N', value: 'N' }
                                                            ]
                                                        }
                                                        search={false}
                                                        defaultOption={{ key: 'Y', value: 'Y' }}
                                                        inputStyles={{ color: 'black', fontSize: 14 }}
                                                        dropdownTextStyles={{ color: 'black', margin: 0 }}
                                                        dropdownStyles={{ borderWidth: 0, position: 'relative', bottom: 22, backgroundColor: 'transparent', marginBottom: -40, maxHeight: 80, paddingVertical: 0 }}
                                                        dropdownItemStyles={{ padding: 0, height: 30, borderWidth: 0, paddingVertical: 0 }}
                                                    />
                                                </View>
                                                <View style={[styles.cellStyle, { flex: 1 }]}>
                                                    <SelectList
                                                        boxStyles={{ backgroundColor: 'white', borderWidth: 0, marginBottom: 0, height: 40, width: 52, top: -12 }}
                                                        setSelected={(val) => onSelectSoi(val, index)}
                                                        fontFamily='time'
                                                        data={
                                                            [
                                                                { key: 'English', value: 'E' },
                                                                { key: 'Punjabi', value: 'P' },
                                                                { key: 'Hindi', value: 'H' },
                                                            ]
                                                        }
                                                        search={false}
                                                        defaultOption={{ key: 'English', value: 'E' }}
                                                        inputStyles={{ color: 'black', fontSize: 14 }}
                                                        dropdownTextStyles={{ color: 'black', margin: 0 }}
                                                        dropdownStyles={{ borderWidth: 0, position: 'relative', bottom: 22, backgroundColor: 'transparent', marginBottom: -40, maxHeight: 120, paddingVertical: 0 }}
                                                        dropdownItemStyles={{ padding: 0, height: 30, borderWidth: 0, paddingVertical: 0 }}
                                                    />
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                }
                                {
                                    showSubmitBtn &&
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => onSubmit()}>
                                        <Text style={styles.btnText}>Submit</Text>
                                    </TouchableOpacity>
                                }
                            </ScrollView> : <Text style={styles.textSmall} > Loading data...</Text>
                    }
                </View>
            </ScrollView>
        </AlertNotificationRoot>
    )
}
export default ReappearFormAgricultureDiploma

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,
        // backgroundColor: 'white',
        // paddingHorizontal:24
    },
    formContainer: {
        flex: 15,
        padding: 16,
        width: '100%',
        elevation: 2
    },
    formSelectors: {
        marginBottom: 16,
        backgroundColor: 'white',
        elevation: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 16
    },
    pickerStyle: {
        placeholder: {
            color: 'black'
        },
        inputAndroid: {
            color: 'black'
        }
    },
    label: {
        color: '#1b1b1b'
    },
    button: {
        backgroundColor: "#223260",
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        paddingHorizontal: 12,
        marginHorizontal: 32,
    },
    btnText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
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
    cellStyle: {
        borderWidth: 0.5,
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderColor: 'black',
        // backgroundColor:'red'
        alignItems: 'center'
    },
    textSmall: {
        color: '#4C4E52',
        fontSize: 14,
    },
})