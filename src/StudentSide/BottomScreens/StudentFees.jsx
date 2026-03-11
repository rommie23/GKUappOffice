import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Pressable, Linking } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcons from 'react-native-vector-icons/Ionicons'
import colors from '../../colors'
import { useNavigation } from '@react-navigation/native'
// import notifee from '@notifee/react-native';
import MaskedView from '@react-native-masked-view/masked-view'
import { StudentContext } from '../../context/StudentContext'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env';

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width



const StudentFees = () => {
  const { closeMenu } = useContext(StudentContext);
  const [loading, setLoading] = useState(false)
  const [tabsData, setTabsData] = useState([])
  const navigation = useNavigation()

  // const onDisplayNotification = async () => {
  //   await notifee.requestPermission()
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //   });
  //   await notifee.displayNotification({
  //     title: 'Notification From GKU',
  //     body: 'This notification is regarding how...',
  //     android: {
  //       channelId,
  //       // smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  // }
  // const sendNotif = () => {
  //   setTimeout(() => {
  //     onDisplayNotification()
  //   }, 5000)
  // }

  const checkTabs = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const tabsData = await fetch(`${BASE_URL}/student/tabsToShowStudent`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pageName: 'Fees_st'
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
  useEffect(() => {
    checkTabs();
  }, [])

  return (
      <ScrollView style={styles.scrollCont}>
        <View style={styles.outerContainer}>
          <View style={styles.container}>
            {/* ///////////////////// cards list ////////////////////// */}
            <View style={styles.containerLeft}>

              {
                tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'PayNow' &&
                <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('FeePayment') }}>
                  {/* <TouchableOpacity style={styles.cards}onPress={()=>{Linking.openURL(IMAGE_URL)}}> */}
                  <View style={[styles.cardCont]}>
                    <Text style={styles.cardText}>Pay Now</Text>
                    <MaskedView
                      style={{ flexDirection: 'row', height: 36, width: 36 }}
                      maskElement={
                        <View
                          style={{
                            backgroundColor: 'transparent',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <IonIcons name='cash-outline' size={36} color={colors.uniBlue} />
                        </View>
                      }
                    >
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={{ flex: 1 }}
                      />
                    </MaskedView>
                  </View>
                </TouchableOpacity>
              }

              {
                tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'Receipts' &&
                <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('Receipts') }}>
                  <View style={[styles.cardCont]}>
                    <Text style={styles.cardText}>Receipts</Text>
                    <MaskedView
                      style={{ flexDirection: 'row', height: 36, width: 36 }}
                      maskElement={
                        <View
                          style={{
                            backgroundColor: 'transparent',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <IonIcons name='receipt-outline' size={36} color={colors.uniBlue} />
                        </View>
                      }
                    >
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={{ flex: 1 }}
                      />
                    </MaskedView>

                  </View>
                </TouchableOpacity>
              }

              {
                tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'RecentTransactions' &&
                <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('RecentTransactions') }} >
                  <View style={styles.cardCont}>
                    <Text style={styles.cardText}>Recent Transactions</Text>
                    <MaskedView
                      style={{ flexDirection: 'row', height: 36, width: 36 }}
                      maskElement={
                        <View
                          style={{
                            backgroundColor: 'transparent',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <MaterialCommunityIcons name='page-previous-outline' size={36} color={colors.uniBlue} />
                        </View>
                      }
                    >
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={{ flex: 1 }}
                      />
                    </MaskedView>

                  </View>

                </TouchableOpacity>
              }

              {/* <TouchableOpacity style={styles.cards} onPress={()=> sendNotif()} >
                <View style={styles.cardCont}>
                    <Text style={styles.cardText}>onclick notification</Text>
                      <MaterialCommunityIcons name='bell' size={36} color={colors.uniBlue} />
                </View>
            </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollCont: {
    backgroundColor: '#f1f1f1',
  },
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth,
    //   backgroundColor:'green',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  containerLeft: {
    width: '100%',
    gap: 20,
    height: 'contain',
    // backgroundColor:'red',
    paddingVertical: 16
  },
  cards: {
    width: '100%',
    height: screenHeight / 12,
    backgroundColor: 'white',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },
  cardText: {
    color: '#3b5998',
    fontSize: 20,
    fontWeight: '600'
  },
  cardCont: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24
  },
  iconOuter: {
    borderColor: '#3b5998',
    borderWidth: 1,
    borderRadius: 32,
    padding: 12,
  },
})

const darkStyle = StyleSheet.create({
  scrollCont: {
    backgroundColor: '#1b1b1b',
  },
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1b1b',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth,
    //   backgroundColor:'green',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 32,
    backgroundColor: '#1b1b1b',
  },
  containerLeft: {
    width: '100%',
    gap: 20,
    height: 'contain',
    // backgroundColor:'red',
    paddingVertical: 8,
    backgroundColor: '#1b1b1b',
  },
  cards: {
    width: '100%',
    height: screenHeight / 12,
    backgroundColor: '#1b1b1b',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#f1f1f1',
  },
  cardText: {
    color: '#f1f1f1',
    fontSize: 20,
    fontWeight: '600'
  },
  cardCont: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    backgroundColor: '#1b1b1b',
  },
  iconOuter: {
    borderColor: '#f1f1f1',
    borderWidth: 1,
    borderRadius: 32,
    padding: 12,
  },
})
export default StudentFees