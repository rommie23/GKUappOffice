import { RefreshControl, Dimensions, ScrollView, StyleSheet, Text, Alert, View, TouchableOpacity, ActivityIndicator, Modal, Image } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import colors from '../../../colors';
import { useCallback, useContext, useEffect, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { StudentContext } from '../../../context/StudentContext';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const Convocation = ({ route }) => {
    const { convoData } = route.params
    const { data } = useContext(StudentContext)
    console.log(data);

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false)
    const [pendingStatus, setPendingStatus] = useState(convoData);
    const md5Hash = convoData.TicketReferenceNo;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(md5Hash)}`;

    console.log('convocationdatafdsfsdjaesdfj;fj: ', pendingStatus);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    return (
        <AlertNotificationRoot>
            <ScrollView
                style={{ backgroundColor: '#f1f1f1' }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {
                    convoData['Account'] + convoData['Library'] + convoData['Registration'] + convoData['ConvoRegistrationStatus'] > 3 && convoData['TicketStatus'] == 1 && convoData['SeatNo'] > 0 &&
                    <View style={{ alignItems: 'center', marginTop: 20, backgroundColor: '#fff', paddingVertical: 24 }}>
                        <View style={{ borderColor: colors.uniRed, borderWidth: 2, padding: 20, borderRadius: 16 }}>
                            <View style={{ alignContent: 'flex-start' }}>
                                <Text style={{ color: colors.uniBlue, fontSize: 20, marginBottom: 8, fontWeight: '700', alignSelf: 'center' }}>ENTRY TICKET</Text>
                                <Text style={styles.smallTxt}>Ticket No : {convoData.ID[1]}</Text>
                                <Text style={styles.smallTxt}>{data.data[0].StudentName}</Text>
                                <Text style={styles.smallTxt}>{data.data[0].UniRollNo}</Text>
                            </View>
                            <Image
                                source={{ uri: qrUrl }}
                                style={{ width: 220, height: 220, marginVertical: 16, alignSelf:'center'}}
                            />
                            <View style={{ alignContent: 'flex-start' }}>
                                    <Text style={styles.smallTxt}>Date of Convocation : {convoData.DateOfConvocation.split("T")[0].split("-").reverse().join("-")}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={{fontSize:16, fontWeight:'500'}}><Text style={[styles.smallTxt, {color:colors.uniBlue}]}>Floor: </Text>{convoData.Floor == 1 ? 'First' : 'Second'} </Text>
                                    <Text style={{fontSize:16, fontWeight:'500'}}><Text style={[styles.smallTxt, {color:colors.uniBlue}]}>, Seat No: </Text>{convoData.Row}-{convoData.SeatNo}</Text>
                                </View>
                                <Text style={{fontSize:14, alignSelf:'center', marginTop:10}}>Please carry this ticket</Text>

                            </View>
                        </View>
                    </View>
                }
                <View style={styles.cardOuter}>
                    {
                        loading ? <ActivityIndicator /> :
                            <>
                                <View style={styles.card}>
                                    <View style={{ width: '100%', rowGap: 8 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.cardTxt}>Account</Text>
                                            {
                                                pendingStatus['Account'] > 0 ?
                                                    <View style={{ flexDirection: 'row', columnGap: 8 }}>
                                                        <Text style={{ color: 'green', fontWeight: '600' }}>Accepted</Text>
                                                        <FontAwesome name='check' size={24} color={'green'} />
                                                    </View>
                                                    : pendingStatus['Account'] == 0 || pendingStatus['Account'] == null ?
                                                        <View style={{ flexDirection: 'row', columnGap: 8 }}>
                                                            <Text style={{ color: colors.uniBlue, fontWeight: '600' }}>Pending</Text>
                                                            <FontAwesome name='clock-o' size={24} color={'blue'} />
                                                        </View>
                                                        :
                                                        <View style={{ flexDirection: 'row', columnGap: 8 }}>
                                                            <Text style={{ color: colors.uniRed, fontWeight: '600' }}>Rejected</Text>
                                                            <FontAwesome name='remove' size={24} color={colors.uniRed} />
                                                        </View>
                                            }
                                        </View>

                                        {
                                            pendingStatus['Account'] > 0 ?
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <Text style={{ fontSize: 12, color: 'black' }}>Verified By</Text>
                                                        <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['AccountVerifiedBy']}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <Text style={{ fontSize: 12, color: 'black' }}>Verified Date</Text>
                                                        <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['AccountVerifiedDate'].split('T')[0].split('-').reverse().join('-')}</Text>
                                                    </View>
                                                </View>
                                                : pendingStatus['Account'] < 0 ?
                                                    <View>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                <Text style={{ fontSize: 12, color: 'black' }}>Rejected By</Text>
                                                                <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['AccountRejectedBy']}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                <Text style={{ fontSize: 12, color: 'black' }}>Rejected Date</Text>
                                                                <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['AccountRejectDate']?.split('T')[0].split('-').reverse().join('-')}</Text>
                                                            </View>
                                                        </View>
                                                        <Text style={{ color: colors.uniRed, fontWeight: '600' }}>Reason: {pendingStatus['AccountRejectReason']}</Text>
                                                    </View>
                                                    : null
                                        }



                                    </View>
                                </View>
                                <View style={styles.card}>
                                    <View style={{ width: '100%', rowGap: 8 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.cardTxt}>Library</Text>
                                            {
                                                pendingStatus['Library'] > 0 ?
                                                    <View style={{ flexDirection: 'row', columnGap: 8 }}>
                                                        <Text style={{ color: 'green', fontWeight: '600' }}>Accepted</Text>
                                                        <FontAwesome name='check' size={24} color={'green'} />
                                                    </View>
                                                    : pendingStatus['Library'] == 0 || pendingStatus['Library'] == null ?
                                                        <View style={{ flexDirection: 'row', columnGap: 8 }}>
                                                            <Text style={{ color: colors.uniBlue, fontWeight: '600' }}>Pending</Text>
                                                            <FontAwesome name='clock-o' size={24} color={'blue'} />
                                                        </View>
                                                        :
                                                        <View style={{ flexDirection: 'row', columnGap: 8 }}>
                                                            <Text style={{ color: colors.uniRed, fontWeight: '600' }}>Rejected</Text>
                                                            <FontAwesome name='remove' size={24} color={colors.uniRed} />
                                                        </View>
                                            }
                                        </View>
                                        {
                                            pendingStatus['Library'] > 0 ?
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <Text style={{ fontSize: 12, color: 'black' }}>Verified By</Text>
                                                        <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['LibraryVerifiedBy']}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <Text style={{ fontSize: 12, color: 'black' }}>Verified Date</Text>
                                                        <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['LibraryVerifiedDate']?.split('T')[0].split('-').reverse().join('-')}</Text>
                                                    </View>
                                                </View>
                                                : pendingStatus['Library'] < 0 ?
                                                    <View>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                <Text style={{ fontSize: 12, color: 'black' }}>Rejected By</Text>
                                                                <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['LibraryRejectedBy']}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                <Text style={{ fontSize: 12, color: 'black' }}>Rejected Date</Text>
                                                                <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['LibraryRejectDate'].split('T')[0].split('-').reverse().join('-')}</Text>
                                                            </View>
                                                        </View>
                                                        <Text style={{ color: colors.uniRed, fontWeight: '600' }}>Reason: {pendingStatus['LibraryRejectReason']}</Text>
                                                    </View>
                                                    : null
                                        }
                                    </View>
                                </View>

                                {/* REGISTRATION CARD */}
                                <View style={styles.card}>
                                    <View style={{ width: '100%', rowGap: 8 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.cardTxt}>Registration</Text>
                                            {
                                                pendingStatus['Registration'] > 0 ?
                                                    <View style={{ flexDirection: 'row', columnGap: 8 }}>
                                                        <Text style={{ color: 'green', fontWeight: '600' }}>Accepted</Text>
                                                        <FontAwesome name='check' size={24} color={'green'} />
                                                    </View>
                                                    : pendingStatus['Registration'] == 0 || pendingStatus['Registration'] == null ?
                                                        <View style={{ flexDirection: 'row', columnGap: 8 }}>
                                                            <Text style={{ color: colors.uniBlue, fontWeight: '600' }}>Pending</Text>
                                                            <FontAwesome name='clock-o' size={24} color={'blue'} />
                                                        </View>
                                                        :
                                                        <View style={{ flexDirection: 'row', columnGap: 8 }}>
                                                            <Text style={{ color: colors.uniRed, fontWeight: '600' }}>Rejected</Text>
                                                            <FontAwesome name='remove' size={24} color={colors.uniRed} />
                                                        </View>
                                            }
                                        </View>
                                        {
                                            pendingStatus['Registration'] > 0 ?
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <Text style={{ fontSize: 12, color: 'black' }}>Verified By</Text>
                                                        <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['RegistrationVerifiedBy']}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <Text style={{ fontSize: 12, color: 'black' }}>Verified Date</Text>
                                                        <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['RegistrationVerifiedDate']?.split('T')[0].split('-').reverse().join('-')}</Text>
                                                    </View>
                                                </View>
                                                : pendingStatus['Registration'] < 0 ?
                                                    <View>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                <Text style={{ fontSize: 12, color: 'black' }}>Rejected By</Text>
                                                                <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['RegistrationRejectedBy']}</Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                                                <Text style={{ fontSize: 12, color: 'black' }}>Rejected Date</Text>
                                                                <Text style={{ fontSize: 16, color: 'black' }}>{pendingStatus['RegistrationRejectDate'].split('T')[0].split('-').reverse().join('-')}</Text>
                                                            </View>
                                                        </View>
                                                        <Text style={{ color: colors.uniRed, fontWeight: '600' }}>Reason: {pendingStatus['RegistrationRejectReason']}</Text>
                                                    </View>
                                                    : null
                                        }
                                    </View>
                                </View>
                            </>

                    }
                </View>
                <View>
                    <Text style={[styles.textSmall, { marginVertical: 12, marginHorizontal: 24 }]}><FontAwesome5Icon name='hand-point-right' size={16} color={colors.uniBlue} /> NOTE : This is No Dues Form Which will be verified by above departments. Then you will be able to see your convocation ticket.</Text>
                </View>

            </ScrollView>
        </AlertNotificationRoot>
    )
}

export default Convocation

const styles = StyleSheet.create({
    mainTable: {
        backgroundColor: 'white',
    },
    headerTable: {
        backgroundColor: colors.uniBlue,
    },
    headerText: {
        color: 'white',
        fontSize: 16
    },
    cardOuter: {
        width: screenWidth,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    card: {
        width: '100%',
        backgroundColor: 'white',
        flexDirection: "row",
        justifyContent: 'space-between',
        padding: 16,
        marginTop: 8,
        borderRadius: 16,
        elevation: 1
    },
    cardTxt: {
        color: '#1b1b1b',
        fontSize: 20,
        fontWeight: '500'
    },
    smallTxt: {
        color: '#1b1b1b',
        fontSize: 16,
        fontWeight: '700',
        alignSelf: 'center',
    },
    sgpaLook: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.uniRed,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8
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
        fontSize: 12
    }
})