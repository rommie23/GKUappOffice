import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, TextInputComponent } from 'react-native'
import React, { useState, useCallback, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SelectList } from 'react-native-dropdown-select-list'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
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
    const [fileResponse, setFileResponse] = useState([]);
    const [selectFile, setSelectFile] = useState(false)
    const [isloading,setIsLoading]= useState(false)
    const [loading,setLoading]= useState(false)
    const [hasSpecialSymbols, setHasSpecialSymbols] = useState(false);

    const [studentIDNo, setStudentIDNo] = useState('4567')
    // console.log(data["data"][0]["CollegeName"]);

    const navigation = useNavigation();

    
    const authorityBind = async()=>{
      setIsLoading(true)
      const session = await EncryptedStorage.getItem("user_session")
      if (session != null) {
        try {
          const authorities = await fetch(BASE_URL + '/Student/grievancehead/', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session}`
            }
          })
          const authoritiesData = await authorities.json()
          console.log(authoritiesData['data']);
          const filteredAuthorities = authoritiesData['data'].filter(item=> item.Status==1)
          setAuthorityDataAll(filteredAuthorities);
          setIsLoading(false)
          let authority = authoritiesData['data'].map((item)=>{
            return { key: item['ID'], value: item['Designation']}
          })
          setAuthorityData(authority)
        } catch (error) {
          console.log('Error fetching Guri data:Login:', error);
          setIsLoading(false)
          errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something Went wrong.`)
          // setShowModal(true)
        }
      }


    }
    useEffect(()=>{
      authorityBind();
    },[])

    const selectedData=async()=>{
      const selectionData = await authorityDataAll.filter(item => item['ID'] == authoritySelected)

      const newAuthorityId = selectionData[0]['IDNo'];
      const newAuthorityName = selectionData[0]['Designation'];
      console.log('selection ::: ', selectionData);
      setAuthorityId(newAuthorityId)
      setAuthorityName(newAuthorityName)
      console.log('setAuthorityId ::: ', authorityId);
      console.log('setAuthorityName ::: ', authorityName);
    }
    useEffect(()=>{
      selectedData();
    },[authoritySelected])
    
    const checkSpecialSymbols = (text) => {
      const regex = /[^a-zA-Z0-9,.()-_@\s]/;
      setHasSpecialSymbols(regex.test(text));
    };
    ///////////////////////////////////////// pick the file  //////////////////////////////////////////
    // const pickDocument = useCallback(async () => {       
    //     try {
    //       const [response] = await pick({
    //         presentationStyle: 'fullScreen',
    //         type: [types.pdf, types.images],
    //         multi : false
    //       });
    //     //   console.log("the reponse after file select :::",response);
    //       if(response[0]["size"]<=5000000){
    //           setFileResponse(response);
    //           console.log("After file select::: ",response[0]);
    //           setSelectFile(true)
    //       }else{
    //         submitModel(ALERT_TYPE.DANGER,"Pdf file Size", "Pdf file size should be less than 5mb")
    //       }
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }, []);
    const pickDocument = useCallback(async () => {
    try {
      // 💡 2. The `pick` function now returns the result directly
      const response = await pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.images], // Use the imported `types`
        multi: false,
      });
      const file = response[0];
      if (file && file.size <= 5000000) {
                  setFileResponse(response);
                  console.log("After file select::: ", file);
                  // setSelectPdf(true);
              } else {
                  submitModel(
                      ALERT_TYPE.DANGER,
                      "Pdf file Size",
                      "Pdf file size should be less than 5 MB"
                  );
              }
    } catch (err) {
      console.log("Document Picker Error:", err);
    }
  }, [setFileResponse, setSelectFile, submitModel]);



    /////////////////////////////// UPLOAD the file and send form /////////////////////////

      const sendGrievanceRequest = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        setIsLoading(true)
        if (session != null) {
          if (hasSpecialSymbols) {
            submitModel(ALERT_TYPE.WARNING,
              "Special Character", 
              "Please remove special characters(!@#$%^&*+':;) from application as they are not allowed")
          }else{
            try {
              const formData = new FormData();
              let responseData;
              if (fileResponse.length > 0) {
                const { uri, type } = fileResponse[0];
                const fileExtension = type.split('/')[1];
                formData.append('application_file', {
                    uri: uri,
                    type: type,                    
                    name: `${studentIDNo}.${fileExtension}`,
                });
                const response = await fetch(BASE_URL + `/student/submitgrievance/${authorityId}/${authorityName}/${subject}/${letter}`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${session}`,
                    'enctype': 'multipart/form-data',
                  },
                  body : formData
                })
                responseData = await response.json()
            }else{
              const response = await fetch(BASE_URL + `/student/submitgrievance/${authorityId}/${authorityName}/${subject}/${letter}`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${session}`,
                },
              })
              responseData = await response.json()
            }
  
              console.log(responseData);
              if (responseData['flag']== "1") {
                errorModel(ALERT_TYPE.SUCCESS,"Done", responseData['message']);
              }else if (responseData['flag']== "0"){
                submitModel(ALERT_TYPE.DANGER,"Failed", "Something went wrong");
              }else{
                submitModel(ALERT_TYPE.DANGER,"Network Slow", "Try After Sometime");
              }

            } catch (error) {
              console.log('Error fetching grievanceRequestResponse ::', error);
              submitModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
              // setShowModal(true)
            }
          }
        }
      }
      const submitModel = (type, title, message)=> {
        Dialog.show({
            type: type ,
            title: title,
            textBody: message,
            button: 'close',
            onHide: setLoading(false)
            })       
    }
    const errorModel = (type, title, message)=> {
        Dialog.show({
            type: type ,
            title: title,
            textBody: message,
            button: 'close',
            onHide: ()=>navigation.goBack()
            })       
        }

  return (
    <AlertNotificationRoot>
    <View style={{ flex: 1}}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={[styles.innerContainer]}>
            {/* selecting purpose of the movement */}
            <View style={[styles.eachInput]}>
              <Text style={styles.txtStyle}>To<Text style={{color:'red'}}>*</Text></Text>
              <SelectList boxStyles={{ padding: 10, width: "100%" }}
                setSelected={(val) => setAuthoritySelected(val)}
                fontFamily='time'
                data={authorityData}
                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                search={false}
                defaultOption={{ key: '0', value: 'Select' }}
                inputStyles={{ color: 'black' }}
                dropdownTextStyles={{ color: 'black' }}
              />
            </View>

                {/* to write down Subject */}
            <View style={[styles.eachInput]}>
              <Text style={styles.txtStyle}>Subject<Text style={{color:'red'}}>*</Text></Text>
              <TextInput
                value={subject}
                style={[styles.inputBox, { color: 'black',height: 40 }]}
                onChangeText={setSubject}
                maxLength={500}
              />
              <Text style={{fontSize:11, color:'red'}}>Max Length 500 Characters*</Text>
            </View>
            <View style={[styles.eachInput]}>
              <Text style={styles.txtStyle}>Respected Sir/Madam,<Text style={{color:'red'}}>*</Text></Text>
              <TextInput
                value={letter}
                style={[styles.inputBox, { color: 'black' }]}
                onChangeText={
                  (text)=>{
                    setLetter(text);
                    checkSpecialSymbols(text);
                  }
                }
                maxLength={2000}
                multiline
                numberOfLines={10}
                textAlignVertical='top'
                check
              />
              <Text style={{fontSize:11, color:'red'}}>Max Length 2000 Characters*</Text>
            </View>
            {fileResponse.map((file, index) => (
                <Text
                key={index.toString()}
                style={{color:'black'}}
                numberOfLines={1}
                ellipsizeMode={'middle'}>
                {file?.name}
                </Text>
            ))}
            <View style={{flexDirection:'row', width:'100%'}}>
                <TouchableOpacity  style={{ alignItems: 'center',justifyContent: 'center', marginVertical:10, backgroundColor: colors.uniRed, borderRadius: 10, width:'100%' }} onPress={()=>pickDocument()} >
                <Text style={{ color: '#fff', padding: 10 }}>Select Document(pdf)</Text>
                </TouchableOpacity>
            </View>
                <Text style={{color:'black', fontSize:12}}>Select files below 5mb only</Text>
            <View style={[styles.eachInput, {height:200}]}>
                <TouchableOpacity style={[styles.btn, {width:'100%'}]} onPress={() => {
                  sendGrievanceRequest();
                // submitModel(ALERT_TYPE.SUCCESS,"Done", "Grievance Request Submitted Succesfully")
                }
                }>
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Submit Grievance</Text>
                </TouchableOpacity>
            </View>
          </View>
      </ScrollView>
    </View>
    </AlertNotificationRoot>
  )
}

export default GrievanceForm

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 15,
      backgroundColor: '#f1f1f1',
  
    },
    innerContainer: {
      backgroundColor: 'white',
      elevation: 2,
      // borderRadius: 24,
      paddingHorizontal: 20,
      paddingVertical: 16
    },
    eachInput: {
      marginTop: 16,
      rowGap: 3
    },
    inputBox: {
      width: '100%',
      borderWidth: 1,
      borderColor: 'lightgray',
      borderRadius: 8,
      paddingHorizontal: 16,
      marginTop: 8,
      color: 'black',
      backgroundColor: '#fffafa'
    },
  
    btn: {
      marginVertical: 4,
      paddingHorizontal: 32,
      paddingVertical: 12,
      backgroundColor: colors.uniBlue,
      alignSelf: 'center',
      alignItems: 'center',
      borderRadius: 8
    },
    txtStyle: {
      color: 'black',
      fontSize: 16,
      fontWeight: '600'
    },
  })