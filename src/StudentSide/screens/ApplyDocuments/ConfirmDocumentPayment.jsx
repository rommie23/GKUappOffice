import { View, Text, Image, StyleSheet, Dimensions, Alert, ScrollView, TextInput, SafeAreaView, TouchableOpacity, Modal, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../../colors'
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { StudentContext } from '../../../context/StudentContext';
import axios from 'axios';


const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const ConfirmDocumentPayment = ({ route }) => {
  const requestId = route?.params?.requestId;
  const { data } = useContext(StudentContext)
  const navigation = useNavigation()
  const [paymentData, setPaymentData] = useState('')
  const [loading, setLoading] = useState(false)



  const paymentDataFetch = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const paymentDetails = await fetch(BASE_URL + `/student/getPaymentData`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: requestId
          })
        })
        const paymentDetailsData = await paymentDetails.json();
        setPaymentData(paymentDetailsData['data'])
        // console.log('paymentDataFetch :: ', paymentDetailsData);

        setLoading(false);
      } catch (error) {
        console.log('Error fetching paymentDataFetch Api ::', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
      }
    }
  }

  useEffect(() => {
    paymentDataFetch()
  }, [])

  const confirmPayment = async () => {
  setLoading(true);

  console.log(`
    idno: ${data.data[0].IDNo},
    firstname: ${data.data[0].StudentName},
    email: ${data.data[0].EmailID},
    phone: ${data.data[0].StudentMobileNo},
    productinfo: Request Document Fees,
    remarks: ${paymentData.DocumentName},
    amount: ${paymentData.TotalAmount},
    requestid: ${paymentData.Id}
  `);

  const session = await EncryptedStorage.getItem("user_session");
  // console.log(`token: Bearer ${session}`);

  if (session != null) {
    try {
      const paymentDetailsData = await axios.post(
        "https://payment.gku.ac.in/api/payu/initiate",
        {
          idno: data.data[0].IDNo,
          firstname: data.data[0].StudentName,
          email: data.data[0].EmailID,
          phone: data.data[0].StudentMobileNo,
          productinfo: "Document Fee",
          remarks: paymentData.DocumentName,
          amount: paymentData.TotalAmount,
          requestid: paymentData.Id,
          semester : 0
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
      try {
        parsedData = JSON.parse(paymentDetailsData.data);
        navigation.navigate('PayFeeScreen', {payData:parsedData})
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
          navigation.navigate('PayFeeScreen', {payData:parsedData})
        } catch (fixErr) {
          console.error('Fallback parse failed too:', fixErr);
          throw new Error('Invalid JSON from server.');
        }
      }

      console.log("Parsed payment data:", parsedData);

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
};

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }
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
      <View>
        {loading &&
          <Spinner
            visible={loading}
            size={'large'}
          />
        }

        <ScrollView keyboardShouldPersistTaps={'handled'}>
          {/* //////////////// form //////////////////// */}
          <SafeAreaView style={styles.container}>
            <View style={styles.inputView}>

              <Text style={{ color: '#666666', marginTop: 10 }}>ID No.</Text>
              <View style={styles.loginInput}>
                <TextInput
                  style={styles.inputBox}
                  placeholder={`${paymentData['IDNo']}`}
                  placeholderTextColor={'#666666'}
                  editable={false}
                />
              </View>
              <Text style={{ color: '#666666', marginTop: 10 }}>Fee Type</Text>
              <View style={styles.loginInput}>
                <TextInput
                  style={styles.inputBox}
                  placeholder='Request Document Fees'
                  placeholderTextColor={'#666666'}
                  editable={false}
                />
              </View>
              <Text style={{ color: '#666666', marginTop: 10 }}>Amount</Text>
              <View style={styles.loginInput}>
                <TextInput
                  style={styles.inputBox}
                  placeholder={`${paymentData['TotalAmount']}`}
                  placeholderTextColor={'#666666'}
                  editable={false}
                />
              </View>
              <Text style={{ color: '#666666', marginTop: 10 }}>Remarks</Text>
              <View style={styles.loginInput}>
                <TextInput
                  style={styles.inputBox}
                  placeholder={`${paymentData['DocumentName']}`}
                  placeholderTextColor={'#666666'}
                  editable={false}
                />
              </View>
              <View>
                <Text style={{ color: '#666666', marginTop: 10 }}>Mobile No.</Text>
                <View style={[styles.loginInput, { marginTop: 8 }]}>
                  <TextInput
                    style={styles.inputBox}
                    placeholder={`${data['data'][0]['StudentMobileNo']}`}
                    placeholderTextColor={'#666666'}
                    editable={false}
                  />
                </View>
                <Text style={{ color: 'red', fontSize: 11 }}>*To change Mobie number visit profile page*</Text>

              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => confirmPayment()}>
                <Text style={styles.btnText}>Confirm Payment</Text>
              </TouchableOpacity>
            </View>
            {/* <Text onPress={()=>removeSession()}>logout</Text> */}
          </SafeAreaView>
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  )
}

export default ConfirmDocumentPayment

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: 'white'
  },
  logoTop: {
    width: screenWidth,
    height: screenHeight / 25,
    resizeMode: 'contain',
  },
  logoImage: {
    //   opacity:0.8,
    height: 160,
    width: 170,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
    color: "#223260"
  },
  inputView: {
    gap: 10,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 10
  },
  inputBox: {
    height: 44,
    paddingHorizontal: 20,
    width: '90%',
    color: 'black'
  },
  loginInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#223560",
    borderWidth: 1,
    borderRadius: 7
    //   paddingBottom:0

  },
  button: {
    backgroundColor: "#223260",
    height: 55,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 16
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textSmall: {
    color: 'gray',
    fontSize: 16
  },
  smallText: {
    color: '#4C4E52',
    fontSize: 12,
  },
});