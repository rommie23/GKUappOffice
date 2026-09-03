// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Dimensions, Alert, Linking } from 'react-native'
// import React, { useCallback, useEffect, useState } from 'react'
// import colors from '../../colors';
// import { SelectList } from 'react-native-dropdown-select-list';
// import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
// import Entypo from 'react-native-vector-icons/Entypo';
// import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
// import EncryptedStorage from 'react-native-encrypted-storage';
// import { BASE_URL, IMAGE_URL } from '@env';
// import { useNavigation, useFocusEffect, Link } from '@react-navigation/native';
// import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
// import WebView from 'react-native-webview';

// const screenWidth = Dimensions.get('window').width

// const StudentStudyMaterial = () => {
//     const [allSemesters, setAllSemesters] = useState({})
//     const [allSubjects, setAllSubjects] = useState([])
//     const [selectedSemester, setSelectedSemester] = useState('')
//     const [selectedSubject, setSelectedSubject] = useState('')
//     const [allMaterial, setAllMaterial] = useState([]);
//     const [isloading, setIsLoading] = useState(true)
//     const [isloadingNew, setIsLoadingNew] = useState(false)
//     const [refreshing, setRefreshing] = useState(false);
//     const [showsearch, setShowSearch] = useState(false)
//     const [noDataText, setNoDataText] = useState(false)
//     const [pdfUrl, setPdfUrl] = useState('')

//     const navigation = useNavigation()

//     // get all the subjects form the backend
//     const getSemesters = async () => {
//         const session = await EncryptedStorage.getItem("user_session")
//         if (session != null) {
//             try {
//                 const semesters = await fetch(BASE_URL + '/Student/noofsem/', {
//                     method: 'POST',
//                     headers: {
//                         Authorization: `Bearer ${session}`
//                     }
//                 })
//                 const totalsemestersData = await semesters.json()
//                 // console.log('total sem data ::',totalsemestersData["semesters"]);
//                 if (totalsemestersData["semesters"]["rowsAffected"] == 0) {
//                     newModel(ALERT_TYPE.WARNING, "No Subjects", "There are no subjects to show");
//                 }
//                 if (totalsemestersData['semesters']['recordset']) {
//                     let semesterArray = totalsemestersData['semesters']['recordset'].map((item) => {
//                         return { key: item['SemesterId'], value: item['SemesterId'] }
//                     })
//                     setAllSemesters(semesterArray)
//                 }
//                 setIsLoading(false)
//                 // console.log(allSemesters)
//                 // console.log(totalsemestersData['semesters']['recordset'][totalsemestersData['semesters']['recordset'].length-1])
//             } catch (error) {
//                 newModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!");
//                 console.log('Error fetching Guri data:AllsubjectsSemwise:', error);
//             }
//         }
//     }
//     useEffect(() => {
//         getSemesters()
//     }, [])


//     //pass the semester value to backend so the api will give data according to the semester //
//     const getSubjects = async (semid) => {
//         // setIsLoadingNew(true)
//         setSelectedSemester(semid)
//         const session = await EncryptedStorage.getItem("user_session")
//         if (session != null) {
//             try {
//                 const subjects = await fetch(`${BASE_URL}/student/subjects/${semid}`, {
//                     method: 'POST',
//                     headers: {
//                         Accept: "application/json",
//                         "Content-type": "application/json",
//                         Authorization: `Bearer ${session}`,
//                     },
//                     body: JSON.stringify({
//                         semid: semid,
//                     })
//                 })
//                 const subjectsData = await subjects.json()
//                 // console.log('all subjects per sem are:::', subjectsData['semesters']['recordsets'][0]);
//                 if (subjectsData['semesters']['recordsets'][0]) {
//                     let subjectArray = subjectsData['semesters']['recordsets'][0].map((item) => {
//                         return { key: item['SubjectCode'], value: item['SubjectName'] }
//                     })
//                     setAllSubjects(subjectArray)
//                 }
//                 setAllMaterial([])
//                 setShowSearch(false)
//                 setNoDataText(false)

//             } catch (error) {
//                 console.log('Error fetching subjects data:AllsubjectsSemwise:', error);
//                 setIsLoadingNew(false)
//                 newModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!");
//             }
//         }
//     }
//     // function when subject is selected
//     const subjectSelectedFunc = (subject) => {
//         setSelectedSubject(subject)
//         setAllMaterial([])
//         setNoDataText(false)

