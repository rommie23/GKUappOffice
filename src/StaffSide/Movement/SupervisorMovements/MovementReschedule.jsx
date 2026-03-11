import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL, IMAGE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import moment from 'moment'
import { StudentContext } from '../../../context/StudentContext'


const MovementReschedule = ({ route }) => {
    const { data1 } = route.params;
    const {data} = useContext(StudentContext)
    console.log(data);
    


    const navigation = useNavigation()
    const [remarks, setRemarks] = useState('')
    const [startTime, setStartTime] = useState('');
    const [startTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false)

    const getTime = (time) => {
        // console.log(time);

        if (!time) return '';
        let tempTime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        return `${tempTime}`;
    };

    // show the time picker on screen
    const showDatePicker = () => {
        setStartTimePickerVisibility(true);
    };
    // movement

    // time selected and giving response
    const starttimehandleConfirm = (time) => {
        setStartTime(time);
        setStartTimePickerVisibility(false);
    };

    const notificationfunction = async () => {
        const session = await EncryptedStorage.getItem("user_session");
        console.log("notificationfunction");

        const date = new Date(startTime);

        const setTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        console.log("setTime::", setTime);

        try {
            if (session != null) {
                const res = await fetch(BASE_URL + '/notifiaction/sendNotificationSelected', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        sendby: data1.Supervisor,
                        receipients: [data1.EmpID],
                        Title: "Movement Request Rescheduled",
                        body: `${data.data[0].Name} has Rescheduled your Request time to ${setTime}`,
                        screenName: 'MyMovements',
                        webUrl: 'mytimeout.php'
                    })
                })
                const response = await res.json()
                console.log(response);
            }
        } catch (error) {
            console.log("error in Notification::", error);

        }
    };

    ////////////////////  Reject the movement of underlings ///////////////////////////////////
    const RescheduleMovement = async () => {
        console.log("RescheduleMovementRescheduleMovement");
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                console.log(BASE_URL + `/staff/authmovementReschedule/${data1.RequestNo}/${startTime}/${remarks}`);

                const movementDetails = await fetch(BASE_URL + `/staff/authmovementReschedule/${data1.RequestNo}/${startTime}/${remarks}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                })
                const movementDetailsData = await movementDetails.json()
                console.log('from api supervisorMovement reschduled', movementDetailsData);
                notificationfunction();
                submitModel(ALERT_TYPE.SUCCESS, "Success", `Request Rescheduled Successfully.`)
                setLoading(false);


            } catch (error) {
                console.log('Error fetching supervisorMovement Reschedule Api ::', error);
                setLoading(false)
                submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
                // setShowModal(true)
            }
        }
    }

    const submitModel = (type, title, message) => {
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
            <View style={{ flex: 1, paddingTop: -40 }}>
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                    <View>
                        <View style={[styles.innerContainer]}>

                            <View style={[styles.eachInput]}>
                                <Text style={styles.txtStyle}>Purpose: {data1.Purpose}</Text>
                            </View>

                            {data1.leave != 0 ?
                                <View style={[styles.eachInput]}>
                                    <Text style={styles.txtStyle}>Leave: {data1.Leave}</Text>

                                </View> : null

                            }


                            {/* selecting movement inside or outside */}

                            <View style={styles.eachInput}>
                                <Text style={styles.txtStyle}>Location: {data1.LocationType}</Text>
                            </View>
                            <View style={styles.eachInput}>
                                <Text style={styles.txtStyle}>Requested Time: {data1.CheckOut}</Text>
                            </View>

                            {/* time picker */}
                            <View style={styles.eachInput}>
                                <Text style={styles.txtStyle}>Select Check-Out Time</Text>
                                <TouchableOpacity onPress={showDatePicker}>
                                    <View pointerEvents="none">
                                        <TextInput
                                            style={[styles.inputBox, { width: '100%' }]}
                                            value={getTime(startTime)}
                                            placeholder="Time..."
                                            editable={false}
                                            inputStyles={{ color: 'black' }}
                                            placeholderTextColor="#000"
                                        />
                                    </View>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={startTimePickerVisible}
                                    mode="time"
                                    onConfirm={starttimehandleConfirm}
                                    onCancel={() => setStartTimePickerVisibility(false)}
                                />
                            </View>
                            {/* to write down remarks */}
                            <View style={styles.eachInput}>
                                <Text style={styles.txtStyle}>Remarks</Text>
                                <TextInput
                                    value={remarks}
                                    style={[styles.inputBox, { color: 'black' }]}
                                    onChangeText={setRemarks}
                                />
                            </View>
                            {
                                startTime != "" && remarks.trim() != "" ?
                                    <View style={styles.eachInput}>
                                        <TouchableOpacity style={styles.btn} onPress={() => {
                                            RescheduleMovement();
                                        }
                                        }>
                                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={styles.eachInput}>
                                        <TouchableOpacity style={[styles.btn, { opacity: 0.5 }]} disabled
                                        >
                                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                            }

                        </View>
                    </View>
                </ScrollView>
            </View>
        </AlertNotificationRoot>
    )
}

export default MovementReschedule

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: '#f1f1f1',

    },
    innerContainer: {
        backgroundColor: 'white',
        marginTop: 24,
        elevation: 2,
        // borderRadius: 24,
        paddingHorizontal: 40,
        paddingVertical: 16
    },
    eachInput: {
        marginTop: 16,
        rowGap: 4
    },
    inputBox: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginTop: 8,
        color: 'black',
        backgroundColor: '#fffafa'
    },

    btn: {
        marginVertical: 4,
        paddingHorizontal: 32,
        paddingVertical: 12,
        backgroundColor: colors.uniBlue,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    txtStyle: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600'
    },
})