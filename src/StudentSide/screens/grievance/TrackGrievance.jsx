import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
import colors from '../../../colors'

const TrackGrievance = () => {
  const navigation = useNavigation()
  const [grievanceId, setGrievanceId] = useState('')
  const [grievanceList, setGrievanceList] = useState([])
  const [grievanceDetails, setGrievanceDetails] = useState({})
  const [showGrievance, setShowGrievance] = useState(false)

  const getGrievanceId = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {    
        const grievanceId = await fetch(BASE_URL + `/student/grievance`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const grievanceIdData = await grievanceId.json()
        const grievancesArray = grievanceIdData["grievances"].map((item)=>{
          return {key:item["TokenNo"], value:item["TokenNo"]}
        })
        // console.log(grievancesArray);
        setGrievanceList(grievancesArray)
      } catch (error) {
        console.log('Error fetching grievance id request ::', error);
        errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
        // setShowModal(true)
      }
    }
  }
  useEffect(()=>{
    getGrievanceId()
  },[])
  // function for what to happen when user select or reselect the grievance id form dropdown

  const grievenceIdSelect=(val)=>{
    setGrievanceId(val)
    setShowGrievance(false)
  }
  
  // sending the GrievanceId to backend
  
  const detailedGrievance = async () => {
    const session = await EncryptedStorage.getItem("user_session")

    if (session != null) {
      console.log(grievanceId);
      
      try {    
        const grievanceDetails = await fetch(BASE_URL + `/student/grievance/${grievanceId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const grievanceDetailsData = await grievanceDetails.json()
        setGrievanceDetails(grievanceDetailsData)
        setShowGrievance(true)
        console.log('track data :::: ',grievanceDetailsData['data'][0]['FilePath']);
        // console.log('length ::: ', );
        
      } catch (error) {
        console.log('Error fetching grievanceDetailsData request ::', error);
        errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
        // setShowModal(true)
      }
    }
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
    const submitModel = (type, title, message)=> {
        Dialog.show({
            type: type ,
            title: title,
            textBody: message,
            button: 'close',
            onHide: setLoading(false)
            })
            
    }

  return (
    <AlertNotificationRoot>
    <View style={{ flex: 1}}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View>
          <View style={[styles.innerContainer]}>

            {/* selecting purpose of the movement */}
            <View style={[styles.eachInput]}>
              <Text style={styles.txtStyle}>Select Application ID</Text>
              <SelectList boxStyles={{ padding: 10, width: "100%" }}
                setSelected={(val) => grievenceIdSelect(val)}
                fontFamily='time'
                data={grievanceList}
                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                search={false}
                defaultOption={{ key: '0', value: 'Select' }}
                inputStyles={{ color: 'black' }}
                dropdownTextStyles={{ color: 'black' }}
              />
            </View>
            
            <View style={styles.eachInput}>
              {
                grievanceId > 0 ?
                  <TouchableOpacity style={styles.btn} onPress={() => {detailedGrievance()}
                  }>
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Search</Text>
                  </TouchableOpacity> :
                  <TouchableOpacity style={[styles.btn, {backgroundColor:'gray'}]} disabled >
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Search</Text>
                  </TouchableOpacity>
              }
                </View>
          </View>
        </View>{
          showGrievance ? 
          <View style={{paddingHorizontal:16, backgroundColor:'white', marginTop:16}}>
              <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', marginVertical:16}}>
                  <Text style={styles.textNormal}>Application No. {grievanceDetails["data"][0]["TokenNo"][0]}</Text>
                  <Text style={styles.textNormal}>Date - {grievanceDetails["data"][0]["SubmitDate"].split("T")[0].split("-").reverse().join("-")}</Text>
              </View>
              <View>
                  <Text style={[styles.textNormal, {fontWeight:'600'}]}>Status :
                    {
                      grievanceDetails['data'][0]["Status"] ==1 ?
                      <Text style={[styles.textNormal,{color:'green', fontWeight:600}]}> Completed</Text>
                      :
                      <Text style={[styles.textNormal,{color:colors.uniBlue, fontWeight:600}]}> Forwarded</Text>
                    }
                    </Text>
                  <Text style={[styles.textNormal, {marginBottom:4}]}>To</Text>
                  <Text style={styles.textNormal}>Student Interaction Cell</Text>
                  <Text style={styles.textNormal}>Guru Kashi University</Text>
                  <Text style={styles.textNormal}>Talwandi Sabo</Text>
                  <Text style={[styles.textNormal, {fontWeight:'600', marginVertical:8}]}>Subject: {grievanceDetails['data'][0]["Subject"]}</Text>
                  {
                    console.log("filepath" ,typeof(grievanceDetails['data'][0]["FilePath"]))
                  }
                  {
                    grievanceDetails['data'][0]['FilePath'] != 'null' ?
                    <Pressable style={[styles.btn,{paddingHorizontal:4, paddingVertical:4, alignSelf:'flex-start'}]} onPress={()=> navigation.navigate("GrievanceRequestFile", {fileName: grievanceDetails['data'][0]["FilePath"]})}>
                      <Text style={{ color: 'white', fontWeight: '400', fontSize: 12 }}>Attachment file</Text>
                    </Pressable> :
                    <Text style={styles.textNormal}>no file attached</Text>
                  }
              </View>
              <View>
                  <Text style={[styles.textNormal,{marginBottom:4}]}>Respected Sir/Madam ,</Text>
                  <Text style={styles.textNormal}>{grievanceDetails['data'][0]["Description"]}</Text>
              </View>
              <View style={{marginVertical:8}}>
                  <Text style={styles.textNormal}>Your Faithfully</Text>
                      <Text style={[styles.textNormal, {fontWeight:'600'}]}>Name: {grievanceDetails["StudentName"]}</Text>
                      <Text style={[styles.textNormal, {fontWeight:'600'}]}>Roll No. {grievanceDetails["ClassRollNo"]} </Text>
                      <Text style={[styles.textNormal, {fontWeight:'600'}]}>Course: {grievanceDetails["Course"]}</Text>
              </View>


          </View> :
          <Text style={[styles.textNormal, {fontWeight:'600'}]}>Please select grievanceId and search</Text>
        }
        {
          showGrievance ? 
          <View style={{marginVertical:16, backgroundColor:'white', alignItems:'center'}}>
                  {
                    grievanceDetails['data'][grievanceDetails['data'].length-1]['Action']==1?
                    <Text style={[styles.textNormal,{color:'green', fontWeight:'600'} ]}>Status : Completed</Text>
                    :<Text style={[styles.textNormal,{color:colors.uniBlue, fontWeight:'600'} ]}>Status : In Process</Text>
                  }
                  <Text style={[styles.textNormal, {color:'green', fontWeight:800, fontSize:16}]}>TRACK</Text>
                      {
                        grievanceDetails['data'].map((item, i)=>(
                          <View key={i} style={{alignItems:'center'}}>
                          <FontAwesome5Icon name='long-arrow-alt-down' size={40} color={'green'}/>

                          <Text style={[styles.textNormal ]}>Remarks: <Text style={[styles.textNormal,{fontWeight:600}]}>{item["EmployeeRemarks"]}</Text></Text>
                          <Text style={[styles.textNormal ]}>Name: {item["EmployeeName"]}({item["EmployeeId"]})</Text>
                          <Text style={[styles.textNormal ]}>Department: {item["EmployeeDepartment"]} </Text>
                          <Text style={[styles.textNormal ]}>Forward Date: {item["ForwardDateTime"] && item["ForwardDateTime"].split("T")[0].split("-").reverse().join("/") }-{item["ForwardDateTime"] && item["ForwardDateTime"].split("T")[1].split('.')[0]}</Text>
                          </View>
                        ))
                      }
              </View> 
              : null
        }



      </ScrollView>
    </View>
    </AlertNotificationRoot>
  )
}

export default TrackGrievance

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 15,
      backgroundColor: '#f1f1f1',
  
    },
    innerContainer: {
      backgroundColor: 'white',
      marginTop: 24,
      elevation: 2,
      // borderRadius: 24,
      paddingHorizontal: 40,
      paddingVertical: 16
    },
    eachInput: {
      marginTop: 16,
      rowGap: 4
    },
    inputBox: {
      height: 40,
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
    textNormal:{
        color:'black'
    }
  })