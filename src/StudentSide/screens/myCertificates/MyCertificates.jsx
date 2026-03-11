import { Alert, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { List } from 'react-native-paper';
import colors from '../../../colors'
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL, IMAGE_URL } from '@env';
import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { pick, types, isCancel } from '@react-native-documents/picker'

let launchImageLibrary = _launchImageLibrary;
let launchCamera = _launchCamera;
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const MyCertificates = () => {
    const [isloading, setIsLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()
    const [imageUri, setImageUri] = useState(null);
    const [ImgSizeError, setImgSizeError] = useState(null);
    const [SignSizeError, setSignSizeError] = useState(null);
    const [showImageChangeButton, setShowImageChangeButton] = useState(true)
    const [certificateList, setCertificateList] = useState([])
    const [fileResponse, setFileResponse] = useState([]);
    const [selectPdf, setSelectPdf] = useState(false)

    const getList = async () => {
        setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const list = await fetch(`${BASE_URL}/student/certificateList`, {
                    method: 'POST',
                    headers: {
                        "Contect-Type": "application/json",
                        Authorization: `Bearer ${session}`,
                    }
                })
                const listDetails = await list.json()
                setCertificateList(listDetails);
                setIsLoading(false)
                // console.log("listDetails", listDetails);

            } catch (error) {
                setIsLoading(false)
                errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
            }
        }
    }

    /////////////////////////////// UPLOAD the pdf for details correction /////////////////////////
    const pickDocument = useCallback(async () => {
        try {
            const response = await pick({
                presentationStyle: 'fullScreen',
                type: types.pdf
            });
            console.log("the reponse after file select :::", response);
            const file = response[0];
            if (file && file.size <= 600000) {
                setFileResponse(response);
                console.log("After file select::: ", file);
                setSelectPdf(true);
            } else {
                submitModel(
                    ALERT_TYPE.DANGER,
                    "Pdf file Size",
                    "Pdf file size should be less than 500 KB"
                );
            }
        } catch (err) {
            console.log("Document Picker Error:", err);
        }
    }, []);

    // const pickDocument = useCallback(async () => {
    //     try {
    //         const response = await pick({
    //             presentationStyle: 'fullScreen',
    //             type: types.pdf
    //         });

    //         console.log("the response after file select :::", response);

    //         // response is an array of selected files
    //         const file = response[0];

    //         if (file && file.size <= 5000000) {
    //             setFileResponse(response);
    //             console.log("After file select::: ", file);
    //             setSelectPdf(true);
    //         } else {
    //             submitModel(
    //                 ALERT_TYPE.DANGER,
    //                 "Pdf file Size",
    //                 "Pdf file size should be less than 5 MB"
    //             );
    //         }
    //     } catch (err) {
    //         console.log("Document Picker Error:", err);
    //     }
    // }, []);

    const uploadPdf = async (srno) => {
        setIsLoading(true)
        if (!fileResponse) return;
        console.log("mmsmsjslsjklsjdkl:::: ", srno);

        const formData = new FormData();
        formData.append('certificate', {
            uri: fileResponse[0]["uri"],
            type: fileResponse[0]["type"],
            name: "studentIDNo" + '.pdf',
        });
        console.log("form data to submit", formData["_parts"]);
        try {
            const session = await EncryptedStorage.getItem("user_session")
            const response = await fetch(`${BASE_URL}/Student/uploadCertificates/${srno}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            });
            console.log('pdf uploaded successfully', response.json());
            errorModel(ALERT_TYPE.SUCCESS, "Done", `File Uploaded Successfully`)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.error('pdf upload failed', error);
            errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
        }
    };


    useEffect(() => {
        getList();
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
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
                        {
                            certificateList.length != 0 ?

                                certificateList.map((certificate, index) =>
                                    <List.Accordion title={certificate['DocumentsRequired']} id={index} key={index}
                                        right={props =>
                                            certificate['Action'] == 0 ?
                                                <View style={{ flexDirection: 'row', columnGap: 4 }}>
                                                    <Text style={{ color: 'gray' }}>In Review</Text>
                                                    <FontAwesome name='clock-o' color={colors.uniBlue} size={24} />
                                                </View>
                                                : certificate["Action"] == 1 ?
                                                    <View style={{ flexDirection: 'row', columnGap: 4 }}>
                                                        <Text style={{ color: 'gray' }}>Verified</Text>
                                                        <FontAwesome name='check-circle-o' color={"green"} size={24} />
                                                    </View>
                                                    : certificate["Action"] == 2 ?
                                                        <View style={{ flexDirection: 'row', columnGap: 4 }}>
                                                            <Text style={{ color: 'gray' }}>Rejected</Text>
                                                            <FontAwesome name='times-circle-o' color={colors.uniRed} size={24} />
                                                        </View>
                                                        : <Text style={{ color: 'gray' }}>Not uploaded yet</Text>
                                        }
                                        description={`Click to check certificate`}
                                        style={styles.shadowView}
                                    >
                                        <View style={styles.uploadContainer}>
                                            {ImgSizeError &&
                                                <Text style={{ color: 'red', alignSelf: 'center' }} >Pdf size should be 500KB or less</Text>
                                            }
                                            {/* {
                                    imageUri ? <Image source={{ uri: imageUri }} style={{ width: 200, height: 200,alignSelf:'center',marginTop:10 }} />:
                                    <Image source={{ uri: IMAGE_URL+"Images/Students/"+ studentImage }} style={{ width: 200, height: 100,resizeMode:'contain',alignSelf:'center',marginTop:10 }} />  } */
                                            }
                                            {
                                                certificate['Original'] != null ?
                                                    <TouchableOpacity style={{ alignItems: 'center', marginTop: 12 }} onPress={() => navigation.navigate('CertificateViewer', { filePath: `${IMAGE_URL}/StudentDocument/${certificate["Original"]}` })}>
                                                        {console.log(`${IMAGE_URL}StudentDocument/${certificate["Original"]}`)}

                                                        <FontAwesome name='file-pdf-o' size={48} color={colors.uniRed} />
                                                        <Text style={{ color: colors.uniBlue }}>Tap to Preview</Text>
                                                    </TouchableOpacity>
                                                    : null
                                            }
                                            {
                                                certificate['Action'] != 1 ?
                                                    <>
                                                        {fileResponse.map((file, index) => (
                                                            <Text
                                                                key={index.toString()}
                                                                style={{ color: 'black',marginTop: 20, marginRight: 20, marginLeft: 20 }}
                                                                numberOfLines={1}
                                                                ellipsizeMode={'middle'}>
                                                                {file?.name}
                                                            </Text>
                                                        ))}
                                                        <TouchableOpacity style={{ marginTop: 4, marginRight: 20, marginLeft: 20, backgroundColor: '#778DA2', borderRadius: 10 }} onPress={() => pickDocument()}>
                                                            <Text style={{ color: '#fff', padding: 10, alignSelf: 'center' }}>{`Choose File(pdf)`}</Text>
                                                        </TouchableOpacity>
                                                        <Text style={{ color: 'green', alignSelf: 'center' }} >Note: Upload File size should be 500KB or less</Text>
                                                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }} onPress={() => uploadPdf(certificate['SerialNo'])}>
                                                            <Text style={{ color: '#fff', padding: 10 }}>Upload</Text>
                                                        </TouchableOpacity>
                                                    </>
                                                    : <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginRight: 20, marginLeft: 20, backgroundColor: '#223260', borderRadius: 10 }}>
                                                        <Text style={{ color: '#fff', padding: 10 }}>Already Verified</Text>
                                                    </View>
                                            }
                                            {
                                                certificate['Remarks'] != null && certificate['Action'] == 2 ?
                                                    <Text style={{ color: colors.uniRed, padding: 10, fontWeight: 600 }}>{`Reject Reason : ${certificate["Remarks"]}`}</Text>
                                                    : null
                                            }
                                            <View><Text></Text></View>
                                        </View>

                                    </List.Accordion>
                                ) :
                                <Text style={{ color: 'gray', textAlign: "center" }}>No Data Found</Text>
                        }
                    </List.AccordionGroup>
                </ScrollView>
            </View>
        </AlertNotificationRoot>
    )
}

export default MyCertificates

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
    },
    shadowView: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 10 }, // Offset at the bottom
        shadowOpacity: 0.3, // How opaque the shadow is
        shadowRadius: 8, // Blur effect of the shadow
        elevation: 5, // Android shadow
    },
})