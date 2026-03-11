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

const FeePayment = () => {
    const navigation = useNavigation()
    const[typesOfFees, setTypesOfFees] = useState([])
    const[amount, setAmount] = useState('')
    const[remarks, setRemarks] = useState('')
    const[selectedFeeType, setSelectedFeeType] = useState('');
    const[selectedSemester, setSelectedSemester] = useState(0);
    const[isloading, setIsLoading] = useState(false)

    const options = [
        { key: '1', value: '1' },
        { key: '2', value: '2' },
        { key: '3', value: '3' },
        { key: '4', value: '4' },
        { key: '5', value: '5' },
        { key: '6', value: '6' },
        { key: '7', value: '7' },
        { key: '8', value: '8' },
        { key: '9', value: '9' },
        { key: '10', value: '10' },
        { key: '11', value: '11' },
        { key: '12', value: '12' },
        { key: '13', value: '13' },
        { key: '14', value: '14' },
        { key: '15', value: '15' },
        { key: '16', value: '16' },
        { key: '17', value: '17' },
        { key: '18', value: '18' },
        { key: '19', value: '19' },
        { key: '20', value: '20' },
      ]
      
      const feeTypeData = async () => {
        setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
          try {
            const feeTypeDetails = await fetch(BASE_URL + `/student/feetype`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${session}`
              }
            })
            const feeTypeDetailsData = await feeTypeDetails.json();
            console.log(feeTypeDetailsData);
            
            let feeTypeArray = feeTypeDetailsData['data'].map((item) => {
                return { key: item['Head'], value: item['Head'] }
            })
            setTypesOfFees(feeTypeArray);
            // console.log('from api feetype :: ', feeTypeDetailsData["data"]);
            setIsLoading(false);
          } catch (error) {
            console.log('Error fetching feetype Api ::', error);
            setIsLoading(false)
            errorModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
          }
        }
      }

      useEffect(()=>{
        feeTypeData()
      },[])

  return (
    <AlertNotificationRoot>
    <View>
        {isloading && 
        <Spinner
        visible={isloading}
        size={'large'}
        />
        }
        <ScrollView keyboardShouldPersistTaps={'handled'}>
            {/* <ImageBackground source={images.bgLogin} style={{height:'100%', width:'100%'}} imageStyle={{opacity:0.8}}> */}
            {/* //////////////// Login form //////////////////// */}
            <View style={styles.container}>
                <View style={styles.inputView}>
                    
                    <Text style={{color:'#666666', marginTop:10}}>Fee Type<Text style={{color:'red'}}>*</Text></Text>
                    <SelectList boxStyles={{ padding: 10, width: "100%" }}
                        setSelected={(val) => setSelectedFeeType(val)}
                        fontFamily='time'
                        data={typesOfFees}
                        arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                        search={false}
                        defaultOption={{ key: '0', value: 'Select Type' }}
                        inputStyles={{ color: 'black' }}
                        dropdownTextStyles={{ color: 'black' }}
                    />

                    <Text style={{color:'#666666', marginTop:10}}>Semester<Text style={{color:'red'}}>*</Text></Text>
                    <SelectList boxStyles={{ padding: 10, width: "100%" }}
                        setSelected={(val) => setSelectedSemester(val)}
                        fontFamily='time'
                        data={options}
                        arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                        search={false}
                        defaultOption={{ key: '0', value: 'Select Semesters' }}
                        inputStyles={{ color: 'black' }}
                        dropdownTextStyles={{ color: 'black' }}
                    />
                    <Text style={{color:'#666666', marginTop:10}}>Amount (INR)<Text style={{color:'red'}}>*</Text></Text>
                    <View style={styles.loginInput}>
                        <TextInput
                        style={styles.inputBox} 
                        placeholder='Enter Amount'
                        onChange={e=>setAmount(e.nativeEvent.text)}
                        placeholderTextColor={'#666666'}
                        />
                    </View>
                    <Text style={{color:'#666666', marginTop:10}}>Remarks<Text style={{color:'red'}}>*</Text></Text>
                    <View style={styles.loginInput}>
                        <TextInput
                        style={styles.inputBox} 
                        placeholder='Enter Remarks'
                        onChange={e=>setRemarks(e.nativeEvent.text)}
                        placeholderTextColor={'#666666'}
                        />
                    </View>
                    <Text style={{color:'red'}}>All the above fields are Mandatory*</Text>
                    <TouchableOpacity
                        style={selectedFeeType != '' && selectedSemester != 0 && amount != '' && remarks != "" ? styles.button : [styles.button,{opacity:0.4}]}
                        onPress={()=>navigation.navigate('paymentConfirmation', {sem:selectedSemester, fees:amount, feetype:selectedFeeType, remarks:remarks})}
                        disabled={
                            selectedFeeType != '' && selectedSemester != 0 && amount != '' && remarks != "" ? false : true
                        }
                        >
                        <Text style={styles.btnText}>Pay Now</Text>
                    </TouchableOpacity>
                </View>
                {/* <Text onPress={()=>removeSession()}>logout</Text> */}
            </View>
        </ScrollView>
    </View>
    </AlertNotificationRoot>
  )
}

export default FeePayment

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