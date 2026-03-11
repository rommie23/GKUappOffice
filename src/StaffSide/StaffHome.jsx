import { Avatar, Card, IconButton, shadow } from 'react-native-paper';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, RefreshControl, View, Text, TouchableOpacity, PermissionsAndroid, Platform, Linking, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { StudentContext } from '../context/StudentContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import PlusIcon from './components/PlusIcon';
import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import colors from '../colors';
import BirthdaySparkle from './components/BirthdaySparkle'
import BirthdayCard from './components/BirthdayCard'
// import InAppReview from 'react-native-in-app-review';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ANDROID_PACKAGE_NAME = 'com.GKUapp';


const StaffHome = () => {
  const d = new Date();
  const CurrentMonth = d.getMonth() + 1;
  const CurrentYear = d.getFullYear();
  const CurrentDayName = moment(d).format('dddd');
  const CurrentDay = moment(d).format('LLL')

  const { setStaffIDNo, setData, setStaffImage, closeMenu, setImageStatus, imageStatus, setIsLoggedin, setMobileToken, setNotificationCount } = useContext(StudentContext);

  const gettTotalBooksText = "Total: "
  const PaidDaysTextFirst = "Paid Days: "
  const PaidDaysTextecond = " out of "
  const [refreshing, setRefreshing] = useState(false);
  const [inouttime, setinouttime] = useState(false);


  const [staffProfileData, setStaffProfileData] = useState([]);
  const [getTotalDays, setTotalDays] = useState([]);
  const [getPaidDay, setPaidDays] = useState([]);
  const [gettTotalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const [tabsData, setTabsData] = useState([])
  const [deviceToken, setDeviceToken] = useState('')
  const [AccPermission, setAccPermission] = useState(0)
  const [sendNoticePermission, setSendNoticePermission] = useState(0)
  const [noDueTab, setNoDueTab] = useState("")
  const [noDueApproveTab, setNoDueApproveTab] = useState("")
  const [birthdayTab, setBirthdayTab] = useState(false)
  const navigation = useNavigation()

  // const errorHandler= ()=>{
  //   setShowModal(false)
  //   navigation.goBack()
  // }

  const STORAGE_KEY = 'hasPromptedReview';

  // const maybeRequestReview = async () => {
  //   try {
  //     const alreadyPrompted = await EncryptedStorage.getItem(STORAGE_KEY);
  //     if (alreadyPrompted === 'yes') return;

  //     if (Platform.OS === 'android') {
  //       if (InAppReview.isAvailable()) {
  //         try {
  //           await InAppReview.RequestInAppReview();
  //         } catch (_) {
  //           // fallback on failure
  //           Linking.openURL(`https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`);
  //         }
  //       } else {
  //         Linking.openURL(`https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`);
  //       }
  //       await EncryptedStorage.setItem(STORAGE_KEY, 'yes');
  //     }
  //   } catch (error) {
  //     console.warn('Review prompt error', error);
  //   }
  // };

  // useEffect(() => {
  //   maybeRequestReview();
  // }, [])

  const getCurrentDate = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    var date = new Date().getDate();
    var month = monthNames[new Date().getMonth()]
    var year = new Date().getFullYear();
    return month + ' - ' + year;
  }

  // *************************Get Punch *****************************************
  const getPunchInOut = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    try {
      setIsLoading(true)
      const getPunch = await fetch(BASE_URL + '/Staff/inout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`
        }
      })
      const getPunchData = await getPunch.json()
      // console.log('punch time is ::::::', getPunchData);
      setinouttime(getPunchData);
      setIsLoading(false)
    } catch (error) {
      console.log('inout api error ::', error);

    }
  }
  //****************************Get Punch End******************************* */


  //****************************Get Paid Days******************************* */
  const getPaidDays = async () => {

    const session = await EncryptedStorage.getItem("user_session");
    try {
      setIsLoading(true);
      const getTotalPaidDays = await fetch(`${BASE_URL}/staff/paiddays/${CurrentMonth}/${CurrentYear}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Month: CurrentMonth,
          Year: CurrentYear
        }),
      });
      const PaidDays = await getTotalPaidDays.json();
      // console.log(PaidDays);
      setTotalDays(PaidDays.noofdays || ['NA']);
      setPaidDays(PaidDays.paidays || ['NA']);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching data for leave ID', ':', error);
      errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
      // setShowModal(true)
    }
  };

  //**********************check Books issued **************************/
  const checkBooks = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const BooksDetails = await fetch(BASE_URL + '/staff/issuedbooks/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const staffBooksData = await BooksDetails.json()
        setTotalBooks(staffBooksData['books'][0]['books'])
        // console.log(staffBooksData['books'][0]['books'])
        // setTotalBooksAndFine(staffBooksData)
        // setIsLoading(false)
        // console.log(totalBooksAndFine);
      } catch (error) {
        console.log('Error fetching Guri data:library:', error);
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
        // setShowModal(true)
      }
    }
  }
  //**********************************end books************************************** */
  // ************************ check session and send employee to right way ***********//

  const removeSession = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const token = await onAppBootstrap();
        // console.log("onAppBootstrap Token:::", token);
        if (!token) {
          console.warn("Device token not available, skipping token upload.");
          return;
        }
        const offNotification = await fetch(BASE_URL + '/notifiaction/logoutNotification', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({
            deviceToken: token
          })
        })
        const response = await offNotification.json()
        // console.log("response::", response);

        if (response.flag == 1) {
          console.log('logout success');
          await EncryptedStorage.removeItem('user_session')
          setIsLoggedin(false)
        } else {
          console.log("Logout Failed");
          submitModel(ALERT_TYPE.DANGER, "Network Error", `${response['message']}`)
        }
      } catch (error) {
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
        console.log(error);
      }
    }
  }

  async function requestNotificationPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Android Notification permission granted');
        } else {
          console.log('Android Notification permission denied');
        }
      }
      if (Platform.OS === 'ios') {
        const settings = await notifee.requestPermission();
        if (
          settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
          settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
        ) {
          console.log('✅ iOS (Notifee) notification permission granted');
        } else {
          console.log('❌ iOS (Notifee) notification permission denied');
        }
      }
    } catch (err) {
      console.warn('Permission request error:', err);
    }

  }

  // Creating Android notification channel
  async function createNotificationChannel() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Notifications',
      importance: AndroidImportance.HIGH,
    });
  }

  // Display a styled notification using Notifee
  async function displayLocalNotification(title, body) {
    await notifee.displayNotification({
      title,
      body,

      android: {
        channelId: 'default',
        smallIcon: 'ic_notification',
        largeIcon: 'https://www.gku.ac.in/images/appLogo.png',
        color: colors.uniBlue,
        pressAction: { id: 'default' },
      },

      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
          list: true,
        },
      },
    });
  }



  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { data } = remoteMessage;
      if (data) {
        await displayLocalNotification(data.title, data.body)
      }
    });
    return unsubscribe;
  }, []);



  async function onAppBootstrap() {
    await messaging().registerDeviceForRemoteMessages();
    const dToken = await messaging().getToken();
    setDeviceToken(dToken)
    await setMobileToken(dToken)

    // console.log(dToken);
    return dToken;
  }

  // ///////// BIRTHDAY FUNCTION START ///////////////
  const isBirthdayToday = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    return (
      today.getDate() === birthDate.getDate() &&
      today.getMonth() === birthDate.getMonth()
    );
  };

  // ///////// BIRTHDAY FUNCTION END ///////////////

  const checkSession = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session) {
      // navigation.navigate('StaffDashboard')
      try {
        const studentDetails = await fetch(BASE_URL + '/Staff/profile/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const studentDetailsData = await studentDetails.json()
        // console.log(studentDetailsData['data'][0])

        if (studentDetailsData['data'][0]['ProfileLock'] == 1) {
          await removeSession()
        } else {
          setData(studentDetailsData)
          // setIsLoggedin(true)
          setStaffIDNo(studentDetailsData['data'][0]['IDNo']);
          setStaffImage(studentDetailsData['data'][0]['Imagepath'])
          setImageStatus(studentDetailsData['data'][0]['ImageStatus'])
          setStaffProfileData(studentDetailsData['data'][0])
          setBirthdayTab(isBirthdayToday(studentDetailsData['data'][0]['DateOfBirth']))
          // console.log("deviceToken ::: ", deviceToken);
          const token = await onAppBootstrap();
          // console.log("onAppBootstrap Token:::", token);
          if (!token) {
            console.warn("Device token not available, skipping token upload.");
            return;
          }
          const sendDeviceToken = await fetch(`${BASE_URL}/Staff/devicetoken`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              deviceToken: token
            }),
          })
          const response = await sendDeviceToken.json();
          // console.log("Response for token save::::", response);
          setIsLoading(false)
          Orientation.lockToPortrait();
        }

      } catch (error) {
        // console.log('Error fetching Guri data:Login:', error);
        setIsLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong HomePage.`)
        // setShowModal(true)
      }
    }

  }

  useFocusEffect(useCallback(() => {
    acceptNoDuesTab();
  }, []))

  useEffect(() => {
    getPunchInOut();
    checkBooks();

    getPaidDays();
    checkTabs();
    checkSession()
    checkAccAuth();
    checkSendNoticeAuth();
    acceptNoDuesTab();
    noDuesTabPermission();

  }, [])

  useEffect(() => {
    requestNotificationPermission();
    onAppBootstrap();
    createNotificationChannel()
  }, []);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    checkBooks();
    getPaidDays();
    getPunchInOut();
    checkTabs();
    checkAccAuth();
    checkSendNoticeAuth();
    acceptNoDuesTab();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  var inoutText = "In Time: ";
  var outtimeText = "Out Time: ";

  // onPressHandler = () => {
  //   // Your onPress logic goes here
  //   // console.log('Animated.View pressed!');

  // };

  // const uri = 'http://stackoverflow.com/questions/35531679/react-native-open-links-in-browser';
  // OpenWEB = () => {
  //   Linking.openURL("http://gurukashiuniversity.co.in/LMS/attendance-pdf-summary.php?month=5&year=2024&EmployeeId=170976");
  // };

  const profileAlert = async () => {
    errorModel(ALERT_TYPE.WARNING, "Profile Image Error", `Kindly update your profile Image to check Attendance Calendar`)
  }

  const checkTabs = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        console.log(`${BASE_URL}/Staff/tabsToShow`);

        const tabsData = await fetch(`${BASE_URL}/Staff/tabsToShow`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pageName: 'Dashboard_fc'
          })
        })
        const pageTabsData = await tabsData.json()
        setTabsData(pageTabsData)
        setIsLoading(false)
        // console.log("pageTabsData:::", pageTabsData);
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
  }


  const checkAccAuth = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const AccPerm = await fetch(`${BASE_URL}/accounts/checkAccPermission`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          }
        })
        const pageAccPerm = await AccPerm.json()
        setAccPermission(pageAccPerm['flag'])
        // console.log("pageAccPerm:::", pageAccPerm);
        setIsLoading(false)
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
  }

  const checkSendNoticeAuth = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const NoticePerm = await fetch(`${BASE_URL}/notifiaction/checkNotificationPermission`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          }
        })
        const pageNoticePerm = await NoticePerm.json()
        setSendNoticePermission(pageNoticePerm['flag'])
        // console.log("pageNoticePerm:::", pageNoticePerm);
        setIsLoading(false)
      } catch (error) {
        console.log("checkSendNoticeAuth:::", error);
        setIsLoading(false)
      }
    }
  }

  const noDuesTabPermission = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const tabPerm = await fetch(`${BASE_URL}/staff/noDuesButtonPermission`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          }
        })
        const showTabPerm = await tabPerm.json()
        // console.log("noDuesTabPermission:::", showTabPerm['result']['total']);
        setNoDueApproveTab(showTabPerm['result']['total'])
        setIsLoading(false)
      } catch (error) {
        console.log("checkSendNoticeAuth:::", error);
        setIsLoading(false)
      }
    }
  }

  const acceptNoDuesTab = async () => {
    console.log("acceptNoDuesTabacceptNoDuesTab");

    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const noDueTab = await fetch(`${BASE_URL}/staff/acceptNoDuesTab`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          }
        })
        const showTab = await noDueTab.json()
        // console.log("noDuesAccept:::", showTab);
        setNoDueTab(showTab)
        setIsLoading(false)
      } catch (error) {
        console.log("checkSendNoticeAuth:::", error);
        setIsLoading(false)
      }
    }
  }

  // //////////////// BIRTHDAY FUNCTION ///////////////
  const isBirthday = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    console.log("Birthday return", today.getDate() === birthDate.getDate() &&
      today.getMonth() === birthDate.getMonth());

    return (
      today.getDate() === birthDate.getDate() &&
      today.getMonth() === birthDate.getMonth()
    );
  };


  const errorModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }
  return (
    <AlertNotificationRoot>
      <View style={{ height: '100%' }}>
        {isLoading ?
          (
            <ActivityIndicator size="large" />
          ) : (
            <Pressable onPress={closeMenu} style={{ flex: 1 }}>
              <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
                {/* NEW STRUCTURE */}

                {birthdayTab && (
                  <>
                  <BirthdayCard name={staffProfileData['Name']} />
                  <BirthdaySparkle show={true} />
                  </>
                )}
                {
                  <View style={{ width: '92%', alignSelf: 'center', paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', rowGap: 16, columnGap: 28, justifyContent: 'flex-start', marginVertical: 16 }}>

                    {
                      noDueTab?.flag == 1 &&
                      <View>
                        {
                          noDueTab['noDuesData']['NoDuesStatus'] == 0 ?
                            <TouchableOpacity style={[styles.cardFull, { backgroundColor: "#3079de" }]} >
                              <LinearGradient
                                colors={[colors.uniRed, colors.uniBlue]}
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 20,
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                <MaterialCommunityIcons name="calendar-month" size={24} color={'white'} />
                              </LinearGradient>
                              <View style={styles.rightText}>
                                <Text style={[styles.cardTxt, { color: '#f1f1f1' }]}>You are on Notice Period</Text>
                                <View style={styles.smallDetails}>
                                  <Text style={[styles.textSmall, { color: '#f1f1f1' }]}>Last Working Day: {`${noDueTab['noDuesData']['NoDuesDate'].split('T')[0].split('-').reverse().join('-')}`}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                            : noDueTab['noDuesData']['NoDuesStatus'] == 1 || noDueTab['noDuesData']['NoDuesStatus'] == 2 ?
                              <TouchableOpacity style={[styles.cardFull, { backgroundColor: "#de3050" }]} onPress={() => { navigation.navigate('TrackNoDues', { noDueId: noDueTab['noDuesData']['ID'], acceptStatus: noDueTab['noDuesData']['AcceptStatus'] }) }} >
                                <LinearGradient
                                  colors={[colors.uniRed, colors.uniBlue]}
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >

                                  <MaterialCommunityIcons name="calendar-month" size={24} color={'white'} />
                                </LinearGradient>
                                <View style={styles.rightText}>
                                  <Text style={[styles.cardTxt, { color: '#f1f1f1' }]}>No Dues are Generated</Text>
                                  <View style={styles.smallDetails}>
                                    <Text style={[styles.textSmall, { color: '#f1f1f1' }]}>Press tab for further process</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                              : noDueTab['noDuesData']['NoDuesStatus'] == 3 ?
                                <TouchableOpacity style={[styles.cardFull, { backgroundColor: "#de3050" }]} onPress={() => { navigation.navigate('TrackNoDues', { noDueId: noDueTab['noDuesData']['ID'], acceptStatus: noDueTab['noDuesData']['AcceptStatus'] }) }} >
                                  <LinearGradient
                                    colors={[colors.uniRed, colors.uniBlue]}
                                    style={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: 20,
                                      justifyContent: 'center',
                                      alignItems: 'center'
                                    }}
                                  >

                                    <MaterialCommunityIcons name="calendar-month" size={24} color={'white'} />
                                  </LinearGradient>
                                  <View style={styles.rightText}>
                                    <Text style={[styles.cardTxt, { color: '#f1f1f1' }]}>No Dues are Completed</Text>
                                    <View style={styles.smallDetails}>
                                      <Text style={[styles.textSmall, { color: '#f1f1f1' }]}>All clearances received. No pending dues</Text>
                                    </View>
                                  </View>
                                </TouchableOpacity> : null
                        }
                      </View>
                    }
                    {/* checkIn checkOut Time */}
                    {tabsData?.[0]?.IsVisible === 1 && tabsData?.[0]?.ElementName === 'DailyCheckInOut' && imageStatus == 0 || imageStatus == 1 || imageStatus == null ?
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={[styles.cardOuterShape]}
                        onPress={() => { closeMenu(); navigation.navigate('Calendar') }}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name="calendar-month" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>
                        <Text
                          style={{ color: inouttime['a'] === 'No Punch' ? 'red' : 'green', fontWeight: '600' }}
                        >
                          {inoutText + inouttime['a']}
                        </Text>

                        <Text
                          style={{ color: inouttime['b'] === 'No Punch' ? 'red' : 'green', fontWeight: '600', fontSize: 12 }}
                        >
                          {outtimeText + inouttime['b']}
                        </Text>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={[styles.cardOuterShape]}
                        onPress={profileAlert}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name="calendar-month" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>
                        <Text
                          style={{ color: inouttime['a'] === 'No Punch' ? 'red' : 'green', fontWeight: '600' }}
                        >
                          {inoutText + inouttime['a']}
                        </Text>

                        <Text
                          style={{ color: inouttime['b'] === 'No Punch' ? 'red' : 'green', fontWeight: '600', fontSize: 12 }}
                        >
                          {outtimeText + inouttime['b']}
                        </Text>
                      </TouchableOpacity>

                    }



                    {/* Attendance Download */}
                    {tabsData?.[1]?.IsVisible === 1 && tabsData?.[1]?.ElementName === 'AttendanceDownload' &&
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => { navigation.navigate('AttandancepdfDownload') }}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name="network-strength-2" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>
                        <Text
                          style={styles.titleText}
                        >
                          {getCurrentDate()}
                        </Text>

                        <Text
                          style={styles.subTitleText}
                        >
                          Days: {getPaidDay + PaidDaysTextecond + getTotalDays}
                        </Text>
                      </TouchableOpacity>
                    }


                    {/* Library Tab */}
                    {tabsData?.[2]?.['IsVisible'] == 1 && tabsData[2]['ElementName'] == 'BooksIssued' &&
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => { closeMenu(); navigation.navigate('LibraryBooks') }}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialIcons name="menu-book" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>
                        <Text
                          style={styles.titleText}
                        >
                          Books Issued
                        </Text>

                        <Text
                          style={styles.subTitleText}
                        >
                          {gettTotalBooksText + gettTotalBooks}
                        </Text>
                      </TouchableOpacity>
                    }

                    {/* Launching Complaint */}
                    {
                      tabsData?.[3]?.['IsVisible'] == 1 && tabsData[3]['ElementName'] == 'LaunchComplaint' &&
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => { closeMenu(); navigation.navigate('ComplaintsMainScreen') }}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}  // ⬇️ smaller icon box
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name="image-broken" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>

                        <Text
                          style={styles.titleText}
                        >
                          Launch Complaint
                        </Text>
                        <Text
                          style={styles.subTitleText}
                        >
                          Complaint a Faulty Article
                        </Text>
                      </TouchableOpacity>
                    }


                    {/* Time Table */}
                    {
                      tabsData?.[4]?.['IsVisible'] == 1 && tabsData[4]['ElementName'] == 'TimeTable' &&
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => navigation.navigate('StaffTimeTable')}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}  // ⬇️ smaller icon box
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name="calendar-clock" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>

                        <Text
                          style={styles.titleText}
                        >
                          Time Table
                        </Text>
                        <Text
                          style={styles.subTitleText}
                        >
                          {CurrentDay.split(',')[0].split(' ').reverse().join('-')} ({CurrentDayName})
                        </Text>
                      </TouchableOpacity>
                    }


                    {/* Mark Attendance */}
                    {
                      tabsData?.[5]?.['IsVisible'] == 1 && tabsData[5]['ElementName'] == 'MarkAttendance' &&
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => navigation.navigate('MarkAttendance')}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}  // ⬇️ smaller icon box
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name="human-greeting-variant" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>

                        <Text
                          style={styles.titleText}
                        >
                          Mark Attendance
                        </Text>
                        <Text
                          style={styles.subTitleText}
                        >
                          {CurrentDay.split(',')[0].split(' ').reverse().join('-')} ({CurrentDayName})
                        </Text>
                      </TouchableOpacity>
                    }


                    {/* Account Dashboard */}
                    {
                      tabsData?.[6]?.['IsVisible'] == 1 && tabsData[6]['ElementName'] == 'AccountDashboard' && AccPermission == 1 &&
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => navigation.navigate('AccountsDashboard')}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name="cash-register" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>

                        <Text
                          style={styles.titleText}
                        >
                          Accounts
                        </Text>
                        <Text
                          style={styles.subTitleText}
                        >
                          {`Acc Till: ${CurrentDay.split(',')[0].split(' ').reverse().join('-')}`}
                        </Text>
                      </TouchableOpacity>
                    }


                    {/* NoticeBoard FC */}
                    {
                      tabsData?.[7]?.['IsVisible'] == 1 && tabsData[7]['ElementName'] == 'NoticeBoardFC' &&
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => navigation.navigate('Notice')}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name="comment-multiple-outline" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>

                        <Text
                          style={styles.titleText}
                        >
                          Communication
                        </Text>
                        <Text
                          style={styles.subTitleText}
                        >
                          Notices/Office Orders
                        </Text>
                      </TouchableOpacity>
                    }


                    {/* Send Notice */}
                    {
                      tabsData?.[8]?.['IsVisible'] == 1 && tabsData[8]['ElementName'] == 'SendNotice' && sendNoticePermission == 1 &&
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => navigation.navigate('CreateNotice')}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name="send" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>

                        <Text
                          style={styles.titleText}
                        >
                          Send Notice
                        </Text>
                        <Text
                          style={styles.subTitleText}
                        >
                          Staff/Students
                        </Text>
                      </TouchableOpacity>
                    }


                    {/* Chats */}
                    {
                      tabsData?.[9]?.['IsVisible'] == 1 && tabsData[9]['ElementName'] == 'Chat' &&
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => navigation.navigate('AllChats')}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name="chat-processing" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>

                        <Text
                          style={styles.titleText}
                        >
                          Chat
                        </Text>
                        <Text
                          style={styles.subTitleText}
                        >
                          Communication
                        </Text>
                      </TouchableOpacity>
                    }

                    {/* No Dues Tab */}
                    {
                      tabsData?.[10]?.['IsVisible'] == 1 && tabsData[10]['ElementName'] == 'NoDues' && noDueApproveTab > 0 &&
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => navigation.navigate('ApproveNodues')}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialIcons name="edit-document" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>

                        <Text
                          style={styles.titleText}
                        >
                          No Dues
                        </Text>
                        <Text
                          style={styles.subTitleText}
                        >
                          No dues forms
                        </Text>
                      </TouchableOpacity>
                    }

                    {/* Verify Students for Gate Guards */}
                    {/* <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cardOuterShape}
                        onPress={() => navigation.navigate('ScanqrScreen')}
                      >
                        <View
                          style={styles.iconOuterRing}
                        >
                          <MaskedView
                            style={{ flexDirection: 'row', height: 22, width: 22 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <AntDesign name="qrcode" color="white" size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>
                        </View>

                        <Text
                          style={styles.titleText}
                        >
                          Verify Student
                        </Text>
                        <Text
                          style={styles.subTitleText}
                        >
                          Scan ID Card
                        </Text>
                      </TouchableOpacity> */}
                  </View>
                }
              </ScrollView>
            </Pressable>
          )
        }
        {/* <PlusIcon />  */}
      </View>
    </AlertNotificationRoot>
  );
};
export default StaffHome
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: 0
  },
  dashboardCards: {
    padding: 12,
    height: 150,
    borderTopEndRadius: 0
  },
  attendanceCard: {
    padding: 10,
    height: 100,
    elevation: 1,
    backgroundColor: 'white',
    margin: 10
  },
  iconOuter: {
    backgroundColor: colors.uniBlue,
    borderRadius: 32,
  },

  cardOuterShape: {
    backgroundColor: '#fff',
    width: '45%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 12,

    elevation: 3,

    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  iconOuterRing: {
    borderColor: colors.uniBlue,
    borderWidth: 1,
    borderRadius: 28,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9ff',
  },
  titleText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#223260',
    marginBottom: 2,
    textAlign: 'center',
  },
  subTitleText: {
    fontSize: 11.5,
    color: '#8a8a8a',
    textAlign: 'center',
  },
  cardFull: {
    padding: 24,
    width: screenWidth - 72,
    marginBottom: 16,
    alignItems: 'center',
    gap: 16,
    flexDirection: 'row',
    elevation: 1,
    backgroundColor: 'white',
    borderRadius: 16
  },
  rightText: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  cardTxt: {
    color: '#3b5998',
    fontSize: 20,
    fontWeight: '600'
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 14
  },
  birthdayCard: {
    backgroundColor: "#FFE8A3",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  message: {
    marginTop: 5,
    fontSize: 14
  }
}
)