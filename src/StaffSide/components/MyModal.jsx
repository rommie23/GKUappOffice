import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../colors';

const MyModal = ({visibility, content, yesHandle, noHandle, cardId}) => {
  return (
    <Modal
      transparent={true}
      visible={visibility}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <FontAwesome name='exclamation' size={64} color={colors.uniRed} style={{position:'absolute', top:-48, backgroundColor:'white', paddingVertical:16, borderRadius:100, paddingHorizontal:32}} />
            <Text style={styles.textSmall}>{content}</Text>
            <View style={{flexDirection:"row", justifyContent:'space-evenly', columnGap:16}}>
                <TouchableOpacity style={styles.modalBtn} onPress={()=> yesHandle(cardId)}>
                <Text style={{color:'white', fontSize:16}}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, {backgroundColor:colors.uniRed}]} onPress={()=> noHandle()}>
                <Text style={{color:'white', fontSize:16}}>No</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  )
}

export default MyModal

const styles = StyleSheet.create({
    // /////////////// modal css //////////////////
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
    textSmall:{
        color:'black', 
        fontSize:14
    }
})