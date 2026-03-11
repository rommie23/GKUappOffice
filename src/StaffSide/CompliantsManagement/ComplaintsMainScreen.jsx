import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../colors';
import { useNavigation } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

import MaskedView from '@react-native-masked-view/masked-view';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { StudentContext } from '../../context/StudentContext';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { BASE_URL, LIMS_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';


const ComplaintsMainScreen = () => {
  const { closeMenu, StaffIDNo } = useContext(StudentContext);


  const [flag, setFlag] = useState('') // for spervisor tabs
  const [flag2, setFlag2] = useState('') // for complete task tab
  const [loading, setLoading] = useState()
  const [authMessage, setAuthMessage] = useState('')
  const [tabsData, setTabsData] = useState([])

  // it is for button to show to authorized poeple only

  const tabPermission = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session");

    try {
      if (session != null) {
        const res = await fetch(BASE_URL + '/staff/taskTabs', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            Accept: "application/json",
            'Content-Type': "application/json"
          }
        })
        const response = await res.json()
        const authTabs = response;

        // console.log("Underlings List::", authTabs);
        setFlag(authTabs['flag'])
        setLoading(false)
      }
    } catch (error) {
      console.log("error in Notification::", error);
      setLoading(false)
    }
  }


  const completeTaskPermission = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session");

    try {
      if (session != null) {
        const res = await fetch(BASE_URL + '/staff/completeTaskTab', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            Accept: "application/json",
            'Content-Type': "application/json"
          }
        })
        const response = await res.json()
        const authTabs = response;

        console.log("Underlings List::", authTabs);
        setFlag2(authTabs['flag'])
        setLoading(false)
      }
    } catch (error) {
      console.log("error in Notification::", error);
      setLoading(false)
    }
  }

  useEffect(() => {
    tabPermission();
    completeTaskPermission()
    checkTabs();
  }, [])

  const checkTabs = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const tabsData = await fetch(`${BASE_URL}/Staff/tabsToShow`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pageName: 'LaunchComplaint_fc'
          })
        })
        const pageTabsData = await tabsData.json()
        setTabsData(pageTabsData)
        console.log(pageTabsData);

        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
  }

  const profileAlert = async () => {
    console.log("kjhdh");

    errorModel(ALERT_TYPE.WARNING, "Profile Image Error", `Kindly update your profile Image to Apply Leave`)
  }

  const errorModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: () => navigation.goBack()
    })
  }

  const navigation = useNavigation()
  return (
    <AlertNotificationRoot>
      <Pressable onPress={closeMenu}>
        <View>
          <ScrollView>
            {
              loading ? <ActivityIndicator /> :
                <View style={{ minHeight: screenHeight / 1.2 }}>
                  <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, columnGap: screenWidth / 30, paddingHorizontal: 24, justifyContent: 'flex-start', rowGap: 16, paddingBottom: 4 }}>

                    {
                      tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'MyComplaints' &&
                      <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('AllComplaints') }}>
                        <View style={styles.cardCont}>
                          <View style={styles.iconOuter}>
                            <MaskedView
                              style={{ flexDirection: 'row', height: 27, width: 27 }}
                              maskElement={
                                <View
                                  style={{
                                    backgroundColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <FontAwesome5Icon name='tasks' size={20} color={colors.uniBlue} />
                                </View>
                              }
                            >
                              <LinearGradient
                                colors={[colors.uniRed, colors.uniBlue]}
                                style={{ flex: 1 }}
                              />
                            </MaskedView>

                          </View>
                          <Text style={styles.cardText}>My Complaints</Text>
                        </View>
                      </TouchableOpacity>
                    }

                    {
                      tabsData?.[1]?.['IsVisible'] == 0 && tabsData?.[1]?.ElementName === 'LaunchComplaint' &&
                      <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('LaunchCompaint') }}>
                        <View style={styles.cardCont}>
                          <View style={styles.iconOuter}>
                            <MaskedView
                              style={{ flexDirection: 'row', height: 24, width: 24 }}
                              maskElement={
                                <View
                                  style={{
                                    backgroundColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <FontAwesome6 name='user-plus' color={colors.uniBlue} size={18} />
                                </View>
                              }
                            >
                              <LinearGradient
                                colors={[colors.uniRed, colors.uniBlue]}
                                style={{ flex: 1 }}
                              />
                            </MaskedView>

                          </View>
                          <Text style={styles.cardText} >Launch a Complaint</Text>
                        </View>
                      </TouchableOpacity>
                    }

                    {
                      tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'SupervisorTasks' && flag == 1 &&
                      <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('SupervisorTasks') }}>
                        <View style={styles.cardCont}>
                          <View style={styles.iconOuter}>
                            <MaskedView
                              style={{ flexDirection: 'row', height: 24, width: 24 }}
                              maskElement={
                                <View
                                  style={{
                                    backgroundColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <MaterialIcons name='assignment-add' color={colors.uniBlue} size={24} />
                                </View>
                              }
                            >
                              <LinearGradient
                                colors={[colors.uniRed, colors.uniBlue]}
                                style={{ flex: 1 }}
                              />
                            </MaskedView>

                          </View>
                          <Text style={styles.cardText} >Supervisor Tasks</Text>
                        </View>
                      </TouchableOpacity>
                    }

                    {
                      tabsData?.[4]?.['IsVisible'] == 1 && tabsData?.[4]?.ElementName === 'AcceptOrCompleteTask' && flag2 == 1 &&
                      <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('AcceptAndCompleteComplaint') }}>
                        <View style={styles.cardCont}>
                          <View style={styles.iconOuter}>
                            <MaskedView
                              style={{ flexDirection: 'row', height: 24, width: 24 }}
                              maskElement={
                                <View
                                  style={{
                                    backgroundColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <MaterialIcons name='add-task' color={colors.uniBlue} size={24} />
                                </View>
                              }
                            >
                              <LinearGradient
                                colors={[colors.uniRed, colors.uniBlue]}
                                style={{ flex: 1 }}
                              />
                            </MaskedView>

                          </View>
                          <Text style={styles.cardText} >Accept/Complete Task</Text>
                        </View>
                      </TouchableOpacity>
                    }

                    {
                      tabsData?.[3]?.['IsVisible'] == 1 && tabsData?.[3]?.ElementName === 'RefferedTasks' && flag == 1 &&
                      <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('SupervisorRejectedTasks') }}>
                        <View style={styles.cardCont}>
                          <View style={styles.iconOuter}>
                            <MaskedView
                              style={{ flexDirection: 'row', height: 24, width: 24 }}
                              maskElement={
                                <View
                                  style={{
                                    backgroundColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <FontAwesome5Icon name='people-arrows' color={colors.uniBlue} size={20} />
                                </View>
                              }
                            >
                              <LinearGradient
                                colors={[colors.uniRed, colors.uniBlue]}
                                style={{ flex: 1 }}
                              />
                            </MaskedView>

                          </View>
                          <Text style={styles.cardText} >Referred Tasks</Text>
                        </View>
                      </TouchableOpacity>
                    }

                  </View>
                </View>
            }
          </ScrollView>
        </View>
      </Pressable>
    </AlertNotificationRoot>
  )
}

export default ComplaintsMainScreen

const styles = StyleSheet.create({

  // Common CSS of all the cards
  cards: {
    width: screenWidth / 2.4,
    paddingBottom: 28,
    // backgroundColor:'green',
    alignSelf: 'center',
    elevation: 2,
    backgroundColor: 'white',
    // opacity: disabled? 0.5 :1
    borderRadius: 8
  },
  cardText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    color: '#1b1b1b'
  },

  // Card outer container CSS
  cardCont: {
    alignItems: 'center',
    height: screenHeight / 11,
    padding: 8,
    alignSelf: 'center',
  },
  iconOuter: {
    borderColor: colors.uniBlue,
    borderWidth: 1,
    borderRadius: 32,
    padding: 10,
  }

})