import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const SideBar = () => {
  return (
    <View>
      <Text style={styles.norecordText}>Under Progress......</Text>
    </View>
  )
}

export default SideBar


const styles = StyleSheet.create({
  norecordText: {
    color: 'black',
    alignSelf: 'center',
    marginTop: 20
  }
});