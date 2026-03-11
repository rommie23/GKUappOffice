import { View, Text, StyleSheet, Dimensions, Image, ScrollView, RefreshControl, ActivityIndicator, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import colors from '../../colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { formatIndianNumber } from '../../services/dateUTCToIST'
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


const AccountsDashboard = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [accData, setAccData] = useState({})
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);

    const dashboardData = async () => {
        setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        try {
            console.log(BASE_URL + '/accounts/mobileDashboardApi');
            
            const accDashboard = await fetch(BASE_URL + '/accounts/mobileDashboardApi', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    startDate : selectedStartDate,
                    endDate: selectedEndDate
                })
            })
            const accDashboardData = await accDashboard.json()
            console.log('accDashboardData ::::::', accDashboardData);
            setAccData(accDashboardData);
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log('inout api error ::', error);
        }
    }
    useEffect(() => {
        dashboardData();
    }, [])

    const showStartDatePicker = () => {
        console.log("showDatePickershowDatePicker");
        setStartDatePickerVisible(true);
    };
    const showEndDatePicker = () => {
        console.log("setEndDatePickerVisible");
        setEndDatePickerVisible(true);
    };

    const handleStartConfirm = (date) => {
        // console.log(date);
        setSelectedStartDate(date);
        setStartDatePickerVisible(false);
    };

    const handleEndConfirm = (date) => {
        // console.log(date);
        setSelectedEndDate(date);
        setEndDatePickerVisible(false);
    };

      const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months start at 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setSelectedEndDate(new Date())
            setSelectedStartDate(new Date())
            dashboardData();
            setRefreshing(false);
        }, 2000);
    }, []);
    // console.log(booksIssued)
    return (
        <View >
            {
                isLoading ? <ActivityIndicator />
                    :
                    <ScrollView style={styles.container}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        { <View>
                                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                                    paddingHorizontal:20, 
                                    paddingVertical:12, width:screenWidth, backgroundColor:colors.uniBlue}}>
                                        <View style={{width:'8%',flexDirection:'row', justifyContent:'center'}}>
                                            <MaterialIcon name='filter-list' size={24} color='white' />
                                        </View>
                                    <View style={{backgroundColor:colors.uniBlue, width:'35%'}}>
                                        <Text style={[styles.textSmall]}>From Date :</Text>
                                        <Pressable onPress={() => showStartDatePicker()} 
                                        // style={{backgroundColor:colors.uniBlue, paddingHorizontal:12, paddingVertical:12, borderRadius:8}}
                                        >
                                            <Text style={{color:'#f1f1f1', fontWeight:'500'}}>{formatDate(selectedStartDate)}</Text>
                                        </Pressable>
                                        <DateTimePickerModal
                                            date={selectedStartDate}
                                            isVisible={startDatePickerVisible}
                                            mode="date"
                                            onConfirm={handleStartConfirm}
                                            onCancel={() => setStartDatePickerVisible(false)}
                                        />
                                    </View>
                                    <View style={{backgroundColor:colors.uniBlue, width:'35%'}}>
                                        <Text style={[styles.textSmall]}>From Date :</Text>
                                        <Pressable onPress={() => showEndDatePicker()} 
                                        // style={{backgroundColor:colors.uniBlue, paddingHorizontal:12, paddingVertical:12, borderRadius:8}}
                                        >
                                            <Text style={{color:'#f1f1f1', fontWeight:'500'}}>{formatDate(selectedEndDate)}</Text>
                                        </Pressable>
                                        <DateTimePickerModal
                                            date={selectedEndDate}
                                            isVisible={endDatePickerVisible}
                                            mode="date"
                                            onConfirm={handleEndConfirm}
                                            onCancel={() => setEndDatePickerVisible(false)}
                                        />
                                    </View>
                                    <View
                                    style={{backgroundColor:colors.uniBlue, width:'22%', height:'100%', marginTop:16}}
                                    >
                                        <Pressable 
                                        style={{backgroundColor:'white', paddingHorizontal:12, paddingVertical:6, borderRadius:8}} onPress={() => dashboardData()}
                                        >
                                            <Text style={{color:'#1b1b1b', fontWeight:'600', fontSize:14, verticalAlign:'middle'}}>Search</Text>
                                        </Pressable>
                                    </View>

                                </View>

                            <View style={[styles.card]}>
                                <View style={[styles.topCard]}>
                                    <Text style={{ width: '100%', fontSize: 18, color: colors.uniBlue, fontWeight: '600' }}>ACCOUNTS</Text>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <FontAwesome5Icon name='credit-card' size={18} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Total Credit</Text>
                                        <Text style={[styles.textStyleR]}>₹ {formatIndianNumber(accData.totalCreditData?.['TotalCredit'])}</Text>
                                    </View>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <FontAwesome5Icon name='money-bill' size={18} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Cash</Text>
                                        <Text style={[styles.textStyleR]}>₹ {formatIndianNumber(accData.totalCashData?.['TotalCash'])}</Text>
                                    </View>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <MaterialCommunityIcons name='bank' size={18} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Bank Transfer</Text>
                                        <Text style={[styles.textStyleR]}>₹ {formatIndianNumber(accData.totalBankTransferData?.['TotalBankTransfer'])}</Text>
                                    </View>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <MaterialCommunityIcons name='contactless-payment-circle' size={18} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Payment Gateway</Text>
                                        <Text style={[styles.textStyleR]}>₹ {formatIndianNumber(accData.totalPaymentGatewayCreditData?.['TotalPaymentGateway'])}</Text>
                                    </View>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <MaterialCommunityIcons name="credit-card-clock" size={18} color={colors.uniRed} />
                                        </View>
                                        <Text style={[styles.textStyleL, { color: colors.uniRed }]}>Pending Collection</Text>
                                        <Text style={[styles.textStyleR, { color: colors.uniRed }]}>₹ {formatIndianNumber(accData.wholeDebitStudentsData?.['wholeDebitStudents'])}</Text>
                                    </View>
                                </View>
                                {/* <View style={[styles.topCard]}>
                                    <Text style={{ width: '100%', fontSize: 18, color: colors.uniBlue, fontWeight: '600' }}>RECEIPTS</Text>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <MaterialCommunityIcons name='receipt' size={20} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Total Receipts</Text>
                                        <Text style={[styles.textStyleR]}>{formatIndianNumber(accData.ReceiptsCount?.['ReceiptsCount'])}</Text>
                                    </View>
                                </View>
                                <View style={[styles.topCard]}>
                                    <Text style={{ width: '100%', fontSize: 18, color: colors.uniBlue, fontWeight: '600' }}>DEAD DEBITS</Text>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <MaterialCommunityIcons name='cash-remove' size={24} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Dead Debits</Text>
                                        <Text style={[styles.textStyleR]}>{formatIndianNumber(accData.allDeadDebitsCountData?.['AllDeadDebitsCount'])}</Text>
                                    </View>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <MaterialCommunityIcons name='clock-outline' size={18} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Pending Dead Debits</Text>
                                        <Text style={[styles.textStyleR]}>{accData.pendingDeadDebitsCountData?.['PendingDeadDebitsCount']}</Text>
                                    </View>
                                </View>
                                <View style={[styles.topCard]}>
                                    <Text style={{ width: '100%', fontSize: 18, color: colors.uniBlue, fontWeight: '600' }}>CONCESSION</Text>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <FontAwesome6Icon name='tags' size={18} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Concessions</Text>
                                        <Text style={[styles.textStyleR]}>{formatIndianNumber(accData.allConcessionCountData?.['AllConcessoinsCount'])}</Text>
                                    </View>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <MaterialCommunityIcons name='clock-outline' size={18} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Pending Concession</Text>
                                        <Text style={[styles.textStyleR]}>{accData.pendingConcessionCountsData?.['PendingConcessoinsCount']}</Text>
                                    </View>
                                </View>
                                <View style={[styles.topCard]}>
                                    <Text style={{ width: '100%', fontSize: 18, color: colors.uniBlue, fontWeight: '600' }}>CANCEL RECEIPTS</Text>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <MaterialIcon name='cancel-presentation' size={22} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Cancelled Receipts</Text>
                                        <Text style={[styles.textStyleR]}>{accData.allCancelledReceiptsCountData?.['AllCancelledReceiptsCounts']}</Text>
                                    </View>
                                </View>
                                <View style={styles.topCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.textStyleI}>
                                            <MaterialCommunityIcons name='clock-outline' size={18} color={colors.uniBlue} />
                                        </View>
                                        <Text style={styles.textStyleL}>Pending Cancelled Receipts</Text>
                                        <Text style={[styles.textStyleR]}>{accData.pendingCancelledReceiptsCountsData?.['PendingCancelledReceiptsCounts']}</Text>
                                    </View>
                                </View> */}
                            </View>
                        </View>
                        }
                    </ScrollView>
            }
        </View>
    )
}

export default AccountsDashboard

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#fff'
    },
    card: {
        backgroundColor: 'white',
        height: 'contain',
        width: screenWidth - 24,
        marginVertical: 12,
        borderRadius: 16,
        alignSelf: 'center',
        paddingHorizontal: 16,
    },
    topCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 0.5,
        paddingVertical: 12
    },
    textStyleI: {
        width: '8%',
        // backgroundColor:'red'
    },
    textStyleL: {
        width: '55%',
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        // backgroundColor:'green'
    },
    textStyleR: {
        width: '37%',
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        // backgroundColor:'blue'
    },
    rowIcon: {
        width: 20,
        height: 20,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textSmall:{
        fontSize:14,
        color:'#f1f1f1'
    },
})