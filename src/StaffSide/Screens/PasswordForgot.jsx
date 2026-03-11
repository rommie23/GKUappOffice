import { View, Text, Image, StyleSheet, Dimensions, Alert, ScrollView, TextInput, Pressable, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { images } from '../../images';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
import AntDesign from 'react-native-vector-icons/AntDesign';

const PasswordForgot = () => {
  const navigation = useNavigation()
  const [isloading, setIsLoading] = useState(false)
  const [getEmailID, setEmailID] = useState('')
  const [getEmployeeID, setEmployeeID] = useState('')
  const [getResult, setresult] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const forgotAction = () => {
    if (getEmployeeID && getEmailID) {
      setIsLoading(true)
      const url = `http://gurukashiuniversity.co.in/GMS/forgot-password-action.php?email_id=${getEmailID}&username=${getEmployeeID}`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetch successful:', data);
          setresult(data);
          if (data == '4') {
            submitModel(ALERT_TYPE.WARNING, "Oops!!!", `Kindly provide the right information. Email and Username does not match in database`)
          } else {
            errorModel(ALERT_TYPE.SUCCESS, "Success", `Email Successfully sent...`)
          }
          // setShowModal(true); 
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Fetch error:', error);
          submitModel(ALERT_TYPE.WARNING, "Oops!!!", `Enter IDNo/ClassRollNo/UniRollNo and Email ID !!!`)
          // setShowModal2(true); 
          setIsLoading(false)
        });
    } else {
      submitModel(ALERT_TYPE.WARNING, "Oops!!!", `Enter Employee ID and Email ID !!!`)
      // setShowModal2(true);
      setIsLoading(false)
    }
    console.log(getResult);
  };
  const closeModel = () => {
    setShowModal(false);
    navigation.goBack();
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
  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }

  return (
    <AlertNotificationRoot>
      <View>
        {isloading &&
          <Spinner
            visible={isloading}
          />
        }
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={styles.container}>
              {/* <Modal
                // transparent={true}
                visible={showModal}> 
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                       <FontAwesome name={getResult=='4'? 'exclamation-circle' :'check'} size={64} color={getResult=='4' ?colors.uniRed:'green'} style={{position:'absolute', top:-48, backgroundColor:'white', padding:16, borderRadius:100}} />
                        <Text style={{color:'gray', fontSize:24}}>{getResult=='4'?'OOps !':'Success'}</Text>
                        <Text style={styles.textSmall}>{getResult=='4' ? 'Kindly provide the right information. Email and Username does not match in database':'Email Successfully sent...' }</Text>
                        <TouchableOpacity style={styles.modalBtn} onPress={()=>getResult=='4'? setShowModal(false) :closeModel()}>
                        <Text style={{color:'white', fontSize:12}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal> */}
              {/* <Modal
                // transparent={true}
                visible={showModal2}> 
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                       <FontAwesome name='exclamation-circle' size={64} color={colors.uniRed} style={{position:'absolute', top:-48, backgroundColor:'white', padding:16, borderRadius:100}} />
                        <Text style={{color:'gray', fontSize:24}}>OOps !</Text>
                        <Text style={styles.textSmall}>Enter Employee ID and Email ID !!!'</Text>
                        <TouchableOpacity style={styles.modalBtn} onPress={()=>setShowModal2(false)}>
                        <Text style={{color:'white', fontSize:12}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal> */}
              <Image style={styles.forgotlogo} source={images.forgotLock} />
              <Text style={styles.title}>Forgot Password</Text>
              <View style={styles.inputView}>
                <View style={styles.loginInput}>

                  <TextInput
                    style={styles.inputBox}
                    placeholder='Enter Employee ID'
                    onChange={e => setEmployeeID(e.nativeEvent.text)}
                    placeholderTextColor={'grey'}
                    keyboardType='numeric'
                  />

                </View>
                <View style={styles.loginInput}>

                  <TextInput
                    style={styles.inputBox}
                    placeholder='Enter Registered Email ID'
                    onChange={e => setEmailID(e.nativeEvent.text)}
                    placeholderTextColor={'grey'}
                  />

                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.selectionbtnFull,
                    {
                      backgroundColor: '#fff',
                      borderWidth: 2,
                      borderRadius: 36,
                      borderColor: colors.uniBlue,
                      paddingVertical: 14,
                      elevation: 4,
                      shadowColor: '#000',
                      shadowOpacity: 0.08,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 4 },
                      paddingHorizontal: 36,
                      marginBottom: 16,
                      width: '50%',
                      alignSelf: 'center',
                      alignItems: 'center'
                    },
                  ]}
                  onPress={() => forgotAction()}
                >
                  {/* Optional icon inside button */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Text
                      style={[
                        styles.selectionbtnText,
                        {
                          color: '#223260',
                          fontSize: 15,
                          fontWeight: '600',
                          letterSpacing: 0.5,
                        },
                      ]}
                    >Submit</Text>
                    <AntDesign name="login" color="#000" size={24} />

                  </View>
                </TouchableOpacity>

                {/* <Pressable
                        style={styles.button}
                        onPress={() => forgotAction()}>
                        <Text style={styles.btnText}>Submit</Text>
                    </Pressable> */}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </AlertNotificationRoot>
  )
}
export default PasswordForgot
//////////////////// CSS of the page ///////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
    backgroundColor: '#fff'
  },
  logoTop: {
    width: screenWidth,
    height: screenHeight / 25,
    resizeMode: 'contain',
  },
  forgotlogo: {
    //   opacity:0.8,
    height: 130,
    width: 140,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    // textTransform : "uppercase",
    textAlign: "center",
    paddingVertical: 40,
    color: "#223260"
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 5
  },
  inputBox: {
    height: 50,
    paddingHorizontal: 20,
    width: '90%',
    color: 'black'
  },
  loginInput: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    // justifyContent:'space-between',
    alignItems: 'center',
    borderColor: "#223260",
    borderWidth: 1,
    borderRadius: 30,
    //   paddingBottom:0
    backgroundColor: '#fff'

  },
  button: {
    backgroundColor: "#223260",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: 'black',
    elevation: 2,
    alignItems: 'center',
    width: '80%',
    paddingTop: 48
  },
  modalBtn: {
    backgroundColor: colors.uniBlue,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8
  },
  textSmall: {
    color: 'gray',
    fontSize: 16
  }
});