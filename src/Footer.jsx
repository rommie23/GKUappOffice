import { View, Text, StyleSheet, TouchableHighlight, Alert, Dimensions, Linking } from 'react-native'
import React from 'react'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import colors from './colors';
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const Footer = () => {
  return (
    <View>
       <Text style={{color:colors.uniBlue,fontWeight:'800',fontSize:15,alignSelf:'center', marginBottom:36}}>
                {/* <MaterialCommunityIcons name="phone" color={colors.uniBlue} size={18} /> 99142-83400, <MaterialCommunityIcons name="email" color={colors.uniBlue} size={18} /> info@gku.ac.in */}
        </Text>
       <Text style={{color:colors.uniBlue,fontWeight:'800',fontSize:15,marginBottom:6,marginTop:10,alignSelf:'center'}}>
             Designed By
        </Text>
       <Text style={{color:colors.uniBlue,fontWeight:'800',fontSize:15,marginBottom:10,alignSelf:'center'}}>
             Department of Information Technology
        </Text>
        <Text style={{color:colors.uniBlue,fontWeight:'800',fontSize:15,marginBottom:6,alignSelf:'center'}}>
            Technical Helpline
        </Text>
        <Text style={{color:colors.uniBlue,fontWeight:'800',fontSize:15,marginBottom:10,alignSelf:'center'}}>
                <MaterialCommunityIcons name="phone" color={colors.uniBlue} size={18} /> 78146-79220, <MaterialCommunityIcons name="email" color={colors.uniBlue} size={18} /> online@gku.ac.in
        </Text>
        <View style={styles.socialMediaIcons}>
                <TouchableHighlight
                    onPress={() => Linking.openURL("https://www.facebook.com/gurukashiuniversity/")}>
                    <MaterialCommunityIcons 
                        name={'facebook'} 
                        size={24} 
                        color="#103a7c"
                        style={styles.icon} 
                    />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => Linking.openURL('https://www.instagram.com/gurukashiuniversity_/')}>
                    <MaterialCommunityIcons 
                        name={'instagram'} 
                        size={24} 
                        color="#103a7c"
                        style={styles.icon} 
                    />
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => Linking.openURL('https://x.com/gurukashiuniv')}>
                    <FontAwesome6 
                        name={'x-twitter'} 
                        size={22} 
                        color="#103a7c"
                        style={styles.icon} 
                    />
                </TouchableHighlight>
            </View>
        {/* <View style={styles.footer} >
                <Text style={styles.footerTxt}></Text>
            </View>
            */}
    </View>
  )
}

export default Footer


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
      socialMediaIcons:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        gap:25,
        width:200,
        alignSelf:'center',
        borderTopWidth:1,
        paddingTop:6
      },
      // footer:{
      //   backgroundColor:'transparent',
      //   height:5,
      //   marginTop:50,
      //   width:screenWidth,
        
      // },
      // footerTxt:{
      //   color:'white',
      //   alignSelf:'center',
      //   verticalAlign:'top'
      // }
}
)