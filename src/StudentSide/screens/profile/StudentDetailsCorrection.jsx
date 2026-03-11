import { Alert, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, List, Modal } from 'react-native-paper';
import { StudentContext } from '../../../context/StudentContext'
import colors from '../../../colors'
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import Entypo from 'react-native-vector-icons/Entypo'
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { pick, types, isCancel } from '@react-native-documents/picker'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import moment from 'moment';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const StudentDetailsCorrection = () => {
    const { data, studentIDNo, studentImage } = useContext(StudentContext)
    const [programName, setProgramName] = useState(data['data'][0]['Course'])
    const [batch, setBatch] = useState((data['data'][0]['Batch']).toString())
    const [universityRollNo, setUniversityRollNo] = useState(data['data'][0]['UniRollNo'])
    const [studentName, setStudentName] = useState(data['data'][0]['StudentName'])
    const [dob, setdob] = useState(moment(data['data'][0]['DOB'].toString().split("T")[0].split("-").reverse().join("-"), 'DD-MM-YYYY').format('llll'))
    const [fatherName, setFatherName] = useState(data['data'][0]['FatherName'])
    const [motherName, setMotherName] = useState(data['data'][0]['MotherName'])
    const [gender, setGender] = useState(data['data'][0]['Sex'])
    const [mobileNo, setMobileNo] = useState(data['data'][0]['StudentMobileNo'])
    const [email, setEmail] = useState(data['data'][0]['EmailID'])
    const [address, setAddress] = useState(data['data'][0]['PermanentAddress'])
    const [loading, setLoading] = useState(false)
    const [isloading, setIsLoading] = useState(false);
    const [getCorrectionHistory, setCorrectionHistory] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation()
    const [showModal, setShowModal] = useState(false);
    const [getAppealID, setAppealID] = useState(null);
    const [remarks, setRemark] = useState('');
    const [fileResponse, setFileResponse] = useState([]);
    const [selectPdf, setSelectPdf] = useState(false)
    const [isDatePickerVisible, setIsDatePickerVisibility] = useState(false);


    const submitCorrectionForm = async () => {
        const session = await EncryptedStorage.getItem("user_session");
        setIsLoading(true);

        try {
            if (fileResponse.length == 0) return setIsLoading(false), submitModel(ALERT_TYPE.WARNING, "Select Document", "Please Select support pdf");
            const formData = new FormData();
            formData.append('correction', {
                uri: fileResponse[0]["uri"],
                type: fileResponse[0]["type"],
                name: studentIDNo + '.pdf',
            });
            // console.log(formData);
            console.log('dob format :::::::: ', dob);


            const url = `${BASE_URL}/student/correction/${studentName}/${fatherName}/${motherName}/${gender}/${mobileNo}/${email}/${address}/${dob}/${remarks}`;



            // const url = `${BASE_URL}/student/correction`;
            // console.log("pdf data after submission :::",formData['_parts'][0]);
            // const url = `${BASE_URL}/Student/uploadPdf`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    'enctype': 'multipart/form-data',
                },
                body: formData
            });
            console.log("after api hit:::", formData['_parts'][0]);

            const data = await response.json();
            console.log(data);

            setIsLoading(false);
            if (data['data'] === 1) {
                submitModel(ALERT_TYPE.SUCCESS, "Success", "Appeal Submitted Successfully")
                // console.log('successfully submit request',data['data']);
            }
            else if (data['data'] === -1) {
                submitModel(ALERT_TYPE.WARNING, "Appeal already exist", "Check Correction History")
                // console.log('already exist data',data['data']);
            }
            else if (data['data'] === 2) {
                submitModel(ALERT_TYPE.WARNING, "No Data to Change", "Check new Details again")
            }
            else {
                submitModel(ALERT_TYPE.DANGER, "Something went wrong", "Try again later")
            }
        } catch (error) {
            setIsLoading(false);
            if (error instanceof TypeError && error.message === 'Network request failed') {
                console.error('Network request failed:', error);

            } else {
                console.error('Error fetching data:', error);
            }
        }
    };

    const getApiForAllCorrectionHistory = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const allHistory = await fetch(BASE_URL + '/Student/correctiondata/', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                })
                const allHistoryData = await allHistory.json()
                console.log('correctionHistory :::: ', allHistoryData);
                setCorrectionHistory(allHistoryData.data)
                setLoading(false)
            } catch (error) {
                // console.log('Error fetching Guri data:Login:', error);
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        getApiForAllCorrectionHistory()
    }, [])
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getApiForAllCorrectionHistory()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const options = {
        title: 'Select Image',
        type: 'library',
        options: {
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    /////////////////////////////// UPLOAD the pdf for details correction /////////////////////////
    // const pickDocument = useCallback(async () => {       
    //     try {
    //       const [response] = await pick({
    //         presentationStyle: 'fullScreen',
    //         type: types.pdf
    //       });
    //       console.log("the reponse after file select :::",response);
    //       if(response[0]["size"]<=5000000){
    //           setFileResponse(response);
    //           console.log("After file select::: ",response[0]);
    //           setSelectPdf(true)
    //       }else{
    //         submitModel(ALERT_TYPE.DANGER,"Pdf file Size", "Pdf file size should be less than 5mb")
    //       }
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }, []);
    const pickDocument = useCallback(async () => {
        try {
            const response = await pick({
                presentationStyle: 'fullScreen',
                type: types.pdf
            });

            console.log("the response after file select :::", response);

            // response is an array of selected files
            const file = response[0];

            if (file && file.size <= 5000000) {
                setFileResponse(response);
                console.log("After file select::: ", file);
                setSelectPdf(true);
            } else {
                submitModel(
                    ALERT_TYPE.DANGER,
                    "Pdf file Size",
                    "Pdf file size should be less than 5 MB"
                );
            }
        } catch (err) {
            console.log("Document Picker Error:", err);
        }
    }, []);


    const uploadPdf = async () => {
        if (!fileResponse) return;
        const formData = new FormData();
        formData.append('file', {
            uri: fileResponse[0]["uri"],
            type: fileResponse[0]["type"],
            name: studentIDNo + '.pdf',
        });
        console.log("form data to submit", formData["_parts"]);
        try {
            const session = await EncryptedStorage.getItem("user_session")
            const response = await fetch(BASE_URL + '/Student/uploadPdf', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            });
            console.log('pdf uploaded successfully', response);
        } catch (error) {
            console.error('pdf upload failed', error);
        }
    };

    const submitModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
            onHide: setLoading(false)
        })

    }

    // //////////////////////////// Date Picker related code ///////////////////////////////

    // const dateStr = 'Jul 14 2024';
    // const formattedDate = moment(dateStr, 'MMM D YYYY').format('DD-MM-YYYY');

    // console.log(formattedDate); // outputs: 14-07-2024

    const getDate = (date) => {
        if (!date) return '';
        let tempDate = date.toString().split(' ');
        return moment(`${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`, 'MMM DD YYYY').format('DD-MM-YYYY');
        // return `${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`;

    };

    const showDatePicker = () => {
        setIsDatePickerVisibility(true);
    };

    const datehandleConfirm = (date) => {
        setdob(date);
        setIsDatePickerVisibility(false);
    };


    return (
        <AlertNotificationRoot>
            <View >

                {isloading &&
                    <Spinner
                        visible={isloading}
                    />
                }
                <View
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    } >

                    <ScrollView>

                        <List.AccordionGroup >
                            {/* <List.Accordion title="Profile Image" id="4">
                            <View style={styles.uploadContainer}>
                                {ImgSizeError &&
                                <Text style={{color:'red',alignSelf:'center'}} >Image size should be 500KB or less</Text>
               
                            }
                            {imageUri ? <Image source={{ uri: imageUri }} style={{ width: 200, height: 200,alignSelf:'center',marginTop:10 }} />:
                            <Image source={{ uri: "http://erp.gku.ac.in:86/Images/Students/"+ studentImage }} style={{ width: 200, height: 100,resizeMode:'contain',alignSelf:'center',marginTop:10 }} />  }
                                <TouchableOpacity style={{ marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#778DA2', borderRadius: 10 }} onPress={openImagePicker}>
                                    <Text style={{ color: '#fff', padding: 10,alignSelf:'center' }}>Choose Image file</Text>
                                </TouchableOpacity>
                            <Text style={{color:'green',alignSelf:'center'}} >Note: Upload Image size should be 500KB or less</Text>
                                <TouchableOpacity  style={{ alignItems: 'center',justifyContent: 'center',marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }} onPress={()=> uploadImage()}>
                                <Text style={{ color: '#fff', padding: 10 }}>Upload</Text>
                                </TouchableOpacity>
                                <View><Text></Text></View>
                            </View>
                         
                        </List.Accordion>

                        <List.Accordion title="Signature" id="2" >
                            <View style={styles.uploadContainer}>
                                {SignSizeError &&
                                <Text style={{color:'red',alignSelf:'center'}} >Image size should be 200KB or less</Text>
               
                            }
                            {signUri ? <Image source={{ uri: signUri }} style={{ width: 200, height: 200,alignSelf:'center',marginTop:10 }} />:
                            <Image source={{ uri: "http://erp.gku.ac.in:86/Images/Signature/"+data['data'][0]['SignaturePath'] }} style={{ width: 200, height: 100,resizeMode:'contain',alignSelf:'center',marginTop:10 }} />  }

                                <TouchableOpacity style={{ marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#778DA2', borderRadius: 10 }} onPress={openSignPicker}>
                                    <Text style={{ color: '#fff', padding: 10,alignSelf:'center' }}>Choose Image file</Text>
                                </TouchableOpacity>
                            <Text style={{color:'green',alignSelf:'center'}} >Note: Upload Image size should be 200KB or less</Text>
                                <TouchableOpacity  style={{ alignItems: 'center',justifyContent: 'center',marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }} onPress={uploadSignature} >
                                <Text style={{ color: '#fff', padding: 10 }}>Upload</Text>
                                    </TouchableOpacity>
                                <View><Text></Text></View>
                            </View>
                         
                        </List.Accordion> */}

                            <List.Accordion title="Correction Form" id="1">
                                {/* <List.Item title="Item 1" /> */}
                                <View style={styles.container}>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Program Name</Text>
                                        <TextInput
                                            value={programName}
                                            style={[styles.inputBox, { color: '#b1b1b1' }]}
                                            onChangeText={setProgramName}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Batch</Text>
                                        <TextInput
                                            value={batch}
                                            style={[styles.inputBox, { color: '#b1b1b1' }]}
                                            onChangeText={setBatch}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>University Roll No</Text>
                                        <TextInput
                                            value={universityRollNo}
                                            style={[styles.inputBox, { color: '#b1b1b1' }]}
                                            onChangeText={setUniversityRollNo}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Student Name</Text>
                                        <TextInput
                                            value={studentName}
                                            style={styles.inputBox}
                                            onChangeText={setStudentName}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Date of Birth</Text>
                                        <TouchableOpacity onPress={() => showDatePicker()}>
                                            <TextInput
                                                style={[styles.inputBox, { width: "100%" }]}
                                                value={getDate(dob)}
                                                // placeholder="Date..."
                                                editable={false}
                                                inputStyles={{ color: 'black' }}
                                                placeholderTextColor="#000"
                                            />
                                        </TouchableOpacity>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="date"
                                            onConfirm={datehandleConfirm}
                                            onCancel={() => setIsDatePickerVisibility(false)}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Father Name</Text>
                                        <TextInput
                                            value={fatherName}
                                            style={styles.inputBox}
                                            onChangeText={setFatherName}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Mother Name</Text>
                                        <TextInput
                                            value={motherName}
                                            style={styles.inputBox}
                                            onChangeText={setMotherName}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Remarks</Text>
                                        <TextInput
                                            value={remarks}
                                            style={styles.inputBox}
                                            onChangeText={setRemark}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Gender</Text>
                                        {/* <TextInput
                                        value={gender}
                                        style={styles.inputBox}
                                        onChangeText={setGender}
                                    /> */}
                                        <View style={{ width: '80%' }}>
                                            <SelectList boxStyles={{ padding: 4, alignSelf: 'flex-start', width: '100%' }}
                                                setSelected={(val) => setGender(val)}
                                                fontFamily='time'
                                                data={
                                                    [
                                                        { key: 'Male', value: 'Male' },
                                                        { key: 'Female', value: 'Female' }
                                                    ]
                                                }
                                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} />}
                                                search={false}
                                                defaultOption={{ key: gender, value: gender }}
                                                inputStyles={{ color: 'black' }}
                                                dropdownTextStyles={{ color: 'black' }}
                                            />
                                        </View>
                                    </View>
                                    {/* <View style={styles.eachInput}>
                                    <Text style={styles.txtStyle}>Mobile No.</Text>
                                    <TextInput
                                        value={mobileNo}
                                        style={styles.inputBox}
                                        onChangeText={setMobileNo}
                                    />
                                </View>
                                <View style={styles.eachInput}>
                                    <Text style={styles.txtStyle}>Email</Text>
                                    <TextInput
                                        value={email}
                                        style={styles.inputBox}
                                        onChangeText={setEmail}
                                    />
                                </View>
                                <View style={styles.eachInput}>
                                    <Text style={styles.txtStyle}>Residence Address</Text>
                                    <TextInput
                                        value={address}
                                        style={styles.inputBox}
                                        onChangeText={setAddress}
                                        multiline
                                    />
                                </View> */}
                                    {/* /////////////////  PDF document uploads in correction form  /////////////////*/}
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Correction Verification Document</Text>
                                        {fileResponse.map((file, index) => (
                                            <Text
                                                key={index.toString()}
                                                style={{ color: 'black' }}
                                                numberOfLines={1}
                                                ellipsizeMode={'middle'}>
                                                {file?.name}
                                            </Text>
                                        ))}
                                        <View style={{ flexDirection: 'row', columnGap: 16 }}>
                                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 6, backgroundColor: '#223260', borderRadius: 10 }} onPress={() => pickDocument()} >
                                                <Text style={{ color: '#fff', padding: 10 }}>Select Document(pdf)</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={{ color: 'red' }}>*Select the pdf to proceed*</Text>
                                    </View>

                                    {/* //////////////////////////////////////////////////////////////// the approval button /////////////////////////////////////////////////// */}
                                    {
                                        <TouchableOpacity
                                            style={selectPdf && remarks.trim().length > 5 ? styles.btn : [styles.btn, { opacity: 0.4 }]}
                                            onPress={() => submitCorrectionForm()}
                                            disabled={selectPdf && remarks.trim().length > 5 ? false : true}
                                        >
                                            <Text style={{ color: 'white' }}>Submit For Approval</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </List.Accordion>

                            <List.Accordion title="Correction history" id="3">
                                <View style={styles.cardOuter}>
                                    {/* {console.log("history is::",getCorrectionHistory.length)} */}
                                    {getCorrectionHistory.length > 0 ? getCorrectionHistory.map((form, index) => (
                                        <TouchableOpacity key={index} style={styles.card} onPress={() => {
                                            setAppealID(form['ID']);
                                            navigation.navigate('ViewAppeal', { ID: form['ID'] });
                                        }}   >
                                            <View style={{ width: '75%', rowGap: 10 }}>
                                                {/* <Text style={styles.cardTxt}>{form['Course']}</Text> */}
                                                <Text style={styles.smallTxt}>Ref. No: - {form['ID']}</Text>
                                                {/* <Text style={styles.smallTxt}>{`Sem - ${form['Semesterid']}(${form['Type']})`}</Text> */}
                                                <Text style={styles.smallerTxt}>Submit Date - {formatDate(form['SubmitDate'])}</Text>
                                            </View>
                                            <View style={{ width: '25%', flex: 1, alignItems: 'center' }}>
                                                <View style={{ flex: 2, justifyContent: 'center' }}>{

                                                    form['Status'] == 0 ? (<Text style={[styles.statusText, { color: 'blue' }]}>Pending</Text>)
                                                        : form['Status'] == 1 ? (<Text style={[styles.statusText, { color: 'green' }]}>Completed</Text>)
                                                            : form['Status'] == 2 ? (<Text style={[styles.statusText, { color: 'red' }]}>Rejected</Text>)
                                                                : (<Text style={[styles.statusText, { color: 'black' }]}>Draft</Text>)
                                                }
                                                </View>
                                                <TouchableOpacity>
                                                    <Entypo name="eye" color='#223260' size={screenWidth / 16} onPress={() => {
                                                        setAppealID(form['ID']);
                                                        navigation.navigate('ViewAppeal', { ID: form['ID'] });
                                                    }} />
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableOpacity>
                                    )) : getCorrectionHistory.length == 0 ? <Text style={{ color: 'black' }}>No data found</Text> : null}
                                </View>
                            </List.Accordion>
                        </List.AccordionGroup>

                    </ScrollView>
                </View>
            </View>
        </AlertNotificationRoot>
    )
}

export default StudentDetailsCorrection

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent:'flex-start',
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    inputBox: {
        height: 50,
        // paddingHorizontal : 20,
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginTop: 4,
        color: 'black'
    },
    eachInput: {
        flex: 1,
        alignItems: 'flex-start',
        marginVertical: 12
    },
    btn: {
        marginVertical: 16,
        paddingHorizontal: 32,
        paddingVertical: 16,
        backgroundColor: colors.uniBlue,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    txtStyle: {
        color: '#1b1b1b'
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500'
    },
    cardOuter: {
        width: screenWidth,
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 4
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
    smallerTxt: {
        color: '#1b1b1b',
        fontSize: 12,
        fontWeight: '500'
    },
    imageText: {
        color: 'balck'
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
        backgroundColor: colors.uniRed,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginVertical: 8
    }
})


