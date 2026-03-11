import { StyleSheet, Text, View, Dimensions, ActivityIndicator, ScrollView, TouchableOpacity, Modal, PermissionsAndroid, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf'
import colors from '../../../colors';
import { StudentContext } from '../../../context/StudentContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL, IMAGE_URL } from '@env';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { images } from '../../../images';
import Share from 'react-native-share';
// import { PERMISSIONS, request } from 'react-native-permissions';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import Orientation from 'react-native-orientation-locker';
import RNPrint from 'react-native-print';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const EachAdmitCard = ({ route }) => {
    const { examId } = route.params
    const { data } = useContext(StudentContext)
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(true)
    const [semForm, setSemForm] = useState([])
    // console.log('id passed from results in stuSemRes',resultID);
    const [showModal, setShowModal] = useState(false)

    const navigation = useNavigation()
    // useEffect(() => {
    //     // Lock to portrait on component mount
    //     Orientation.lockToLandscape();

    //     // Cleanup: Unlock orientation on component unmount
    //     return () => {
    //         Orientation.lockToPortrait();
    //     };
    // }, []);

    /////////////////////////////   getting data from api while sending the id of the admitcard //////////////////////////////////////////
    const semesterAdmitCard = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const res = await fetch(`${BASE_URL}/Student/admitCardPrint/${examId}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                })
                const response = await res.json();
                // const neew = response.JSON.stringify(JSON.parse('{"key":"value","array":[1,2,3]}'), null, 2)
                console.log(response['data2']);
                // console.log(response);
                setSemForm(response);
                setLoading(false)


            } catch (error) {
                console.log('Error fetching Guri data:Login:', error);
                setLoading(false);
                errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something Went wrong.`)
            }
        }

    }

    ////////////////////////// to create structure of the pdf which user has to send /////////////////////////////

    const createPdf = async () => {
        // console.log(data.data);
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${yyyy}-${mm}-${dd}`;
        let imgUrl = '../../images/gku-logo.png'
        let rows = ''
        // <Text style={[styles.cardTxt, { color: 'black' }]}>{result['ExamDate'] ? result['ExamDate'].split('T')[0].split('-').reverse().join("-") : null}{result['ExamSession'] && `/ ${result['ExamSession']}`}</Text>
        semForm['data2'].map((result, i) => {
            const examDate = result['ExamDate'] ? result['ExamDate'].split('T')[0].split('-').reverse().join("-") : ''
            const sessionMap = {
                M: 'Morning',
                A: 'Afternoon',
                E: 'Evening',
            };

            const sessionCode = result['ExamSession'];
            const sessionText = sessionCode ? sessionMap[sessionCode] || sessionCode : '';
            const shift = sessionText ? `/ ${sessionText}` : '';
            rows = rows + `<tr>
            <td style="text-align:center;">${i + 1}</td>
            <td style="text-align:center;">${result['SubjectName']}/${result['SubjectCode']}</td>
            <td style="text-align:center;">${result['InternalExam']}</td>
            <td style="text-align:center;">${result['ExternalExam']}</td>
            <td style="text-align:center;">${result['SubjectType']}</td>
            <td style="text-align:center;">${examDate}${shift}</td>
            <td></td>
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
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 12px;
                        
                        }
                        .container {
                            width: 95%;
                            margin: auto;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .header img {
                            width: 100px;
                            height: auto;
                        }
                        .header h1 {
                            font-size: 20px;
                            margin: 5px 0;
                        }
                        .header h2 {
                            font-size: 12px;
                            padding: 2px;
                        }
                        .admit-card-info, .subjects-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 17px;
                        }
                        .admit-card-info td {
                            padding: 5px;
                        }
                        .admit-card-info td:first-child {
                            font-weight: bold;
                        }
                        .subjects-table th, .subjects-table td {
                            border: 2px solid #000;
                            text-align: center;
                            padding: 2px;
                            
                        }
                        .basic-table th, .basic-table td {
                            border: 2px solid #000;
                            text-align: left;
                            border-collapse: collapse;
                            padding: 0px;
                        }
                        .footer {
                            margin-top: 20px;
                        }
                        .footer p {
                            font-size: 12px;
                            margin: 5px 0;
                        }
                        .signature {
                            margin-top: 20px;
                            display: flex;
                            justify-content: space-between;
                        }
                        .signature div {
                            text-align: left;
                        }
                    </style>
                    <style>
                    .signature-table {
                        border-bottom: 2px solid #000;
                        border-collapse: collapse;
                    }
                    .signature-table td {
                        padding: 5px;
                    
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <table class="subjects-table">
                            <tr>
                                <td style="text-align: left;" colspan="5">
                                    <img class="logo" src="https://www.gku.ac.in/public/uploads/page_section_attributes/page-68e8d2e2ca560-1760088802.png" alt="uniLogo" width="100%" height="70">
                                </td>
                                
                                <!-- <td style="text-align: right; width: 20%;"> -->
                                    <!-- <img src="admin/img/join-logo.png" alt="Right Logo" width="200" height="70"> -->
                                <!-- </td> -->
                            </tr>
                            <tr>
                                
                                <td style="text-align: center; width: 100%;" colspan="5">
                                    <div class="header">
                                        <p style="text-align: center; font-weight: 600;">ADMIT CARD FOR (<strong>${semForm.data2[0]['Examination']}</strong>) EXAMINATION</p>
                                    </div>
                                </td>

                            </tr>

                            <tr>
                                <td rowspan="4" style="text-align: left; width: 15%;text-align: center;">Affix the latest photo of the candidate here,<br> duly attested by the college/department dean with a stamp.

                                <!-- <img src="{{ isset($data['Image']) ? '${IMAGE_URL}Images/Students/'.$data['Image'] : 'default-image-url.jpg' }}" width="70" height="100" alt="Student Image"> -->
                                </td>
                                <td colspan="2" style="text-align: left; width: 30%;"> <b>Name:</b> ${semForm['data1'][0]['StudentName']}</td>
                                <td colspan="1" style="text-align: left; width: 30%;"> <b>Roll No:</b> ${semForm['data1'][0]['UniRollNo']}</td>
                                <td colspan="1" rowspan="4" style="text-align: center; width: 15%; padding: 1px !important;">
                        <img src="${IMAGE_URL}/Images/Students/${semForm['data1'][0]['Image']}" 
                            width="130" 
                            height="150" 
                            alt="Student Image" 
                            style="display: block; margin: 0; padding: 0;">
                    </td>

                            </tr>
                            <tr>
                                <td colspan="2" style="text-align: left; "> <b>Father Name:</b> ${semForm['data1'][0]['FatherName']}</td>
                                <td colspan="1" style="text-align: left; "> <b>Mother Name:</b> ${semForm['data1'][0]['MotherName']}</td>
                            </tr>
                            <tr>
                            <td colspan="2" style="text-align: left; "> <b>Semester:</b> ${semForm['data2'][0]?.['SemesterId']}(${semForm['data2'][0]['Type'][0]})${semForm['data1'][0]['Batch']}</td>
                            <td colspan="1" style="text-align: left; "> <b>ABC ID:</b> ${semForm['data1'][0]['ABCID']}</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: left; "> <b>Course:</b> ${semForm['data1'][0]['Course']}</td>
                            </tr>
                        </table>
                        <table class="subjects-table">
                            <thead>
                                <tr>
                                    <th style="width: 7%;">Sr. No. </th>
                                    <th style="width: 40%;">Subjects/Subject Code</th>
                                    <th style="width: 4%;">Int.</th>
                                    <th style="width: 4%;">Ext.</th>
                                    <th style="width: 8%;">T/P</th>
                                    <th style="width: 20%;">Date/Shift</th>
                                    <th style="width: 17%;">Sign. of Invigilator</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                        <b>
                        Timing :- Morning: ${semForm['data3'][0]['Morning']} | Evening: ${semForm['data3'][0]['Evening']}
                        </b>
                        <table class="subjects-table">
                            <tr>
                                <td colspan="5" style="text-align: justify;"> I have read all the regulations and it's amendments in regard to examination. I found myself eligible to appear in examination. In case university declare me ineligible due to any wrong information submitted in examination form by me, i shall be responsible for its consequences.</br>
                                <strong>Note : </strong>Check your Name, Father's Name, Mother's Name and ABC ID carefully. If you find any discrepancy, contact the Registration Branch at the earliest.
                                </td>      
                            </tr>
                            <tr>
                            <th colspan="3" style="text-align: left; vertical-align: middle;">
                                Candidate Sign:
                            </th>
                            <th colspan="2">Date: ${formattedDate.split('-').reverse().join('-')}</th>
                            </tr>
                        </table>
                        <table class="subjects-table">
                            <tr>
                                <td colspan="5" style="text-align: justify;"> Certified that the Candidate has completed the prescribed course of study and fulfilled all the conditions laid down in the regulations for the examinations and is eligible to apprear in the examination as a regular student of Guru Kashi University. The candidate bears a good moral character and particulars filled by him/her are correct. Nothing is due to towards this student.
                                </td>      
                            </tr>
                        </table>
                            <table class="signature-table" style="text-align: center; width: 100%;">
                                <tr>
                                    <th style="text-align: left; width: 33%;"></th>
                                        <th style="text-align: center; width: 33%;"></th>
                                        <th style="text-align: right; width: 33%;" >
                                        <img src="${IMAGE_URL}/OfficialSignatures/examcontrollor.png" alt="Left Logo" width="180" height="50">
                                    </th>
                                </tr>
                                <tr>
                                    <th style="text-align: left; width: 33%;">Dean/HOD</th>
                                    <th style="text-align: left; width: 33%;"> </th>
                                    
                                </th>
                                <th style="text-align: right; width: 33%;">Controller of Examination</th>
                                </tr>
                            </table>
                    </div>
                </div>
            </body>
            </html>`

        await RNPrint.print({
            html: pdf_html,
        });
        // let options = {
        //     html: pdf_html,
        //     fileName: `resultFile_${semForm['data2'][0]['Semester']}`,
        //     directory: 'Downloads',
        // };
        // let file = await RNHTMLtoPDF.convert(options)
        // // console.log(file.filePath);
        // setUrl(file.filePath)
        // setLoading(false)
        // // alert(file.filePath);
    }

    // const errorHandler= ()=>{
    //     setShowModal(false)
    //     navigation.goBack()
    // }
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

        semesterAdmitCard()
    }, [])
    // useEffect(() => {
    //     createPdf()
    // }, [semForm])


    // requesting storage permission to store the file or send the file in device //////////////
    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ], {
                title: 'Storage Permission',
                message: 'App needs access to your storage to read and write files.',
                buttonPositive: 'OK',
            });

            if (granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
                // Permissions granted, you can now read and write to external storage.
                console.log("granted");
            } else {
                console.log("denied");
                // Permissions denied, handle accordingly.
            }
        } catch (error) {
            console.error('Error requesting storage permission:', error);
        }
    };

    // Call the function to request permissions
    useEffect(() => {
        Platform.OS == 'android' &&
            requestStoragePermission();
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

                <ScrollView>
                    {loading ? <ActivityIndicator /> :
                        <View style={styles.cardOuter}>
                            {/* {
                    console.log('width is ::: ',screenWidth)
                    }
                    {
                    console.log('height is ::: ',screenHeight)
                    } */}
                            <ScrollView
                                horizontal style={{ width: screenWidth > screenHeight && "100%" }}
                            >
                                <View style={{ flex: 1 }}>

                                    {/* header with details */}
                                    <View style={styles.header}>
                                        <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: 'white' }}>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>Name: {semForm['data1'][0]['StudentName']}</Text>
                                            </View>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>RollNo.: {semForm['data1'][0]['UniRollNo']}</Text>
                                            </View >
                                        </View>
                                        <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: 'white' }}>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>Father's Name: {semForm['data1'][0]['FatherName']}</Text>
                                            </View >
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>Course: {semForm['data1'][0]['Course']}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: 'white' }}>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>Semester: {semForm['data2'][0]?.['SemesterId']}</Text>
                                            </View >
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>Batch: {semForm['data1'][0]['Batch']}</Text>
                                            </View>
                                        </View>

                                    </View>

                                    {/* header end with details */}
                                    <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: colors.uniBlue }}>
                                        <View style={[styles.cellStyle, { flex: 0.5 }]}>
                                            <Text style={[styles.cardTxt, { color: 'white' }]}>Sno.</Text>
                                        </View >
                                        <View style={[styles.cellStyle, { flex: 3.5 }]}>
                                            <Text style={[styles.cardTxt, { color: 'white' }]}>SubjectName/SubjectCode</Text>
                                        </View>
                                        <View style={[styles.cellStyle, { flex: .3 }]}>
                                            <Text style={[styles.cardTxt, { color: 'white' }]}>Int.</Text>
                                        </View>
                                        <View style={[styles.cellStyle, { flex: .3 }]}>
                                            <Text style={[styles.cardTxt, { color: 'white' }]}>Ext.</Text>
                                        </View>
                                        <View style={[styles.cellStyle, { flex: 1 }]}>
                                            <Text style={[styles.cardTxt, { color: 'white' }]}>T/P</Text>
                                        </View>
                                        <View style={[styles.cellStyle, { flex: 1.4 }]}>
                                            <Text style={[styles.cardTxt, { color: 'white' }]}>Date/Shift</Text>
                                        </View>
                                    </View>
                                    {semForm['data2'].map((result, index) => (
                                        <View style={{ flexDirection: 'row', width: screenWidth * 2, justifyContent: 'space-between', backgroundColor: 'white' }} key={index}>
                                            <View style={[styles.cellStyle, { flex: 0.5 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>{index + 1}</Text>
                                            </View >
                                            <View style={[styles.cellStyle, { flex: 3.5 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>{`${result['SubjectName']} (${result['SubjectCode']})`}</Text>
                                            </View>
                                            <View style={[styles.cellStyle, { flex: .3 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}> {result['InternalExam']}</Text>
                                            </View>
                                            <View style={[styles.cellStyle, { flex: .3 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}> {result['ExternalExam']}</Text>
                                            </View>
                                            <View style={[styles.cellStyle, { flex: 1 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}> {result['SubjectType']}</Text>
                                            </View>
                                            <View style={[styles.cellStyle, { flex: 1.4 }]}>
                                                <Text style={[styles.cardTxt, { color: 'black' }]}>
                                                    {result['ExamDate']
                                                        ? result['ExamDate'].split('T')[0].split('-').reverse().join('-')
                                                        : null}
                                                    {result['ExamSession'] && (() => {
                                                        const sessionMap = { M: 'Morning', A: 'Afternoon', E: 'Evening' };
                                                        return ` / ${sessionMap[result['ExamSession']] || result['ExamSession']}`;
                                                    })()}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                    <View>
                                        <Text style={{ color: 'red', fontWeight: '600' }}>Timing :-  Morning: {semForm['data3'][0]['Morning']} | Evening: {semForm['data3'][0]['Evening']}</Text>
                                    </View>
                                </View>
                            </ScrollView>

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

export default EachAdmitCard

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