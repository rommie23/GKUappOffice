// import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, TextInputComponent } from 'react-native'
// import React, { useState, useCallback, useContext, useEffect } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { SelectList } from 'react-native-dropdown-select-list'
// import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
// import { useNavigation } from '@react-navigation/native'
// import EncryptedStorage from 'react-native-encrypted-storage'
// import { BASE_URL } from '@env';
// import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
// import { pick, types, isCancel } from '@react-native-documents/picker'
// import colors from '../../../colors'
// import { StudentContext } from '../../../context/StudentContext'

// const GrievanceForm = () => {
//   const { data } = useContext(StudentContext)
//     const [authorityDataAll, setAuthorityDataAll] = useState('')
//     const [authorityData, setAuthorityData] = useState('')
//     const [authoritySelected, setAuthoritySelected] = useState('')
//     const [authorityId, setAuthorityId] = useState('')
//     const [authorityName, setAuthorityName] = useState('')
//     const [subject, setSubject] = useState('')
//     const [letter, setLetter] = useState('')
//     const [fileResponse, setFileResponse] = useState([]);
//     const [selectFile, setSelectFile] = useState(false)
//     const [isloading,setIsLoading]= useState(false)
//     const [loading,setLoading]= useState(false)
//     const [hasSpecialSymbols, setHasSpecialSymbols] = useState(false);

//     const [studentIDNo, setStudentIDNo] = useState('4567')
//     // console.log(data["data"][0]["CollegeName"]);

//     const navigation = useNavigation();

    
//     const authorityBind = async()=>{
//       setIsLoading(true)
//       const session = await EncryptedStorage.getItem("user_session")
//       if (session != null) {
//         try {
//           const authorities = await fetch(BASE_URL + '/Student/grievancehead/', {
//             method: 'POST',
//             headers: {
//               Authorization: `Bearer ${session}`
//             }
//           })
//           const authoritiesData = await authorities.json()
//           console.log(authoritiesData['data']);
//           const filteredAuthorities = authoritiesData['data'].filter(item=> item.Status==1)
//           setAuthorityDataAll(filteredAuthorities);
//           setIsLoading(false)
//           let authority = authoritiesData['data'].map((item)=>{
//             return { key: item['ID'], value: item['Designation']}
//           })
//           setAuthorityData(authority)
//         } catch (error) {
//           console.log('Error fetching Guri data:Login:', error);
//           setIsLoading(false)
//           errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something Went wrong.`)
//           // setShowModal(true)
//         }
//       }


//     }
//     useEffect(()=>{
//       authorityBind();
//     },[])

//     const selectedData=async()=>{
//       const selectionData = await authorityDataAll.filter(item => item['ID'] == authoritySelected)

//       const newAuthorityId = selectionData[0]['IDNo'];
//       const newAuthorityName = selectionData[0]['Designation'];
//       console.log('selection ::: ', selectionData);
//       setAuthorityId(newAuthorityId)
//       setAuthorityName(newAuthorityName)
//       console.log('setAuthorityId ::: ', authorityId);
//       console.log('setAuthorityName ::: ', authorityName);
//     }
//     useEffect(()=>{
//       selectedData();
//     },[authoritySelected])
    
//     const checkSpecialSymbols = (text) => {
//       const regex = /[^a-zA-Z0-9,.()-_@\s]/;
//       setHasSpecialSymbols(regex.test(text));
//     };
//     ///////////////////////////////////////// pick the file  //////////////////////////////////////////
//     // const pickDocument = useCallback(async () => {       
//     //     try {
//     //       const [response] = await pick({
//     //         presentationStyle: 'fullScreen',
//     //         type: [types.pdf, types.images],
//     //         multi : false
//     //       });
//     //     //   console.log("the reponse after file select :::",response);
//     //       if(response[0]["size"]<=5000000){
//     //           setFileResponse(response);
//     //           console.log("After file select::: ",response[0]);
//     //           setSelectFile(true)
//     //       }else{
//     //         submitModel(ALERT_TYPE.DANGER,"Pdf file Size", "Pdf file size should be less than 5mb")
//     //       }
//     //     } catch (err) {
//     //       console.log(err);
//     //     }
//     //   }, []);
//     const pickDocument = useCallback(async () => {
//     try {
//       // 💡 2. The `pick` function now returns the result directly
//       const response = await pick({
//         presentationStyle: 'fullScreen',
//         type: [types.pdf, types.images], // Use the imported `types`
//         multi: false,
//       });
//       const file = response[0];
//       if (file && file.size <= 5000000) {
//                   setFileResponse(response);
//                   console.log("After file select::: ", file);
//                   // setSelectPdf(true);
//               } else {
//                   submitModel(
//                       ALERT_TYPE.DANGER,
//                       "Pdf file Size",
//                       "Pdf file size should be less than 5 MB"
//                   );
//               }
//     } catch (err) {
//       console.log("Document Picker Error:", err);
//     }
//   }, [setFileResponse, setSelectFile, submitModel]);



