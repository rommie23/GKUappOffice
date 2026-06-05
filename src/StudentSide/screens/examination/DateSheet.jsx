import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, RefreshControl, TouchableOpacity, ActivityIndicator, Modal } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import colors from '../../../colors';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const DateSheet = () => {
  const [myExamForms, setMyExamForm] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  const admitCards = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const AllForms = await fetch(BASE_URL + '/Student/allAdmitCard/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const AllFormsData = await AllForms.json()
        console.log('all exam forms : ', AllFormsData);

        if (AllFormsData.flag == 0) {
          errorModel(ALERT_TYPE.WARNING, "No Admit card", AllFormsData.message)
        }
        else if (AllFormsData.message == 'no data found') {
          errorModel(ALERT_TYPE.WARNING, "No Admit card", 'Check University Roll No or Previous Examform')
        } else {
          setMyExamForm(AllFormsData.data)
        }

        setLoading(false)
      } catch (error) {
        console.log('Error fetching Guri data:Login:', error);
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something Went wrong.`)
        // setShowModal(true)
      }
    }
  }

  useEffect(() => {
    admitCards()
  }, [])
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    admitCards()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const errorModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: () => navigation.goBack()
    })
  }
  return (
    <AlertNotificationRoot>
      <View style={{flex:1}}>

        {/* course, sem/type, examination, status, Action  */}
        <ScrollView
          style={{ backgroundColor: '#f1f1f1' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.cardOuter}>
            {loading ? <ActivityIndicator /> : myExamForms.map((form, index) => (
              <TouchableOpacity key={index} style={styles.card}
                onPress={() => navigation.navigate('EachDateSheet', { examId: form["ID"] })}>
                <View style={{ width: '80%', rowGap: 8 }}>
                  <Text style={styles.cardTxt}>{form['Course']}</Text>
                  <Text style={styles.smallTxt}>Examiantion - {form['Examination']}</Text>
                  <Text style={styles.smallTxt}>{`Sem - ${form['SemesterId']}(${form['Type']})`}</Text>
                </View>
                <View style={{ width: '20%', flex: 1, alignItems: 'center', alignSelf: 'flex-start' }}>
                  <View style={{ flex: 2, justifyContent: 'center' }}>
                    <View style={{ paddingVertical: 8, paddingHorizontal: 8, backgroundColor: '#a62535', borderRadius: 6 }} >
                      <FontAwesome5Icon name="eye" size={18} color={'white'} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      </View>
    </AlertNotificationRoot>
  )
}

const styles = StyleSheet.create({
  cardOuter: {
    width: screenWidth,
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 4
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: "row",
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 8,
    borderRadius: 16,
    elevation: 1
  },
  cardTxt: {
    color: '#1b1b1b',
    fontSize: 16,
    fontWeight: '500'
  },
  smallTxt: {
    color: '#1b1b1b',
    fontSize: 14,
    fontWeight: '500'
  },
  smallerTxt: {
    color: '#1b1b1b',
    fontSize: 12,
    fontWeight: '500'
  },
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
    backgroundColor: colors.uniRed,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 12,
  },
})

export default DateSheet