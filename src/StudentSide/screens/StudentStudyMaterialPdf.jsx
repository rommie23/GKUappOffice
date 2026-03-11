import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Pdf from 'react-native-pdf'
import { IMAGE_URL} from '@env';


const StudentStudyMaterialPdf = ({route}) => {
    const {courseFile} = route.params
    console.log(courseFile);
    
  return (
    <ScrollView>
        <View style={styles.container}>
            <Pdf
            trustAllCerts={false}
            source={{uri : `${IMAGE_URL}StudyMaterial/${courseFile}`, cache:true}}
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
        </View>
    </ScrollView>
  )
}

export default StudentStudyMaterialPdf

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
      },
      pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height-150,
      }
})