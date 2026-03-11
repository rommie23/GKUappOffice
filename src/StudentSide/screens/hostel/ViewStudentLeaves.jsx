import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { ScrollView } from 'react-native-gesture-handler';
import { LIMS_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { StudentContext } from '../../../context/StudentContext';


const ViewStudentLeaves = () => {
    const { studentIDNo } = useContext(StudentContext)
    const [leaves, setLeaves] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const ViewLeaveRequests = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        setIsLoading(true)
        if (session != null) {
            try {
                const leaves = await fetch(LIMS_URL + '/student/showAllLeaves', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        studentId: studentIDNo,
                    })
                })
                const response = await leaves.json();
                console.log("response ::: ", response);
                setLeaves(response)
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
            }
        }
    }

    useEffect(() => {
        ViewLeaveRequests();
    }, [])

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
            {
                isLoading ? <ActivityIndicator /> :
                        <View style={{height:'90%'}}>
                    <ScrollView>
                            {
                                leaves.length > 0 ? leaves.map((leave, i) => (
                                    <View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: 'white', margin: 8, elevation: 1, borderRadius: 12 }} key={i}>
                                        <View style={{ flexDirection: 'row', columnGap: 4 }}>
                                            <Text style={{ color: 'black', fontSize: 15, fontWeight:600 }}>Leave Duration: </Text>
                                            <Text style={{ color: 'black', fontSize: 15 }}>{leave['start_date'].split(' ')[0].split("-").reverse().join("-")}</Text>
                                            <Text style={{ color: 'black', fontSize: 15 }}>TO</Text>
                                            <Text style={{ color: 'black', fontSize: 15 }}>{leave['end_date'].split(' ')[0].split("-").reverse().join("-")}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{ color: 'black', fontSize: 15, fontWeight:600 }}>Remarks: 
                                                </Text>
                                            <Text style={{ color: 'black', fontSize: 15 }}> {leave['remarks']}
                                            </Text>

                                        </View>
                                    </View>
                                ))
                                    :
                                    <Text style={{textAlign: 'center'}}>No Data Found</Text>
                            }

                    </ScrollView>
                    </View>
            }
        </AlertNotificationRoot>
    )
}

export default ViewStudentLeaves

const styles = StyleSheet.create({})