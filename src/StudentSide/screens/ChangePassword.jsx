import { View, Text, Image, StyleSheet, Dimensions, Alert, ScrollView, TextInput, TouchableOpacity, Modal, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';

import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../colors'
import { useNavigation } from '@react-navigation/native';
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const ChangePassword = () => {
    const navigation = useNavigation()
    const[oldPassword, setOldPassword] = useState('')
    const[newPassword, setNewPassword] = useState('')
    const[confirmPassword, setConfirmPassword] = useState('')
    const[showConfirmPassword, setShowConfirmPassword] = useState(false)
    const[matchError, setMatchError] = useState(false)
    const[oldPasswordError, setOldPasswordError]= useState(false)
    const[isloading, setIsLoading] = useState(false)
    const[showModal, setShowModal] = useState(false)
    ///////////////////// toggle for password show and hide in login page /////////////////////////////
    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }; 

    const submitNewPassword = async () => {
        setMatchError(false)
        setOldPasswordError(false)
        setIsLoading(true)
        if (!newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[^\w\d\s]).{8,}$/)) {
            submitModel(ALERT_TYPE.DANGER, "Strong Password Required", "Password must have capital letter, samll letter, special character, and 8 characters long.")
            setIsLoading(false)
        }
        else if(newPassword != confirmPassword){
            setMatchError(true)
            setIsLoading(false)
        }
        else{
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const sendNewPassword = await fetch(`${BASE_URL}/student/passwordchange/${oldPassword}/${newPassword}`, {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${session}`,
                    }
                })
                const sendNewPasswordRes = await sendNewPassword.json()
                console.log('password change details', sendNewPasswordRes)
                setIsLoading(false)
                sendNewPasswordRes["Response"] == "2" ? setOldPasswordError(true) :
                sendNewPasswordRes["Response"] == "1" ? 
                submitModel(ALERT_TYPE.SUCCESS,"Done", "Password Change Successfull.") :
                null
            } catch (error) {
                console.log('Error fetching Password Change flag data:apply:', error);
                setIsLoading(false)
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
            onHide: setIsLoading(false)
            })
    }

  return (
    <AlertNotificationRoot>
    <View>
        {isloading && 
        <Spinner
        visible={isloading}
        size={'large'}
        />
        }
        {/* top header with logo image of university */}
        {/* <View style={{backgroundColor:'#ffbc3b', paddingHorizontal:20, paddingVertical:8, zIndex:999}}>
            <Image style={styles.logoTop} source={images.topLogo}/>
        </View> */}
        <ScrollView keyboardShouldPersistTaps={'handled'}>
            {/* <ImageBackground source={images.bgLogin} style={{height:'100%', width:'100%'}} imageStyle={{opacity:0.8}}> */}
            {/* //////////////// Login form //////////////////// */}
            <View style={styles.container}>
                <Text style={styles.title}>Change Password</Text>
                <View style={styles.inputView}>
                    <Text style={{color:'#666666', marginTop:10}}>Old Password</Text>
                    <View style={styles.loginInput}>
                        <FontAwesome 
                            name='lock'
                            size={24} 
                            color="#103a7c"
                            style={styles.icon} 
                        />
                        <TextInput
                        style={styles.inputBox} 
                        placeholder='Enter Old Password'
                        onChange={e=>setOldPassword(e.nativeEvent.text)}
                        placeholderTextColor={'#666666'}
                        />
                    </View>
                    {
                        oldPasswordError &&
                        <Text style={{color:'red', fontSize:12}}>Old Password is not correct *</Text>
                    }
                    <Text style={{color:'#666666', marginTop:10}}>New Password</Text>
                    <View style={styles.loginInput}>
                        <FontAwesome 
                            name={'lock'} 
                            size={24} 
                            color="#103a7c"
                            style={styles.icon} 
                        />
                        <TextInput
                        style={styles.inputBox} 
                        placeholder='Enter New Password'
                        onChange={e=>setNewPassword(e.nativeEvent.text)}
                        placeholderTextColor={'#666666'}
                        />
                    </View>
                    <Text style={{color:'#666666', marginTop:10}}>Confirm Password</Text>
                    <View style={styles.loginInput}>
                        <FontAwesome 
                            name={'lock'} 
                            size={24} 
                            color="#103a7c"
                            style={styles.icon} 
                        />
                        <TextInput 
                            style={styles.inputBox} 
                            placeholder='Confirm New Password'
                            secureTextEntry={!showConfirmPassword}
                            onChange={e=>setConfirmPassword(e.nativeEvent.text)}
                            placeholderTextColor={'#666666'}
                        />
                        <MaterialCommunityIcons 
                            name={showConfirmPassword ? 'eye-off' : 'eye'} 
                            size={24} 
                            color="#103a7c"
                            style={styles.icon} 
                            onPress={toggleShowConfirmPassword}
                        /> 
                    </View>
                    {
                        matchError &&
                        <Text style={{color:'red', fontSize:12}}>New password and Confirm Password are not matching*</Text>
                    }
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => submitNewPassword()}>
                        <Text style={styles.btnText}>Change Password</Text>
                    </TouchableOpacity>
                </View>
                {/* <Text onPress={()=>removeSession()}>logout</Text> */}
            </View>
        </ScrollView>
    </View>
    </AlertNotificationRoot>
  )
}

export default ChangePassword

const styles = StyleSheet.create({
    container: {
        alignItems : "center",
        paddingTop: 70,
        backgroundColor:'white'
    },
    logoTop:{
        width:screenWidth, 
        height:screenHeight/25,
        resizeMode:'contain', 
    },
    logoImage:{
    //   opacity:0.8,
    height : 160,
    width : 170,
    },
    title : {
        fontSize : 30,
        fontWeight : "bold",
        textAlign: "center",
        paddingVertical : 20,
        color : "#223260"
      },
      inputView : {
        gap : 15,
        width : "100%",
        paddingHorizontal : 40,
        marginBottom:10
      },
    inputBox:{
        height : 50,
        paddingHorizontal : 20,
        width:'90%',
        color:'black'
    },
    loginInput:{
        flex:1,
        flexDirection:'row',
        paddingHorizontal:16,
        // justifyContent:'space-between',
        alignItems: 'center',
        borderColor : "#223560",
        borderWidth : 1,
        borderRadius: 7
    //   paddingBottom:0

    },
    button : {
        backgroundColor : "#223260",
        height : 55,
        borderColor : "gray",
        borderWidth  : 1,
        borderRadius : 15,
        alignItems : "center",
        justifyContent : "center",
        marginBottom:10,
        marginTop:16
      },
    btnText:{
        color : "white"  ,
        fontSize: 18,
        fontWeight : "bold"
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
      },
      textSmall:{
        color:'gray',
        fontSize:16
      },
      smallText: {
        color: '#4C4E52',
        fontSize: 12,
      },
  });