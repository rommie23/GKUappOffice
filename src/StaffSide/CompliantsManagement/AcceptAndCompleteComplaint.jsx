import { ActivityIndicator, Alert, Dimensions, Linking, PermissionsAndroid, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { LIMS_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';
import {convertUTCToIST} from '../../services/dateUTCToIST'
import Geolocation from '@react-native-community/geolocation'


const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const AcceptAndCompleteComplaint = () => {
    const { StaffIDNo } = useContext(StudentContext);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [complainData, setComplainData] = useState([])
    const [location, setLocation] = useState(null)
    const [error, setError] = useState(null);

    const navigation = useNavigation();

    const complains = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/complainsAssignedToEmployee`, {
                StaffIDNo
            })
            const complainsData = response.data;
            setComplainData(complainsData)
            console.log("tasks to complete::", JSON.stringify(complainsData, null, 2));
            // console.log("tasks to complete:", complainsData);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        complains()
    }, []))

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                console.log("requestLocationPermission");
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'We need access to your location to provide GPS features.',
                        buttonPositive: 'OK',
                        buttonNegative: 'Cancel',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Now check if location services are ON
                    Geolocation.getCurrentPosition(
                        () => true, // Success = location enabled
                        (error) => {
                            if (error.code === 2) {
                                // Location provider disabled
                                Alert.alert(
                                    'Enable Location',
                                    'Location is turned off. Please enable it.',
                                );
                            }
                        },
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
                    );

                    return true;
                } else {
                    Alert.alert(
                        'Permission Required',
                        'Location access is required. Please enable it in settings.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Open Settings', onPress: () => Linking.openSettings() },
                        ]
                    );
                    return false;
                }
                // return granted === PermissionsAndroid.RESULTS.GRANTED;

            } catch (err) {
                setError('Permission error: ' + err.message);
                return false;
            }
        }
        return true;
    };

    // Function to get current location
    const getLocation = async (taskId, action) => {
        setLoading(true)
        console.log("getlocation called");

        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            setError('Location permission denied');
            return;
        }

        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                buttonHandle(taskId, action, latitude, longitude)
                setError(null);
                setLoading(false)
            },
            (err) => {
                setError('Location error: ' + err.message);
                setLocation(null);
                setLoading(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            }
        );
    };

    const buttonHandle = async (assignId = 0, action = 0, latitude = 0, longitude = 0) => {
        console.log(assignId, action, latitude, longitude);

        setLoading(true)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/taskActions`, {
                assignId, action, latitude, longitude, StaffIDNo
            })
            const responseData = response.data;
            console.log(responseData);
            if (action == 1) {
                newModel(ALERT_TYPE.SUCCESS, 'Task Accepted', 'Task accepted successfully.')
            } else if (action == 2) {
                newModel(ALERT_TYPE.SUCCESS, 'Task Started', 'Task started successfully.')
            }
            complains()
            setLoading(false)
        } catch (error) {
            newModel(ALERT_TYPE.DANGER, 'Task Update Failed', 'Please try again after sometime.')
            console.log(error);
            setLoading(false)
        }
    }

    const confirmAndExecute = (taskId, action) => {
        Alert.alert(
            "Confirm Action",
            action == 1 ? "Are you sure you want to Accept Task ?" : "Are you sure you want to Start Task ?",
            [
                {
                    text: "No",
                    style: "cancel",
                    onPress: () => {
                        console.log("User cancelled");
                    },
                },
                {
                    text: "Yes",
                    onPress: () => {
                        getLocation(taskId, action);
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const newModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
        })
    }

    const onRefresh = useCallback(() => {
        complains();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <AlertNotificationRoot>
            <View style={{ flex: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {loading ? <ActivityIndicator /> :
                        complainData.length > 0 ?
                            complainData.map((item, i) => (
                                <View style={styles.card} key={i}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={styles.bottomCardTop}>
                                            <FontAwesome5 name='walking' size={24} color={colors.uniBlue} />
                                            <Text style={styles.textStyle}>Assignment No. {item['assignId']}</Text>
                                        </View>

                                    </View>
                                    <View style={styles.transaction}>
                                        <View style={{ width: '50%' }}>
                                            <Text style={[styles.textSmall]}>Complaint Date/Time</Text>
                                            <Text style={[styles.textStyle, styles.rowMiddle]}>{convertUTCToIST(item['created_at'])}</Text>
                                        </View>
                                        <View style={{ width: '30%' }}>
                                            <Text style={[styles.textSmall]}>Category</Text>
                                            <Text style={styles.textStyle}>{item['CategoryName']}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.transaction}>
                                        <View style={{ width: '100%' }}>
                                            <Text style={styles.textSmall}>Location</Text>
                                            <Text style={[styles.textStyle]}>{`Block ${item['BlockName']} Floor ${item['Floor']}, Room No. ${item['RoomNo']}`}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.transaction}>
                                        <View style={{ width: '100%' }}>
                                            <Text style={styles.textSmall}>Title</Text>
                                            <Text style={[styles.textStyle]}>{item['title']}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.transaction}>
                                        <View style={{ width: '100%' }}>
                                            <Text style={styles.textSmall}>Description</Text>
                                            <Text style={[styles.textStyle]}>{item["description"]}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.transaction, { flexDirection: 'column' }]}>
                                        {
                                            item['status'] == 'pending' ?
                                                <TouchableOpacity
                                                    style={[{ backgroundColor: colors.uniBlue, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16, width: '50%' }]} onPress={() => buttonHandle(item['assignId'], 1)}>
                                                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Accept Task</Text>
                                                </TouchableOpacity> :
                                                item['status'] == 'accepted' ?
                                                    <View>
                                                        {/* {location && (
                                                            <Text style={styles.text}>
                                                                Latitude: {location.latitude}{"\n"}
                                                                Longitude: {location.longitude}
                                                            </Text>
                                                        )} */}
                                                        {error && <Text style={styles.error}>{error}</Text>}
                                                        <TouchableOpacity
                                                            style={[{ backgroundColor: colors.uniBlue, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16, width: '50%' }]} onPress={() => confirmAndExecute(item['assignId'], 2)}>

                                                            <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Start Task</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    : item['status'] == 'in_progress' ?
                                                        <View>
                                                            <TouchableOpacity
                                                                style={[{ backgroundColor: colors.uniBlue, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16, width: '50%' }]} onPress={() => navigation.navigate("CompleteTaskScreen", { complainId: item['assignId'] })}>
                                                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Complete Task</Text>
                                                            </TouchableOpacity>
                                                        </View> :
                                                        item['status'] == 'completed' &&
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                                                            <View style={{ width: '70%' }}>
                                                                <Text style={styles.textSmall}>Task Status</Text>
                                                                <Text style={[styles.textStyle, { color: 'green', fontWeight: '600', fontSize: 14 }]}>Completed</Text>
                                                            </View>
                                                            <View style={{ width: '30%' }}>
                                                                <Text style={styles.textSmall}>View Photo</Text>
                                                                <TouchableOpacity onPress={() => navigation.navigate('OpenImage', { imageURI: `TMSUploads/${item['work_image']}` })}>
                                                                    <FontAwesome5 name='eye' size={24} color={colors.uniBlue} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                        }
                                    </View>
                                </View>
                            ))
                            :
                            <Text style={{ color: '#aaaaaa', alignSelf: 'center' }}>No Record Found</Text>
                    }
                </ScrollView>
                {/* <TouchableOpacity style={{position: 'absolute', backgroundColor:colors.uniBlue, borderRadius:30, height:50, width:50, bottom:30, right:30, justifyContent:'center', alignItems:'center'}}>
              <FontAwesome5 name='filter' color="white" size={20} />
    
            </TouchableOpacity> */}
            </View>
        </AlertNotificationRoot>
    )
}

export default AcceptAndCompleteComplaint

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 5,
        paddingHorizontal: 15,
        borderRadius: 10,
        color: '#000',
        height: 38,
        backgroundColor: 'white'
    },
    // Common CSS for every card 
    card: {
        backgroundColor: 'white',
        width: screenWidth - 24,
        marginVertical: 12,
        borderRadius: 16,
        alignSelf: 'center',
        padding: 16,
        elevation: 2
    },

    // CSS for images inside the cards
    topCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems:'center',
        paddingVertical: 12
    },
    textStyle: {
        color: '#1b1b1b',
        fontSize: 12,
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4
    },
    bottomCardTop: {
        flexDirection: 'row',
        columnGap: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textSmall: {
        color: '#4C4E52',
        fontSize: 10
    },
    inputBox: {
        height: 42,
        paddingHorizontal: 20,
        width: '100%',
        color: 'black'
    },
    loginInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: "#1b1b1b",
        borderWidth: 1,
        borderRadius: 8
    }
})