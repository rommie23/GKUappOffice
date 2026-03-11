import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal, SafeAreaView, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import colors from '../../colors';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import EncryptedStorage from 'react-native-encrypted-storage';
import {BASE_URL,IMAGE_URL} from '@env'
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';

const screenWidth = Dimensions.get('window').width;

const ApplyBusPass = () => {
    const [busRootData, setBusRootData] = useState([])
    const [busSpotData, setBusSpotData] = useState([])
    // const [busFeesData, setBusFeesData] = useState([])
    const [selectedRoot, setSelectedRoot] = useState('')
    const [selectedSpot, setSelectedSpot] = useState('')
    const [passData, setPassData] = useState([])
    const [loading, setLoading] = useState(true)
    const [loading1, setLoading1] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [applyResponse, setApplyResponse] = useState('')
    const navigation = useNavigation()
    const [applyModal, setApplyModal] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false);    

    const oldBusPass = async () => {
        setLoading1(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const passData = await fetch(`${BASE_URL}/student/buspass`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    }
                })
                const passDataDetails = await passData.json()
                // console.log("recordset oldbus pass data array", passDataDetails["buspassdeail"]['recordset']);
                setPassData(passDataDetails["buspassdeail"])
                setLoading1(false)
            } catch (error) {
                // setShowModal(true)
                console.log('Error fetching OldBusPass data:apply:', error);
                setLoading1(false)
            }
        }
    }

    // get details about the routes of the buses
    const getBusRoutesDetails = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const busRoot = await fetch(`${BASE_URL}/student/transportrootes`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    }
                })
                const busRootDetails = await busRoot.json()
                // console.log('bus Root details', busRootDetails["data"])

                const busRootsArray = busRootDetails['data'].map((item, i) => {
                    return { key: item['BusRouteID'], value: item['RouteName'].trim() }
                })
                setBusRootData(busRootsArray)

                setLoading(false)

            } catch (error) {
                console.log('Error fetching bus route data:apply:', error);
                errorModel(ALERT_TYPE.DANGER,"Oops!!!", "Something went wrong !!!");
                // setShowModal(true)
                setLoading(false)
            }
        }
    }

    // get all the stops of each bus from where users can aboard bus
    const getBusSpot = async (spotid) => {
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const busSpots = await fetch(`${BASE_URL}/student/transportspot/${spotid}`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    }
                })
                const busSpotsDetail = await busSpots.json()
                const busSpotArray = busSpotsDetail['data'].map((item, i) => {
                    return { "key": item['StopageID'], "value": item['Spot'] }
                })
                // console.log(busSpotsDetail['data']);
                // console.log("bus stop array",busSpotArray);
                setBusSpotData(busSpotArray)
                setSelectedRoot(spotid)
                setLoading(false)
                setSelectedSpot(0)
            } catch (error) {
                console.log('Error fetching busStop data:passApply:', error);
                setLoading(false)
            }
        }
    }

    // function to operaions when apply button will appear and pressed
    const applyBusPass = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const busPassSend = await fetch(`${BASE_URL}/student/applybuspass/${selectedRoot}/${selectedSpot}`, {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    }
                })
                // console.log("route: ", selectedRoot, 'spot: ', selectedSpot);
                const busPassSendDetails = await busPassSend.json()

                // console.log('Bus pass apply flag',busPassSendDetails);
                setApplyResponse(busPassSendDetails['data'])
                setLoading(false)
                busPassSendDetails['data'] == 1 ?
                submitModel(ALERT_TYPE.SUCCESS,"Done", "Bus pass applied Successfully.")
                :busPassSendDetails['data'] == -1 ?
                submitModel(ALERT_TYPE.WARNING,"Sorry", "Form already applied.")
                :busPassSendDetails['data'] == -2 ?
                submitModel(ALERT_TYPE.WARNING,"Oops!!", "Please Select Route and Spot.")
                : 
                errorModel(ALERT_TYPE.DANGER,"oops!!!", "Something went wrong !!!");
                // setApplyModal(true)
            } catch (error) {
                console.log('Error fetching busApplyBtn data:passApply:', error);
                setLoading(false)
                // setApplyModal(true)
            }
        }
    }
    useEffect(() => {
        getBusRoutesDetails()
        oldBusPass()
    }, [])

    // Detect dropdown open/close based on height changes
    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height > 50) {
        // Assuming the closed dropdown height is less than 50
        setDropdownOpen(true);
        } else {
        setDropdownOpen(false);
        }
    };
    const handleLayout2 = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height > 50) {
        // Assuming the closed dropdown height is less than 50
        setDropdownOpen(true);
        } else {
        setDropdownOpen(false);
        }
    };
    // const errorHandler = () => {
    //     setApplyModal(false)
    //     setShowModal(false)
    //     navigation.goBack()
    // }

    // const applyHandler = () => {
    //     setApplyModal(false)
    //     setShowModal(false)
    // }
    // call the function again if the user drag and pull for refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        oldBusPass()
        getBusRoutesDetails()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);


    // model to show errors in the page
    const errorModel = (type, title, message)=> {
        Dialog.show({
            type: type ,
            title: title,
            textBody: message,
            button: 'close',
            onHide : ()=>navigation.goBack()
            })
    }

    // modal to show after submission
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
        <View>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={!dropdownOpen} />
                }
            >
                {/* <Modal
                    transparent={true}
                    visible={applyModal}
                >
                    <View style={styles.centeredView}>
                        {
                            // console.log('response after apply', applyResponse)
                        }
                        <View style={styles.modalView}>
                            <FontAwesome name= {
                                applyResponse == 1 ? 'check' 
                                :applyResponse == -1 ? 'exclamation' 
                                :applyResponse == -2 ? 'cross'
                                : 'exclamation' } 
                                size={64} color={
                                    applyResponse == 1 ? 'green' 
                                    :applyResponse == -1 ? colors.uniBlue 
                                    :colors.uniRed
                                } style={{ position: 'absolute', top: -48, backgroundColor: 'white', paddingVertical: 16, borderRadius: 100, paddingHorizontal: 32 }} />
                                {
                                    applyResponse == 1 ?
                                    <Text style={styles.textSmall}>Form submitted successfully.</Text>
                                    :applyResponse == -1 ?
                                    <Text style={styles.textSmall}>Form already applied</Text>
                                    :applyResponse == -2 ?
                                    <Text style={styles.textSmall}>Please select route and Spot</Text>
                                    : 
                                    <Text style={styles.textSmall}>Oops something went wrong!!!</Text>
                                }
                            <TouchableOpacity style={styles.modalBtn} onPress={() => applyHandler()}>
                                <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal> */}
                {/* <Modal
                    transparent={true}
                    visible={showModal}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <FontAwesome name='exclamation' size={64} color={colors.uniRed} style={{ position: 'absolute', top: -48, backgroundColor: 'white', paddingVertical: 16, borderRadius: 100, paddingHorizontal: 32 }} />
                            <Text style={styles.textSmall}>OOps Something went wrong!!!</Text>
                            <TouchableOpacity style={styles.modalBtn} onPress={() => errorHandler()}>
                                <Text style={{ color: 'white', fontSize: 16 }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal> */}
                <View style={styles.outerContainer}>
                    <View style={styles.formContainer}>
                        <View style={styles.formSelectors}>
                            {
                                loading ? <ActivityIndicator style={{alignSelf:'center'}} /> :
                            <View style={{ alignSelf: 'flex-start' }}>
                                <Text style={styles.label}>Select Bus Roots</Text>
                                <View onLayout={handleLayout}>
                                <SelectList boxStyles={{ padding: 10, width: "100%" }}
                                    
                                    setSelected={(val) => getBusSpot(val)}
                                    fontFamily='time'
                                    data={busRootData}
                                    arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4 }} />}
                                    search={false}
                                    defaultOption={{ key: '0', value: 'Select Bus Route' }}
                                    inputStyles={{ color: 'black' }}
                                    dropdownTextStyles={{ color: 'black' }}
                                    onFocus={()=>console.log('focus is on')}
                                    onBlur={()=>console.log('focus is off')}
                                />
                                </View>

                                <Text style={[styles.label, { marginTop: 16 }]}>Select Pickup Spot</Text>
                                <View onLayout={handleLayout2}>
                                <SelectList boxStyles={{ padding: 10, width: "100%" }}
                                    setSelected={(val) => setSelectedSpot(val)}
                                    fontFamily='time'
                                    data={busSpotData}
                                    arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                    search={false}
                                    defaultOption={{ key: '0', value: 'Select Bus Spot' }}
                                    inputStyles={{ color: 'black' }}
                                    dropdownTextStyles={{ color: 'black' }}
                                />
                                </View>
                                {/* { console.log(selectedSpot) } */}
                                {
                                    selectedRoot != '' && selectedSpot != 0 ?
                                    <TouchableOpacity style={styles.button} onPress={() => { applyBusPass() }}>
                                        <Text style={styles.btnText}>Apply</Text>
                                    </TouchableOpacity> :null
                                }
                                {
                                    applyResponse == -1 ? <Text style={{ color: colors.uniBlue, alignSelf: 'center' }}>Bus Pass is Already Applied</Text>
                                        : applyResponse == 1 ? <Text style={{ color: colors.uniBlue, alignSelf: 'center' }}>Bus Pass Applied Successfully</Text> :
                                            null
                                }
                            </View>
                            }
                            {/* {console.log(passData["recordset"].length)} */}
                        </View>
                        {loading1 ? <ActivityIndicator /> :
                            <View style={styles.outerContainer}>
                                {
                                    passData["rowsAffected"] > 0 ?
                                        passData['recordset'].map((item, i) => (
                                            <View style={styles.card} key={i}>
                                                <View style={styles.topCard}>
                                                    <Text style={[styles.textStyle, { flex: 1 }]}>Pass Number : {item["SerialNo"]}</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.textSmall}>Status</Text>
                                                        {
                                                            item['p_status'] == 0 ?
                                                                <Text style={{ color: 'blue' }}>Applied</Text>
                                                                : item['p_status'] == 1 ?
                                                                    <Text style={{ color: 'blue' }}>Pending</Text>
                                                                    : item['p_status'] == 2 ?
                                                                        <Text style={{ color: 'red' }}>Rejected By IT</Text>
                                                                        : item['p_status'] == 3 ?
                                                                            <Text style={{ color: 'blue' }}>Frowarded to Account</Text>
                                                                            : item['p_status'] == 4 ?
                                                                                <Text style={{ color: 'red' }}>Rejected By Account</Text>
                                                                                : item['p_status'] == 5 ?
                                                                                    <Text style={{ color: 'blue' }}>Ready to Print</Text>
                                                                                    : <Text style={{ color: 'green' }}>Printed</Text>
                                                        }
                                                    </View>
                                                    <View style={{ flex: 0.6 }}>
                                                        <Text style={styles.textSmall}>Expiry Date</Text>
                                                        {item["expiryDate"] == null ?
                                                        <Text style={styles.textStyle}>N/A</Text> :
                                                        <Text style={styles.textStyle}>{item["expiryDate"].slice(0, 10).split("-").reverse().join("-")}</Text>
                                                        }
                                                    </View>
                                                </View>
                                                <View style={styles.bottomCard}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.textSmall}>Bus Route</Text>
                                                        <Text style={styles.textStyle}>{item["route"]}</Text>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.textSmall}>Bus Stop</Text>
                                                        <Text style={styles.textStyle}>{item["spot"]}</Text>
                                                    </View>
                                                    <View style={{ flex: 0.6 }}>
                                                        <Text style={styles.textSmall}>Session</Text>
                                                        <Text style={styles.textStyle}>{item["session"]}</Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    {
                                                        item["ac_reason"] != null && item["p_status"] == 4 ? <Text style={[styles.textSmall, {
                                                            color: 'red', borderTopColor: 'lightgray',
                                                            borderTopWidth: 0.5,
                                                        }]}>`${item["ac_reason"]} on ${item['acrejectdate']}`</Text> : item["itreason"] != null && item["p_status"] == 2 ? <Text style={[styles.textSmall, {
                                                            color: 'red', borderTopColor: 'lightgray',
                                                            borderTopWidth: 0.5,
                                                        }]}>{item["itreason"]} </Text> : null
                                                    }
                                                </View>
                                            </View>
                                        )) : <Text style={{color:'black'}}>no data found</Text>
                                }
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
        </AlertNotificationRoot>
    )
}

