import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Modal, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import Foundation from 'react-native-vector-icons/Foundation'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
import axios from 'axios';
import colors from '../../../colors';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RecentTransactions = () => {
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  
  const navigation = useNavigation()
// //////////// fetching data by api //////////////
  const getTransactions = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {      
      try {
          const TransactionsDetails = await fetch(BASE_URL + '/student/transactionsTest', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json',
          },
        })
        const TransactionsDetailData = await TransactionsDetails.json()        
        if(TransactionsDetailData.data.length == 0){
          errorModel(ALERT_TYPE.WARNING,"No Transactions", `No recent transactions to show !`)
          // setShowModal(true)
        }
        setTransactions(TransactionsDetailData.data)
        console.log('data froms api recent Transactions',TransactionsDetailData)
        setLoading(false)        
        // console.log(transactions);
      } catch (error) {
        console.log('Error fetching transaction data:transaction:', error)
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something Went wrong.`)
        // setShowModal2(true)
      }
    }
  }
  useEffect(() => {
    getTransactions()
  }, [])

  const resyncApi = async (txid) => {
          setLoading(true);  
          const session = await EncryptedStorage.getItem("user_session");
          console.log(`token: Bearer ${session}`);
  
          if (session != null) {
              try {
                  const paymentDetailsData = await axios.post(
                      "https://payment.gku.ac.in/api/payu/payment-sync",
                      {
                          "transaction_id": txid
                      },
                      {
                          responseType: 'text',  // forcing raw text to handle broken JSON
                          headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                          },
                      }
                  );
  
                  let parsedData;
                  console.log(paymentDetailsData);
                  
                  try {
                      parsedData = JSON.parse(paymentDetailsData.data);
                  } catch (parseErr) {
                      console.warn('Primary JSON.parse failed:', parseErr);
                      // 🩹 Try to auto-fix: trim + add missing brace
                      let fixed = paymentDetailsData.data.trim();
                      if (!fixed.endsWith('}')) {
                          fixed += '}';
                      }
                      try {
                          parsedData = JSON.parse(fixed);
                          console.log('Successfully parsed with fallback fix.');
                      } catch (fixErr) {
                          console.error('Fallback parse failed too:', fixErr);
                          throw new Error('Invalid JSON from server.');
                      }
                  }
  
                  console.log("Parsed payment data:", parsedData);
                  if (parsedData.status != 'failure') {
                    inModel(ALERT_TYPE.SUCCESS,"Updated", "Payment Status Updated Successfully.")
                  }else{
                    inModel(ALERT_TYPE.WARNING,"Failed", "No Payment Found.")
                  }
                  setLoading(false);
              } catch (error) {
                  console.log('Error fetching confirmPayment API:', error);
                  setLoading(false);
                  errorModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong.");
              }
          } else {
              console.warn("No session found.");
              setLoading(false);
          }
      }

      const resyncRazorPayApi = async(txid)=>{
        setLoading(true);
        const session = await EncryptedStorage.getItem("user_session");
          console.log(`token: Bearer ${session}`);
  
          if (session != null) {
              try {
                  const paymentDetailsData = await axios.post(
                      "https://payment.gku.ac.in/api/razorpay/payment-sync",
                      {
                          "transaction_id": txid
                      },
                      {
                          responseType: 'text',  // forcing raw text to handle broken JSON
                          headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                          },
                      }
                  );
  
                  let parsedData;
                  console.log(paymentDetailsData);
                  
                  try {
                      parsedData = JSON.parse(paymentDetailsData.data);
                  } catch (parseErr) {
                      console.warn('Primary JSON.parse failed:', parseErr);
                      // 🩹 Try to auto-fix: trim + add missing brace
                      let fixed = paymentDetailsData.data.trim();
                      if (!fixed.endsWith('}')) {
                          fixed += '}';
                      }
                      try {
                          parsedData = JSON.parse(fixed);
                          console.log('Successfully parsed with fallback fix.');
                      } catch (fixErr) {
                          console.error('Fallback parse failed too:', fixErr);
                          throw new Error('Invalid JSON from server.');
                      }
                  }
  
                  console.log("Parsed payment data:", parsedData);
                  if (parsedData.status != 'failure') {
                    inModel(ALERT_TYPE.SUCCESS,"Updated", "Payment Status Updated Successfully.")
                  }else{
                    inModel(ALERT_TYPE.WARNING,"Failed", "No Payment Found.")
                  }
                  setLoading(false);
              } catch (error) {
                  console.log('Error fetching confirmPayment API:', error);
                  setLoading(false);
                  errorModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong.");
              }
          } else {
              console.warn("No session found.");
              setLoading(false);
          }
      }


  ///////// recall the data if user push down the page //////////////
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTransactions();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  const inModel = (type, title, message)=> {
    Dialog.show({
        type: type ,
        title: title,
        textBody: message,
        button: 'close',
        // onHide : ()=>navigation.goBack()
        })
  }

  const errorModel = (type, title, message)=> {
    Dialog.show({
        type: type ,
        title: title,
        textBody: message,
        button: 'close',
        onHide : ()=>navigation.goBack()
        })
  }
  return (
    <AlertNotificationRoot>
    <View >
      {
      <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      >
        {/* Card starts here */}
        {loading ? <ActivityIndicator size={'large'} /> :
        transactions.map((transaction, i) => (
          <View style={styles.card} key={i}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <View style={styles.bottomCardTop}>
                <Feather name='list' size={24} color={colors.uniBlue} />
                <Text style={styles.textStyle}>Transaction Details</Text>
              </View>
              <View>
                {
                  transaction['Gateway'] == 'razorpay' ?
                  <TouchableOpacity style={[styles.modalBtn, {borderRadius:4}]} onPress={()=>{resyncRazorPayApi(transaction['txnid'])}}>
                    <Text style={[styles.textSmall]}><Foundation size={12} name='refresh'/> ReCheck</Text>
                  </TouchableOpacity> :
                  <TouchableOpacity style={[styles.modalBtn, {borderRadius:4, backgroundColor:colors.uniBlue}]} onPress={()=>{resyncApi(transaction['txnid'])}}>
                    <Text style={[styles.textSmall]}><Foundation size={12} name='refresh'/> ReCheck</Text>
                  </TouchableOpacity>
                }
                {/* {
                  transaction['Status'] == 'success' ?
                  <Text style={[styles.textStyle, {color: transaction['Status'] == 'success' ? 'green' : 'red', textTransform:'capitalize', fontWeight:'500', textAlignVertical:'bottom'}]}>{transaction['Status']}</Text> :
                  <TouchableOpacity style={[styles.modalBtn, {borderRadius:4}]} onPress={()=>{resyncApi(transaction['txnid'])}}>
                    <Text style={[styles.textSmall]}><Foundation size={12} name='refresh'/> ReCheck</Text>
                  </TouchableOpacity>
                } */}
                
              </View>
            </View>
            <View style={styles.topCard}>
              <View >
                <Text style={styles.textStyle}>Reference Number</Text>
                <Text style={[styles.textStyle]}>{transaction['mihpayid'] ? transaction['mihpayid'] : transaction['txnid']}</Text>
              </View>
              <View style={{width:'30%'}}>
                <Text style={[styles.textStyle]}>Receipt Date</Text>
                <Text style={[styles.textStyle, styles.rowMiddle]}>{(JSON.stringify(transaction['Paymentdate']).slice(1,11)).split("-").reverse().join("-")}</Text>
              </View>
              <View>
                <Text style={styles.textStyle}>Amount Paid</Text>
                <Text style={[styles.textStyle, styles.rowMiddle]}>₹{transaction['Amount']}</Text>
              </View>
            </View>
              <View style={styles.transaction}>
                <View>
                  <Text style={[styles.textSmall, styles.textStyle]}>Semester</Text>
                  <Text style={styles.textStyle}>{transaction['sem']}</Text>
                </View>
                <View style={{width:'30%', marginLeft:'10%'}}>
                  <Text style={[styles.textSmall, styles.textStyle]}>Type</Text>
                  <Text style={styles.textStyle}>{transaction['FeeType']}</Text>
                </View>
                <View style={{width:'20%'}}>
                  <Text style={[styles.textSmall, styles.textStyle]}>Remarks</Text>
                  <Text style={[styles.textStyle]}>{transaction['Remarks']}</Text>
                </View>
              </View>
          </View>

        ))
        }
      </ScrollView>
      }
    </View>
    </AlertNotificationRoot>
  )
}

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
    // alignItems:'center',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 0.5,
    paddingVertical: 12
  },
  textStyle: {
    color: '#1b1b1b',
    fontSize: 12
  },
  transaction: {
    // marginBottom: 16,
    // borderBottomColor: 'lightgray',
    // borderBottomWidth: 0.5,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bottomCardTop: {
    flexDirection: 'row',
    columnGap: 16,
    alignItems: 'center',
    justifyContent:'center'
  },
  bottomCardMiddle: {
    flexDirection: 'row',
    paddingVertical: 6,
    justifyContent: 'space-between'
  },
  textSmall: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight:600
  },
  centeredView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  modalView:{
    backgroundColor:'white',
    padding:20,
    borderRadius:20,
    shadowColor:'black',
    elevation:2,
    alignItems:'center',
    width:'80%',
    paddingTop:48
  },
  modalBtn:{
    backgroundColor:colors.uniRed,
    alignItems:'center',
    paddingHorizontal:8,
    paddingVertical:4,
    marginVertical:4
  },
})

export default RecentTransactions