//     }
//     useEffect(() => {
//         if (selectedSemester == 0 || selectedSemester == undefined || selectedSubject == 0 || selectedSubject == undefined) {
//             setShowSearch(false)
//         }
//         else { setShowSearch(true) }
//     }, [selectedSemester, selectedSubject])


//     //  when search button is pressed
//     const searchHandler = async () => {
//         setIsLoadingNew(true)
//         const session = await EncryptedStorage.getItem("user_session")
//         if (session != null) {
//             try {
//                 const studyMaterial = await fetch(`${BASE_URL}/student/studymaterial/${selectedSemester}/${selectedSubject}`, {
//                     method: 'POST',
//                     headers: {
//                         Accept: "application/json",
//                         "Content-type": "application/json",
//                         Authorization: `Bearer ${session}`,
//                     },
//                     body: JSON.stringify({
//                         semid: selectedSemester,
//                         subjectCode: selectedSubject,
//                     })
//                 })
//                 const studyMaterialDetails = await studyMaterial.json();
//                 console.log("studyMaterialDetails::::", studyMaterialDetails);

//                 if (studyMaterialDetails['material']['recordset'].length == 0) {
//                     setNoDataText(true)
//                 } else {
//                     setAllMaterial(studyMaterialDetails['material']['recordset']);
//                 }
//                 // console.log(studyMaterialDetails['material']['recordset']);
//                 setIsLoadingNew(false)
//             } catch (error) {
//                 console.log('Error fetching subjects data:study Material subject wise:', error);
//                 setIsLoadingNew(false)
//                 newModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!");
//             }
//             // console.log(selectedSubject, selectedSemester);
//         }
//     }
//     const onRefresh = useCallback(() => {
//         setRefreshing(true);
//         getSemesters()
//         setTimeout(() => {
//             setRefreshing(false);
//         }, 2000);
//     }, []);
//     const downloadPdf = (fileName) => {
//         console.log('download content');
//         const url = `${IMAGE_URL}StudyMaterial/${fileName}`;
//         setPdfUrl(url);
//     };
//     const openVideoAudio = (fileName) => {
//         console.log(fileName);
//         const url = fileName
//         Linking.canOpenURL(url)
//             .then((supported) => {
//                 if (supported) {
//                     return Linking.openURL(url);
//                 } else {
//                     console.log("Can't open URL: " + url);
//                 }
//             })
//             .catch((err) => console.error('An error occurred', err));
//     }



//     //////////////////////////////////.  CLick Handle ///////////////////////////////////

//     const materialClickHandle = async (result) => {
//         console.log("materialClickHandle::", result);

//         setIsLoadingNew(true)
//         const session = await EncryptedStorage.getItem("user_session")
//         if (session != null) {
//             try {
//                 const materialRead = await fetch(`${BASE_URL}/student/materialread/${result["id"]}`, {
//                     method: 'POST',
//                     headers: {
//                         Accept: "application/json",
//                         "Content-type": "application/json",
//                         Authorization: `Bearer ${session}`,
//                     }
//                 })
//                 const materialReadDetails = await materialRead.json();
//                 console.log(materialReadDetails);
//                 if (result['DocumentType'] !== "Video/Audio") {
//                     downloadPdf(result["CourseFile"]);
//                 } else {
//                     openVideoAudio(result["CourseFile"]);
//                 }

//                 setIsLoadingNew(false)


//             } catch (error) {
//                 console.log('Error updating read count:', error);
//                 setIsLoadingNew(false)
//                 newModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!");
//             }
//             // console.log(selectedSubject, selectedSemester);
//         }
//     }

//     const newModel = (type, title, message) => {
//         Dialog.show({
//             type: type,
//             title: title,
//             textBody: message,
//             button: 'close',
//             onHide: () => navigation.goBack()
//         })
//     }
//     return (
//         <AlertNotificationRoot>
//             <ScrollView
//                 refreshControl={
//                     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//                 }
//             >