export default ApplyBusPass

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,

    },
    formContainer: {
        flex: 1,
        padding: 16,
        width: '100%',
        elevation: 2,
    },
    formSelectors: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 4,
        marginBottom: 16,
        backgroundColor: 'white',
        elevation: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 16,
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
        marginTop: 16,
        paddingHorizontal: 12,
        marginHorizontal: 32,
    },
    btnText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    rejectDetails: {
        borderBottomColor: 'lightgray',
        borderTopWidth: 0.5,
        paddingTop: 12
    },

    // /////////////// modal css //////////////////
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
    card: {
        backgroundColor: 'white',
        width: screenWidth - 24,
        marginVertical: 12,
        borderRadius: 16,
        alignSelf: 'center',
        padding: 16,
        paddingBottom:4,
        elevation: 2
    },

    // CSS for images inside the cards
    topCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems:'center',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 0.5,
        paddingBottom: 12
    },
    textStyle: {
        color: '#1b1b1b',
        fontSize: 12
    },
    bottomCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap: 16,
        alignItems: 'center',
        marginTop: 12,
        paddingBottom:12
    },
    bottomCardMiddle: {
        flexDirection: 'row',
        paddingVertical: 6,
        justifyContent: 'space-between'
    },
    textSmall: {
        color: '#4C4E52',
        fontSize: 10
    },
    rowMiddle: {
        width: '60%'
    }
})