import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL, IMAGE_URL } from '@env';
import { RefreshControl } from 'react-native-gesture-handler';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import colors from '../../colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { StudentContext } from '../../context/StudentContext';
const screenWidth = Dimensions.get('window').width;


const ApproveNodues = () => {
    const [listData, setListData] = useState([])
    const [loading, setLoading] = useState(false)
    const [comment, setComment] = useState(false)
    const [comments, setComments] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const ImageUrl = `${IMAGE_URL}/Images/Staff/`;
    const {data} = useContext(StudentContext)

    const noDuesList = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const data = await fetch(`${BASE_URL}/staff/noDuesToApproveList`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-type": "application/json",
                    }
                })
                const dataDetails = await data.json()
                console.log("Nodues main List ::: ", dataDetails);
                setListData(dataDetails)
                setLoading(false)
            } catch (error) {
                // setShowModal(true)
                console.log('Error fetching OldBusPass data:apply:', error);
                setLoading(false)
            }
        }
    }

    const acceptNoDuesHandler = async (noDuesId, newStatus, receipientId) => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const data = await fetch(`${BASE_URL}/staff/approveNoDues`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        noDuesId,
                        remarks: comments[noDuesId] || "",
                        status: newStatus
                    })
                })
                const dataDetails = await data.json()
                console.log("acceptNoDuesHandler::", dataDetails.flag == 1, dataDetails);
                if (dataDetails.flag == 1) {
                    errorModel(ALERT_TYPE.SUCCESS, "Approved", dataDetails.message)
                    notificationfunction(receipientId)
                    onRefresh();
                }

                setLoading(false)
            } catch (error) {
                // setShowModal(true)
                console.log('Error fetching OldBusPass data:apply:', error);
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        noDuesList();
    }, [])

    const notificationfunction = async (recepients) => {
        console.log("notificationfunction", recepients);

        const session = await EncryptedStorage.getItem("user_session");
        try {
            if (session != null) {
                const res = await fetch(BASE_URL + '/notifiaction/sendNotificationSelected', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        sendby: data.data[0].IDNo,
                        receipients: [recepients],
                        Title: "No Dues Request",
                        body: `${data.data[0].Name} has Approved No Dues.`,
                        screenName: 'TrackNoDues',
                        webUrl: 'staff-no-dues-status.php'
                    })
                })
                const response = await res.json()
                console.log(response);
            }
        } catch (error) {
            console.log("error in Notification::", error);

        }
    }

    const onRefresh = useCallback(() => {
        noDuesList()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const errorModel = (type, title, message) => {
        Dialog.show({
            type: type,
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
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {/* each card which has data of movement */}
                    {loading ? <ActivityIndicator />
                        :
                        // console.log(movements);
                        listData ? listData.map((item, i) => (
                            <View key={i} style={styles.card}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={styles.bottomCardTop}>
                                        <Image source={{ uri: ImageUrl + item["Imagepath"] }} style={{ height: 45, width: 45, borderRadius: 25 }} alt="profile" />
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textStyle]}>Name : {item["EmployeeName"].trim()} ({item["EmpID"]})</Text>
                                            {/* <Text style={styles.textStyle}>Emp. ID : {item["EmpID"]}</Text> */}
                                            <Text style={styles.textStyle}>Department : {item["Department"]}</Text>
                                            <Text style={styles.textStyle}>Designation : {item["Designation"]}</Text>
                                        </View>
                                    </View>
                                </View>
                                {
                                    item.Status == 0 ?
                                        <View style={styles.topCard}>
                                            <View style={{ width: '65%' }}>
                                                <View style={styles.eachInput}>
                                                    <Text style={styles.txtStyle}>Comment</Text>
                                                    <TextInput
                                                        value={comments[item.ID] || ""}
                                                        style={styles.inputBox}
                                                        onChangeText={(text) =>
                                                            setComments(prev => ({
                                                                ...prev,
                                                                [item.ID]: text
                                                            }))
                                                        }
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ width: '35%' }}>
                                                <TouchableOpacity style={{ paddingHorizontal: 12, paddingVertical: 12, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'flex-end', borderRadius: 6 }}
                                                    onPress={() => acceptNoDuesHandler(item.ID, 1, item["EmpID"])
                                                    }>
                                                    <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Approve</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View> :
                                        <View style={styles.topCard}>
                                            <Text style={[styles.textStyle, { color: 'green', fontWeight: '600' }]}>Verified</Text>
                                        </View>
                                }
                            </View>
                        )
                        ) : <Text style={{ fontSize: 14, fontWeight: '600', color: 'black', alignSelf: 'center' }}>No Data Found</Text>

                    }
                </ScrollView>
            </View>
        </AlertNotificationRoot>
    )
}

export default ApproveNodues

const styles = StyleSheet.create({
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
        alignItems: 'flex-end',
        paddingVertical: 12,
    },
    textStyle: {
        color: '#1b1b1b',
        fontSize: 14
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between'
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

    //////////////// CSS of madal ////////////////
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
    inputBox: {
        height: 40,
        // paddingHorizontal : 20,
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginTop: 4,
        color: 'black'
    },
    eachInput: {
        flex: 1,
        alignItems: 'flex-start',
    },
    txtStyle: {
        color: '#1b1b1b'
    },
})