//     /////////////////////////////// UPLOAD the file and send form /////////////////////////

//       const sendGrievanceRequest = async () => {
//         const session = await EncryptedStorage.getItem("user_session")
//         setIsLoading(true)
//         if (session != null) {
//           if (hasSpecialSymbols) {
//             submitModel(ALERT_TYPE.WARNING,
//               "Special Character", 
//               "Please remove special characters(!@#$%^&*+':;) from application as they are not allowed")
//           }else{
//             try {
//               const formData = new FormData();
//               let responseData;
//               if (fileResponse.length > 0) {
//                 const { uri, type } = fileResponse[0];
//                 const fileExtension = type.split('/')[1];
//                 formData.append('application_file', {
//                     uri: uri,
//                     type: type,                    
//                     name: `${studentIDNo}.${fileExtension}`,
//                 });
//                 const response = await fetch(BASE_URL + `/student/submitgrievance/${authorityId}/${authorityName}/${subject}/${letter}`, {
//                   method: 'POST',
//                   headers: {
//                     Authorization: `Bearer ${session}`,
//                     'enctype': 'multipart/form-data',
//                   },
//                   body : formData
//                 })
//                 responseData = await response.json()
//             }else{
//               const response = await fetch(BASE_URL + `/student/submitgrievance/${authorityId}/${authorityName}/${subject}/${letter}`, {
//                 method: 'POST',
//                 headers: {
//                   Authorization: `Bearer ${session}`,
//                 },
//               })
//               responseData = await response.json()
//             }
  
//               console.log(responseData);
//               if (responseData['flag']== "1") {
//                 errorModel(ALERT_TYPE.SUCCESS,"Done", responseData['message']);
//               }else if (responseData['flag']== "0"){
//                 submitModel(ALERT_TYPE.DANGER,"Failed", "Something went wrong");
//               }else{
//                 submitModel(ALERT_TYPE.DANGER,"Network Slow", "Try After Sometime");
//               }

//             } catch (error) {
//               console.log('Error fetching grievanceRequestResponse ::', error);
//               submitModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
//               // setShowModal(true)
//             }
//           }
//         }
//       }
//       const submitModel = (type, title, message)=> {
//         Dialog.show({
//             type: type ,
//             title: title,
//             textBody: message,
//             button: 'close',
//             onHide: setLoading(false)
//             })       
//     }
//     const errorModel = (type, title, message)=> {
//         Dialog.show({
//             type: type ,
//             title: title,
//             textBody: message,
//             button: 'close',
//             onHide: ()=>navigation.goBack()
//             })       
//         }

//   return (
//     <AlertNotificationRoot>
//     <View style={{ flex: 1}}>
//       <ScrollView keyboardShouldPersistTaps={'handled'}>
//           <View style={[styles.innerContainer]}>
//             {/* selecting purpose of the movement */}
//             <View style={[styles.eachInput]}>
//               <Text style={styles.txtStyle}>To<Text style={{color:'red'}}>*</Text></Text>
//               <SelectList boxStyles={{ padding: 10, width: "100%" }}
//                 setSelected={(val) => setAuthoritySelected(val)}
//                 fontFamily='time'
//                 data={authorityData}
//                 arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
//                 search={false}
//                 defaultOption={{ key: '0', value: 'Select' }}
//                 inputStyles={{ color: 'black' }}
//                 dropdownTextStyles={{ color: 'black' }}
//               />
//             </View>