//                 <View style={styles.formContainer}>
//                     <View style={styles.formSelectors}>
//                         <View style={{ alignSelf: 'flex-start' }}>
//                             <Text style={styles.label}>Semester</Text>
//                             <SelectList boxStyles={{ padding: -5, width: '100%' }}
//                                 setSelected={(val) => val != 0 && getSubjects(val)}
//                                 fontFamily='time'
//                                 data={allSemesters}
//                                 arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
//                                 search={false}
//                                 defaultOption={{ key: '0', value: 'Semester' }}
//                                 inputStyles={{ color: 'black' }}
//                                 dropdownTextStyles={{ color: 'black' }}
//                             />
//                         </View>
//                         <View style={{ alignSelf: 'flex-start' }}>
//                             <Text style={[styles.label]}>Select Subject</Text>
//                             <SelectList boxStyles={{ padding: -5, width: '100%' }}
//                                 setSelected={(val) => subjectSelectedFunc(val)}
//                                 fontFamily='time'
//                                 data={allSubjects}
//                                 arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
//                                 search={false}
//                                 defaultOption={{ key: '0', value: 'Subject' }}
//                                 inputStyles={{ color: 'black' }}
//                                 dropdownTextStyles={{ color: 'black' }}
//                             />
//                         </View>
//                         {showsearch &&
//                             <TouchableOpacity
//                                 style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16 }]}
//                                 onPress={() => searchHandler()}>
//                                 <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
//                                     <Text style={{ color: 'white', fontWeight: '500', fontSize: 18 }}>Search</Text>
//                                     <FontAwesome5Icon name="search" size={18} color={'white'} />
//                                 </View>
//                             </TouchableOpacity>
//                         }

//                     </View>
//                 </View>
//                 <View style={styles.cardOuter}>
//                     {
//                         isloadingNew ? <ActivityIndicator />
//                             : allMaterial.length > 0 ?
//                                 allMaterial.map((result, index) => (
//                                     <TouchableOpacity key={index} style={styles.card} onPress={() => materialClickHandle(result)} >
//                                         {/* <TouchableOpacity key={index} style={styles.card} onPress={()=>navigation.navigate('StudentStudyMaterialPdf', {courseFile: result["CourseFile"]})} > */}
//                                         <View style={{ width: '80%', rowGap: 8 }}>
//                                             <Text style={styles.cardTxt}>Subject Code : {selectedSubject}</Text>
//                                             <Text style={styles.smallTxt}>{`Topic - ${result['Topic']}`}</Text>
//                                         </View>
//                                         <View style={{ width: '20%', flex: 1, alignItems: 'center', gap: 16 }}>
//                                             <TouchableOpacity>
//                                                 <Entypo name="download" color='#223260' size={screenWidth / 14} />
//                                             </TouchableOpacity>
//                                         </View>
//                                     </TouchableOpacity>
//                                 )) : noDataText && <Text style={{color:'balck'}}>No Data Found</Text>
//                     }
//                 </View>
//                 {pdfUrl && (
//                     <WebView
//                         source={{ uri: pdfUrl }}
//                         style={{ marginTop: 20, width: '100%', height: '80%' }}
//                     />
//                 )}
//             </ScrollView>
//         </AlertNotificationRoot>
//     )
// }

// export default StudentStudyMaterial

// const styles = StyleSheet.create({
//     formContainer: {
//         flex: 1,
//         padding: 16,
//         width: '100%',
//         elevation: 2,
//     },
//     formSelectors: {
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         columnGap: 4,
//         marginBottom: 8,
//         backgroundColor: 'white',
//         elevation: 1,
//         paddingHorizontal: 16,
//         paddingVertical: 16,
//         borderRadius: 16,
//     },
//     pickerStyle: {
//         placeholder: {
//             color: 'black'
//         },
//         inputAndroid: {
//             color: 'black'
//         }
//     },
//     label: {
//         color: '#1b1b1b'
//     },
//     button: {
//         backgroundColor: "#223260",
//         height: 45,
//         borderColor: "gray",
//         borderWidth: 1,
//         borderRadius: 5,
//         alignItems: "center",
//         justifyContent: "center",
//         marginVertical: 10,
//         paddingHorizontal: 12,
//         marginHorizontal: 32,
//     },
//     btnText: {
//         color: "white",
//         fontSize: 18,
//         fontWeight: "bold"
//     },
//     centeredView: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//     },
//     modalView: {
//         backgroundColor: 'white',
//         padding: 20,
//         borderRadius: 20,
//         shadowColor: 'black',
//         elevation: 2,
//         alignItems: 'center',
//         width: '80%',
//         paddingTop: 48
//     },
//     modalBtn: {
//         backgroundColor: colors.uniBlue,
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         marginVertical: 8
//     },
//     cellStyle: {
//         borderWidth: 0.5,
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         borderColor: 'black',
//         // backgroundColor:'red'
//     },
//     textSmall: {
//         color: '#4C4E52',
//         fontSize: 14,
//     },
//     cardOuter: {
//         width: screenWidth,
//         alignItems: 'center',
//         paddingHorizontal: 8,
//     },
//     card: {
//         width: '100%',
//         backgroundColor: 'white',
//         flexDirection: "row",
//         justifyContent: 'space-between',
//         padding: 16,
//         marginTop: 8,
//         borderRadius: 16,
//         elevation: 1
//     },
//     cardTxt: {
//         color: '#1b1b1b',
//         fontSize: 16,
//         fontWeight: '500'
//     },
//     smallTxt: {
//         color: '#1b1b1b',
//         fontSize: 14,
//         fontWeight: '500'
//     },
//     sgpaLook: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: colors.uniRed,
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 8
//     },
// })

