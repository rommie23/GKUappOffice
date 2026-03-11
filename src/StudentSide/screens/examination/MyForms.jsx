import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, RefreshControl,TouchableOpacity, ActivityIndicator, Modal } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
import colors from '../../../colors';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const MyForms = () => {

  const [myExamForms, setMyExamForm] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)

  const insets = useSafeAreaInsets();

  const getExamforms = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const AllForms = await fetch(BASE_URL + '/Student/examforms/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const AllFormsData = await AllForms.json()
        // console.log(AllFormsData);
        
        if(AllFormsData.data.length == 0){
          errorModel(ALERT_TYPE.WARNING,"No Forms", `No previous forms found for you !`)
          // setShowModal2(true)
        }
        setMyExamForm(AllFormsData.data)
        console.log('all previous forms:::',AllFormsData)
        // console.log('sessoin at Amrik details',session);
        setLoading(false)
      } catch (error) {
        console.log('Error fetching Guri data:Login:', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something Went wrong.`)
        // setShowModal(true)
      }
    }
  }
  // const errorHandler= ()=>{
  //   setShowModal(false)
  //   setShowModal2(false)
  //   navigation.goBack()
  // }
  useEffect(() => {
    getExamforms()
  }, [])
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getExamforms()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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
    <View style={{flex:1, paddingBottom:insets.bottom}}>
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

{/* No data found Modal */}
      {/* <Modal
      transparent={true}
      visible={showModal2}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <FontAwesome name='exclamation' size={64} color={colors.uniRed} style={{position:'absolute', top:-48, backgroundColor:'white', paddingVertical:16, borderRadius:100, paddingHorizontal:32}} />
            <Text style={styles.textSmall}>No previous forms found for you !</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={()=>errorHandler()}>
              <Text style={{color:'white', fontSize:16}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
      {/* course, sem/type, examination, status, Action  */}
      <ScrollView
        style={{ backgroundColor: '#f1f1f1' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <View style={styles.cardOuter}>
        {loading ? <ActivityIndicator/> :myExamForms.map((form, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={()=> navigation.navigate('StudentFilledExamForm',{formId : form["ID"] })}>
            <View style={{flexDirection:'row', justifyContent:'center'}} >
              <View style={{width:'75%',rowGap:8}}>
                <Text style={styles.cardTxt}>{form['Course']}</Text>
                <Text style={styles.smallTxt}>Examiantion - {form['Examination']}</Text>
                <Text style={styles.smallTxt}>{`Sem - ${form['Semesterid']}(${form['Type']})`}</Text>
                <Text style={styles.smallerTxt}>Submit Date - {(JSON.stringify(form['SubmitFormDate']).slice(1, 11)).split("-").reverse().join("-")}</Text>
              </View>
              <View style={{ width:'25%', flex:1, alignItems:'center' }}>
                <View style={{ flex: 2, justifyContent: 'center' }}>{
                  form['Status'] == -1 ? (<Text style={[styles.statusText, { color: 'blue' }]}>Forward to Registration</Text>)
                    : form['Status'] == 0 ? (<Text style={[styles.statusText, { color: 'blue' }]}>Forward to Department</Text>)
                      : form['Status'] == 1 ? (<Text style={[styles.statusText, { color: 'blue' }]}>Forward to Department</Text>)
                        : form['Status'] == 2 ? (<Text style={[styles.statusText, { color: 'red' }]}>Reject by Deptartment</Text>)
                          : form['Status'] == 3 ? (<Text style={[styles.statusText, { color: 'red' }]}>Reject by Dean</Text>)
                            : form['Status'] == 4 ? (<Text style={[styles.statusText, { color: 'blue' }]}>Forward to Account</Text>)
                              : form['Status'] == 5 ? (<Text style={[styles.statusText, { color: 'blue' }]}>Forward to Examination</Text>)
                                : form['Status'] == 6 ? (<Text style={[styles.statusText, { color: 'red' }]}>Reject by Account</Text>)
                                  : form['Status'] == 7 ? (<Text style={[styles.statusText, { color: 'red' }]}>Reject by Examination</Text>)
                                    : form['Status'] == 22 ? (<Text style={[styles.statusText, { color: 'red' }]}>Reject by Registration</Text>)
                                      : form['Status'] == 8 && form['AcceptType'] == 1 ? (<View style={{alignItems:'center'}}><Text style={[styles.statusText, { color: 'green' }]}>Accept</Text><Text style={[styles.statusText, { color: 'green', fontSize:12 }]}>{`(Provisional)`}</Text></View>)
                                        : form['Status'] == 8 ?(<Text style={[styles.statusText, { color: 'green' }]}>Accept</Text>)
                                          : (<Text style={[styles.statusText, { color: colors.uniBlue }]}>In Process</Text>)
                }</View>
                <TouchableOpacity>
                  <Entypo name="eye" color='#223260' size={screenWidth/12} onPress={()=> navigation.navigate('StudentFilledExamForm',{formId : form["ID"] })} />
                </TouchableOpacity>
              </View>

            </View>
              <View>
                <Text style={{color:'red', fontSize:12.5, marginTop:8}}>{
                  form['Status'] == 7 ? 
                  `Reject Reason : ${form['ExaminationRejectReason']}` :
                  form['Status'] == 6 ?
                  `Reject Reason : ${form['AccountantRejectReason']}` : 
                  form['Status'] == 2 ?
                  `Reject Reason : ${form['DepartmentRejectReason']}` :
                  form['Status'] == 22 ? 
                  `Reject Reason : ${form['RegistraionRejectedReason']}`:
                  form['Status'] == 3 ?
                  `Reject Reason : ${form['DeanRejectReason']}`
                  :null
                  }</Text>
              </View>
          </TouchableOpacity>
        ))}
      </View>
      </ScrollView>
    </View>
    </AlertNotificationRoot>
  )
}

const styles = StyleSheet.create({
  mainTable: {
    backgroundColor: 'white',
    width: screenWidth * 1.5
  },
  headerTable: {
    backgroundColor: colors.uniBlue,
  },
  headerText: {
    color: 'white',
    fontSize: 16
  },
  statusText: {
    fontSize:18,
    fontWeight: '500'
  },
  cardOuter: {
    width:screenWidth,
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom:4
  },

  card: {
    width:'100%',
    backgroundColor: 'white',
    flexDirection: "column",
    justifyContent:'center',
    padding: 16,
    marginTop:8,
    borderRadius:16,
    elevation:1
  },
  cardTxt: {
    color: '#1b1b1b',
    fontSize: 16,
    fontWeight:'500'
  },
  smallTxt:{
    color: '#1b1b1b',
    fontSize:14,
    fontWeight:'500'
  },
  smallerTxt:{
    color: '#1b1b1b',
    fontSize:12,
    fontWeight:'500'
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
    paddingHorizontal:16,
    paddingVertical:8,
    marginVertical:8
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 12,
    },
})

export default MyForms