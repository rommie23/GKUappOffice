import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'

const TrackMovement = () => {

  const navigation = useNavigation()
  const [remarks, setRemarks] = useState('')

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container]}>
        <View style={[styles.innerContainer]}>
          <View style={styles.eachInput}>
            <Text style={styles.txtStyle}>Enter Employee Id</Text>
            <TextInput
              value={remarks}
              style={[styles.inputBox, { color: 'black' }]}
              onChangeText={setRemarks}
            />
          </View>
          <View style={styles.eachInput}>
            <Pressable style={styles.btn} onPress={()=> {
              navigation.pop();
              navigation.navigate('MovementPending');
            }
              }>
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Track</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TrackMovement

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f1f1f1',

  },
  innerContainer: {
    backgroundColor: 'white',
    marginTop: 24,
    elevation: 2,
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 16
  },
  eachInput: {
    marginTop: 16,
    rowGap: 4
  },
  inputBox: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    color: 'black',
    backgroundColor: '#fffafa'
  },

  btn: {
    marginVertical: 4,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.uniBlue,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  txtStyle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600'
  },
})