//                 {/* to write down Subject */}
//             <View style={[styles.eachInput]}>
//               <Text style={styles.txtStyle}>Subject<Text style={{color:'red'}}>*</Text></Text>
//               <TextInput
//                 value={subject}
//                 style={[styles.inputBox, { color: 'black',height: 40 }]}
//                 onChangeText={setSubject}
//                 maxLength={500}
//               />
//               <Text style={{fontSize:11, color:'red'}}>Max Length 500 Characters*</Text>
//             </View>
//             <View style={[styles.eachInput]}>
//               <Text style={styles.txtStyle}>Respected Sir/Madam,<Text style={{color:'red'}}>*</Text></Text>
//               <TextInput
//                 value={letter}
//                 style={[styles.inputBox, { color: 'black' }]}
//                 onChangeText={
//                   (text)=>{
//                     setLetter(text);
//                     checkSpecialSymbols(text);
//                   }
//                 }
//                 maxLength={2000}
//                 multiline
//                 numberOfLines={10}
//                 textAlignVertical='top'
//                 check
//               />
//               <Text style={{fontSize:11, color:'red'}}>Max Length 2000 Characters*</Text>
//             </View>
//             {fileResponse.map((file, index) => (
//                 <Text
//                 key={index.toString()}
//                 style={{color:'black'}}
//                 numberOfLines={1}
//                 ellipsizeMode={'middle'}>
//                 {file?.name}
//                 </Text>
//             ))}
//             <View style={{flexDirection:'row', width:'100%'}}>
//                 <TouchableOpacity  style={{ alignItems: 'center',justifyContent: 'center', marginVertical:10, backgroundColor: colors.uniRed, borderRadius: 10, width:'100%' }} onPress={()=>pickDocument()} >
//                 <Text style={{ color: '#fff', padding: 10 }}>Select Document(pdf)</Text>
//                 </TouchableOpacity>
//             </View>
//                 <Text style={{color:'black', fontSize:12}}>Select files below 5mb only</Text>
//             <View style={[styles.eachInput, {height:200}]}>
//                 <TouchableOpacity style={[styles.btn, {width:'100%'}]} onPress={() => {
//                   sendGrievanceRequest();
//                 // submitModel(ALERT_TYPE.SUCCESS,"Done", "Grievance Request Submitted Succesfully")
//                 }
//                 }>
//                 <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Submit Grievance</Text>
//                 </TouchableOpacity>
//             </View>
//           </View>
//       </ScrollView>
//     </View>
//     </AlertNotificationRoot>
//   )
// }

// export default GrievanceForm

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       paddingHorizontal: 15,
//       backgroundColor: '#f1f1f1',
  
//     },
//     innerContainer: {
//       backgroundColor: 'white',
//       elevation: 2,
//       // borderRadius: 24,
//       paddingHorizontal: 20,
//       paddingVertical: 16
//     },
//     eachInput: {
//       marginTop: 16,
//       rowGap: 3
//     },
//     inputBox: {
//       width: '100%',
//       borderWidth: 1,
//       borderColor: 'lightgray',
//       borderRadius: 8,
//       paddingHorizontal: 16,
//       marginTop: 8,
//       color: 'black',
//       backgroundColor: '#fffafa'
//     },
  
//     btn: {
//       marginVertical: 4,
//       paddingHorizontal: 32,
//       paddingVertical: 12,
//       backgroundColor: colors.uniBlue,
//       alignSelf: 'center',
//       alignItems: 'center',
//       borderRadius: 8
//     },
//     txtStyle: {
//       color: 'black',
//       fontSize: 16,
//       fontWeight: '600'
//     },
//   })

import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useCallback, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SelectList } from 'react-native-dropdown-select-list'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification'
import { pick, types, isCancel } from '@react-native-documents/picker'
import colors from '../../../colors'
import { StudentContext } from '../../../context/StudentContext'

