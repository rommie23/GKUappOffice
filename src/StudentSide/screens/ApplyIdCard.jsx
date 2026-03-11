import { View, Text, Image, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator, Modal } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { StudentContext } from '../../context/StudentContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import colors from '../../colors';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native';
import {BASE_URL,IMAGE_URL} from '@env'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


const ApplyIdCard = () => {
    const { studentIDNo, studentImage } = useContext(StudentContext)
    const [smartCard, setSmartCard] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [smartCardData, setSmartCardData] = useState({})
    const [loading, setLoading] = useState(true)
    const [loading1, setLoading1] = useState(true)
    const [btnFlag1, setBtnFlag1] = useState('')
    const [btnFlag2, setBtnFlag2] = useState('')
    // const [showModal, setShowModal] = useState(false)
    // const [successModal, setSuccessModal] = useState(false)
    const navigation = useNavigation()

    ///////////////////////////////// Student photograph ///////////////////////////////////////////
    const ImageUrl = `${IMAGE_URL}Images/Students/`;
    //   console.log(data)
    const getSmartCardData = async () => {
        // setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const smartCardData1 = await fetch(`${BASE_URL}/student/viewsmartcard`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    }
                })
                const smartCardDataDetails = await smartCardData1.json()
                setSmartCard(smartCardDataDetails)
                // console.log('smartcard data details', smartCardDataDetails["data"][0]['Image'])
                setLoading1(false)
                // console.log('sessoin at Amrik details',session);

            } catch (error) {
                console.log('Error fetching smartCardData data:apply:', error);
                setLoading1(false)
                errorModel(ALERT_TYPE.DANGER,"Oops!!!", "Something went wrong !!!");
                // setShowModal(true)
            }
        }
    }
    const applySmartCard = async () => {
        // setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
            if (smartCard['data'][0]['Image'] == null || smartCard['data'][0]['Image'] == "") {
                console.log('the image name of student',smartCard['data'][0]['Image']);
                submitModel(ALERT_TYPE.WARNING,"No Image Found", "Please update the profile image First")
            }
            else{
                if (session != null) {
                    try {
                        const sendSmartCardRequest = await fetch(`${BASE_URL}/student/applysmartcard`, {
                            method: 'POST',
                            headers: {
                                Accept: "application/json",
                                "Content-type": "application/json",
                                Authorization: `Bearer ${session}`,
                            }
                        })
                        const sendSmartCardRequestDetails = await sendSmartCardRequest.json()
                        // console.log('smart card details', sendSmartCardRequestDetails)
                        setLoading(false)
                        submitModel(ALERT_TYPE.SUCCESS,"Done", "ID Card Applied Successfully")
                        // setSuccessModal(true)
                    } catch (error) {
                        console.log('Error fetching smartCardButton Flag data:apply:', error);
                        setLoading(false)
                        // setShowModal(true)
                    }
                }
            }
        }

    const getSmartCard = async () => {
        // setLoading(true)
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
                setBtnFlag1(smartCardDetails['flag'])
                if(smartCardDetails['data']){
                    setSmartCardData(smartCardDetails['data'][0])
                }
                // console.log('smart card with flag details', smartCardDetails)
                setLoading(false)
                if (smartCardDetails['flag'] == '0') {
                    try {
                        const applyButton = await fetch(`${BASE_URL}/student/applybutton`, {
                            method: 'POST',
                            headers: {
                                Accept: "application/json",
                                "Content-type": "application/json",
                                Authorization: `Bearer ${session}`,
                            }
                        })
                        const applyButtonDetails = await applyButton.json()
                        // console.log("aply btn data", applyButtonDetails);
                        setBtnFlag2(applyButtonDetails["flag"])
                        setLoading(false)
                    } catch (error) {
                        console.log('Error fetching smartCard second check data:apply:', error);
                        setLoading(false)
                    }
                }

                // console.log('sessoin at Amrik details',session);

            } catch (error) {
                console.log('Error fetching smartCard button data:apply:', error);
                // setShowModal(true)
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        getSmartCardData()
        getSmartCard()
    }, [])
    // const errorHandler = () => {
    //     setShowModal(false)
    //     navigation.goBack()
    // }

    // call the function again if the user drag and pull for refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getSmartCardData()
        getSmartCard()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const errorModel = (type, title, message)=> {
        Dialog.show({
            type: type ,
            title: title,
            textBody: message,
            button: 'close',
            onHide : ()=>navigation.goBack()
            })
    }
    const submitModel = (type, title, message)=> {
        Dialog.show({
            type: type ,
            title: title,
            textBody: message,
            button: 'close',
            })
    }
    return (
        <AlertNotificationRoot>
        <ScrollView
            style={{ paddingVertical: 16, backgroundColor: '#f1f1f1' }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            
            {/* {loading1 ? null : console.log('from log',smartCard['data'][0]['StudentName'])} */}
            {/* ////////////////////////// front of student id card /////////////////////////// */}
            <Text style={{ color: '#1d1d1d', fontSize: 20, fontWeight: '500', alignSelf: 'center' }}>Front Side</Text>
            {loading1 ? <ActivityIndicator /> :
                <View style={{ flex: 1, alignItems: 'center', height: 'contain', paddingVertical: 32, backgroundColor: 'white' }}>

                    <Image source={{
                        uri: ImageUrl + studentImage
                    }} style={{ height: 80, width: 80 }} />
                    <Text style={{ color: '#1d1d1d', fontWeight:'600', fontSize:18 }}>{smartCard['data'][0]['ClassRollNo']}</Text>
                    <Text style={{ fontSize: 17, color: '#1d1d1d', fontWeight: '600' }}>{smartCard['data'][0]['StudentName']}</Text>
                    <Text style={{ color: '#1d1d1d', fontWeight:'500' }}>Course: {smartCard['data'][0]['Course']}({smartCard['data'][0]['Batch']})</Text>
                    <Text style={{ color: '#1d1d1d', fontWeight:'500' }}>Valid upto: {smartCard['data1'][0]?.['validdate'].slice(0, 10).split("-").reverse().join("-")}</Text>
                    <Text style={{ color: '#1d1d1d', fontWeight:'500', marginTop:20 }}>Mobile: {smartCard['data'][0]['StudentMobileNo']}</Text>
                    <Text style={{ color: '#1d1d1d', fontWeight:'500' }}>{smartCard['data'][0]['PermanentAddress']}</Text>

                    <View style={{marginTop:20}}>
                        <Text style={{ color: '#1d1d1d', fontWeight: '600', fontSize:16, alignSelf:'center'}}>Campus Address</Text>
                        <Text style={{ color: '#1d1d1d', fontWeight: '600', fontSize:12, alignSelf:'center'}}>Sardulgarh Road, Talwandi Sabo Bathinda,Punjab</Text>
                        <Text style={{ color: '#1d1d1d', fontWeight: '600', fontSize:12, alignSelf:'center'}}>India(151302) Phone: +99142-83400</Text>
                        <Text style={{ color: '#1d1d1d', fontWeight: '600', fontSize:12, alignSelf:'center'}}>www.gku.ac.in</Text>
                    </View>

                </View>
            }

            {/* /////////////////////////////// Apply Card button ///////////////////////////// */}
            {
                btnFlag1 == '0' && btnFlag2 == '0' ?
                    <TouchableOpacity style={styles.btn} onPress={()=> applySmartCard()}>
                        <Text style={styles.btnTxt} >Apply SmartCard</Text>
                    </TouchableOpacity>
                    : null
            }
            {/* ///////////////////////// Print Details of student id card ///////////////////// */}
            <Text style={{ color: '#1d1d1d', fontSize: 20, fontWeight: '500', alignSelf: 'center' }}>Smart-Card Status</Text>
            {/* {console.log('this is from console',smartCardData)} */}
            {
                loading ? <ActivityIndicator /> :

                    <View style={{ flex: 1, alignItems: 'center', height: 'contain', paddingVertical: 32, backgroundColor: 'white' }}>
                        {
                            btnFlag1 > 0 ?
                                <View style={{ flex: 1, alignItems: 'center', height: 'contain', paddingVertical: 32 }}>
                                    <Text style={{ color: '#1d1d1d', fontWeight: '800' }}>Applied Date</Text>
                                    <Text style={{ color: '#1d1d1d' }}>{smartCardData['ApplyDate'].slice(0, 10).split("-").reverse().join("/")} <FontAwesome5 color="green" name="check" size={20} /></Text>
                                    {smartCardData['status'] == "Rejected" && <Text style={{ color: 'red' }}>Rejection Reason - {smartCardData['RejectReason']} <FontAwesome5 color="red" name="user-times" size={20} /></Text>}
                                    <Text style={{ color: '#1d1d1d', fontWeight: '800', marginTop: 36 }}>Card Status</Text>
                                    {
                                        smartCardData['status'] == 'Printed' ?
                                            <Text style={{ color: '#1d1d1d' }}>
                                                Printed on : {smartCardData && smartCardData['PrintDate'].slice(0, 10).split("-").reverse().join("/")} <FontAwesome5 color="green" name="check" size={20} />
                                            </Text>
                                            : smartCardData['status'] == "Verified" ?
                                                <Text style={{ color: '#1d1d1d' }}>
                                                    Verified on: {smartCardData && smartCardData['VerifyDate'].slice(0, 10).split("-").reverse().join("/")} <FeatherIcon color="blue" name="clock" size={20} />
                                                </Text>
                                                : smartCardData['status'] == "Applied" ?
                                                    <Text style={{ color: '#1d1d1d' }}>
                                                        Applied on: {smartCardData && smartCardData['ApplyDate'].slice(0, 10).split("-").reverse().join("/")} <FontAwesome5 color="blue" name="clock" size={20} />
                                                    </Text>
                                                    :
                                                    <Text style={{ color: '#1d1d1d' }}>
                                                        Rejected on: {smartCardData && smartCardData['RejectDate'].slice(0, 10).split("-").reverse().join("/")} <FontAwesome5 color="red" name="times" size={20} />
                                                    </Text>
                                    }

                                </View> : <Text style={{ color: 'black' }}>No data Available</Text>
                        }

                    </View>
            }

        </ScrollView>
        </AlertNotificationRoot>
    )
}

export default ApplyIdCard

const styles = StyleSheet.create({
    headingsTxt: {
        marginVertical: 12,
        fontSize: 16,
        textTransform: 'uppercase',
        fontWeight: '600',
        paddingLeft: 24,
        color: '#1d1d1d'
    },
    downCont: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 16,
        backgroundColor: 'white',
    },
    downLeft: {
        width: '100%',
        padding: 8,
    },
    tab: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rowIcon: {
        width: 30,
        height: 30,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    tabText: {
        fontSize: 16,
        color: '#1b1b1b',
        fontWeight: '500'
    },

    btn: {
        marginVertical: 16,
        width: screenWidth / 2.3,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#ff6961',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    btnTxt: {
        color: '#f1f1f1',
        fontWeight: '600',
        fontSize: 14,
    },
    bottomBtn: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
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
    textSmall: {
        color: 'black',
        fontSize: 10
    }
})