//////////////////// NOT IN USE //////////////////////////////


import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { LIMS_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';
import {convertUTCToIST} from '../../services/dateUTCToIST'
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const AssignTask = () => {
    const { StaffIDNo } = useContext(StudentContext);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [complainData, setComplainData] = useState([])

    const navigation = useNavigation()

    const complains = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/complainForSupervisor`)
            const complainsData = response.data;
            setComplainData(complainsData)
            console.log(complainsData);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        complains();
    }, [])

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
        complains()
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
                                        <Text style={styles.textStyle}>Complain No. {item['id']}</Text>
                                    </View>
                                        <View style={[styles.bottomCardTop, { width: '40%' }]}>
                                    {item['TaskStatus'] == 0 ? 
                                        <FontAwesome5 name={"clock"} size={24} color={colors.uniBlue} /> : 
                                        item['TaskStatus'] == 1 ?
                                        <FontAwesome5 name={"cogs"} size={24} color={colors.uniBlue} /> : 
                                        item['TaskStatus'] == 2 ?
                                        <FontAwesome5 name={"check"} size={24} color={colors.uniBlue} /> : 
                                        null
                                    }
                                            <Text style={[styles.textStyle, {
                                                fontWeight: '600', color: colors.uniBlue
                                            }]}>
                                                {
                                                    item['TaskStatus'] == 0 ? `Pending` :
                                                    item['TaskStatus'] == 0 ? `Under Process` :
                                                    item['TaskStatus'] == 0 ? `Resolved` :
                                                    null
                                                }
                                            </Text>
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
                                <View style={[styles.transaction]}>
                                    <View style={{ width: '50%'}}>
                                        <Text style={[styles.textSmall]}>Resolved At</Text>
                                        <Text style={[styles.textStyle]}>{item["TaskEndTime"] ? item["TaskEndTime"]: 'Not Resolved Yet'}</Text>
                                    </View>
                                    <View style={{ width: '50%'}}>
                                        <TouchableOpacity
                                                style={[{ backgroundColor: colors.uniBlue, paddingVertical: 6, borderRadius: 8, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16}]}>
                                                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }} onPress={()=>navigation.navigate('AssignTaskEach', {taskId:item['id']})}>Assign Task</Text>
                                            </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                        :
                        <Text style={{color:'#aaaaaa', alignSelf:'center'}}>No Record Found</Text>
                    }
                </ScrollView>
            </View>
        </AlertNotificationRoot>
    )
}

export default AssignTask

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
})