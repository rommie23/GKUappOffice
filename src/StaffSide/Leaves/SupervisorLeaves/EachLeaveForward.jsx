import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import { launchImageLibrary as _launchImageLibrary, launchCamera as _launchCamera } from 'react-native-image-picker';
import { StudentContext } from '../../../context/StudentContext';

import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import moment from 'moment';
import colors from '../../../colors';
import { useNavigation } from '@react-navigation/native';

const EachLeaveForward = ({ route }) => {
    const { leaveId, name, buttonType, VCId } = route.params;
    console.log(route.params);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
    const [leaveData, setLeaveData] = useState({})
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation()

    const startdatehandleConfirm = (date) => {
        setStartDate(date);
        setStartDatePickerVisibility(false);
    };

    const enddatehandleConfirm = (date) => {
        setEndDate(date);
        setEndDatePickerVisibility(false);
    };

    const showDatePicker = () => {
        setStartDatePickerVisibility(true);
    };

    const showEndDatePicker = () => {
        setEndDatePickerVisibility(true);
    };

    const clearState = () => {
        setStartDate('');
        setEndDate('');
        setText('')
    };


    const getDate = (date) => {
        if (!date) return '';
        let tempDate = date.toString().split(' ');
        return `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`;
    };


    const getLeaveData = async () => {
        setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        try {
            if (session != null) {
                const res = await fetch(BASE_URL + '/staff/eachLeaveData', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        leaveId: leaveId,
                    })
                })
                const response = await res.json()
                const dataToUse = response['recordset'][0]
                setStartDate(new Date(response['recordset'][0]['StartDate']))
                setEndDate(new Date(response['recordset'][0]['EndDate']))
                setLeaveData(dataToUse)
                setIsLoading(false)
                console.log(response['recordset'][0]);
                // submitModel(ALERT_TYPE.SUCCESS, "Success", 'Updated Successfully')
            }
        } catch (error) {
            console.log("error in getLeaveData::", error);
        }
    }

    useEffect(() => {
        getLeaveData(leaveId);
    }, [])

    const notificationfunction = async (recipient, notifiId) => {
        console.log("notificationfunction called");

        const session = await EncryptedStorage.getItem("user_session");
        if (!session) return;

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000); // stop if takes >5s

            const res = await fetch(`${BASE_URL}/notifiaction/sendNotification`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    receipients: recipient,
                    notificationId: notifiId,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeout);

            if (res.ok) {
                submitModel(ALERT_TYPE.SUCCESS, "Success", "Updated Successfully & Notification Sent");
            } else {
                submitModel(ALERT_TYPE.SUCCESS, "Partial Success", "Updated, but notification may not have sent");
            }
        } catch (error) {
            console.log("Notification error:", error.message);
            submitModel(ALERT_TYPE.SUCCESS, "Success", "Updated Successfully, but notification not sent");
        }
    };


    const recommendOrSanctionLeave = async (recepient) => {
        setIsLoading(true)
        console.log("recommendOrSanctionLeave :: ", recepient);

        const session = await EncryptedStorage.getItem("user_session");
        console.log(endDate, startDate, text);
        if (session != null) {
                try {
                const res = await fetch(BASE_URL + '/staff/recommendOrSanctionLeave', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        leaveId: leaveId,
                        startDate: startDate,
                        endDate: endDate,
                        remarks: text,
                        buttonType: buttonType
                    })
                })
                const response = await res.json()
                console.log("recommendOrSanctionLeave:::", response);
                const notificationTasks = []
                if (buttonType == 3) {
                    notificationfunction(recepient, 7)
                } else if (buttonType == 1) {
                    console.log(recepient['AuthorityId']);
                    console.log(recepient['StaffId']);

                    notificationfunction(recepient['Authority'], 8)
                    notificationfunction(recepient['StaffId'], 9)
                } else if (buttonType == 2) {
                    notificationfunction(recepient, 10)
                    notificationfunction([VCId], 8)
                } else {
                    notificationfunction(recepient, 11)
                }
                await Promise.allSettled(notificationTasks)
                submitModel(ALERT_TYPE.SUCCESS, "Success", 'Updated Successfully')
            } catch (error) {
                console.log(error);
                submitModel(ALERT_TYPE.WARNING, "Error", "Network Issue, please try again");
            } finally{
                setIsLoading(false) 
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
            <Spinner
                visible={isLoading}
                textContent={'Please wait...'}
                textStyle={{ color: '#fff' }}
                overlayColor="rgba(0,0,0,0.4)" // slightly dark background
            />

            <ScrollView keyboardShouldPersistTaps={'handled'}>
                <View>
                    <View style={{ padding: 20, backgroundColor: '#ffff' }}>
                        <View style={styles.rowSpacer} />
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, color: 'black' }}>Name : </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: 'black' }}>{name} ({leaveData['StaffId'] && leaveData['StaffId']})</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, color: 'black' }}>Leave Date : </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: 'black' }}>{leaveData['StartDate'] && leaveData['StartDate'].split("T")[0].split("-").reverse().join("-")} TO {leaveData['EndDate'] && leaveData['EndDate'].split("T")[0].split("-").reverse().join("-")}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, color: 'black' }}>Duration : </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: 'black' }}>{`${leaveData["LeaveDurationsTime"] > 0 ? leaveData["LeaveDurationsTime"] : leaveData["LeaveDuration"]}`}</Text>
                        </View>
                        <View>
                            <View style={styles.rowSpacer} />
                            <View style={{ backgroundColor: 'white' }}>
                                <Text style={{ color: '#757575' }}>Sanctioned/Reccomended Start Date :</Text>
                                <View style={styles.rowSpacer} />
                                <TouchableOpacity onPress={showDatePicker}>
                                    <TextInput
                                        style={styles.textInput}
                                        value={getDate(startDate)}
                                        placeholder="Date..."
                                        editable={false}
                                        inputStyles={{ color: 'black' }}
                                        placeholderTextColor="#000"
                                    />
                                </TouchableOpacity>
                            </View>
                            <DateTimePickerModal
                                isVisible={isStartDatePickerVisible}
                                mode="date"
                                onConfirm={startdatehandleConfirm}
                                onCancel={() => setStartDatePickerVisibility(false)}
                                minimumDate={moment().toDate()}
                            />
                            <View style={styles.rowSpacer} />
                            <View style={{ backgroundColor: 'white' }}>
                                <Text style={{ color: '#757575' }}>Sanctioned/Reccomended End Date :</Text>
                                <View style={styles.rowSpacer} />
                                <TouchableOpacity onPress={showEndDatePicker}>
                                    <TextInput
                                        style={styles.textInput}
                                        value={getDate(endDate)}
                                        placeholder="Date..."
                                        editable={false}
                                        placeholderTextColor="#000"
                                    />
                                </TouchableOpacity>
                            </View>
                            <DateTimePickerModal
                                isVisible={isEndDatePickerVisible}
                                mode="date"
                                onConfirm={enddatehandleConfirm}
                                onCancel={() => setEndDatePickerVisibility(false)}
                                minimumDate={moment().toDate()}
                            />
                        </View>
                        <View style={styles.rowSpacer} />
                        <Text style={{ color: '#757575' }}>Sanctioned/Reccomended Remarks</Text>
                        <View style={styles.rowSpacer} />
                        <TextInput
                            style={[styles.inputTextArea, { color: 'black' }]}
                            onChangeText={setText}
                            value={text}
                            placeholder="Enter reason..."
                            placeholderTextColor="#000"
                        />
                        {
                            buttonType == 3 ?
                                <View style={{ marginTop: 16 }}>
                                    <Text style={{ color: 'red' }}>All Fields are required **</Text>
                                    {
                                        text != '' && startDate != '' && endDate != '' ?
                                            <TouchableOpacity style={[styles.bottomBtn, { backgroundColor: colors.uniRed }]} onPress={() => recommendOrSanctionLeave([leaveData['StaffId']])}>
                                                <Text style={styles.btnTxt}>Reject Leave</Text>
                                            </TouchableOpacity> :
                                            <TouchableOpacity style={[styles.bottomBtn, { opacity: 0.5, backgroundColor: colors.uniRed }]} disabled>
                                                <Text style={styles.btnTxt}>Reject Leave</Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                                :
                                buttonType == 1 ?
                                    <View style={{ marginTop: 16 }}>
                                        {
                                            text != '' && startDate != '' && endDate != '' ?
                                                <TouchableOpacity style={styles.bottomBtn} onPress={() => recommendOrSanctionLeave({
                                                    "Authority": [leaveData['AuthorityId']],
                                                    "StaffId": [leaveData['StaffId']]
                                                })}>
                                                    <Text style={styles.btnTxt}>Forward to Authority</Text>
                                                </TouchableOpacity> :
                                                <View>
                                                    <Text style={{ color: 'red' }}>All Fields are required **</Text>
                                                    <TouchableOpacity style={[styles.bottomBtn, { opacity: 0.5 }]} disabled>
                                                        <Text style={styles.btnTxt}>Forward to Authority</Text>
                                                    </TouchableOpacity>
                                                </View>
                                        }
                                    </View> :
                                    buttonType == 2 ?
                                        <View style={{ marginTop: 16 }}>
                                            {
                                                text != '' && startDate != '' && endDate != '' ?
                                                    <TouchableOpacity style={styles.bottomBtn} onPress={() => recommendOrSanctionLeave([leaveData['StaffId']])}>
                                                        <Text style={styles.btnTxt}>Forward to VC</Text>
                                                    </TouchableOpacity> :
                                                    <View>
                                                        <Text style={{ color: 'red' }}>All Fields are required **</Text>
                                                        <TouchableOpacity style={[styles.bottomBtn, { opacity: 0.5 }]} disabled>
                                                            <Text style={styles.btnTxt}>Forward to VC</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                            }
                                        </View> :
                                        buttonType == 4 ?
                                            // leaveData['SanctionId'] == VCId && leaveData['Status'] == "Pending to Sanction" ?
                                            <View style={{ marginTop: 16 }}>
                                                {
                                                    text != '' && startDate != '' && endDate != '' && !isLoading?
                                                        <TouchableOpacity style={styles.bottomBtn} onPress={() => recommendOrSanctionLeave([leaveData['StaffId']])} disabled={isLoading}>
                                                            <Text style={styles.btnTxt}>Approve Leave</Text>
                                                        </TouchableOpacity> :
                                                        <View>
                                                            <Text style={{ color: 'red' }}>All Fields are required **</Text>
                                                            <TouchableOpacity style={[styles.bottomBtn, { opacity: 0.5 }]} disabled>
                                                                <Text style={styles.btnTxt}>Approve Leave</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                }
                                            </View>
                                            // : leaveData['SanctionId'] != leaveData['AuthorityId'] && leaveData['Status'] == "Pending to Authority" ?
                                            //     <View style={{ marginTop: 16 }}>
                                            //         {
                                            //             text != '' && startDate != '' && endDate != '' ?
                                            //                 <TouchableOpacity style={styles.bottomBtn} onPress={() => recommendOrSanctionLeave()}>
                                            //                     <Text style={styles.btnTxt}>Approve/Sanction Leave</Text>
                                            //                 </TouchableOpacity> :
                                            //                 <View>
                                            //                     <Text style={{ color: 'red' }}>All Fields are required **</Text>
                                            //                     <TouchableOpacity style={[styles.bottomBtn, { opacity: 0.5 }]} disabled>
                                            //                         <Text style={styles.btnTxt}>Approve/Sanction Leave</Text>
                                            //                     </TouchableOpacity>
                                            //                 </View>
                                            //         }
                                            //     </View>
                                            //     : leaveData['Status'] == "Pending to VC" ?
                                            //         <View style={{ marginTop: 16 }}>
                                            //             {
                                            //                 text != '' && startDate != '' && endDate != '' ?
                                            //                     <TouchableOpacity style={styles.bottomBtn} onPress={() => recommendOrSanctionLeave()}>
                                            //                         <Text style={styles.btnTxt}>Approve/Sanction Leave</Text>
                                            //                     </TouchableOpacity> :
                                            //                     <View>
                                            //                         <Text style={{ color: 'red' }}>All Fields are required **</Text>
                                            //                         <TouchableOpacity style={[styles.bottomBtn, { opacity: 0.5 }]} disabled>
                                            //                             <Text style={styles.btnTxt}>Approve/Sanction Leave</Text>
                                            //                         </TouchableOpacity>
                                            //                     </View>
                                            //             }
                                            //         </View>
                                            : null
                        }
                    </View>
                </View>
            </ScrollView>
        </AlertNotificationRoot>
    );
};

export default EachLeaveForward;

const styles = StyleSheet.create({
    rowSpacer: {
        marginTop: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 5,
        padding: 10,
        borderRadius: 10,
        color: '#000'
    },

    inputTextArea: {
        height: 100,
        margin: 0,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10
    },
    bottomBtn: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 0,
        height: 44,
        backgroundColor: `${colors.uniBlue}`,
        color: '#fff',
        textAlignVertical: "center"
    },
    btnTxt: {
        color: '#fff',
        textAlign: 'center',
        padding: 5,
        fontWeight: '700'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
    },
});
