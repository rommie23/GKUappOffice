import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, ActivityIndicator, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import colors from '../../../colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const BooksFineDetails = () => {

  const [booksFine, setBooksFine] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const navigation = useNavigation();

  // get the fines of books and show in the modal
  const getBooksFine = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const BooksFineDetails = await fetch(BASE_URL + '/student/finedetail/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const getBooksFineDetailData = await BooksFineDetails.json()
        setBooksFine(getBooksFineDetailData)
        setLoading(false)
        // console.log('data in state variable:BooksFineDetails', getBooksFineDetailData)
      } catch (error) {
        console.log('Error fetching booksFine data:BooksFineDetails:', error)
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER,"Oops!!!", "Something went wrong !!!");
        // setShowModal(true)
      }

    }
  }
  // const errorHandler= ()=>{
  //   setShowModal(false)
  //   navigation.goBack()
  // }
  useEffect(() => {
    getBooksFine()
    
  }, [])

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
    <SafeAreaView>
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
        {loading ? <ActivityIndicator/> : 
          booksFine.map((book, i) =>
            <View key={i} style={styles.card}>
              <View style={styles.topCard}>
                <View style={styles.cardTop}>
                  <Text style={[styles.textStyle]}>{book['Title']} ({book['AccessionNo']})</Text>
                  <Text style={[styles.textSmall]}>{book['Author']}</Text>
                </View>
                <View style={styles.dates}>
                  <Text style={[styles.textSmall]}>Amount</Text>
                  <Text style={[styles.textStyle, { color: colors.uniRed }]}>₹ {book['Fine']}</Text>
                </View>
                {/* <Text style={[styles.textStyle, { color: colors.uniBlue }]}>{book['AccessionNo']}</Text> */}
              </View>
              <View style={styles.bottomCardBottom}>
                <View style={styles.dates}>
                  <Text style={[styles.textSmall]}>Book Issue Date</Text>
                  <Text style={[styles.textStyle, { color: colors.uniBlue }]}>{(JSON.stringify(book['DateOfIssue']).slice(1, 11)).split("-").reverse().join("-")}</Text>
                </View>
                <View style={styles.dates}>
                  <Text style={[styles.textSmall]}>Last Return Date</Text>
                  <Text style={[styles.textStyle, { color: colors.uniRed }]}>{(JSON.stringify(book['LastReturnDate']).slice(1, 11)).split("-").reverse().join("-")}</Text>
                </View>
                <View style={styles.dates}>
                  <Text style={[styles.textSmall]}>Date of Fine</Text>
                  <Text style={[styles.textStyle, { color: colors.uniRed }]}>{(JSON.stringify(book['DateOfFine']).slice(1, 11)).split("-").reverse().join("-")}</Text>
                </View>
              </View>
            </View>
          )
        }
      </ScrollView>
    </SafeAreaView>
      </AlertNotificationRoot>
  )
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    height: 'contain',
    width: screenWidth - 24,
    marginVertical: 12,
    borderRadius: 16,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  cardTop:{
    width:'80%'
  },
  topCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 0.5,
    paddingVertical: 12
  },
  textStyle: {
    fontSize: 15,
    color: '#1b1b1b',
    fontWeight: '500'
  },
  dates: {
    marginBottom: 16,
    borderBottomColor: 'lightgray',
    paddingVertical: 12
  },
  bottomCardTop: {
    flexDirection: 'row',
    columnGap: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  bottomCardMiddle: {
    flexDirection: 'row',
    paddingVertical: 12,
    justifyContent: 'space-between'
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 12,
  },
  rowMiddle: {
    width: '60%'
  },
  bottomCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bottomCardBottomLeft: {
    width: '85%'
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
  }
})
export default BooksFineDetails