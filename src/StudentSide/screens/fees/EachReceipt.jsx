import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Pdf from 'react-native-pdf'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import converter from 'number-to-words'
import Share from 'react-native-share';
import colors from '../../../colors'

const EachReceipt = ({route}) => {
    const { ledgerName, receiptNo, examSession } = route.params
    console.log(ledgerName, receiptNo, examSession);
    
    const [eachReciept, setEachReceipt] = useState([])
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState('')
    const [showPdf, setShowPdf] = useState(false);


    // print receipt by sending ledger, receiptNo and Exam session to show on the pdf receipt //
    const printReciept = async (ledgerName, receiptNo, examSession) => {
        console.log('receipt No',receiptNo);

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
            setEachReceipt(PrintReceiptDetailsData.data)
            console.log('data from api useState eachreceipt', PrintReceiptDetailsData)
            setLoading(false)
          } catch (error) {
            console.log('Error fetching each receipt data:receipts:', error)
            setLoading(false)
          }
        }
      }

    //   creating the pdf from HTML and CSS 
      const createPdf = async () => {
        // console.log(data.data);
        const pdf_html =`
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
                      <img class="logo" src="https://www.gku.ac.in/images/appLogo.png" alt="uniLogo">
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
                          <p class="rightSide">${(JSON.stringify(eachReciept[0]['DateEntry']).slice(1,11)).split("-").reverse().join("-")}</p>
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
        // let options = {
        //   html: pdf_html,
        //   fileName: `receipt_${receiptNo}`,
        //   directory: 'Downloads',
        // };
        // let file = await RNHTMLtoPDF.convert(options)
        // // console.log(file.filePath);
        // setUrl(file.filePath)
        // // setLoading(false)
        // // alert(file.filePath);
      }


      useEffect(()=>{
        printReciept(ledgerName, receiptNo, examSession)
      },[])


    //   useEffect(()=>{
    //     createPdf()
    //   },[eachReciept])

    // //   to show share pdf sharing options
    //   const shareOptions = {
    //     title: 'Share file',
    //     failOnCancel: false,
    //     url: `file://${url}`,
    //   };
    //   const sharePdf = async () => {
    //     try {
    //       await Share.open(shareOptions);
    //     //   console.log('Result =>', ShareResponse);
    //     } catch (error) {
    //       console.log('Error =>', error);
    //     }
    //   };

  return (
      <View style={styles.container}>
          {loading ? <ActivityIndicator/> :
        //  pdf view of the receipt
          <Pdf
          trustAllCerts={false}
          source={{uri : `file://${url}`, cache:true}}
          onLoadComplete={(numberOfPages,filePath) => {
              // console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page,numberOfPages) => {
              // console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
              console.log(error);
          }}
          onPressLink={(uri) => {
              // console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}/>
          }
          {/* the button to share the receipt */}
          <TouchableOpacity style={styles.printBtn} onPress={()=>createPdf()}>
              <Text style={{color:'white', fontSize:16}}>Share Receipt</Text>
          </TouchableOpacity>
      </View>
  )
}

export default EachReceipt

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
    modalBtn:{
        backgroundColor:colors.uniRed,
        alignItems:'center',
        paddingHorizontal:16,
        paddingVertical:8,
        marginVertical:8
    },
    printBtn:{
        backgroundColor:colors.uniBlue,
        alignItems:'center',
        paddingHorizontal:16,
        paddingVertical:8,
        marginVertical:8
    }

})    