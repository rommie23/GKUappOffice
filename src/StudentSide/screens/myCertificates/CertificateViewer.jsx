import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';

const CertificateViewer = () => {
    const route = useRoute();
    const {filePath} = route.params;

    console.log("filePath",filePath);
    const fileExtension = filePath.split('.').pop().toLowerCase();
    
  return (
    <ScrollView>
        <View style={styles.container}>
            {
                fileExtension == 'pdf' ? (
                    <Pdf
                    trustAllCerts={false}
                    source={{uri : filePath, cache:true}}
            
                    onError={(error) => {
                      console.log(error);
                    }}
            
                  style={styles.pdf}/>
                ) :
                (
                    <Image
                    source={{ uri: filePath }}
                    style={styles.image}
                    resizeMode="contain" // Ensures the image fits the view without distortion
                    />
                )
            }
        </View>
    </ScrollView>
  )
}

export default CertificateViewer

const styles = StyleSheet.create({
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height-300,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
      },
      image: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
})