{/* <script src="http://10.0.8.181:8097"></script> */ }

import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TouchableHighlight, ActivityIndicator, Modal } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { StudentContext } from '../../../context/StudentContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';


const screenWidth = Dimensions.get('window').width;
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/native';

const AllSubjectsSemWise = () => {
  const { data } = useContext(StudentContext)
  const [accordionSelected, setaccordionSelected] = useState(null)
  const [allSemesters, setAllSemesters] = useState({})
  const [allSubjects, setAllSubjects] = useState([])
  const [isloading, setIsLoading] = useState(true)
  const [isloadingNew, setIsLoadingNew] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [showModal2, setShowModal2] = useState(false)

  const navigation = useNavigation()
  // get all the subjects form the backend
  const getSemesters = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const semesters = await fetch(BASE_URL + '/Student/noofsem/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const totalsemestersData = await semesters.json()
        // console.log('total sem data ::',totalsemestersData["semesters"]);
        if(totalsemestersData["semesters"]["rowsAffected"] == 0){
          newModel(ALERT_TYPE.WARNING,"No Subjects", "There are no subjects to show");
          // setShowModal2(true)
        }
        setAllSemesters(totalsemestersData)
        setIsLoading(false)
        // console.log(allSemesters)
        // console.log(totalsemestersData['semesters']['recordset'])
      } catch (error) {
        newModel(ALERT_TYPE.DANGER,"Oops!!!", "Something went wrong !!!");
        console.log('Error fetching Guri data:AllsubjectsSemwise:', error);
      }
    }
  }
  useEffect(() => {
    getSemesters()
  }, [])
  //pass the semester value to backend so the api will give data according to the semester //
  const getSubjects = async (semid) => {
    setIsLoadingNew(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const subjects = await fetch(`${BASE_URL}/student/subjects/${semid}`, {
          method: 'POST',
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          body: JSON.stringify({
            semid: semid
          })
        })
        // console.log(subjects);
        // console.log('inside the try ', semid);
        const subjectsData = await subjects.json()
        // console.log('all subjects per sem are:::',subjectsData['semesters']['recordsets'][0]);
        setAllSubjects(subjectsData['semesters']['recordsets'][0])
        setIsLoadingNew(false)
      } catch (error) {
        console.log('Error fetching subjects data:AllsubjectsSemwise:', error);
        setIsLoadingNew(false)
        newModel(ALERT_TYPE.DANGER,"Oops!!!", "Something went wrong !!!");
        // setShowModal(true)
      }
    }
  }
  // const errorHandler= ()=>{
  //   // setShowModal(false)
  //   setShowModal2(false)
  //   navigation.goBack()
  // }
  const toggle = (i) => {
    if (accordionSelected == i) {
      return setaccordionSelected(null)
    }
    setaccordionSelected(i)
  }

  const accordianClick = (i, semid) => {
    getSubjects(semid)
    toggle(i)
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getSemesters()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const newModel = (type, title, message)=> {
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
    <View>
      {/* <Modal
      transparent={true}
      visible={showModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <FontAwesome5Icon name='exclamation' size={64} color={colors.uniRed} style={{position:'absolute', top:-48, backgroundColor:'white', paddingVertical:16, borderRadius:100, paddingHorizontal:32}} />
            <Text style={styles.textSmall}>OOps Something went wrong!!!</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={()=>errorHandler()}>
              <Text style={{color:'white', fontSize:16}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      {/* <Modal
      transparent={true}
      visible={showModal2}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <FontAwesome5Icon name='exclamation' size={64} color={colors.uniRed} style={{position:'absolute', top:-48, backgroundColor:'white', paddingVertical:16, borderRadius:100, paddingHorizontal:32}} />
            <Text style={styles.textSmall}>No Subjects found for you !</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={()=>errorHandler()}>
              <Text style={{color:'white', fontSize:16}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      >
        {isloading ? <Spinner
        visible={isloading}
        size={'large'}
        /> : allSemesters.semesters.recordset.map((item, i) => (
          <View key={i} style={[styles.card]} >
            <TouchableOpacity style={styles.topCard} onPress={() => accordianClick(i, item['SemesterId'])}>
              <Text style={[styles.textStyle]}>Semester : {item.SemesterId}</Text>
              <TouchableOpacity style={styles.touchBtn} onPress={() => accordianClick(i, item['SemesterId'])}>
                {
                  accordionSelected === i ?
                    (<Feather name='chevron-up' size={24} color={'#1b1b1b'} />) :
                    (<Feather name='chevron-down' size={24} color={'#1b1b1b'} />)
                }
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={{height:accordionSelected != i ? 0: isloadingNew?60:null}}>
              {
                  allSubjects.map((subject, index) => (
                    <View key={index} style={[styles.SubjectView]}>
                      {accordionSelected == i && isloadingNew ? <ActivityIndicator/>
                      :
                      <>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Text style={styles.SubjectTxt}>{index+1}</Text>
                        <Text style={styles.SubjectTxt}>{subject.SubjectName}</Text>
                      </View>
                      <View style={styles.subjectDetails}>
                        <TouchableHighlight style={styles.SubjectTabs} >
                          <Text style={styles.smallText}>SEM - {subject.SemesterID}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.SubjectTabs} >
                          <Text style={styles.smallText}>{subject.SubjectType == 'T' ? 'Theory' : 'Practical'}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.SubjectTabs} >
                          <Text style={styles.smallText}>{subject.SubjectCode}</Text>
                        </TouchableHighlight>
                      </View>
                      
                      </>
                      }
                    </View>
                  ))
              }
              </View>
          </View>
        ))}

      </ScrollView>

    </View>
    </AlertNotificationRoot>
  )
}
export default AllSubjectsSemWise

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    width: screenWidth - 24,
    marginVertical: 12,
    borderRadius: 16,
    alignSelf: 'center',
    padding: 16,
    overflow: 'hidden',
    elevation: 2
  },
  topCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomColor: 'lightgray',
    // borderBottomWidth: 0.5,
    paddingVertical: 6
  },
  textStyle: {
    color: '#1b1b1b',
  },
  notificationText: {
    color: 'gray'
  },
  SubjectView: {
    height:null,
    width: screenWidth - 32,
    paddingHorizontal: 16,
    alignSelf: 'center',
    paddingVertical:18,
    backgroundColor:'white'
  },
  SubjectTxt: {
    fontSize: 16,
    color: '#000'
  },
  smallText: {
    fontSize: 10,
    color: 'green'
  },
  subjectDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  SubjectTabs: {
    backgroundColor: '#FFF7D4',
    padding: 8,
    marginTop: 16,
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
  textSmall: {
    color: '#4C4E52',
    fontSize: 12,
  },
})