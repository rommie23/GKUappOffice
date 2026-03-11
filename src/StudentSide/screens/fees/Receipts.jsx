import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, ActivityIndicator, TouchableOpacity, Modal, Pressable, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import colors from '../../../colors';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import RNPrint from 'react-native-print';
import converter from 'number-to-words'

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Receipts = () => {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation()

  // function to get all the data from 
  const getReceipts = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const ReceiptsDetails = await fetch(BASE_URL + '/student/receipts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          },
        })
        const ReceiptsDetailData = await ReceiptsDetails.json()
        if (ReceiptsDetailData['data'].length == 0) {
          errorModel(ALERT_TYPE.WARNING, "No Receipts", `No receipts to show !`)
          // setShowModal2(true)
        }
        setReceipts(ReceiptsDetailData.data)
        console.log('data froms api receipts', ReceiptsDetailData)
        setLoading(false)
      } catch (error) {
        console.log('Error fetching receipts data:receipts:', error)
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something Went wrong.`)
        // setShowModal(true)
      }
    }
  }

  // ////// call on click ///////////
  const printReciept = async (ledgerName, receiptNo, examSession) => {
    setLoading(true)
    console.log('receipt No', receiptNo);

    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        // console.log('data to send ::::', ledgerName, receiptNo, examSession);
        const PrintReceiptDetails = await fetch(`${BASE_URL}/student/preceipts/${ledgerName}/${receiptNo}/${examSession}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const PrintReceiptDetailsData = await PrintReceiptDetails.json()
        const eachReciept = PrintReceiptDetailsData.data
        createPdf(eachReciept)
        console.log('data from api useState eachreceipt', PrintReceiptDetailsData)
        setLoading(false)
      } catch (error) {
        console.log('Error fetching each receipt data:receipts:', error)
        setLoading(false)
      }
    }
  }

  const createPdf = async (eachReciept) => {
    // console.log(data.data);
    try {
      const pdf_html = `
            <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Document</title>
                  <style>
                      *{
                          margin: 0;
                          padding: 0;
                          font-family: 'Arial', Times, san-serif;
                          font-weight:600
                      }
                      .logo{
                          height: 100px;
                          width: 100px;
                      }
                      .topOfPage{
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          margin-bottom: 32px;
                          column-gap: 15%;
                          margin-top:20px
                      }
                      .eachLine{
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          padding: 0 20px;
                          margin-bottom: 8px;
                          
                      }
                      .leftSide{
                          /* border: 2px solid; */
                          width: 20%;
                          padding: 4px 0;
                      }
                      .rightSide{
                          border-bottom: 1px solid;
                          padding: 4px 0;
                          width: 80%;
                      }
                      .eachLineLeft{
                          width: 50%;
                          display: flex;
                      }
                      .eachLineLeft .leftSide{
                          width: 53%;
                      }
                      .eachLineRight{
                          width: 50%;
                          display: flex;
                      }
                      .heading{
                          font-size: 24px;
                          font-weight: 600;
                      }.heading2{
                          font-size: 12px;
                          margin-top: 4px;
                      }
                      .boxLine{
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          padding: 0 100px;
                          margin-top: 32px;
                      }
                      .leftSideBox{
                          height: 35px;
                          width: 20%;
                          border: 1.5px solid;
                          align-content: center;
                          padding: 0px 16px;
                      }
                      .rightSideBox{
                          height: 35px;
                          width: 20%;
                          border: 1.5px solid;
                          align-content:end;
                      }
                      .smallText{
                          font-size: 8px;
                      }
                      .eachLineRightTop{
                          width: 30%;
                          display: flex;
                      }
                      .eachLineRight .leftSide{
                        width:30%
                      }
        
                      
                  </style>
              </head>
              <body>
                  <div class="outerLayout">
                      <div class="topOfPage">
                          <img class="logo" src="https://www.gku.ac.in/public/uploads/editors/gku-logo-Gba3iLP4.png" alt="uniLogo">
                          <div class="rightTop">
                              <p class="heading">GURU KASHI UNIVERSITY</p>
                              <p class="heading">${eachReciept[0]['CollegeName']}</p>
                              <h4 class="heading2">TALWANDI SABO BATHINDA,PUNJAB -151302</h4>
                          </div>
                      </div>
                      <div class="eachLine">
                          <div class="eachLineLeft">
                              <p class="leftSide">Receipt No.</p>
                              <p class="rightSide">${eachReciept[0]['ReceiptNo']}</p>
                          </div>
                          <div class="eachLineRightTop">
                              <p class="leftSide">Date :</p>
                              <p class="rightSide">${(JSON.stringify(eachReciept[0]['DateEntry']).slice(1, 11)).split("-").reverse().join("-")}</p>
                          </div>
                      </div>
                      <div class="eachLine">
                          <p class="leftSide">Received From</p>
                          <p class="rightSide">${eachReciept[0]['StudentName']}/${eachReciept[0]['FatherName']}</p>
                      </div>
                      <div class="eachLine">
                          <p class="leftSide">Course</p>
                          <p class="rightSide">${eachReciept[0]['Course']}</p>
                      </div>
                      <div class="eachLine">
                          <div class="eachLineLeft">
                              <p class="leftSide">Batch</p>
                              <p class="rightSide">${eachReciept[0]['Batch']}</p>
                          </div>
                          <div class="eachLineRight">
                              <p class="leftSide">Installment:</p>
                              <p class="rightSide">${eachReciept[0]['Semester']}</p>
                          </div>
                      </div>
                      <div class="eachLine">
                          <div class="eachLineLeft">
                              <p class="leftSide">Class Roll No.</p>
                              <p class="rightSide">${eachReciept[0]['ClassRollNo']}</p>
                          </div>
                          <div class="eachLineRight">
                              <p class="leftSide">ID/Reg No:</p>
                              <p class="rightSide">${eachReciept[0]['IDNo']} </p>
                          </div>
                      </div>
        
                      <div class="eachLine">
                          <p class="leftSide">Rs (In Words)</p>
                          <p class="rightSide">${converter.toWords(eachReciept[0]['credit'])}</p>
                      </div>
                      <div class="eachLine">
                          <p class="leftSide">On Account Of</p>
                          <p class="rightSide">${eachReciept[0]['OnAccountof']}</p>
                      </div>
                      <div class="boxLine">
                          <div class="leftSideBox">Rs. ${eachReciept[0]['credit']}</div>
                          <div class="rightSideBox"><p class="smallText">Signature</p></div>
                      </div>
                  </div>
                  <br>
                  <br>
                  <div>
                  <p style="text-align:center;">Computer Generated Receipt Signature not Required.</p>
                  </div>
              </body>
              </html>
            `

      await RNPrint.print({
        html: pdf_html,
      });

      // User can select “Save as PDF” or print directly
      // Alert.alert('PDF Generated', 'You can choose "Save as PDF" in the print dialog.');
    } catch (error) {
      console.log('Print Error:', error);
      // Alert.alert('Error', 'Failed to generate PDF.');
    }
  }


  // const errorHandler= ()=>{
  //   setShowModal2(false)
  //   setShowModal(false)
  //   navigation.goBack()
  // }
  useEffect(() => {
    getReceipts()
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getReceipts()
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
      onHide: () => navigation.goBack()
    })
  }

  // UI of the page //
  return (
    <AlertNotificationRoot>
      <View>
        <ScrollView style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >

          {/* Card starts here */}
          {loading ? <ActivityIndicator /> : receipts.map((receipt, i) => (
            <TouchableOpacity style={styles.card} key={i}
              // onPress={() => navigation.navigate('EachReceipt', { ledgerName: receipt['Type'], receiptNo: receipt['ReceiptNo'], examSession: receipt['Session'] })}
              onPress={() => printReciept(receipt['Type'], receipt['ReceiptNo'], receipt['Session'])}
            >
              <View style={styles.bottomCardTop}>
                <Feather name='list' size={24} color={colors.uniBlue} />
                <Text style={styles.textStyle}>Receipt Details</Text>
              </View>
              <View style={[styles.topCard]}>
                <View style={{ flex: 1.5 }} >
                  <Text style={styles.textStyle}>Receipt Number</Text>
                  <Text style={[styles.textStyle, styles.rowMiddle]}>{receipt['ReceiptNo']}</Text>
                </View>
                <View style={{ flex: 2 }} >
                  <Text style={[styles.textStyle]}>Receipt Date</Text>
                  <Text style={[styles.textStyle, styles.rowMiddle]}>{receipt['DateEntry'].split('T')[0].split("-").reverse().join("-")}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textStyle}>Amount Paid</Text>
                  <Text style={[styles.textStyle, styles.rowMiddle]}>₹{receipt['Amount']}</Text>
                </View>
              </View>
              <View style={styles.bottomCard}>
                <View style={styles.transaction}>
                  <View style={{ flex: 1.5 }} >
                    <Text style={[styles.textSmall, styles.textStyle]}>Semester</Text>
                    <Text style={styles.textStyle}>{receipt['Semester']}</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={[styles.textSmall, styles.textStyle]}>Type</Text>
                    <Text style={styles.textStyle}>{receipt['Type']}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }} >
                    <Entypo name='download' size={24} color={colors.uniBlue} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

          ))
          }
          {/* Card ends here */}
          {/* Card starts here */}
          {/* <View style={styles.card}>
          <Text style={styles.textStyle}>Paid To</Text>
          <View style={styles.topCard}>
            <Image source={images.logo} style={styles.image} />
            <Text style={[styles.textStyle, styles.rowMiddle]}>GURU KASHI UNIVERSITY</Text>
            <Text style={styles.textStyle}>55000 INR</Text>
          </View>
          <View style={styles.bottomCard}>
            <View style={styles.bottomCardTop}>
              <Feather name='list' size={24} color={colors.uniBlue}/>
              <Text style={styles.textStyle}>Transfer Details</Text>
            </View>
            <View style={styles.transaction}>
              <Text style={[styles.textSmall,styles.textStyle]}>Transfer ID</Text>
              <Text style={styles.textStyle}>T7684GH13413HJ1434143H314</Text>
            </View>
            <View>
                <Text style={[styles.textSmall,styles.textStyle]}>Debited Form</Text>
              <View style={styles.bottomCardMiddle}>

                <Image source={images.notice} style={styles.image}/>
                <Text style={[styles.textStyle, styles.rowMiddle]}>82676XXXXX</Text>
                <Text style={styles.textStyle}>55000 INR</Text>
              </View>
              <Text style={styles.textStyle}>UTR:785344672</Text>
            </View>
          </View>
        </View> */}
          {/* Card ends here */}

        </ScrollView>

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
  image: {
    height: 35,
    width: 35,
    borderRadius: 18,
    backgroundColor: 'green'
  },
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
    marginTop: 12,
  },
  bottomCardMiddle: {
    flexDirection: 'row',
    paddingVertical: 6,
    justifyContent: 'space-between'
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 10
  },
  rowMiddle: {
    width: '60%'
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
    color: '#4C4E52',
    fontSize: 12,
  },
})
export default Receipts