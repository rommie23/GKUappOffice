import { StyleSheet, Text, View, Dimensions, ActivityIndicator, ScrollView, TouchableOpacity, Modal, PermissionsAndroid, Platform, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf'
import colors from '../../../colors';
import { StudentContext } from '../../../context/StudentContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Share from 'react-native-share';
// import { PERMISSIONS, request } from 'react-native-permissions';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import Orientation from 'react-native-orientation-locker';
import RNPrint from 'react-native-print';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const StudentSemesterResult = ({ route }) => {
    const { resultID } = route.params
    const { data } = useContext(StudentContext)
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(true)
    const [semResult, setSemResult] = useState([])
    // console.log('id passed from results in stuSemRes',resultID);
    const [showModal, setShowModal] = useState(false)

    const navigation = useNavigation()
    useEffect(() => {
        // Lock to portrait on component mount
        Orientation.lockToLandscape();

        // Cleanup: Unlock orientation on component unmount
        return () => {
            Orientation.lockToPortrait();
        };
    }, []);

    /////////////////////////////   getting data from api while sending the id of the result //////////////////////////////////////////
    const eachResult = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const examResult = await fetch(`${BASE_URL}/student/results/${resultID}`, {
                    method: 'POST',
                    headers: {
                        Accept: "applicaion/json",
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    },
                    body: JSON.stringify({
                        resultid: resultID
                    })
                })
                const examResultData = await examResult.json()
                setSemResult(examResultData.data)
                // console.log(examResultData.data)
                // console.log('semester result', semResult);
                setLoading(false)
                // console.log('sessoin at Amrik details',session);
            } catch (error) {
                console.log('Error fetching Guri data:studentSemResult:', error);
                setLoading(false)
                errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
                // setShowModal(true)
            }
        }
    }



    /////////////// to create structure of the pdf which user has to send //////////////////

    const createPdf = async () => {
        // console.log(data.data);
        let imgUrl = '../../images/gku-logo.png'
        let rows = ''
        semResult.map((result, i) => {
            rows = rows + `<tr>
            <td>${result["SrNo"]}</td>
            <td style="text-align:left;">${result['SubjectName']}(${result['SubjectCode']})</td>
            <td>${result['SubjectGrade']}</td>
            <td>${result['SubjectGradePoint']}</td>
            </tr>`
        })
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
                        font-family: 'Times New Roman', Times, serif;
                    }
                    .layout{
                        margin-top:24px;
                    }
                    .logo{
                        height: 100px;
                        width: 100px;
                    }
                    .topOfPage{
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                    }
                    .heading{
                        font-size: 24px;
                        font-weight: 600;
                    }.heading2{
                        font-size: 12px;
                        margin-top: 4px;
                    }.establishment{
                        font-size: 12px;
                        margin-top: 4px;
                    }.tableOuter{
                        padding: 0 20px;
                    }
                    table {
                        border:1px solid #b3adad;
                        border-collapse:collapse;
                        padding:5px;
                        width:100%;
                        margin: 16px 0px;
                        background-color: transparent;
                    }
                    table th {
                        border:1px solid #b3adad;
                        text-align:center;
                        padding:5px;
                        background: #ffffff;
                        color: #313030;
                        font-size: 14px;
                        font-weight: 600;
                        background-color: transparent;
                    }
                    table td {
                        border:1px solid #b3adad;
                        text-align:left;
                        padding:5px;
                        background: #ffffff;
                        color: #313030;
                        font-size: 14px;
                        font-weight: 600;
                        background-color: transparent;
                    }
                    .bottomTable td{
                        text-align: center;
                        font-weight: 400;
                        margin-bottom: 16px;
                    }
                    .watermark::after{
                        content: 'Internet Result Copy';
                        transform: rotate(340deg);
                        font-size: 100px;
                        z-index: -1;
                        position: absolute;
                        top: 320px;
                        opacity: 0.3;
                        text-align: center;
                    }
                    
                </style>
            </head>
            <body>
                <div class="layout">
                    <div class="topOfPage">
                        <img class="logo" src="https://www.gku.ac.in/public/uploads/editors/gku-logo-Gba3iLP4.png" alt="uniLogo">
                        <p class="heading">GURU KASHI UNIVERSITY</p>
                        <h4 class="heading2">TALWANDI SABO BATHINDA,PUNJAB -151302</h4>
                        <p class="establishment">(Established by Government of Punjab Act No. 37 of 2011 as per Section 2(f) of UGC Act. 1956)</p>
                        <h4 class="heading2">(Internet Result Copy)</h4>
                    </div>
                    <div class="tableOuter watermark">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Roll No.: ${semResult[0]['UniRollNo']}</td>
                                    <td>Name: ${semResult[0]['StudentName']}</td>
                                </tr>
                                <tr>
                                    <td>Father's Name: ${semResult[0]['FatherName']}</td>
                                    <td>Course: ${semResult[0]['Course']}</td>
                                </tr>
                                <tr>
                                    <td>Semester: ${semResult[0]['Semester']}</td>
                                    <td>Examination: ${semResult[0]['Examination']} (${semResult[0]['Type']})</td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="bottomTable">
                            <thead>
                                <tr>
                                    <th style="width: 10%;">Sr. No. </th>
                                    <th style="width: 50%;">Subjects/Subject Code</th>
                                    <th style="width: 20%;">Grade</th>
                                    <th style="width: 20%;">Grade Point</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                                <tr>
                                    <td style="width: 10%; font-weight: 600;" colspan="2">Total Number of Credit: ${semResult[0]['TotalCredit']}</td>
                                    <td style="width: 15%; font-weight: 600;" colspan="2">SGPA: ${semResult[0]['Sgpa']}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p>Declare date : ${(semResult[0]['DeclareDate']).split("-").reverse().join("-")}</p>
                    </div>
                </div>
            </body>
            </html>`
        let options = {
            html: pdf_html,
            fileName: `resultFile_${semResult[0]['Semester']}`,
            directory: 'Downloads',
        };
        await RNPrint.print({
                html: pdf_html,
              });
        // let file = await RNHTMLtoPDF.convert(options)
        // if (file && file.filePath) {
        //     console.log('✅ PDF created successfully at:', file.filePath);

        //     // Now you can proceed with sharing...
        //     const shareOptions = {
        //         title: 'Share file',
        //         failOnCancel: false,
        //         url: `file://${file.filePath}`,
        //         type: 'application/pdf',
        //     };
        //     await Share.open(shareOptions);
        //     setUrl(file.filePath)

        // } else {
        //     // This case handles if the library doesn't throw but returns an invalid object
        //     console.log('❌ PDF generation failed: No file path returned.');
        //     Alert.alert('Error', 'Could not generate the PDF file.');
        // }
        setLoading(false)
    }
    // const shareOptions = {
    //     title: 'Share file',
    //     failOnCancel: false,
    //     url: `file://${url}`,
    // };
    // const sharePdf = async () => {
    //     try {
    //         const ShareResponse = await Share.open(shareOptions);
    //         //   console.log('Result =>', ShareResponse);
    //     } catch (error) {
    //         console.log('Error =>', error);
    //     }
    // };


    // const requestPrmissions = (permission)=>{
    //     request(permission).then(result=>{
    //       console.log('permission granted', result);
    //     })
    //   }

    useEffect(() => {

        eachResult()
    }, [])
    // useEffect(() => {
    //     createPdf()
    // }, [semResult])


    // requesting storage permission to store the file or send the file in device //////////////
    // const requestStoragePermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.requestMultiple([
    //             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //         ], {
    //             title: 'Storage Permission',
    //             message: 'App needs access to your storage to read and write files.',
    //             buttonPositive: 'OK',
    //         });

    //         if (granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
    //             granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
    //             // Permissions granted, you can now read and write to external storage.
    //             console.log("granted");
    //         } else {
    //             console.log("denied");
    //             // Permissions denied, handle accordingly.
    //         }
    //     } catch (error) {
    //         console.error('Error requesting storage permission:', error);
    //     }
    // };

    const checkAndRequestStoragePermission = async () => {
  // We only need to do this on Android.
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    // --- Step 1: Check if permission is already granted ---
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );

    if (hasPermission) {
      console.log('Permission is already granted.');
      return true; // Permission already exists
    }

    // --- Step 2: If not granted, ask the user for permission ---
    console.log('Permission not granted, requesting now...');
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission Required',
        message: 'This app needs access to your storage to save PDF files.',
        buttonPositive: 'OK',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission was granted by the user.');
      return true;
    } else {
      console.log('Permission was denied by the user.');
      Alert.alert('Permission Denied', 'Storage permission is required to save files.');
      return false;
    }
  } catch (err) {
    console.warn('Permission check/request error:', err);
    return false;
  }
};

    // Call the function to request permissions
    useEffect(() => {
        // checkAndRequestStoragePermission()
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

        // /////////////////////// to show pdf in same page ///////////////////////////// //

        // <View style={styles.container}>
        //     {loading ? <ActivityIndicator/> :
        //     <Pdf
        //     trustAllCerts={false}
        //     source={{uri : `file://${url}`, cache:true}}
        //     onLoadComplete={(numberOfPages,filePath) => {
        //         // console.log(`Number of pages: ${numberOfPages}`);
        //     }}
        //     onPageChanged={(page,numberOfPages) => {
        //         // console.log(`Current page: ${page}`);
        //     }}
        //     onError={(error) => {
        //         console.log(error);
        //     }}
        //     onPressLink={(uri) => {
        //         // console.log(`Link pressed: ${uri}`);
        //     }}
        //     style={styles.pdf}/>
        //     }
        //     <TouchableOpacity style={styles.printBtn} onPress={()=>saveFile()}>
        //         <Text style={styles.btnTxt}>Print/Download the file</Text>
        //     </TouchableOpacity>
        // </View>
        <AlertNotificationRoot>
            <View>
                {/* <Modal
            transparent={true}
            visible={showModal}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <FontAwesome name='exclamation' size={64} color={colors.uniRed} style={{position:'absolute', top:-48, backgroundColor:'white', paddingVertical:16, borderRadius:100, paddingHorizontal:32}} />
                    <Text style={styles.textSmall}>OOps Something went wrong!!!</Text>
                    <TouchableOpacity style={styles.modalBtn} onPress={()=>errorHandler()}>
                    <Text style={{color:'white', fontSize:16}}>Close</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal> */}
                <ScrollView>
                    {loading ? <ActivityIndicator /> :
                        <View style={styles.cardOuter}>
                            {/* {
                    console.log('width is ::: ',screenWidth)
                    }
                    {
                    console.log('height is ::: ',screenHeight)
                    } */}
                            <ScrollView horizontal style={{ width: screenWidth > screenHeight && "60%" }}>
                                <View style={{ flex: 1 }}>

                                    {/* header with details */}
                                    <View style={styles.header}>
                                        <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: 'white' }}>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>RollNo.: {semResult[0]['UniRollNo']}</Text>
                                            </View >
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>Name: {semResult[0]['StudentName']}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: 'white' }}>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>Father's Name: {semResult[0]['FatherName']}</Text>
                                            </View >
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>Course: {semResult[0]['Course']}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: 'white' }}>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>Semester: {semResult[0]['Semester']}</Text>
                                            </View >
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>Examination: {semResult[0]['Examination']} ({semResult[0]['Type']})</Text>
                                            </View>
                                        </View>

                                    </View>

                                    {/* header end with details */}
                                    <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: colors.uniBlue }}>
                                        <View style={[styles.cellStyle, { flex: 0.5 }]}>
                                            <Text style={[styles.cardTxt, { color: 'white' }]}>Sno.</Text>
                                        </View >
                                        <View style={[styles.cellStyle, { flex: 3.5 }]}>
                                            <Text style={[styles.cardTxt, { color: 'white' }]}>Subject</Text>
                                        </View>
                                        <View style={[styles.cellStyle, { flex: 1 }]}>
                                            <Text style={[styles.cardTxt, { color: 'white' }]}>Grade</Text>
                                        </View>
                                        <View style={[styles.cellStyle, { flex: 1 }]}>
                                            <Text style={[styles.cardTxt, { color: 'white' }]}>Grade Point</Text>
                                        </View>
                                    </View>
                                    {semResult.map((result, index) => (
                                        <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: 'white' }} key={index}>
                                            <View style={[styles.cellStyle, { flex: 0.5 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>{index + 1}</Text>
                                            </View >
                                            <View style={[styles.cellStyle, { flex: 3.5 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>{`${result['SubjectName']} (${result['SubjectCode']})`}</Text>
                                            </View>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}> {result['SubjectGrade']}</Text>
                                            </View>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}> {result['SubjectGradePoint']}</Text>
                                            </View>
                                        </View>
                                    ))}
                                    <View style={{ flex: 1, flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: 'white', marginBottom: 16 }}>
                                        <View style={[styles.cellStyle, { flex: 1 }]}>
                                            <Text style={[styles.cardTxt, { color: 'black', alignSelf: 'center' }]}>Total Credit- {semResult[0]['TotalCredit']}</Text>
                                        </View >
                                        <View style={[styles.cellStyle, { flex: 0.535 }]}>
                                            <Text style={[styles.cardTxt, { color: 'black', alignSelf: 'center' }]}>Total SGPA- {semResult[0]['Sgpa']}</Text>
                                        </View >
                                    </View>
                                </View>
                            </ScrollView>
                            {/* {semResult.map((result,index)=>(
                        <View key={index} style={styles.card}>
                        <View style={{ rowGap: 8, flexDirection:'row' }}>
                        <Text style={styles.cardTxt}>{result["SrNo"]}.</Text>
                            <Text style={styles.cardTxt}>{`${result['SubjectName']} (${result['SubjectCode']})`}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf:'center'}}>
                            <View style={styles.sgpaLook}>
                                <Text style={[styles.statusText, { color: 'green' }]}>SGPA- {result['SubjectGradePoint']}</Text>
                            </View>
                            <View style={[styles.sgpaLook]}>
                                <Text style={[styles.statusText, { color: 'green' }]}>Grade- {result['SubjectGrade']}</Text>
                            </View>
                        </View>
                    </View>
                    ))} */}
                        </View>
                    }
                    {!loading &&
                        <>
                            {/* <TouchableOpacity style={styles.printBtn} onPress={()=>saveFile()}>
                        <Text style={styles.btnTxt}>Print/Download the file</Text>
                    </TouchableOpacity> */}
                            <TouchableOpacity style={styles.printBtn} onPress={() => createPdf()}>
                                <Text style={styles.btnTxt}>Share the file</Text>
                            </TouchableOpacity>
                        </>
                    }
                </ScrollView>
            </View>
        </AlertNotificationRoot>

    )
}

export default StudentSemesterResult

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