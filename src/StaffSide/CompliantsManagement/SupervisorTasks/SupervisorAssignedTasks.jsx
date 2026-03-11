import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { BASE_URL, LIMS_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import axios from 'axios';
import {convertUTCToIST} from '../../../services/dateUTCToIST'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StudentContext } from '../../../context/StudentContext';

const screenWidth = Dimensions.get("window").width

const SupervisorPendingTask = () => {
    const { StaffIDNo } = useContext(StudentContext);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [complainData, setComplainData] = useState([])

    const navigation = useNavigation()

    const assignedTasks = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/assignedTasksSupervisor`,{ StaffIDNo })
            const assignedTasksData = response.data;
            setComplainData(assignedTasksData)
            // console.log("assignedTasksData::", assignedTasksData);
            setLoading(false)
        } catch (error) {
            console.log(error);
            newModel(ALERT_TYPE.DANGER, 'oops something went wrong !', 'Try after Sometime')
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        assignedTasks();
    }, []))

    const newModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
            onHide: () => navigation.goBack()
        })
    }


    const onRefresh = useCallback(() => {
        setRefreshing(true)
        assignedTasks()
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
                                        <View style={[styles.bottomCardTop, { width: '70%' }]}>
                                            <FontAwesome5 name='walking' size={24} color={colors.uniBlue} />
                                            <Text style={styles.textStyle}>Complain No. {item['id']}</Text>
                                        </View>
                                        <View style={[styles.bottomCardTop, { width: '30%' }]}>
                                            <Text style={styles.textStyle}>Assign No. {item['assignId']}</Text>
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
                                        <View style={{ width: '70%' }}>
                                            <Text style={styles.textSmall}>Location</Text>
                                            <Text style={[styles.textStyle]}>{`Block ${item['BlockName']} Floor ${item['Floor']}, Room No. ${item['RoomNo']}`}</Text>
                                        </View>
                                        <View style={{ width: '30%' }}>
                                            <Text style={[styles.textSmall]}>Status</Text>
                                            <Text style={[styles.textStyle, { color: item['status'] == 'accepted' ? 'green' : colors.uniBlue, fontWeight: '500' }]}>{`${item['status']}`}</Text>
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
                                    <View style={[styles.transaction]}>
                                        <View >
                                            <TouchableOpacity
                                                style={[{ backgroundColor: colors.uniRed, paddingVertical: 6, borderRadius: 8, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }]}>
                                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }} onPress={() => navigation.navigate('AssignTaskEach', { taskId: item['id'] })}>View Task/ Assign to More</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))
                            :
                            <Text style={{ color: '#aaaaaa', alignSelf: 'center' }}>No Record Found</Text>
                    }
                </ScrollView>
            </View>
        </AlertNotificationRoot>
    )
}

export default SupervisorPendingTask

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
    },
    textSmall: {
        color: '#4C4E52',
        fontSize: 10
    },
})