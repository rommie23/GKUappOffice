import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {IMAGE_URL} from '@env'

const {height, width} = Dimensions.get('window')

const OpenImage = ({route}) => {

    const {imageURI} = route.params;
    
    const baseUri = IMAGE_URL
    console.log(baseUri+imageURI);
    
    return (
        <View style={styles.container}>
            <Image
                source={{
                    uri: baseUri+imageURI
                }}
                style={styles.image}
                resizeMode="contain"
                />
        </View>
    )
}

export default OpenImage

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "black", // so empty space looks clean
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: height,
  }
})