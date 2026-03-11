import { Alert, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, List, Modal } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons'
import { StudentContext } from '../../context/StudentContext'
import colors from '../../colors'
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL,IMAGE_URL } from '@env';
import Entypo from 'react-native-vector-icons/Entypo'
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { images } from '../../images';

const StaffEditProfile = () => {
    const { data, StaffIDNo, staffImage, imageStatus, setImageStatus, setStaffImage, setData} = useContext(StudentContext);
    console.log("the data is ::: ", data)
    const [staffID, setStaffID] = useState(data['data'][0]['IDNo'].toString())
    const [collegeName, setCollegeName] = useState(data['data'][0]['CollegeName'].trim())
    const [Department, setDepartment] = useState(data['data'][0]['Department'].trim());
    const [fatherName, setFatherName] = useState(data['data'][0]['FatherName'].trim());
    const [motherName, setMotherName] = useState(data['data'][0]['MotherName'].trim())
    const [staffName, setStaffName] = useState(data['data'][0]['Name'].trim())
    const [gender, setGender] = useState(data['data'][0]['Gender'].trim())
    const [mobileNo, setMobileNo] = useState(data['data'][0]['MobileNo'].trim())
    const [email, setEmail] = useState(data['data'][0]['EmailID'].trim())
    const [address, setAddress] = useState(data['data'][0]['PermanentAddress'].trim())
    const [loading, setLoading] = useState()
    const [isloading, setIsLoading] = React.useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    // const [signUri, setSignUri] = useState(null);
    const [ImgSizeError, setImgSizeError] = useState(null);
    const [SignSizeError, setSignSizeError] = useState(null);

    /////////////////////// function to submit correction form and values are coming from the useState variables //////////////////////

    const updateData=async()=>{
        console.log("this is update function Call :::::::::::::::::::::::::::::::::::::::");
        const session = await EncryptedStorage.getItem("user_session");
        const staffDetails = await fetch(BASE_URL + '/Staff/profile', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session}`
        }
        })
        const staffDetailsData = await staffDetails.json()
        setData(staffDetailsData);
        setStaffImage(staffDetailsData['data'][0]['Imagepath'])
        setImageStatus(staffDetailsData['data'][0]['ImageStatus'])
    }

    const submitCorrectionForm = async () => {
        const session = await EncryptedStorage.getItem("user_session");
        setIsLoading(true);
        try {
            const url = `${BASE_URL}/staff/correction/${mobileNo}/${email}/${address}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setIsLoading(false);
            submitModel(ALERT_TYPE.SUCCESS, "Success", 'Updated Successfully')
            console.log(data);

        } catch (error) {
            setIsLoading(false);
            if (error instanceof TypeError && error.message === 'Network request failed') {
                console.error('Network request failed:', error);
                submitModel(ALERT_TYPE.DANGER, "Newtwork Error", "Network Slow at moment please Try again")
            } else {
                console.error('Error fetching data:', error);
                submitModel(ALERT_TYPE.DANGER, "Network Error", "Network Slow at moment please Try again")
            }
        }
    };
    // //////////////// function to launch the image library to pick image to upload //////////////////////

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

                    setSignSizeError(true);
                    submitModel(ALERT_TYPE.DANGER, "Image Size", "Image size should be less than 500kb")
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

    // /////////////////////// Upload the profile image ///////////////////////////////////

    const uploadImage = async () => {
        if (!imageUri) return;
        setIsLoading(true)
        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: StaffIDNo + '.jpg',
        });
        console.log("form data to submit", formData["_parts"]);
        try {
            const session = await EncryptedStorage.getItem("user_session")
            const response = await fetch(BASE_URL + '/staff/image', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    'enctype': 'multipart/form-data',
                },
                body: formData
            });
            const res = await response.json();
            console.log('Image uploaded successfully', res);
            await updateData();
            submitModel(ALERT_TYPE.SUCCESS, "Success", 'Kindly Refresh Profile Page to See Effect')
            setIsLoading(false)

        } catch (error) {
            console.error('Image upload failed', error);
            submitModel(ALERT_TYPE.DANGER, "Failed", "Image upload Failed Try again")
            setIsLoading(false)
        }
    };


    useEffect(() => {
    }, [])
    const onRefresh = useCallback(() => {
        setRefreshing(true);

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

    ////////////// Date formatting from UTC string to normal readable string /////////////////////////
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

                    <ScrollView keyboardShouldPersistTaps={'handled'}>

                        <List.AccordionGroup >
                            {/* <List.Accordion title="Upload Signature" id="2" >
                            <View style={styles.uploadContainer}>
                                {SignSizeError &&
                                <Text style={{color:'red',alignSelf:'center'}} >Image size should be 200KB or less</Text>
               
                            }
                            {signUri ? 
                            <Image source={{ uri: signUri }} style={{ width: 200, height: 200,alignSelf:'center',marginTop:10 }} />:
                            <Image source={{ uri: IMAGE_URL+"/Images/Signature/"+StaffIDNo+".PNG" }} style={{ width: 200, height: 100,resizeMode:'contain',alignSelf:'center',marginTop:10 }} />  }

                                <TouchableOpacity style={{ marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#778DA2', borderRadius: 10 }} onPress={()=>Alert.alert("select image")}>
                                    <Text style={{ color: '#fff', padding: 10,alignSelf:'center' }}>Choose Image file</Text>
                                </TouchableOpacity>
                         
                                <TouchableOpacity  style={{ alignItems: 'center',justifyContent: 'center',marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }} onPress={()=>Alert.alert("uploadSignature")} >
                                <Text style={{ color: '#fff', padding: 10 }}>Upload</Text>
                                    </TouchableOpacity>
                                <View><Text></Text></View>
                            </View>
                         
                        </List.Accordion> */}

                            {/*  photo upload accordion */}
                            <List.Accordion title="Upload Image" id="4">
                                <View style={styles.uploadContainer}>
                                    {ImgSizeError &&
                                        <Text style={{ color: 'red', alignSelf: 'center' }} >Image size should be 200KB or less</Text>

                                    }
                                    {console.log("imageUri", imageUri)
                                    }
                                    {imageStatus == 2 && imageUri == null ? <Image source={images.profileReject} style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 10 }} /> :
                                        imageUri ? <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 10 }} /> :
                                            <Image source={{ uri: `${IMAGE_URL}Images/Staff/` + staffImage }} style={{ width: 200, height: 100, resizeMode: 'contain', alignSelf: 'center', marginTop: 10 }} />}

                                    {imageStatus != 1 ?
                                        <>
                                            <TouchableOpacity style={{ marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#778DA2', borderRadius: 10 }} onPress={() => openImagePicker()}>
                                                <Text style={{ color: '#fff', padding: 10, alignSelf: 'center' }}>Choose Image file</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }} onPress={() => uploadImage()}>
                                                <Text style={{ color: '#fff', padding: 10 }}>Upload</Text>
                                            </TouchableOpacity>
                                        </>
                                        : <View style={{flexDirection:'row', justifyContent:'center', columnGap:2}}>
                                            <Text style={{color:"#1336BE", textAlign:'center', fontWeight:'600', marginTop:4}}>Profile Photo is Verified</Text>
                                            <IonIcon name='checkmark-circle' size={16} color='#1338BE'/>
                                        </View>
                                    }

                                    <View><Text></Text></View>
                                </View>

                            </List.Accordion>
                            {/* accordion to update details */}
                            <List.Accordion title="Update Basic Details" id="1">
                                {/* <List.Item title="Item 1" /> */}
                                <View style={styles.container}>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>IDNo</Text>
                                        <TextInput
                                            value={staffID}
                                            style={[styles.inputBox, { color: '#b1b1b1' }]}
                                            onChangeText={setStaffID}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Staff Name</Text>
                                        <TextInput
                                            value={staffName}
                                            style={styles.inputBox}
                                            onChangeText={setStaffName}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>College Name</Text>
                                        <TextInput
                                            value={collegeName}
                                            style={[styles.inputBox, { color: '#b1b1b1' }]}
                                            onChangeText={setCollegeName}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Department Name</Text>
                                        <TextInput
                                            value={Department}
                                            style={[styles.inputBox, { color: '#b1b1b1' }]}
                                            onChangeText={setDepartment}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Father Name</Text>
                                        <TextInput
                                            value={fatherName}
                                            style={[styles.inputBox, { color: '#b1b1b1' }]}
                                            onChangeText={setFatherName}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Mother Name</Text>
                                        <TextInput
                                            value={motherName}
                                            style={[styles.inputBox, { color: '#b1b1b1' }]}
                                            onChangeText={setMotherName}
                                            editable={false}
                                        />
                                    </View>

                                    <View style={styles.eachInput}>
                                        <Text style={styles.txtStyle}>Gender</Text>
                                        <TextInput
                                            value={gender}
                                            style={styles.inputBox}
                                            onChangeText={setGender}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.eachInput}>
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
                                    </View>

                                    <TouchableOpacity style={styles.btn} onPress={submitCorrectionForm} >
                                        <Text style={{ color: 'white' }}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </List.Accordion>


                        </List.AccordionGroup>

                    </ScrollView>
                </View>
            </View>
        </AlertNotificationRoot>
    )
}

export default StaffEditProfile


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


