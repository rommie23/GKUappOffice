import { ScrollView, StyleSheet, Text, TouchableHighlight, View, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../../../colors'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';

const StudentFilledExamForm = ({route}) => {
  const { formId } = route.params
  const [loading, setLoading] = useState(false)
  const [allSubjects, setAllSubjects] = useState([])
  const [basicData, setBasicData] = useState([])

  const navigation = useNavigation()

  const getExamsubjects = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const ExamSubjects = await fetch(`${BASE_URL}/Student/examform/${formId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const ExamSubjectsDetails = await ExamSubjects.json()
        // console.log(ExamSubjectsDetails)
        // console.log('sessoin at Amrik details',session);
        setAllSubjects(ExamSubjectsDetails['data1'])
        setBasicData(ExamSubjectsDetails['data'])
        setLoading(false)
      } catch (error) {
        console.log('Error fetching Guri data:Login:', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something Went wrong.`)
      }
    }
  }

  useEffect(()=>{
    getExamsubjects()
  },[])

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
    <ScrollView 
    >

      <View>
        {
            basicData.map((info,i)=>(
            <View style={styles.outerCard} key={i}>
              <View style={{ flexDirection: 'column', marginBottom:8 }}>
                <Text style={[styles.SubjectTxt, {marginVertical:4}]}>Course - {info["Course"]}</Text>
                <Text style={[styles.SubjectTxt, {marginVertical:4}]}>Batch - {info["Batch"]}</Text>
              </View>
            </View>
              
            ))
          }
        {
            allSubjects.map((subject,i)=>(
            <View style={styles.outerCard} key={i}>
              <View style={{ flexDirection: 'row', alignItems:'center', marginBottom:8 }}>
                <Text style={[styles.SubjectTxt, {width:'5%', alignSelf:'flex-start'}]}>{i+1}</Text>
                <Text style={[styles.SubjectTxt, {width:'80%'}]}>{subject["SubjectName"]}</Text>
                <Text style={[styles.SubjectTxt , {width:'25%', color:colors.uniBlue, fontWeight:'500',alignSelf:'flex-start'}]}>{subject["SubjectCode"]}</Text>
              </View>
              <View style={styles.subjectDetails}>
                <View>
                  <TouchableHighlight style={styles.SubjectTabs} >
                    <Text style={styles.smallText}>External exam - {subject["ExternalExam"] == "Y" ? "Yes" : "No"}</Text>
                  </TouchableHighlight>
                </View>
                {/* <TouchableHighlight style={styles.SubjectTabs} >
                  <Text style={styles.smallText}>{subject["SubjectType"] == "T" ? 'Theory' : 'Practical'}</Text>
                </TouchableHighlight> */}
              </View>

            </View>
              
            ))
          }
      </View>
    </ScrollView>
    </AlertNotificationRoot>
  )
}

export default StudentFilledExamForm

const styles = StyleSheet.create({
  outerCard: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical:12,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 8,
    elevation: 1
  },
  heading: {
    flex: 1,
    alignItems: 'center'
  },
  headingTxt: {
    fontSize: 20,
    color: 'gray'
  },
  SubjectTxt: {
    fontSize: 14,
    color: '#000'
  },
  smallText: {
    fontSize: 12,
    color: 'green',
    fontWeight:'400'
  },
  subjectDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:'5%'
  },
  SubjectTabs: {
    marginBottom: 4,
    borderRadius: 12,
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
})