/////////////// we aren't really using it //////////////////////

import { View, Text, Image, StyleSheet, Dimensions, Alert, ScrollView, TextInput, SafeAreaView, TouchableOpacity, Modal, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';

import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../../colors'
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'


const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const ConfirmPayment = () => {
    const navigation = useNavigation()
    const[amount, setAmount] = useState('')
    const[remarks, setRemarks] = useState('')
    const[feeType, setFeeType] = useState(0);
    const[semester, setSemester] = useState(0);
    const[loading, setLoading] = useState(false)

    const confirmPayment = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
          try {
            const movementDetails = await fetch(BASE_URL + `/staff/mymovement`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${session}`
              }
            })
            const movementDetailsData = await movementDetails.json();
            setMovements(movementDetailsData);
            console.log('from api movement pending', movementDetailsData);
            setLoading(false);
          } catch (error) {
            console.log('Error fetching movementPending Api ::', error);
            setLoading(false)
            errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
          }
        }
      }
      
  return (
    <AlertNotificationRoot>
    <View>
        {loading && 
        <Spinner
        visible={loading}
        size={'large'}
        />
        }

        <ScrollView keyboardShouldPersistTaps={'handled'}>
            {/* //////////////// form //////////////////// */}
            <View style={styles.container}>
                <View style={styles.inputView}>
                    
                    <Text style={{color:'#666666', marginTop:10}}>Ref No.</Text>
                    <View style={styles.loginInput}>
                        <TextInput
                        style={styles.inputBox} 
                        placeholder='Ref No.'
                        onChange={e=>setFeeType(e.nativeEvent.text)}
                        placeholderTextColor={'#666666'}
                        editable={false}
                        />
                    </View>
                    <Text style={{color:'#666666', marginTop:10}}>Fee Type</Text>
                    <View style={styles.loginInput}>
                        <TextInput
                        style={styles.inputBox} 
                        placeholder='Fee Type'
                        onChange={e=>setFeeType(e.nativeEvent.text)}
                        placeholderTextColor={'#666666'}
                        editable={false}
                        />
                    </View>
                    <Text style={{color:'#666666', marginTop:10}}>Semester</Text>
                    <View style={styles.loginInput}>
                        <TextInput
                        style={styles.inputBox} 
                        placeholder='Semester'
                        onChange={e=>setSemester(e.nativeEvent.text)}
                        placeholderTextColor={'#666666'}
                        editable={false}
                        />
                    </View>
                    <Text style={{color:'#666666', marginTop:10}}>Amount</Text>
                    <View style={styles.loginInput}>
                        <TextInput
                        style={styles.inputBox} 
                        placeholder='Amount'
                        onChange={e=>setAmount(e.nativeEvent.text)}
                        placeholderTextColor={'#666666'}
                        editable={false}
                        />
                    </View>
                    <Text style={{color:'#666666', marginTop:10}}>Remarks</Text>
                    <View style={styles.loginInput}>
                        <TextInput
                        style={styles.inputBox} 
                        placeholder='Remarks'
                        onChange={e=>setRemarks(e.nativeEvent.text)}
                        placeholderTextColor={'#666666'}
                        editable={false}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => submitNewPassword()}>
                        <Text style={styles.btnText}>Confirm Payment</Text>
                    </TouchableOpacity>
                </View>
                {/* <Text onPress={()=>removeSession()}>logout</Text> */}
            </View>
        </ScrollView>
    </View>
    </AlertNotificationRoot>
  )
}

export default ConfirmPayment

const styles = StyleSheet.create({
    container: {
        alignItems : "center",
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
        gap : 10,
        width : "100%",
        paddingHorizontal : 40,
        marginBottom:10
      },
    inputBox:{
        height : 44,
        paddingHorizontal : 20,
        width:'90%',
        color:'black'
    },
    loginInput:{
        flex:1,
        flexDirection:'row',
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
      textSmall:{
        color:'gray',
        fontSize:16
      },
      smallText: {
        color: '#4C4E52',
        fontSize: 12,
      },
  });