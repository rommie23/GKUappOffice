import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, ScrollView, ActivityIndicator, Image, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FeatherIcon from 'react-native-vector-icons/Feather';
import colors from '../../colors';
import { useNavigation } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

import MaskedView from '@react-native-masked-view/masked-view';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import PlusIcon from '../components/PlusIcon';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { StudentContext } from '../../context/StudentContext';


const Leaves = () => {
  const { closeMenu, imageStatus } = useContext(StudentContext);


  const [flag, setFlag] = useState([])
  const [loading, setLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [tabsData, setTabsData] = useState([])

  // it is for button to show to authorized poeple only

  const authButtonShow = async () => {

    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const buttonData = await fetch(`${BASE_URL}/staff/authsideleavebutton`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-type": "application/json",
          }
        })
        const buttonDataDetails = await buttonData.json()
        console.log("leave main button ::: ", buttonDataDetails["Message"]);
        setAuthMessage(buttonDataDetails["Message"])
        setLoading(false)
      } catch (error) {
        // setShowModal(true)
        console.log('Error fetching OldBusPass data:apply:', error);
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    authButtonShow()
    checkTabs()
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
            pageName: 'Leave_fc'
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
                <View style={{ minHeight: screenHeight / 1.3 }}>
                  <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, columnGap: screenWidth / 30, paddingHorizontal: 24, justifyContent: 'flex-start', rowGap: 16, paddingBottom: 4 }}>
                    {
                      tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'MyLeaves' &&
                      <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('MyLeaves') }}>
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
                                  <FontAwesome6 name='person-walking-dashed-line-arrow-right' size={20} color={colors.uniBlue} />
                                </View>
                              }
                            >
                              <LinearGradient
                                colors={[colors.uniRed, colors.uniBlue]}
                                style={{ flex: 1 }}
                              />
                            </MaskedView>
                          </View>
                          <Text style={styles.cardText}>My Leaves</Text>
                        </View>
                      </TouchableOpacity>
                    }

                    {/* Supervisor leaves */}
                    {
                      tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'SupervisorLeaves' &&
                          authMessage == "1" ?
                            <TouchableOpacity style={styles.cards} onPress={() => { navigation.navigate('SupervisorLeaves') }}>
                              <View style={styles.cardCont}>
                                <View style={[styles.iconOuter]}>
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
                                        <FontAwesome name='sitemap' size={24} color={colors.uniBlue} />
                                      </View>
                                    }
                                  >
                                    <LinearGradient
                                      colors={[colors.uniRed, colors.uniBlue]}
                                      style={{ flex: 1 }}
                                    />
                                  </MaskedView>
                                </View>
                                <Text style={styles.cardText}>Supervisor Leaves</Text>
                              </View>
                            </TouchableOpacity> : null
                    }


                    {/* Apply leave */}
                    {
                      tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'ApplyLeave' &&
                      <View>
                        {imageStatus == 2 ?
                          <TouchableOpacity style={styles.cards} onPress={() => { profileAlert() }}>
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
                              <Text style={styles.cardText} >Apply Leave</Text>
                            </View>
                          </TouchableOpacity>
                          :
                          <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('ApplyLeaveForm') }}>
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
                              <Text style={styles.cardText} >Apply Leave</Text>
                            </View>
                          </TouchableOpacity>
                        }
                      </View>
                    }

                  </View>
                  {/* <PlusIcon /> */}
                </View>
            }
          </ScrollView>
        </View>
      </Pressable>
    </AlertNotificationRoot>
  )
}

export default Leaves

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