import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Dimensions, Alert, Linking } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import colors from '../../colors'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL, IMAGE_URL } from '@env'
import { useNavigation, useFocusEffect, Link } from '@react-navigation/native'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification'
import WebView from 'react-native-webview'

const screenWidth = Dimensions.get('window').width

const StudentStudyMaterial = () => {
    const [allSemesters, setAllSemesters] = useState({})
    const [allSubjects, setAllSubjects] = useState([])
    const [selectedSemester, setSelectedSemester] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [allMaterial, setAllMaterial] = useState([])
    const [isloading, setIsLoading] = useState(true)
    const [isloadingNew, setIsLoadingNew] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [showsearch, setShowSearch] = useState(false)
    const [noDataText, setNoDataText] = useState(false)
    const [pdfUrl, setPdfUrl] = useState('')

    const navigation = useNavigation()

    // Get all semesters
    const getSemesters = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const semesters = await fetch(BASE_URL + '/Student/noofsem/', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${session}` }
                })
                const totalsemestersData = await semesters.json()

                if (totalsemestersData["semesters"]["rowsAffected"] == 0) {
                    newModel(ALERT_TYPE.WARNING, "No Subjects", "There are no subjects to show")
                }

                if (totalsemestersData['semesters']['recordset']) {
                    let semesterArray = totalsemestersData['semesters']['recordset'].map((item) => ({
                        key: item['SemesterId'],
                        value: item['SemesterId']
                    }))
                    setAllSemesters(semesterArray)
                }

                setIsLoading(false)
            } catch (error) {
                newModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!")
                console.log('Error fetching Guri data:AllsubjectsSemwise:', error)
            }
        }
    }

    useEffect(() => {
        getSemesters()
    }, [])

    // Get subjects according to semester
    const getSubjects = async (semid) => {
        setSelectedSemester(semid)
        const session = await EncryptedStorage.getItem("user_session")

        if (session != null) {
            try {
                const subjects = await fetch(`${BASE_URL}/student/subjects/${semid}`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    },
                    body: JSON.stringify({ semid: semid })
                })

                const subjectsData = await subjects.json()

                if (subjectsData['semesters']['recordsets'][0]) {
                    let subjectArray = subjectsData['semesters']['recordsets'][0].map((item) => ({
                        key: item['SubjectCode'],
                        value: item['SubjectName']
                    }))
                    setAllSubjects(subjectArray)
                }

                setAllMaterial([])
                setShowSearch(false)
                setNoDataText(false)
            } catch (error) {
                console.log('Error fetching subjects data:AllsubjectsSemwise:', error)
                setIsLoadingNew(false)
                newModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!")
            }
        }
    }

    // Handle subject selection
    const subjectSelectedFunc = (subject) => {
        setSelectedSubject(subject)
        setAllMaterial([])
        setNoDataText(false)
    }

    useEffect(() => {
        if (selectedSemester == 0 || selectedSemester == undefined || selectedSubject == 0 || selectedSubject == undefined) {
            setShowSearch(false)
        } else {
            setShowSearch(true)
        }
    }, [selectedSemester, selectedSubject])

    // Search study material
    const searchHandler = async () => {
        setIsLoadingNew(true)
        const session = await EncryptedStorage.getItem("user_session")

        if (session != null) {
            try {
                const studyMaterial = await fetch(`${BASE_URL}/student/studymaterial/${selectedSemester}/${selectedSubject}`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    },
                    body: JSON.stringify({
                        semid: selectedSemester,
                        subjectCode: selectedSubject,
                    })
                })

                const studyMaterialDetails = await studyMaterial.json()
                console.log("studyMaterialDetails::::", studyMaterialDetails)

                if (studyMaterialDetails['material']['recordset'].length == 0) {
                    setNoDataText(true)
                } else {
                    setAllMaterial(studyMaterialDetails['material']['recordset'])
                }

                setIsLoadingNew(false)
            } catch (error) {
                console.log('Error fetching subjects data:study Material subject wise:', error)
                setIsLoadingNew(false)
                newModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!")
            }
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        getSemesters()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    const downloadPdf = (fileName) => {
        console.log('download content')
        const url = `${IMAGE_URL}StudyMaterial/${fileName}`
        setPdfUrl(url)
    }

    const openVideoAudio = (fileName) => {
        console.log(fileName)
        const url = fileName
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url)
                } else {
                    console.log("Can't open URL: " + url)
                }
            })
            .catch((err) => console.error('An error occurred', err))
    }

    // Handle material click
    const materialClickHandle = async (result) => {
        console.log("materialClickHandle::", result)

        setIsLoadingNew(true)
        const session = await EncryptedStorage.getItem("user_session")

        if (session != null) {
            try {
                const materialRead = await fetch(`${BASE_URL}/student/materialread/${result["id"]}`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    }
                })

                const materialReadDetails = await materialRead.json()
                console.log(materialReadDetails)

                if (result['DocumentType'] !== "Video/Audio") {
                    downloadPdf(result["CourseFile"])
                } else {
                    openVideoAudio(result["CourseFile"])
                }

                setIsLoadingNew(false)
            } catch (error) {
                console.log('Error updating read count:', error)
                setIsLoadingNew(false)
                newModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!")
            }
        }
    }

    const newModel = (type, title, message) => {
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
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    {/* <View style={styles.headerIcon}>
                        <FontAwesome5Icon name="book-open" size={21} color={colors.uniBlue} />
                    </View> */}
                    <View style={styles.headerContent}>
                        {/* <Text style={styles.headerTitle}>Study Material</Text> */}
                        <Text style={styles.headerSubtitle}>Find notes, documents and other resources</Text>
                    </View>
                </View>

                {/* Selectors */}
                <View style={styles.selectorCard}>
                    <View style={styles.sectionHeader}>
                        <FontAwesome5Icon name="filter" size={14} color={colors.uniBlue} />
                        <Text style={styles.sectionTitle}>Select Material</Text>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Semester</Text>
                        <SelectList
                            boxStyles={styles.selectBox}
                            setSelected={(val) => val != 0 && getSubjects(val)}
                            fontFamily="time"
                            data={allSemesters}
                            arrowicon={<FontAwesome5Icon name="chevron-down" size={11} color="#60666C" />}
                            search={false}
                            defaultOption={{ key: '0', value: 'Semester' }}
                            inputStyles={styles.selectInput}
                            dropdownTextStyles={styles.dropdownText}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Subject</Text>
                        <SelectList
                            boxStyles={styles.selectBox}
                            setSelected={(val) => subjectSelectedFunc(val)}
                            fontFamily="time"
                            data={allSubjects}
                            arrowicon={<FontAwesome5Icon name="chevron-down" size={11} color="#60666C" />}
                            search={false}
                            defaultOption={{ key: '0', value: 'Subject' }}
                            inputStyles={styles.selectInput}
                            dropdownTextStyles={styles.dropdownText}
                        />
                    </View>

                    {showsearch && (
                        <TouchableOpacity style={styles.searchButton} onPress={() => searchHandler()}>
                            <FontAwesome5Icon name="search" size={15} color="#FFF" />
                            <Text style={styles.searchText}>Search Material</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Material list */}
                <View style={styles.materialSection}>
                    {isloadingNew ? (
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color={colors.uniBlue} />
                            <Text style={styles.loaderText}>Loading material...</Text>
                        </View>
                    ) : allMaterial.length > 0 ? (
                        <>
                            <View style={styles.resultHeader}>
                                <Text style={styles.resultTitle}>Available Material</Text>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{allMaterial.length}</Text>
                                </View>
                            </View>

                            {allMaterial.map((result, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.card}
                                    onPress={() => materialClickHandle(result)}
                                    activeOpacity={0.75}
                                >
                                    <View style={styles.materialIcon}>
                                        <FontAwesome5Icon
                                            name={result['DocumentType'] === "Video/Audio" ? "play" : "file-pdf"}
                                            size={19}
                                            color={result['DocumentType'] === "Video/Audio" ? "#52665E" : colors.uniRed}
                                        />
                                    </View>

                                    <View style={styles.cardContent}>
                                        <Text style={styles.subjectCode}>SUBJECT • {selectedSubject}</Text>
                                        <Text style={styles.topic} numberOfLines={2}>
                                            {result['Topic']}
                                        </Text>
                                        <Text style={styles.materialType}>
                                            {result['DocumentType'] === "Video/Audio" ? "Video / Audio" : "PDF Document"}
                                        </Text>
                                    </View>

                                    <View style={styles.openIcon}>
                                        <Entypo
                                            name={result['DocumentType'] === "Video/Audio" ? "controller-play" : "download"}
                                            color={colors.uniBlue}
                                            size={19}
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    ) : noDataText ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIcon}>
                                <FontAwesome5Icon name="folder-open" size={25} color="#92979C" />
                            </View>
                            <Text style={styles.emptyTitle}>No Material Found</Text>
                            <Text style={styles.emptyText}>No study material is available for this subject.</Text>
                        </View>
                    ) : null}
                </View>

                {/* PDF viewer */}
                {pdfUrl && (
                    <WebView
                        source={{ uri: pdfUrl }}
                        style={styles.pdfViewer}
                    />
                )}
            </ScrollView>
        </AlertNotificationRoot>
    )
}

export default StudentStudyMaterial

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F6F8' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 8 },
    headerIcon: { width: 46, height: 46, borderRadius: 13, backgroundColor: '#E8EDF0', alignItems: 'center', justifyContent: 'center' },
    headerContent: { flex: 1, marginLeft: 12 },
    headerTitle: { fontSize: 21, fontWeight: '700', color: '#25292D' },
    headerSubtitle: { fontSize: 14, color: '#7B8187', marginTop: 3 },

    selectorCard: { backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 8, padding: 15, borderRadius: 16, elevation: 2 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 13 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#30353A' },
    field: { marginBottom: 12 },
    label: { fontSize: 11, fontWeight: '600', color: '#656B71', marginBottom: 6 },
    selectBox: { width: '100%', minHeight: 44, borderRadius: 10, borderColor: '#E0E3E6', backgroundColor: '#FAFBFC', paddingVertical: 8 },
    selectInput: { color: '#30353A', fontSize: 13 },
    dropdownText: { color: '#30353A', fontSize: 13 },

    searchButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, backgroundColor: colors.uniBlue, borderRadius: 10, paddingVertical: 12, marginTop: 2 },
    searchText: { color: '#FFF', fontSize: 13, fontWeight: '600' },

    materialSection: { padding: 16, paddingTop: 18 },
    resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    resultTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#30353A' },
    countBadge: { minWidth: 25, height: 25, paddingHorizontal: 7, borderRadius: 13, backgroundColor: '#E8EDF0', alignItems: 'center', justifyContent: 'center' },
    countText: { fontSize: 11, fontWeight: '700', color: colors.uniBlue },

    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, padding: 13, marginBottom: 9, elevation: 1 },
    materialIcon: { width: 44, height: 44, borderRadius: 11, backgroundColor: '#F1F3F4', alignItems: 'center', justifyContent: 'center' },
    cardContent: { flex: 1, marginLeft: 11, marginRight: 8 },
    subjectCode: { fontSize: 9, fontWeight: '700', color: colors.uniBlue, letterSpacing: 0.4 },
    topic: { fontSize: 14, fontWeight: '600', color: '#30353A', marginTop: 4 },
    materialType: { fontSize: 10, color: '#8A9096', marginTop: 4 },
    openIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#EEF1F3', alignItems: 'center', justifyContent: 'center' },

    loader: { alignItems: 'center', paddingVertical: 35 },
    loaderText: { fontSize: 12, color: '#7B8187', marginTop: 9 },

    emptyState: { backgroundColor: '#FFF', borderRadius: 14, alignItems: 'center', paddingVertical: 35, paddingHorizontal: 20 },
    emptyIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EEF0F2', alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 15, fontWeight: '700', color: '#555B61', marginTop: 10 },
    emptyText: { fontSize: 11, color: '#8A9096', textAlign: 'center', marginTop: 4 },

    pdfViewer: { width: '100%', height: '80%', marginTop: 12 }
})