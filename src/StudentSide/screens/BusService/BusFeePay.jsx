import { View, Text, Image, StyleSheet, Dimensions, Alert, ScrollView, TextInput, TouchableOpacity, Modal, Button, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import colors from '../../../colors'
import { useNavigation } from '@react-navigation/native';
import { StudentContext } from '../../../context/StudentContext';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay'



const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height


const BusFeePay = ({ route }) => {
  const { data } = useContext(StudentContext)
  const { fee, sem, routeId, spotId } = route.params
  console.log(route.params);

  const [instructions, setInstructions] = useState([])
  const fees = fee
  const feetype = 'Bus Fee'
  const remarks = 'Bus Fee'

  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [tabsData, setTabsData] = useState([])

  const instructionNote = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const inst = await fetch(`${BASE_URL}/student/convocationInstructions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          }
        })
        const instData = await inst.json()

        console.log("instructionNote :::: ", instData);
        setInstructions(instData)
        // setLoading(false)
      } catch (error) {
        console.log("instructionNote ::::", error);
        setLoading(false)
      }
    }
  }


  const confirmPayment = async () => {
    setLoading(true);
    console.log(
      {
        idno: data.data[0].IDNo,
        firstname: data.data[0].StudentName,
        email: data.data[0].EmailID,
        phone: data.data[0].StudentMobileNo,
        productinfo: feetype,
        remarks: remarks,
        amount: fees,
        requestid: "-1",
        semester: sem,
        routeid: routeId,
        spotid: spotId
      }
    );


    const session = await EncryptedStorage.getItem("user_session");
    console.log(`token: Bearer ${session}`);

    if (session != null) {
      try {
        const paymentDetailsData = await axios.post(
          "https://payment.gku.ac.in/api/payu/initiate",
          {
            idno: data.data[0].IDNo,
            firstname: data.data[0].StudentName,
            email: data.data[0].EmailID,
            phone: data.data[0].StudentMobileNo,
            productinfo: feetype,
            remarks: remarks,
            amount: fees,
            requestid: "-1",
            semester: sem,
            routeid: routeId,
            spotid: spotId
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
          navigation.navigate('PayFeeScreen', { payData: parsedData })
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
            navigation.navigate('PayFeeScreen', { payData: parsedData })
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



  const confirmPayment2 = async () => {
    setLoading(true);

    console.log(`
            idno: ${data.data[0].IDNo},
            firstname: ${data.data[0].StudentName},
            email: ${data.data[0].EmailID},
            phone: ${data.data[0].StudentMobileNo},
            productinfo: ${feetype},
            remarks: ${remarks},
            amount: ${fees},
            requestid: -1,
            semester :${sem}
        `);

    const session = await EncryptedStorage.getItem("user_session");
    console.log(`token: Bearer ${session}`);

    if (session != null) {
      try {
        const paymentDetailsData = await axios.post(
          "https://payment.gku.ac.in/api/razorpay/initiaterazorpay",
          {
            idno: data.data[0].IDNo,
            firstname: data.data[0].StudentName,
            email: data.data[0].EmailID,
            phone: data.data[0].StudentMobileNo,
            productinfo: feetype,
            remarks: remarks,
            amount: fees,
            requestid: "-1",
            semester: sem,
            routeid: routeId,
            spotid: spotId
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

        console.log("Parsed payment data:", parsedData['order_id']);
        const orderId = parsedData['order_id']

        var options = {
          description: feetype,
          image: 'https://www.gku.ac.in/images/appLogo.png',
          currency: 'INR',
          key: 'rzp_live_EVtO9WAkbWCVKK', // key_id from Razorpay Dashboard (frontend only)
          amount: fees * 100, // in paise (₹500)
          name: 'Guru Kashi University',
          order_id: orderId,
          prefill: {
            email: data.data[0].EmailID,
            contact: data.data[0].StudentMobileNo,
            name: data.data[0].StudentName
          },
          theme: { color: colors.uniBlue }
        };

        RazorpayCheckout.open(options)
          .then(async (data1) => {
            console.log(`"idno": "${data.data[0].IDNo}",
                            "firstname": "${data.data[0].StudentName}",
                            "requestid": "-1",
                            "semester": "${sem}",
                            "remarks": "${remarks}",
                            "razorpay_payment_id" : "${data1.razorpay_payment_id}",
                            "razorpay_order_id" : "${data1.razorpay_order_id}",
                            "razorpay_signature": "${data1.razorpay_signature}",`);


            // Payment success: send this to backend to verify
            const response = await axios.post("https://payment.gku.ac.in/api/razorpay/payment-response-razorpay", {

              idno: data.data[0].IDNo,
              name: data.data[0].StudentName,
              requestid: "-1",
              semester: sem,
              remarks: remarks,
              razorpay_payment_id: data1.razorpay_payment_id,
              razorpay_order_id: data1.razorpay_order_id,
              razorpay_signature: data1.razorpay_signature,
            },
              {
                responseType: 'text',  // forcing raw text to handle broken JSON
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              });
            let finalData;
            try {
              finalData = JSON.parse(response.data);
            } catch (parseErr) {
              console.warn('Primary JSON.parse failed:', parseErr);
              // 🩹 Try to auto-fix: trim + add missing brace
              let fixed = response.data.trim();
              if (!fixed.endsWith('}')) {
                fixed += '}';
              }
              try {
                finalData = JSON.parse(fixed);
                console.log('Successfully parsed with fallback fix.');
              } catch (fixErr) {
                console.error('Fallback parse failed too:', fixErr);
                throw new Error('Invalid JSON from server.');
              }
            }
            console.log(finalData);

            console.log('Payment Success:', finalData.flag);
            if (finalData.flag == '1') {
              navigation.replace('PaymentSuccessScreen', { status: finalData });
            } else {
              navigation.replace('PaymentFailureScreen', { status: finalData });
            }
          })

          .catch((error) => {
            console.log(`Payment failed: ${error.code} | ${error.description}`);
          });

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

  const confirmPayment3 = async () => {   //easypay   
		setLoading(true);
    

		const session = await EncryptedStorage.getItem("user_session");
		if (session != null) {
			try {
        console.log(`
            idno: ${data.data[0].IDNo},
            firstname: ${data.data[0].StudentName},
            email: ${data.data[0].EmailID},
            phone: ${data.data[0].StudentMobileNo},
            productinfo: ${feetype},
            remarks: ${remarks},
            amount: ${fees},
            requestid: -1,
            semester :${sem},
            routeid: ${routeId},
            spotid: ${spotId}
        `);
				const paymentDetailsData = await axios.post(
					"https://payment.gku.ac.in/api/epay/initiate-we-easypay",
					{
						idno: data.data[0].IDNo,
						firstname: data.data[0].StudentName,
						email: data.data[0].EmailID,
						phone: data.data[0].StudentMobileNo,
						productinfo: feetype,
						remarks: remarks,
						amount: fees,
						requestid: "-1",
						semester: sem,
            routeid: routeId,
            spotid: spotId
					},
					{
						responseType: 'text',  // forcing raw text to handle broken JSON
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					}
				);
        console.log({paymentDetailsData});
        

				let parsedData;
				try {
					parsedData = JSON.parse(paymentDetailsData.data);
					console.log("parsedData", parsedData);

					navigation.navigate('EasyPayScreen', { payData: parsedData })
				} catch (parseErr) {
					console.warn('Primary JSON.parse failed:', parseErr);
					// 🩹 Try to auto-fix: trim + add missing brace
					let fixed = paymentDetailsData.data.trim();
					if (!fixed.endsWith('}')) {
						fixed += '}';
					}
					try {
						parsedData = JSON.parse(fixed);
						navigation.navigate('EasyPayScreen', { payData: parsedData })
						// if (parsedData.flag == 1) {
						//   navigation.navigate('PayFeeScreen', { payData: parsedData })
						// }
						console.log('Successfully parsed with fallback fix.');
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
	}


  // /////////////////// To hide/show buttons in UI for Gateway ///////////////

  const checkTabs = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const tabsData = await fetch(`${BASE_URL}/student/tabsToShowStudent`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pageName: 'ConfirmFee_st'
          })
        })
        const pageTabsData = await tabsData.json()
        setTabsData(pageTabsData)
        console.log(pageTabsData);

        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
  }
  useEffect(() => {
    checkTabs();
    instructionNote();
  }, [])

  const errorModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      // onHide : ()=>navigation.goBack()
    })
  }
  return (
    <AlertNotificationRoot>
      {
        loading ? <ActivityIndicator />
          :

          <View style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              <View style={styles.container}>
                <View style={styles.inputView}>
                  <Text style={{ color: '#666666', marginTop: 10 }}>Fee Type</Text>
                  <View style={styles.loginInput}>
                    <TextInput
                      style={styles.inputBox}
                      placeholder={feetype}
                      placeholderTextColor={'#666666'}
                      editable={false}
                    />
                  </View>
                  <Text style={{ color: '#666666', marginTop: 10 }}>Semester</Text>
                  <View style={styles.loginInput}>
                    <TextInput
                      style={styles.inputBox}
                      placeholder={sem}
                      placeholderTextColor={'#666666'}
                      editable={false}
                    />
                  </View>
                  <Text style={{ color: '#666666', marginTop: 10 }}>Remarks</Text>
                  <View style={styles.loginInput}>
                    <TextInput
                      style={styles.inputBox}
                      placeholder={remarks}
                      placeholderTextColor={'#666666'}
                      editable={false}
                    />
                  </View>

                  {/* PayU Button */}
                  {
                    tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'PayUFeePay' &&
                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={() => confirmPayment()}
                    >
                      <Text style={styles.btnText}>{fees}-Pay Now</Text>
                    </TouchableOpacity>
                  }
                  {/* RazorPayButton */}
                  {
                    tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'RazorPayFeePay' &&
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: colors.uniRed }]}
                      onPress={() => confirmPayment2()}
                    >
                      <Text style={styles.btnText}>{fees}-Pay Now</Text>
                    </TouchableOpacity>
                  }
                  {
                    tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'EazyPayFeePay' &&
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: colors.uniBlue }]}
                      onPress={() => confirmPayment3()}
                    >
                      <Text style={styles.btnText}>Pay Now</Text>
                    </TouchableOpacity>
                  }
                </View>
              </View>
            </ScrollView>

          </View>
      }
    </AlertNotificationRoot>
  )
}

export default BusFeePay

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
    marginBottom: 8,
    marginTop: 8
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
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0d6efd',
    marginBottom: 16,
  },

  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: 'red',
    marginTop: 20,
    marginBottom: 10,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#002147',
    marginTop: 10,
    textAlign: 'justify',
  },

  list: {
    marginTop: 8,
    marginBottom: 8,
  },

  listItem: {
    fontSize: 16,
    lineHeight: 22,
    color: '#212529',
    marginLeft: 10,
  },

  note: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
    marginTop: 15,
  },
});