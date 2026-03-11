import { ActivityIndicator, Alert, Dimensions, Linking, PermissionsAndroid, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BASE_URL, LIMS_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';
import {convertUTCToIST} from '../../services/dateUTCToIST'
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height
const CompleteTaskScreen = ({ route }) => {
    const { StaffIDNo } = useContext(StudentContext);
    const [complainData, setComplainData] = useState([])
    const [photo, setPhoto] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = useState('')

    const navigation = useNavigation();

    const { complainId } = route.params;

    const complains = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/eachComplainToComplete`, {
                complainId
            })
            const complainsData = response.data;
            setComplainData(complainsData[0])
            console.log("One Complain :: ", complainsData);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        complains();
    }, [])

    const takePhoto = async () => {
        return new Promise((resolve, reject) => {
            launchCamera(
                {
                    mediaType: 'photo',
                    includeBase64: false,
                    maxWidth: 600, // resize for smaller size
                    maxHeight: 600,
                    quality: 0.5,
                },
                (response) => {
                    if (response.didCancel) {
                        reject(console.log('User cancelled image picker'));
                    } else if (response.errorCode) {
                        reject(console.log(response.errorMessage));
                    } else {
                        resolve(response.assets[0]); // return the photo
                        setPhoto(response.assets[0]);
                    }
                }
            );
        });
    };

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

    const completeTask = async () => {
        setLoading(true)
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            setError('Location permission denied');
            return;
        }

        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                try {
                    const formData = new FormData();
                    formData.append('assingId', complainId);
                    formData.append('remarks', remarks);
                    formData.append('latitude', latitude);
                    formData.append('longitude', longitude);
                    formData.append('StaffIDNo', StaffIDNo);

                    if (photo) {
                        console.log("photo:", photo);
                        formData.append('photo', {
                            uri: photo.uri,
                            type: photo.type,
                            name: photo.fileName,
                        });
                    }

                    const response = await axios.post(
                        `${LIMS_URL}/complain/completeTask`,
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );

                    const responseData = response.data;
                    if (responseData['affectedRows'] > 0) {
                        newModel(ALERT_TYPE.SUCCESS, 'Task Completed', 'Task completed successfully.');
                        setLoading(false)
                    }
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    newModel(ALERT_TYPE.DANGER, 'Task Update Failed', 'Please try again after sometime.');
                    setLoading(false)
                    console.log(error);
                }
            },
            (err) => {
                setError('Location error: ' + err.message);
                setLocation(null);
                setLoading(false)
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

        const confirmAndExecute = () => {
            Alert.alert(
                "Confirm Action",
                "Are you sure you want to Complete Task ?",
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
                            completeTask();
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
            onHide: () => navigation.goBack()
        })
    }

    return (
        <AlertNotificationRoot>
            <View style={{ flex: 1 }}>
                <ScrollView
                >
                    {loading ? <ActivityIndicator /> :

                        <View style={styles.card}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={styles.bottomCardTop}>
                                    <FontAwesome5 name='walking' size={24} color={colors.uniBlue} />
                                    <Text style={styles.textStyle}>Complain No. {complainData['assignId']}</Text>
                                </View>
                            </View>
                            <View style={styles.transaction}>
                                <View style={{ width: '50%' }}>
                                    <Text style={[styles.textSmall]}>Start Date/Time</Text>
                                    <Text style={[styles.textStyle, styles.rowMiddle]}>{convertUTCToIST(complainData['start_at'])}</Text>
                                </View>
                            </View>
                            <View style={styles.transaction}>
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.textSmall}>Location</Text>
                                    <Text style={[styles.textStyle]}>{`Block ${complainData['BlockName']} Floor ${complainData['Floor']}, Room No. ${complainData['RoomNo']}`}</Text>
                                </View>
                            </View>
                            <View style={styles.transaction}>
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.textSmall}>Title</Text>
                                    <Text style={[styles.textStyle]}>{complainData['title']}</Text>
                                </View>
                            </View>
                            <View style={styles.transaction}>
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.textSmall}>Description</Text>
                                    <Text style={[styles.textStyle]}>{complainData["description"]}</Text>
                                </View>
                            </View>
                            <View>
                                {photo && (
                                    <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
                                        📷 {photo.fileName || 'Unnamed photo'}
                                    </Text>
                                )}
                                <TouchableOpacity
                                    style={[{ backgroundColor: colors.uniRed, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 8 }]} onPress={() => takePhoto()}>
                                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Capture Photo</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignSelf: 'flex-start' }}>
                                <Text style={{ color: '#1b1b1b', marginTop: 10 }}>Remarks<Text style={{ color: 'red' }}>*</Text></Text>
                                <View style={styles.loginInput}>
                                    <TextInput
                                        style={styles.inputBox}
                                        placeholder="Enter Remarks for Task"
                                        onChangeText={(text) =>
                                            setRemarks(text)
                                        }
                                        placeholderTextColor="#666666"
                                    />
                                </View>
                            </View>
                            {
                                remarks.length > 1 ?
                                    <TouchableOpacity
                                        style={[{ backgroundColor: colors.uniBlue, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16, width: '50%' }]} onPress={() => confirmAndExecute()}>
                                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Complete Task</Text>
                                    </TouchableOpacity> :
                                    <TouchableOpacity
                                        style={[{ backgroundColor: colors.uniBlue, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16, width: '50%', opacity:0.5 }]}>
                                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Complete Task</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    }
                </ScrollView>
            </View>
        </AlertNotificationRoot>
    )
}

export default CompleteTaskScreen

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