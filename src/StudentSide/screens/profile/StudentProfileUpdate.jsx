import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, List, Modal } from 'react-native-paper';
import { StudentContext } from '../../../context/StudentContext'
import colors from '../../../colors'
import { useNavigation, useRoute } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL,IMAGE_URL } from '@env';
import Entypo from 'react-native-vector-icons/Entypo'
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import moment from 'moment';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { deviceType } from '../../../deviceType';

let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const StudentProfileUpdate = () => {
    const { data, studentIDNo, studentImage, setData } = useContext(StudentContext)
    const route = useRoute()
    const flag = route.params?.flag;    

    const [mobileNo, setMobileNo] = useState(data['data'][0]['StudentMobileNo'])
    const [bloodGroup, setBloodGroup] = useState('')
    const [abcId, setAbcId] = useState(data['data'][0]['ABCID'])
    const [email, setEmail] = useState(data['data'][0]['EmailID'])
    const [address, setAddress] = useState(data['data'][0]['PermanentAddress'])
    const [loading, setLoading] = useState(false)
    const [isloading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation()
    const [imageUri, setImageUri] = useState(null);
    const [signUri, setSignUri] = useState(null);
    const [ImgSizeError, setImgSizeError] = useState(null);
    const [SignSizeError, setSignSizeError] = useState(null);
    const [showImageChangeButton, setShowImageChangeButton] = useState(true)
    const [otr, setOtr] = useState(data['data'][0]['OTR']);
    const [emailModal, setEmailModal] = useState(false);
    const [hasSpecialSymbols, setHasSpecialSymbols] = useState(false);
    const [clubsList, setClubsList] = useState([]);
    const [desc, setDesc] = useState(null)
    const [selectedClub, setSelectedClub] = useState('')
    const [clubData, setClubData] = useState([])

    const getSmartCard = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const smartCard = await fetch(`${BASE_URL}/student/smartcard`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    }
                })
                const smartCardDetails = await smartCard.json()
                console.log(smartCardDetails['data'][0]['status']);

                smartCardDetails['data'][0]['status'] == 'Printed' ? setShowImageChangeButton(false) : null
                setLoading(false)
                console.log(data);
            }
            catch (error) {
                console.log('smartcard api error', error);
            }
        }
    }

    const allClubs = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const response = await fetch(`${BASE_URL}/student/allClubs`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    }
                })
                const clubsData = await response.json()
                setClubsList(clubsData['data'].map((item, i) => {
                    return { "key": item['Id'], "value": item['Name'], "description": item['Description'] }
                }
                ))
                console.log(clubsData)

                setLoading(false)
            }
            catch (error) {
                console.log('smartcard api error', error);
            }
        }
    }
    const checkABCId =()=>{
        flag == 0 && submitModel(ALERT_TYPE.WARNING, 'Update ABC ID first', 'Click on eye button for SOP')
    }
    useEffect(() => {
        allClubs()
        getSmartCard()
        checkEntry()
        checkABCId();
    }, [])

    const handleSelectClub = (val) => {
        setSelectedClub(val);
        const found = clubsList.find((item) => item.key === val);
        if (found) {
            setDesc(found.description);
        }

    };

    const checkSpecialSymbols = (text) => {
        const regex = /[^a-zA-Z0-9,.()-_\s]/;
        setHasSpecialSymbols(regex.test(text));
    };


    const updateProfile = async () => {
        const session = await EncryptedStorage.getItem("user_session");
        setIsLoading(true);
        if (abcId.length < 1) {
            setAbcId("null")
        }
        if (hasSpecialSymbols) {
            submitModel(ALERT_TYPE.WARNING,
                "Special Character",
                "Please remove special characters(!@#$%^&*+') from application as they are not allowed")
        }
        else {
            try {
                const url = `${BASE_URL}/student/updateprofile/${mobileNo}/${bloodGroup}/${abcId}/${email}/${address}/${otr}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                    },
                });
                
                const data = await response.json();
                console.log(data['data'][0]);
                if (data['data'][0] == 1) {
                    outModel(ALERT_TYPE.SUCCESS, "Success", 'Profile Updated Successfully')
                    setIsLoading(false)
                } else {
                    submitModel(ALERT_TYPE.DANGER, "Network Error", "Network Slow at moment please Try again")
                    setIsLoading(false)
                }
            } catch (error) {
                setIsLoading(false);
                submitModel(ALERT_TYPE.DANGER, "Network Error", "Network Slow at moment please Try again")


                console.error('Error fetching data:', error);
            }
        }
    };



    const uploadImage = async () => {
        setIsLoading(true)
        if (!imageUri) return;
        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: studentIDNo + '.jpg',
        });
        console.log("form data to submit", formData["_parts"]);
        try {
            const session = await EncryptedStorage.getItem("user_session")
            const response = await fetch(BASE_URL + '/Student/image', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    'enctype': 'multipart/form-data',
                },
                body: formData
            });
            const res = await response.json();
            console.log('Image uploaded successfully ::: ', res);
            deviceType('Student-image');
            submitModel(ALERT_TYPE.SUCCESS, "Success", res['message'])
        } catch (error) {
            console.error('Image upload failed', error);
            submitModel(ALERT_TYPE.DANGER, "Network Error", "Network Slow at moment please Try again")
        }
        setIsLoading(false)
    };

    const uploadSignature = async () => {
        if (!signUri) return;
        setIsLoading(true)
        const formData = new FormData();
        formData.append('image', {
            uri: signUri,
            type: 'image/jpeg',
            name: studentIDNo + '.jpg',
        });
        console.log("form data to submit", formData["_parts"]);
        try {
            const session = await EncryptedStorage.getItem("user_session")
            const response = await fetch(BASE_URL + '/Student/signature', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    'enctype': 'multipart/form-data',
                },
                body: formData
            });
            const res = await response.json();
            console.log('Signature uploaded successfully', res);
            outModel(ALERT_TYPE.SUCCESS, "Success", res['message'])
        } catch (error) {
            console.error('Signature upload failed', error);
            submitModel(ALERT_TYPE.DANGER, "Network Error", "Network Slow at moment please Try again")
        }
        setIsLoading(false)
    };


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        profileRefresh();
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

    const openImagePicker = async () => {
        const images = await launchImageLibrary(options, response => {
            if (response.assets && response.assets.length > 0) {
                const { uri, fileSize } = response.assets[0];
                const sizeInKB = fileSize / 1024;
                // console.log(uri);
                if (sizeInKB <= 500) {
                    setImageUri(uri);
                    setImgSizeError(false);
                } else {
                    // Alert.alert('Error', 'Image size should be 200KB or less');
                    // console.log("http://erp.gku.ac.in:86/Images/Signature/"+data['data'][0]['IDNo']+".PNG");

                    setImgSizeError(true);
                    submitModel(ALERT_TYPE.DANGER, "Image Size", "Image size should be less than 500kb")

                    setSignUri(null);
                }
            }

        });
        console.log("image assets are here", images.assets[0]);
        const formData = new FormData();
        formData.append('image', {
            uri: images.assets[0].uri,
            type: images.assets[0].type,
            name: images.assets[0].fileName
        })
    };
    const openSignPicker = async () => {
        const signature = await launchImageLibrary({}, response => {
            if (response.assets && response.assets.length > 0) {
                const { uri, fileSize } = response.assets[0];
                const sizeInKB = fileSize / 1024;
                // console.log(uri);
                if (sizeInKB <= 200) {
                    setSignUri(uri);
                    setSignSizeError(false);
                } else {
                    // Alert.alert('Error', 'Image size should be 200KB or less');
                    // console.log("http://erp.gku.ac.in:86/Images/Signature/"+data['data'][0]['IDNo']+".PNG");
                    setSignSizeError(true);
                    submitModel(ALERT_TYPE.DANGER, "Signature Image Size", "Signature Image size should be less than 200kb")
                    setSignUri(null);
                }
            }
        });
        console.log("signature assets are here", signature.assets[0]);
        const formData = new FormData();
        formData.append('image', {
            uri: signature.assets[0].uri,
            type: signature.assets[0].type,
            name: signature.assets[0].fileName
        })
    };

    const updateClub = async () => {
        setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        try {
            if (session != null) {
                console.log(selectedClub);

                const res = await fetch(BASE_URL + '/Student/updateStudentClub', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        clubId: selectedClub
                    })
                })
                const response = await res.json()
                console.log("clubsubmission:::", response);
                if (response.flag ==1) {
                    checkEntry()
                    setIsLoading(false)
                    submitModel(ALERT_TYPE.SUCCESS, "Success", 'Updated Successfully')
                }else{
                    submitModel(ALERT_TYPE.DANGER, "Something went Wrong !", 'Please try again')
                }
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }


    const checkEntry = async () => {
        // setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        try {
            if (session != null) {
                console.log(selectedClub);
                const res = await fetch(BASE_URL + '/Student/checkClubEntry', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    }
                })
                const response = await res.json()
                if (response?.data && response.data.length > 0) {
                    setClubData(response.data[0]);
                } else {
                    setClubData(null);
                }
                console.log("clubEntry :::", response);
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    const submitModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
            onHide: setIsLoading(false)
        })
    }
    const outModel = (type, title, message) => {
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
            {/* <Modal
                transparent={true}
                visible={emailModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <FontAwesome name={'check'}
                            size={64} color={'green'} style={{ position: 'absolute', top: -48, backgroundColor: 'white', paddingVertical: 16, borderRadius: 100, paddingHorizontal: 32 }} />
                        <TouchableOpacity style={styles.modalBtn} onPress={() => { navigation.goBack() }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> */}
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

                    <ScrollView keyboardShouldPersistTaps={'handled'}>

                        <List.AccordionGroup >
                            <List.Accordion title="Profile Image" id="4">
                                <View style={styles.uploadContainer}>
                                    {ImgSizeError &&
                                        <Text style={{ color: 'red', alignSelf: 'center' }} >Image size should be 500KB or less</Text>

                                    }
                                    {imageUri ? <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 10 }} /> :
                                        <Image source={{ uri: IMAGE_URL+"Images/Students/" + studentImage }} style={{ width: 200, height: 100, resizeMode: 'contain', alignSelf: 'center', marginTop: 10 }} />}

                                    {
                                        showImageChangeButton ?
                                            <>
                                                <TouchableOpacity style={{ marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#778DA2', borderRadius: 10 }} onPress={openImagePicker}>
                                                    <Text style={{ color: '#fff', padding: 10, alignSelf: 'center' }}>Choose Image file</Text>
                                                </TouchableOpacity>
                                                <Text style={{ color: 'green', alignSelf: 'center' }} >Note: Upload Image size should be 500KB or less</Text>
                                                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }} onPress={() => uploadImage()}>
                                                    <Text style={{ color: '#fff', padding: 10 }}>Upload</Text>
                                                </TouchableOpacity>
                                            </>
                                            : <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }}>
                                                <Text style={{ color: '#fff', padding: 10 }}>Only idcard remaimining students can change</Text>
                                            </View>
                                    }
                                    <View><Text></Text></View>
                                </View>

                            </List.Accordion>

                            <List.Accordion title="Signature" id="2" >
                                <View style={styles.uploadContainer}>
                                    {SignSizeError &&
                                        <Text style={{ color: 'red', alignSelf: 'center' }} >Image size should be 200KB or less</Text>

                                    }
                                    {signUri ? <Image source={{ uri: signUri }} style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 10 }} /> :
                                        <Image source={{ uri: IMAGE_URL+"Images/Signature/" + data['data'][0]['SignaturePath'] }} style={{ width: 200, height: 100, resizeMode: 'contain', alignSelf: 'center', marginTop: 10 }} />}

                                    <TouchableOpacity style={{ marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#778DA2', borderRadius: 10 }} onPress={openSignPicker}>
                                        <Text style={{ color: '#fff', padding: 10, alignSelf: 'center' }}>Choose Image file</Text>
                                    </TouchableOpacity>
                                    <Text style={{ color: 'green', alignSelf: 'center' }} >Note: Upload Image size should be 200KB or less</Text>
                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }} onPress={uploadSignature} >
                                        <Text style={{ color: '#fff', padding: 10 }}>Upload</Text>
                                    </TouchableOpacity>
                                    <View><Text></Text></View>
                                </View>

                            </List.Accordion>

                            <List.Accordion title="Update Details" id="1">
                                {/* <List.Item title="Item 1" /> */}
                                <View style={styles.container}>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Mobile No.</Text>
                                        <TextInput
                                            value={mobileNo}
                                            style={styles.inputBox}
                                            onChangeText={setMobileNo}
                                        />
                                    </View>

                                    {/* BLOOD GROUP SELECTION */}
                                    <View style={[styles.eachInput]}>
                                        <Text style={styles.txtStyle}>Blood Group</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                            <SelectList boxStyles={{ width: "100%" }}
                                                setSelected={(val) => setBloodGroup(val)}
                                                fontFamily='time'
                                                data={[
                                                    { key: 'O +ve', value: 'O +ve' },
                                                    { key: 'A +ve', value: 'A +ve' },
                                                    { key: 'B +ve', value: 'B +ve' },
                                                    { key: 'AB +ve', value: 'AB +ve' },
                                                    { key: 'O -ve', value: 'O -ve' },
                                                    { key: 'A -ve', value: 'A -ve' },
                                                    { key: 'B -ve', value: 'B -ve' },
                                                    { key: 'AB -ve', value: 'AB -ve' },
                                                ]}
                                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                                search={false}
                                                defaultOption={{ key: `${data['data'][0]['BloodGroup']}` ? `${data['data'][0]['BloodGroup']}` : 'Select', value: `${data['data'][0]['BloodGroup']}` ? `${data['data'][0]['BloodGroup']}` : 'Select' }}
                                                inputStyles={{ color: 'black' }}
                                                dropdownTextStyles={{ color: 'black' }}
                                            // dropdownStyles={{width:'50%'}}
                                            />

                                        </View>
                                    </View>
                                    {/* {
                                    console.log('abc id:',data['data'][0]['ABCID'])
                                } */}
                                    <View style={{ flex: 1, alignItems: 'flex-start', marginVertical: 12 }}>
                                        <Text style={styles.txtStyle}>ABC ID</Text>
                                        <View style={{ flexDirection: 'row', width: '100%', gap: 20, alignItems: 'center' }}>
                                            <TextInput
                                                value={abcId}
                                                style={[styles.inputBox, { width: '85%' }]}
                                                onChangeText={setAbcId}
                                                editable={data['data'][0]['ABCID'] === null || data['data'][0]['ABCID'] == "" || data['data'][0]['ABCID'] === "null" || data['data'][0]['ABCID'] == "NA" ? true : false}
                                            />
                                            {
                                                data['data'][0]['ABCID'] === null || data['data'][0]['ABCID'] == "" || data['data'][0]['ABCID'] === "null" || data['data'][0]['ABCID'] == "NA" ? 
                                                <TouchableOpacity onPress={()=>navigation.navigate('OpenPDF', {fileURL :`${IMAGE_URL}/Notices/131053_a0f083af_ABC-ID-for-Students.pdf`})}>
                                                    <FontAwesome5Icon name='eye' size={32} color={colors.uniBlue} />
                                                </TouchableOpacity>
                                                 : <FontAwesome name='lock' size={36} color={colors.uniRed} />
                                            }

                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-start', marginVertical: 12 }}>
                                        <Text style={styles.txtStyle}>Email</Text>
                                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <TextInput
                                                value={email}
                                                style={[styles.inputBox, { width: '80%' }]}
                                                onChangeText={setEmail}
                                            />
                                            {/* <TouchableOpacity style={{backgroundColor:colors.uniBlue, paddingHorizontal:12, paddingVertical:6, borderRadius:8}} onPress={()=>setEmailModal(true)}>
                                            <Text style={{color:'white'}}>Verify</Text>
                                        </TouchableOpacity> */}

                                        </View>
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Residence Address</Text>
                                        <TextInput
                                            value={address}
                                            style={styles.inputBox}
                                            onChangeText={
                                                (text) => {
                                                    setAddress(text);
                                                    checkSpecialSymbols(text);
                                                }
                                            }
                                            multiline
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>OTR <Text style={{ color: 'red', fontSize: 12 }}>Only for Punjab SC/ST Students*</Text></Text>

                                        <TextInput
                                            value={otr}
                                            style={styles.inputBox}
                                            onChangeText={setOtr}
                                            multiline
                                        />

                                    </View>

                                    {/* //////////////////////////////////////////////////////////////// the approval button /////////////////////////////////////////////////// */}
                                    {
                                        <TouchableOpacity
                                            style={styles.btn}
                                            // onPress={()=>fullBloodGroupFunction()}
                                            onPress={() => updateProfile()}
                                        >
                                            <Text style={{ color: 'white', fontWeight: '600' }}>Update Changes</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </List.Accordion>
                            <List.Accordion title="Club Details" id="3" >

                                {/* CLUB GROUP SELECTION */}
                                <View style={{ backgroundColor: 'white', elevation: 1, paddingHorizontal: 24 }}>
                                    <View style={[styles.eachInput]}>

                                        {
                                            clubData != null ?
                                                <View>
                                                    <Text style={styles.statusText}>Club ID : {clubData['Id']}</Text>
                                                    <Text style={styles.statusText}>Club Name : {clubData['Name']}</Text>
                                                    <Text style={styles.statusText}>Description : {clubData['Description']}</Text>

                                                </View> :
                                                <View>
                                                    <Text style={styles.txtStyle}>Select Club</Text>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                                        <SelectList boxStyles={{ width: "100%" }}
                                                            setSelected={(val) => handleSelectClub(val)}
                                                            fontFamily='time'
                                                            data={clubsList}
                                                            arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                                            search={false}
                                                            defaultOption={'Select'}
                                                            inputStyles={{ color: 'black' }}
                                                            dropdownTextStyles={{ color: 'black' }}
                                                        // dropdownStyles={{width:'50%'}}
                                                        />
                                                    </View>

                                                    {
                                                        desc != null ?
                                                            <View style={{ margin: 8 }}>
                                                                <Text style={{ color: colors.uniBlue }}>Description of club : </Text>
                                                                <Text style={{ color: 'black' }}>{desc}</Text>
                                                            </View> :
                                                            null
                                                    }
                                                    <TouchableOpacity
                                                        style={styles.btn}
                                                        // onPress={()=>fullBloodGroupFunction()}
                                                        onPress={() => updateClub()}
                                                    >
                                                        <Text style={{ color: 'white', fontWeight: '600' }}>Update Changes</Text>
                                                    </TouchableOpacity>

                                                </View>
                                        }


                                    </View>
                                </View>
                            </List.Accordion>
                        </List.AccordionGroup>

                    </ScrollView>
                </View>
            </View>
        </AlertNotificationRoot>
    )
}

export default StudentProfileUpdate

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
        fontSize: 14,
        fontWeight: '500',
        color: '#1b1b1b'
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