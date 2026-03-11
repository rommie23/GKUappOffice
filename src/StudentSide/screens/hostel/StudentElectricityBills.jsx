import { StyleSheet, Text, View, Dimensions, ActivityIndicator, ScrollView, TouchableOpacity, Modal, PermissionsAndroid } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import colors from '../../../colors';
import { StudentContext } from '../../../context/StudentContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import Orientation from 'react-native-orientation-locker';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const StudentElectricityBills = () => {
    const { data, studentIDNo } = useContext(StudentContext)
    const [loading, setLoading] = useState(false)
    const [billData, setBillData] = useState([])

    const navigation = useNavigation()
    useEffect(() => {
        // Lock to portrait on component mount
        Orientation.lockToLandscape();

        // Cleanup: Unlock orientation on component unmount
        return () => {
            Orientation.lockToPortrait();
        };
    }, []);

    //////////////////   getting data from api while sending the id of the result ///////////////////////
    const eachBill = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const res = await fetch(`http://gurukashiuniversity.co.in/odl-api/meterallblls.php?IDNo=${studentIDNo}`, {
                    method: 'POST',
                })
                const response = await res.json()
                // console.log(response);

                setLoading(false)
                // console.log('sessoin at Amrik details',session);
                setBillData(response['data'])
            } catch (error) {
                console.log('Error fetching bills Api:', error);
                setLoading(false)
                errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
                // setShowModal(true)
            }
        }
    }
    useEffect(() => {
        eachBill();
    }, [])


    const errorModel = (type, title, message) => {
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
            <ScrollView>
                {loading ? <ActivityIndicator /> :
                    <View style={styles.cardOuter}>
                        <ScrollView horizontal style={{ width: screenWidth > screenHeight && "95%" }}>
                            <View>

                                <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: colors.uniBlue }}>
                                    <View style={[styles.cellStyle, { flex: 0.3 }]}>
                                        <Text style={[styles.cardTxt, { color: 'white' }]}>Sno.</Text>
                                    </View >
                                    <View style={[styles.cellStyle, { flex: 1 }]}>
                                        <Text style={[styles.cardTxt, { color: 'white' }]}>Reading Date</Text>
                                    </View>
                                    <View style={[styles.cellStyle, { flex: 1 }]}>
                                        <Text style={[styles.cardTxt, { color: 'white' }]}>Current Reading</Text>
                                    </View>
                                    <View style={[styles.cellStyle, { flex: 0.5 }]}>
                                        <Text style={[styles.cardTxt, { color: 'white' }]}>Unit</Text>
                                    </View>
                                    <View style={[styles.cellStyle, { flex: 1 }]}>
                                        <Text style={[styles.cardTxt, { color: 'white' }]}>Amount(₹)</Text>
                                    </View>
                                </View>
                                {billData.map((result, index) => (
                                    <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: 'white' }} key={index}>
                                        <View style={[styles.cellStyle, { flex: 0.3 }]}>
                                            <Text style={[styles.cardTxt, { color: 'black' }]}>{index + 1}</Text>
                                        </View >
                                        <View style={[styles.cellStyle, { flex: 1 }]}>
                                            <Text style={[styles.cardTxt, { color: 'black' }]}>{`${result['ReadingDate']}`}</Text>
                                        </View>
                                        <View style={[styles.cellStyle, { flex: 1 }]}>
                                            <Text style={[styles.cardTxt, { color: 'black' }]}> {result['CurrentReading']}</Text>
                                        </View>
                                        <View style={[styles.cellStyle, { flex: 0.5 }]}>
                                            <Text style={[styles.cardTxt, { color: 'black' }]}> {result['Unit']}</Text>
                                        </View>
                                        <View style={[styles.cellStyle, { flex: 1 }]}>
                                            <Text style={[styles.cardTxt, { color: 'black' }]}> {result['Amount']}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                }
            </ScrollView>
        </AlertNotificationRoot>

    )
}

export default StudentElectricityBills

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 300,
    },
    printBtn: {
        backgroundColor: colors.uniBlue,
        marginVertical: 16,
        width: Dimensions.get('window').width / 2,
        alignSelf: 'center',
        alignItems: 'center',
        paddingVertical: 8
    },
    btnTxt: {
        color: 'white'
    },
    cardOuter: {
        width: "100%",
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 4,
    },
    card: {
        width: "100%",
        backgroundColor: 'white',
        justifyContent: 'space-between',
        padding: 16,
        marginTop: 8,
        borderRadius: 16,
        elevation: 1,
        rowGap: 8,
    },
    cardTxt: {
        color: '#1b1b1b',
        fontSize: 16,
        fontWeight: '500'
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500'
    },
    sgpaLook: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF7D4',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8
    },
    cellStyle: {
        borderWidth: 0.5,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderColor: 'black'
    },
    header: {
        marginVertical: 16
    },
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
        backgroundColor: colors.uniRed,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginVertical: 8
    },
    textSmall: {
        color: 'black',
        fontSize: 10
    }
})