import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';


const TrackApplyDocument = () => {
    const [requests, setRequests] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()

    const ViewLeaveRequests = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        setIsLoading(true)
        if (session != null) {
            try {
                const res = await fetch(BASE_URL + '/student/allDocRequests', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    }
                })
                const response = await res.json();
                // console.log("response :::: ", response);
                setRequests(response)
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
            }
        }
    }
    useFocusEffect(useCallback(()=>{
        ViewLeaveRequests();
    },[]))

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
                    <View style={{ height: '90%' }}>
                        <ScrollView>
                            {
                                requests['data'] ? requests['data'].map((request, i) => (
                                    <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: 'white', margin: 8, elevation: 1, borderRadius: 12 }} key={i} onPress={
                                        () => request['Status'] < 0 ? navigation.navigate('TrackEachRequest', { requestId: request['Id'] }) : null
                                    }>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: '75%' }}>
                                                <View style={{ flexDirection: 'row', columnGap: 4 }}>
                                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>Request ID: </Text>
                                                    <Text style={{ color: 'black', fontSize: 15 }}>{request['Id']}</Text>

                                                </View>
                                                <View style={{ flexDirection: 'row', columnGap: 4 }}>
                                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>Request Date: </Text>
                                                    <Text style={{ color: 'black', fontSize: 15 }}>{request['SubmitDate'].split('T')[0].split("-").reverse().join("-")}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', columnGap: 4 }}>
                                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>Requested Document: </Text>
                                                    <Text style={{ color: 'black', fontSize: 15 }}>{request['DocumentName']}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>Receiving Type:
                                                    </Text>
                                                    <Text style={{ color: 'black', fontSize: 15 }}> {request['ReceivingType']}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ width: '25%' }}>
                                                <View style={{ flexDirection: 'row', columnGap: 4, alignSelf: 'center' }}>
                                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>Status </Text>
                                                </View>
                                                <View style={{ alignSelf: 'center' }}>
                                                    {
                                                        <Text style={{ color: 'green', fontSize: 15, textAlign: 'center' }}>{request['Status'] == -1 ? `Request Confirmation Pending` :
                                                            request['Status'] == 0 ? `Pending to Pay` : 
                                                                request['Status'] == 1 ? `Pending to SIC ` : null
                                                        }</Text>
                                                    }
                                                    <View>

                                                        {
                                                            request['Status'] == -1 ?
                                                                <View style={{ alignSelf: 'center' }}>
                                                                    <FontAwesome5Icon name='eye' size={24} color={colors.uniBlue} />
                                                                </View>
                                                                : request['Status'] == 0 ?
                                                                    <TouchableOpacity style={{ alignSelf: 'center', paddingHorizontal:8, paddingVertical:4, backgroundColor:colors.uniBlue, borderRadius:4 }} onPress={()=> navigation.navigate('ConfirmDocumentPayment', { requestId: request['Id'] })}>
                                                                        <Text style={{color:'white'}}>Pay Now</Text>
                                                                    </TouchableOpacity> : null
                                                        }
                                                    </View>
                                                </View>

                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                ))
                                    :
                                    <Text style={{ textAlign: 'center' }}>No Data Found</Text>
                            }

                        </ScrollView>
                    </View>
            }
        </AlertNotificationRoot >
    )
}

export default TrackApplyDocument

const styles = StyleSheet.create({})