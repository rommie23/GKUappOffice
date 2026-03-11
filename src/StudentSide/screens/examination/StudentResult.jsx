import { RefreshControl, Dimensions, ScrollView, StyleSheet, Text, Alert, View, TouchableOpacity, ActivityIndicator, Modal, PermissionsAndroid } from 'react-native';
import colors from '../../../colors';
import { useCallback, useEffect, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo'
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';
import PrintTest from './PrintTest';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const StudentResult = () => {
  const navigation = useNavigation()

  const [allResults, setAllResults] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
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

  // useEffect(()=>{
  //   const orientation =  screenWidth > screenHeight ? "landscape" : "portrait"
  //   console.log('width :: ', screenWidth);
  //   console.log('height :: ', screenHeight);
    
  //   console.log(orientation);
  // })

  const getAllResults = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const AllResults = await fetch(`${BASE_URL}/Student/results/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const AllResultsData = await AllResults.json()
        console.log(AllResultsData)
        if (AllResultsData.data.length == 0) {
          errorModel(ALERT_TYPE.WARNING,"No Results", `No Results Found !`)
          // setShowModal2(true)
        }
        setAllResults(AllResultsData.data)
        // console.log('sessoin at Amrik details',session);
        setLoading(false)
      } catch (error) {
        console.log('Error fetching Guri data:Login:', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
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
    getAllResults()
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllResults()
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
    <ScrollView
      style={{ backgroundColor: '#f1f1f1' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.cardOuter}>
      {
        loading ? <ActivityIndicator/> : allResults.map((result, index) => (
          result["AcceptType"] !=1 && result["AcceptTypeRegistration"] != 1 ?
          <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate('StudentSemesterResult' , {resultID : result["Id"] })}>
            <View style={{ width: '80%', rowGap: 8 }}>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.cardTxt}>{`${result["Examination"]}`}</Text>
                {result['DeclareType'] ? <Text style={styles.cardTxt}>{` (${result['DeclareType']})`}</Text>
                :
                null
                }
              </View>
              <Text style={styles.smallTxt}>{`Semester - ${result['Semester']} (${result['Type']})`}</Text>
              <Text style={styles.smallTxt}>{`Declare Date - ${(JSON.stringify(result['DeclareDate']).slice(1, 11)).split("-").reverse().join("-")}`}</Text>
            </View>
            <View style={{ width: '20%', flex: 1, alignItems: 'center', gap:16 }}>
              <View style={styles.sgpaLook}>{<Text style={[styles.statusText, { color: 'white' }]}>{result['Sgpa']}</Text>
              }</View>
              <TouchableOpacity>
                <Entypo name="eye" color='#223260' size={screenWidth / 14} onPress={() => navigation.navigate('StudentSemesterResult' , {resultID : result["Id"]})}/>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          :
          <TouchableOpacity key={index} disabled style={styles.card}>
            <View style={{ width: '80%', rowGap: 8 }}>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.cardTxt}>{`${result["Examination"]}`}</Text>
                {result['DeclareType'] ? <Text style={styles.cardTxt}>{` (${result['DeclareType']})`}</Text>
                :
                null
                }
              </View>
              <Text style={styles.smallTxt}>{`Semester - ${result['Semester']} (${result['Type']})`}</Text>
              <Text style={[styles.smallTxt,{color:'red', fontSize:12}]}>{`${result['ProvisionalMessage']}`}</Text>
            </View>
            <View style={{ width: '20%', flex: 1, alignItems: 'center', gap:16 }}>
              <View style={styles.sgpaLook}>{<Text style={[styles.statusText, { color: 'white' }]}>{`${result['ProvisionalMessageTitle']}`}</Text>
              }</View>
            </View>
          </TouchableOpacity>
        ))
      } 
      </View>      
    </ScrollView>
    </AlertNotificationRoot>
  )
}

const styles = StyleSheet.create({
  mainTable: {
    backgroundColor: 'white',
  },
  headerTable: {
    backgroundColor: colors.uniBlue,
  },
  headerText: {
    color: 'white',
    fontSize: 16
  },
  cardOuter: {
    width:screenWidth,
    alignItems: 'center',
    paddingHorizontal: 8,   
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: "row",
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 8,
    borderRadius: 16,
    elevation: 1
  },
  cardTxt: {
    color: '#1b1b1b',
    fontSize: 16,
    fontWeight: '500'
  },
  smallTxt: {
    color: '#1b1b1b',
    fontSize: 14,
    fontWeight: '500'
  },
  sgpaLook: {
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: colors.uniRed,
    paddingHorizontal:16,
    paddingVertical:8,
    borderRadius:8
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
  textSmall:{
    color:'black',
    fontSize:12
  }
})

export default StudentResult