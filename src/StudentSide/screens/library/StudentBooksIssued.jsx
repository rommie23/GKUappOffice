import { View, Text, StyleSheet, SafeAreaView, Dimensions, ScrollView, RefreshControl, Modal, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import colors from '../../../colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


const StudentBooksIssued = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [booksIssued, setBooksIssued] = useState([])
  const [showModal, setShowModal] = useState(false)
  const navigation = useNavigation()

  const getBooksIssued = async()=>{
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const BooksDetails = await fetch(BASE_URL + '/student/issueddetail/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const studentIssuedBooksData = await BooksDetails.json()
        setBooksIssued(studentIssuedBooksData['books'])
        console.log('detail of books',booksIssued)
      } catch (error) {
        console.log('Error fetching issuedBooks data:StudentBooksIssued:', error)
        errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something Went wrong.`)
        // setShowModal(true)
        
      }
    }
  }
  // const errorHandler= ()=>{
  //   setShowModal(false)
  //   navigation.goBack()
  // }
  useEffect(()=>{
    getBooksIssued()
  },[])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getBooksIssued()
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
    <SafeAreaView >
      {/* <Modal
      transparent={true}
      visible={showModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <FontAwesome name='exclamation' size={64} color={colors.uniRed} style={{position:'absolute', top:-48, backgroundColor:'white', paddingVertical:16, borderRadius:100, paddingHorizontal:32}} />
            <Text style={styles.smallText}>OOps Something went wrong!!!</Text>
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
        { booksIssued != [] &&
        booksIssued.map((book,i)=>          
          <View key={i} style={styles.card}>
          <View style={styles.topCard}>
            <View style={styles.cardTop}>
              <Text style={[styles.textStyle]}>{book['Title']}</Text>
              <Text style={[styles.textSmall]}>{book['Author']}</Text>
            </View>
              <Text style={[styles.textStyle, {color:colors.uniBlue}]}>{book['AccessionNo']}</Text>
          </View>
          <View style={styles.bottomCardBottom}>
            <View style={styles.dates}>
              <Text style={[styles.textSmall]}>Book Issue Date</Text>
              <Text style={[styles.textStyle,{color:colors.uniBlue}]}>{(JSON.stringify(book['IssueDate']).slice(1,11)).split("-").reverse().join("-")}</Text>
            </View>
            <View style={styles.dates}>
              <Text style={[styles.textSmall]}>Due Date</Text>
              <Text style={[styles.textStyle,{color:colors.uniRed}]}>{(JSON.stringify(book['LastReturnDate']).slice(1,11)).split("-").reverse().join("-")}</Text>
            </View>
            <View style={styles.dates}>
              <Text style={[styles.textSmall]}>Fine Till Date</Text>
              <Text style={[styles.textStyle,{color:colors.uniRed}]}>₹{book['fine']}</Text>
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

export default StudentBooksIssued

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
  smallText:{
    color:'black'
  }
})