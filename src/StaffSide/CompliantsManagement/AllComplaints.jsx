// ///////////////////////// MY COMPLAINS PAGE //////////// 

import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { LIMS_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';
import {convertUTCToIST} from '../../services/dateUTCToIST'

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const AllComplaints = () => {
    const { StaffIDNo } = useContext(StudentContext);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [complainData, setComplainData] = useState([])

    const complains = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/myCompliants`, {
                StaffIDNo
            })
            const complainsData = response.data;
            setComplainData(complainsData)
            console.log("My complains :: ",JSON.stringify(complainsData, null , 2));
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        complains();
    }, [])


    const onRefresh = useCallback(() => {
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
                                            { item['complainStatus'] == 2 ? 
                                                <FontAwesome5 name={"times"} size={20} color={colors.uniRed} /> :
                                            item['complainStatus'] == 1 && item['status'] == 'pending' ?
                                                <FontAwesome5 name={"clock"} size={20} color={colors.uniBlue} /> :
                                                item['complainStatus'] == 1 && item['status'] == 'in_progress' ?
                                                    <FontAwesome5 name={"cogs"} size={20} color={colors.uniBlue} /> :
                                                    item['complainStatus'] == 1 && item['status'] == 'completed' ?
                                                        <FontAwesome5 name={"check"} size={20} color={'green'} /> :
                                                        <FontAwesome5 name={"clock"} size={20} color={colors.uniBlue} />
                                            }
                                            <Text style={[styles.textStyle, {
                                                fontWeight: '600', color: colors.uniBlue
                                            }]}>
                                                {
                                                    item['complainStatus'] == 2 ? "Rejected" : 
                                                    item['complainStatus'] == 1 ? `${item['status']}` : `Pending`
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
                                        <View style={{ width: '50%' }}>
                                            <Text style={[styles.textSmall]}>Resolved At</Text>
                                            <Text style={[styles.textStyle]}>{item["compete_at"] ? convertUTCToIST(item["compete_at"]) : 'Not Resolved Yet'}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.transaction}>
                                        {
                                            item['complainStatus'] == 2 ? 
                                            <Text style={[styles.textStyle, {color:colors.uniRed}]}>Rejected Due to :{item['reject_remarks']}</Text> : null   
                                        }
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

export default AllComplaints

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