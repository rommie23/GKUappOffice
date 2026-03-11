import { View, Text, StyleSheet, Dimensions, TouchableHighlight,ScrollView, Button, PermissionsAndroid, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Pdf from 'react-native-pdf'
import { useRoute } from '@react-navigation/native';
import { IMAGE_URL } from '@env';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const GrievanceAttachmentView = () => {
    const route = useRoute();
    const FileId = route.params.fileName;    
    console.log("pdf correction path",FileId);
    console.log(`${IMAGE_URL}Images/Grievance/${FileId}`);
    
    const isPdf = FileId.endsWith('.pdf');

  return (
    <ScrollView>
    <View style={styles.container}>
      {
        isPdf ? 
        <Pdf
          trustAllCerts={false}
          source={{uri : `${IMAGE_URL}Images/Grievance/${FileId}`, cache:true}}
          onLoadComplete={(numberOfPages,filePath) => {
            // console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page,numberOfPages) => {
            // console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            // console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}/>
        :
        <Image
          source={{ uri: `${IMAGE_URL}Images/Grievance/${FileId}` }}
          style={styles.image}
          resizeMode="contain"
        />

      }
      </View>
  </ScrollView>
  )
}

const styles= StyleSheet.create({
    examsView:{
        borderBottomWidth:1,
        paddingVertical:16,
        width:screenWidth-32,
        paddingHorizontal:16,
    },
    ExamTxt:{
        fontSize:20,
        color:'#000'
    },
    smallText:{
        fontSize:12,
        color:'green'
    },
    subjectDetails:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    examTabs:{
        backgroundColor:'#FFF7D4',
        padding:10,
        marginTop:16,
        borderRadius:16,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 25,
    },
    pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height-300,
    },
    image: {
      width: screenWidth,
      height: .8*screenHeight,
  },
  
  })
  

export default GrievanceAttachmentView