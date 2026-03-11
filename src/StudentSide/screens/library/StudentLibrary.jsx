import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert, Modal, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import IonIcons from 'react-native-vector-icons/Ionicons'
import colors from '../../../colors'
import { useNavigation } from '@react-navigation/native'
import { StudentContext } from '../../../context/StudentContext'
import LinearGradient from 'react-native-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const StudentLibrary = () => {
  const {totalBooksAndFine} = useContext(StudentContext);
  // console.log('coming form library', totalBooksAndFine);
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [icon, setIcon] = useState('')
  const navigation = useNavigation()

  const modalDetails = (myMessage, myIcon)=>{
    // setMessage(myMessage)
    // setIcon(myIcon)
    errorModel(ALERT_TYPE.WARNING,"Oops!!!", myMessage)
    // setShowModal(true)
  }

  const errorModel = (type, title, message)=> {
    Dialog.show({
        type: type ,
        title: title,
        textBody: message,
        button: 'close',
        })
  }

  return (
    <AlertNotificationRoot>
    <ScrollView style={styles.scrollCont}>
      {/* <Modal
      transparent={true}
      visible={showModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <FontAwesome name={icon} size={64} color={colors.uniBlue} style={{position:'absolute', top:-48, backgroundColor:'white', padding:16, borderRadius:100}} />
            <Text style={styles.textSmall}>{message}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={()=>setShowModal(false)}>
              <Text style={{color:'white', fontSize:16}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
      <View style={styles.outerContainer}>

        <View style={styles.container}>
          {/* ///////////////////// cards list ////////////////////// */}
          <View style={styles.containerLeft}>
            <TouchableOpacity style={styles.cards} onPress={() => totalBooksAndFine['books'][0]['books'] == 0 ? modalDetails('No Issued Books for You', 'book') : totalBooksAndFine['books'][0]['books'] == null ? modalDetails('No fine', 'money') : navigation.navigate('StudentBooksIssued')}>
              <View style={styles.cardCont}>
                <View>
                  <Text style={styles.cardText}>Issued Books</Text>
                  <Text style={styles.textSmall}>Current Books Issued:{totalBooksAndFine['books'][0]['books']}</Text>
                </View>
                <MaskedView
                  style={{ flexDirection: 'row', height: 36, width: 36 }}
                  maskElement={
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <FontAwesome name='book' size={36} color={colors.uniBlue} />
                    </View>
                  }
                >
                  <LinearGradient
                    colors={[colors.uniRed, colors.uniBlue]}
                    style={{ flex: 1 }}
                  />
                </MaskedView>
                
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cards} onPress={()=>totalBooksAndFine['finedata'][0]['amount'] == null ? modalDetails('No Fine to Show', 'money') : totalBooksAndFine['finedata'][0]['amount'] == 0 ? modalDetails('No Fine to Show', 'money') : navigation.navigate('BooksFineDetails')}>
              <View style={[styles.cardCont]}>
              <View>
                  <Text style={styles.cardText}>Fine: ₹{totalBooksAndFine['finedata'][0]['amount']}</Text>
                  <Text style={styles.textSmall}>To be paid in library</Text>
                </View>
                <MaskedView
                  style={{ flexDirection: 'row', height: 36, width: 36 }}
                  maskElement={
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <IonIcons name='cash-outline' size={36} color={colors.uniBlue} />
                    </View>
                  }
                >
                  <LinearGradient
                    colors={[colors.uniRed, colors.uniBlue]}
                    style={{ flex: 1 }}
                  />
                </MaskedView>
                
              </View>
            </TouchableOpacity>


            <TouchableOpacity style={styles.cards} onPress={() => navigation.navigate('BookSearch')}>
              <View style={styles.cardCont}>
                <View>
                  <Text style={styles.cardText}>Book Search</Text>
                  <Text style={styles.textSmall}>Search Required Book</Text>
                </View>
                <MaskedView
                  style={{ flexDirection: 'row', height: 36, width: 36 }}
                  maskElement={
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <FontAwesome name='book' size={36} color={colors.uniBlue} />
                    </View>
                  }
                >
                  <LinearGradient
                    colors={[colors.uniRed, colors.uniBlue]}
                    style={{ flex: 1 }}
                  />
                </MaskedView>
                
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </ScrollView>
    </AlertNotificationRoot>
  )
}

export default StudentLibrary

const styles = StyleSheet.create({
  scrollCont: {
    backgroundColor: '#f1f1f1',
  },
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth,
    //   backgroundColor:'green',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  containerLeft: {
    width: '100%',
    gap: 20,
    height: 'contain',
    // backgroundColor:'red',
    paddingVertical: 8
  },
  cards: {
    width: '100%',
    height: screenHeight / 12,
    backgroundColor: 'white',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  cardText: {
    color: '#3b5998',
    fontSize: 20,
    fontWeight: '600'
  },
  cardCont: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24
  },
  iconOuter: {
    borderColor: '#3b5998',
    borderWidth: 1,
    borderRadius: 32,
    padding: 12,
  },
  textSmall:{
    fontWeight:'600',
    color:'gray'
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
    backgroundColor:colors.uniBlue,
    alignItems:'center',
    paddingHorizontal:16,
    paddingVertical:8,
    marginVertical:8
  }

})