const GrievanceForm = () => {
  const { data } = useContext(StudentContext)
  const [authorityDataAll, setAuthorityDataAll] = useState('')
  const [authorityData, setAuthorityData] = useState('')
  const [authoritySelected, setAuthoritySelected] = useState('')
  const [authorityId, setAuthorityId] = useState('')
  const [authorityName, setAuthorityName] = useState('')
  const [subject, setSubject] = useState('')
  const [letter, setLetter] = useState('')
  const [fileResponse, setFileResponse] = useState([])
  const [selectFile, setSelectFile] = useState(false)
  const [isloading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasSpecialSymbols, setHasSpecialSymbols] = useState(false)
  const [studentIDNo, setStudentIDNo] = useState('4567')

  const navigation = useNavigation()

  // Get grievance authorities
  const authorityBind = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const authorities = await fetch(BASE_URL + '/Student/grievancehead/', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session}` }
        })
        const authoritiesData = await authorities.json()
        const filteredAuthorities = authoritiesData['data'].filter(item => item.Status == 1)
        setAuthorityDataAll(filteredAuthorities)
        setIsLoading(false)

        let authority = authoritiesData['data'].map(item => ({
          key: item['ID'],
          value: item['Designation']
        }))
        setAuthorityData(authority)
      } catch (error) {
        console.log('Error fetching Guri data:Login:', error)
        setIsLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something Went wrong.`)
      }
    }
  }

  useEffect(() => {
    authorityBind()
  }, [])

  const selectedData = async () => {
    const selectionData = await authorityDataAll.filter(item => item['ID'] == authoritySelected)
    const newAuthorityId = selectionData[0]['IDNo']
    const newAuthorityName = selectionData[0]['Designation']

    console.log('selection ::: ', selectionData)
    setAuthorityId(newAuthorityId)
    setAuthorityName(newAuthorityName)
    console.log('setAuthorityId ::: ', authorityId)
    console.log('setAuthorityName ::: ', authorityName)
  }

  useEffect(() => {
    selectedData()
  }, [authoritySelected])

  const checkSpecialSymbols = (text) => {
    const regex = /[^a-zA-Z0-9,.()-_@\s]/
    setHasSpecialSymbols(regex.test(text))
  }

  // Pick attachment
  const pickDocument = useCallback(async () => {
    try {
      const response = await pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.images],
        multi: false,
      })

      const file = response[0]
      if (file && file.size <= 5000000) {
        setFileResponse(response)
        console.log("After file select::: ", file)
      } else {
        submitModel(
          ALERT_TYPE.DANGER,
          "Pdf file Size",
          "Pdf file size should be less than 5 MB"
        )
      }
    } catch (err) {
      console.log("Document Picker Error:", err)
    }
  }, [setFileResponse, setSelectFile, submitModel])

  // Submit grievance
  const sendGrievanceRequest = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    setIsLoading(true)

    if (session != null) {
      if (hasSpecialSymbols) {
        submitModel(
          ALERT_TYPE.WARNING,
          "Special Character",
          "Please remove special characters(!@#$%^&*+':;) from application as they are not allowed"
        )
      } else {
        try {
          const formData = new FormData()
          let responseData

          if (fileResponse.length > 0) {
            const { uri, type } = fileResponse[0]
            const fileExtension = type.split('/')[1]

            formData.append('application_file', {
              uri: uri,
              type: type,
              name: `${studentIDNo}.${fileExtension}`,
            })

            const response = await fetch(
              BASE_URL + `/student/submitgrievance/${authorityId}/${authorityName}/${subject}/${letter}`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${session}`,
                  'enctype': 'multipart/form-data',
                },
                body: formData
              }
            )

            responseData = await response.json()
          } else {
            const response = await fetch(
              BASE_URL + `/student/submitgrievance/${authorityId}/${authorityName}/${subject}/${letter}`,
              {
                method: 'POST',
                headers: { Authorization: `Bearer ${session}` }
              }
            )

            responseData = await response.json()
          }

          console.log(responseData)

          if (responseData['flag'] == "1") {
            errorModel(ALERT_TYPE.SUCCESS, "Done", responseData['message'])
          } else if (responseData['flag'] == "0") {
            submitModel(ALERT_TYPE.DANGER, "Failed", "Something went wrong")
          } else {
            submitModel(ALERT_TYPE.DANGER, "Network Slow", "Try After Sometime")
          }
        } catch (error) {
          console.log('Error fetching grievanceRequestResponse ::', error)
          submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
        }
      }
    }
  }

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: setLoading(false)
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
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          {/* <View style={styles.header}>
            <View style={styles.headerIcon}>
              <FontAwesome5Icon name="file-alt" size={21} color={colors.uniBlue} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Grievance Form</Text>
              <Text style={styles.subtitle}>Submit your concern or application</Text>
            </View>
          </View> */}

          {/* Form */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <FontAwesome5Icon name="edit" size={14} color={colors.uniBlue} />
              <Text style={styles.sectionTitle}>Application Details</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>To <Text style={styles.required}>*</Text></Text>
              <SelectList
                boxStyles={styles.selectBox}
                setSelected={(val) => setAuthoritySelected(val)}
                fontFamily="time"
                data={authorityData}
                arrowicon={<FontAwesome5Icon name="chevron-down" size={11} color="#60666C" />}
                search={false}
                defaultOption={{ key: '0', value: 'Select Authority' }}
                inputStyles={styles.selectInput}
                dropdownTextStyles={styles.dropdownText}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Subject <Text style={styles.required}>*</Text></Text>
              <TextInput
                value={subject}
                style={styles.input}
                onChangeText={setSubject}
                maxLength={500}
                placeholder="Enter application subject"
                placeholderTextColor="#9A9FA4"
              />
              <Text style={styles.limit}>Maximum 500 characters</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Respected Sir/Madam, <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={letter}
                style={[styles.input, styles.messageInput]}
                onChangeText={(text) => {
                  setLetter(text)
                  checkSpecialSymbols(text)
                }}
                maxLength={2000}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                placeholder="Write your grievance or application here..."
                placeholderTextColor="#9A9FA4"
              />
              <Text style={styles.limit}>Maximum 2000 characters</Text>
            </View>
          </View>

          {/* Attachment */}
          <View style={styles.attachmentCard}>
            <View style={styles.sectionHeader}>
              <FontAwesome5Icon name="paperclip" size={14} color={colors.uniBlue} />
              <Text style={styles.sectionTitle}>Supporting Document</Text>
            </View>

            {fileResponse.map((file, index) => (
              <View style={styles.fileBox} key={index.toString()}>
                <View style={styles.fileIcon}>
                  <FontAwesome5Icon name="file-pdf" size={18} color={colors.uniRed} />
                </View>
                <Text
                  style={styles.fileName}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {file?.name}
                </Text>
                <FontAwesome5Icon name="check-circle" size={16} color="#4B8B63" />
              </View>
            ))}

            <TouchableOpacity style={styles.documentButton} onPress={() => pickDocument()}>
              <FontAwesome5Icon name="folder-open" size={16} color="#FFF" />
              <Text style={styles.buttonText}>Select Document</Text>
            </TouchableOpacity>

            <View style={styles.fileInfo}>
              <FontAwesome5Icon name="info-circle" size={12} color="#7A8086" />
              <Text style={styles.fileInfoText}>PDF or image • Maximum 5 MB</Text>
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              sendGrievanceRequest()
            }}
          >
            <FontAwesome5Icon name="paper-plane" size={15} color="#FFF" />
            <Text style={styles.submitText}>Submit Grievance</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            Please review your application before submitting.
          </Text>
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  )
}

export default GrievanceForm

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F8' },
  content: { padding: 16, paddingBottom: 30 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerIcon: { width: 46, height: 46, borderRadius: 13, backgroundColor: '#E8EDF0', alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, marginLeft: 12 },
  title: { fontSize: 21, fontWeight: '700', color: '#25292D' },
  subtitle: { fontSize: 11, color: '#7B8187', marginTop: 3 },

  formCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, elevation: 2 },
  attachmentCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginTop: 12, elevation: 2 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#30353A' },

  field: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '600', color: '#5F666C', marginBottom: 6 },
  required: { color: colors.uniRed },
  selectBox: { width: '100%', minHeight: 44, borderRadius: 10, borderColor: '#E0E3E6', backgroundColor: '#FAFBFC', paddingVertical: 8 },
  selectInput: { color: '#30353A', fontSize: 13 },
  dropdownText: { color: '#30353A', fontSize: 13 },

  input: { width: '100%', minHeight: 44, borderWidth: 1, borderColor: '#E0E3E6', borderRadius: 10, paddingHorizontal: 13, backgroundColor: '#FAFBFC', color: '#30353A', fontSize: 13 },
  messageInput: { minHeight: 160, paddingTop: 12 },
  limit: { fontSize: 10, color: '#8A9096', marginTop: 5, textAlign: 'right' },

  fileBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#E5E7E9', marginBottom: 10 },
  fileIcon: { width: 38, height: 38, borderRadius: 9, backgroundColor: '#FCEBEC', alignItems: 'center', justifyContent: 'center' },
  fileName: { flex: 1, fontSize: 12, color: '#3D4348', marginHorizontal: 9 },

  documentButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.uniRed, borderRadius: 10, paddingVertical: 12 },
  buttonText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  fileInfo: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 9 },
  fileInfoText: { color: '#7A8086', fontSize: 10 },

  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, backgroundColor: colors.uniBlue, borderRadius: 11, paddingVertical: 13, marginTop: 14, elevation: 2 },
  submitText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  footerNote: { textAlign: 'center', fontSize: 10, color: '#8A9096', marginTop: 9 }
})