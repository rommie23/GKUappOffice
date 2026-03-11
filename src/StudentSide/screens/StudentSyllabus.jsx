import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwsome6 from 'react-native-vector-icons/FontAwesome6';
import Foundation from 'react-native-vector-icons/Foundation';
import colors from '../../colors';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const StudentSyllabus = () => {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <View style={[styles.iconOuter]}>
          <MaskedView
              style={{ flexDirection: 'row', height: 72, width: 72 }}
              maskElement={
                  <View
                      style={{
                          backgroundColor: 'transparent',
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                      }}
                  >
                      <FontAwsome6 name='clipboard-list' color={colors.uniBlue} size={72} />
                  </View>
              }
          >
              <LinearGradient
                  colors={[colors.uniRed, colors.uniBlue]}
                  style={{ flex: 1 }}
              />
          </MaskedView>

      </View>
      <Text style={{color:'black'}}>Syllabus Coming soon.......</Text>
    </View>
  )
}

export default StudentSyllabus

const styles = StyleSheet.create({
  iconOuter: {
    borderColor: colors.uniBlue,
    borderWidth: 1,
    borderRadius: 72,
    padding: 30,
    marginBottom:24
}
})