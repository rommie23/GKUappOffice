import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Pressable, TouchableWithoutFeedback, Platform } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
// import Carousel from 'react-native-reanimated-carousel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import colors from '../../colors';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL, LIMS_URL } from '@env';
import { StudentContext } from '../../context/StudentContext';
import { RefreshControl } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import Orientation from 'react-native-orientation-locker';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { askForRating } from '../../services/askForRatings';
import PlusButton from '../components/PlusButton'
import BirthdaySparkle from '../../StaffSide/components/BirthdaySparkle'
import BirthdayCard from '../../StaffSide/components/BirthdayCard'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaskedView from '@react-native-masked-view/masked-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FeesAlert from '../components/feesRelated/FeesAlert'


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const StudentHome = () => {

  // permission
  async function requestNotificationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (err) {
      console.warn('Permission request error:', err);
    }

  }

  useEffect(() => {
    if (Platform.OS == "android") {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        const { data } = remoteMessage;
        if (data) {
          await displayLocalNotification(data.title, data.body)
        }
      });
      return unsubscribe;

    }
  }, []);

  async function onAppBootstrap() {
    await messaging().registerDeviceForRemoteMessages();
    const dToken = await messaging().getToken();
    await setMobileToken(dToken)

    console.log(dToken);
    return dToken;
  }

  // Creating Android notification channel
  async function createNotificationChannel() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Notifications',
      importance: AndroidImportance.HIGH,
    });
  }
  useEffect(() => {
    if (Platform.OS == "android") {
      requestNotificationPermission();
      onAppBootstrap();
      createNotificationChannel();
    } else {
      console.log("it is ios device");
    }
  }, []);

  // Display a styled notification using Notifee
  async function displayLocalNotification(title, body) {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
        smallIcon: 'ic_notification', // must exist in res/drawable
        largeIcon: 'https://www.gku.ac.in/images/appLogo.png',
        color: colors.uniBlue,
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const { setTotalBooksAndFine, setIsLoggedin, setStudentIDNo, setData, setStudentImage, closeMenu, setMobileToken } = useContext(StudentContext);
  const navigation = useNavigation()
  // const [carousalPhotos, setCarousalPhotos] = useState([images.carousal4, images.carousal4, images.carousal4, images.carousal4, ])
  const [profileData, setProfileData] = useState([])
  const [totalBooks, setTotalBooks] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooksLoading, setIsBooksLoading] = useState(true)
  const [noticesData, setNoticesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [electricityData, setElectricityData] = useState([])
  const [showElectricityTab, setShowElectricityTab] = useState(false)
  const [tabsData, setTabsData] = useState([])
  const [convoTabData, setConvoTabData] = useState([])
  const [birthdayTab, setBirthdayTab] = useState(false)
  const [flag, setFlag] = useState([])
  const [feePending, setFeePending] = useState(true)
  const [hostelTab, setHostelTab] = useState(false)
  const [hostelData, setHostelData] = useState({})


  //////////////////////////// meter bill Api //////////////////////////
  const electricityBills = async (studentId) => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const res = await fetch(LIMS_URL + '/student/meterReading/' + studentId, {
          method: 'POST',
        })
        const response = await res.json();
        console.log("response:::::", response);
        setElectricityData(response[0])
        Orientation.lockToPortrait();

        response.length > 0 ? setShowElectricityTab(true) : null
      } catch (error) {
        console.log('meter data :: ', error);
      }
    }
  }

  //////// to check how many books are issued and how much total fine is /////////////

  const checkBooks = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const BooksDetails = await fetch(BASE_URL + '/Student/issuedbooks/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const studentBooksData = await BooksDetails.json()
        console.log(studentBooksData)
        setTotalBooks(studentBooksData)
        setTotalBooksAndFine(studentBooksData)
        setIsBooksLoading(false)
        // console.log(totalBooksAndFine);
      } catch (error) {
        console.log('Error fetching Guri data:library:', error);
      }

      /////// api to see if there is any new notice for students ////
      try {
        const NoticesDetails = await fetch(BASE_URL + '/student/notice', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          },
        })
        const NoticesDetailsData = await NoticesDetails.json()
        setNoticesData(NoticesDetailsData.data)
        // console.log('data froms api NoticeBoard',NoticesDetailsData)
        setLoading(false)
      } catch (error) {
        console.log('Error fetching noticeBoard data:', error)
        setLoading(false)
      }
    }
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
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      // navigation.navigate('StudentDashboard')
      setIsLoading(true)
      setIsLoggedin(true)
      try {
        const studentDetails = await fetch(BASE_URL + '/student/profile/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const studentDetailsData = await studentDetails.json()
        console.log("profile Data", studentDetailsData)
        setData(studentDetailsData)
        setStudentIDNo(studentDetailsData['data'][0]['IDNo'])
        setStudentImage(studentDetailsData['data'][0]['Image'])
        setProfileData(studentDetailsData['data'][0])
        setBirthdayTab(isBirthdayToday(studentDetailsData['data'][0]['DOB']))
        if (studentDetailsData['data'][0]['ABCID'] === null || studentDetailsData['data'][0]['ABCID'] == "" || studentDetailsData['data'][0]['ABCID'] === "null" || studentDetailsData['data'][0]['ABCID'] == "NA") {
          navigation.navigate('StudentProfileUpdate', { flag: 0 })
          console.log('StudentProfileUpdate');

        }
        // console.log("FeedBackStatus::", studentDetailsData['data'][0]);

        if (studentDetailsData['data'][0]['FeedBackStatus'] != '1' && studentDetailsData['data'][0]['CourseID'] != '188') {
          setIsLoading(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'FeedbackForm' }],
          });
          return;
        }

        if (Platform.OS == "android") {
          const token = await onAppBootstrap();
          console.log("onAppBootstrap Token:::", token);
          if (!token) {
            console.warn("Device token not available, skipping token upload.");
            return;
          }
          const sendDeviceToken = await fetch(`${BASE_URL}/student/devicetoken`, {
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
          console.log("Response for token save::::", response);
        }

        electricityBills(studentDetailsData['data'][0]['IDNo'])
        if (studentDetailsData['data'][0]['Status'] != 1) {
          try {
            await EncryptedStorage.removeItem('user_session')
            // navigation.navigate('StaffLogin');
            setIsLoggedin(false)
          } catch (error) {
            // console.log('Error in sessionDestroy StudentHome:', error);
          }
        }

        setIsLoading(false)
        // console.log('sessoin at Amrik details',session);
      } catch (error) {
        console.log('Error fetching Guri data:studentHome:', error);
        setIsLoading(false)
      }
    }
  }

  // /////////////////// To hide/show tabs in UI for Gateway ///////////////
  // ---------------- FETCH ALL TABS ----------------
  const fetchAllTabs = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    if (!session) return;

    try {
      const res = await fetch(`${BASE_URL}/student/tabsToShowStudentDashboard`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session}` }
      });

      const data = await res.json();
      // console.log("AllTabs:::", data);
      setTabsData(data);
    } catch (err) {
      console.log(err);
    }
  };


  const fetchFeePending = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    if (!session) return;

    try {
      const res = await fetch(`${BASE_URL}/student/feepending`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session}` }
      });

      const data = await res.json();
      console.log("fetchFeePending:::", data);
      setFeePending(data);

    } catch (err) {
      console.log(err);
    }
  };


  const convoTab = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const tabsData = await fetch(`${BASE_URL}/student/convocation`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          }
        })
        const pageTabsData = await tabsData.json()
        setConvoTabData(pageTabsData)
        // console.log("convoTab :::: ", pageTabsData);

        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
  }

  const getCourseFlag = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const courseFlag = await fetch(BASE_URL + '/student/checkbutton', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          },
        })
        const courseFlagDetails = await courseFlag.json()
        setFlag(courseFlagDetails)
        // console.log('data froms api flags:::',courseFlagDetails['statusopen'][0]['flag'])
        setFlag(courseFlagDetails['statusopen'][0]['flag'])
        setLoading(false)
        // console.log(transactions);
      } catch (error) {
        console.log('Error fetching flags data:examination:', error)
        setLoading(false)
      }
    }
  }

  const hostelTabShow=async()=>{
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const hostelFlag = await fetch(BASE_URL + '/student/hostelStudentDetails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          },
        })
        const hostelFlagDetails = await hostelFlag.json()
        if (hostelFlagDetails.flag == 1) {
          setHostelTab(true)
          setHostelData(hostelFlagDetails.studentData)
        }
        
      } catch (error) {
        console.log('Error fetching flags data:examination:', error)
        setLoading(false)
      }
    }
  }


  useEffect(() => {
    checkBooks()
    checkSession()
    fetchAllTabs()
    convoTab();
    getCourseFlag();
    fetchFeePending();
    hostelTabShow();
  }, [])


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllTabs()
    checkSession()
    convoTab();
    fetchFeePending();
    hostelTabShow();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  ///////////////////  UI of the Page home ////////////////
  return (
    // <Pressable onPress={closeMenu}
    // style={{ flex: 1 }} 
    // pointerEvents="box-none">
    <ScrollView style={{ backgroundColor: 'white' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={{ backgroundColor: '#fff', minHeight: screenHeight / 1.26 }}>

        <View style={[styles.container]}>

          {/* <View style={styles.carousalOuter}>
          <Carousel
            loop
            width={screenWidth - 32}
            height={screenHeight / 4 - 50}
            autoPlay={true}
            data={data}
            scrollAnimationDuration={1000}
            style={{ elevation: 1, borderRadius: 16 }}
            renderItem={({ index }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Image style={{ height: '100%', width: '100%', resizeMode: 'cover' }} source={data[index]} />
              </View>
            )}
          />

        </View> */}
          {isLoading ? <ActivityIndicator /> :
            <View style={{ paddingVertical: 16 }}>
              {
                convoTabData?.data?.length > 0 && convoTabData?.data?.[0]?.ConvoRegistrationStatus == 0 && convoTabData?.data?.[0]?.RegistrationOpen == '1' ?
                  <View>
                    <TouchableOpacity style={[styles.cardFull, { backgroundColor: "#305CDE" }]} onPress={() => { closeMenu(); navigation.navigate('ConvocationFeePay', { fee: convoTabData?.data[0]["Fee"] }) }}>
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={[styles.iconOuter]}
                      >
                        {/* <MaterialCommunityIcons name='certificate' size={20} color={'white'} /> */}
                        <FontAwesome6Icon name='graduation-cap' color={'white'} size={18} />
                      </LinearGradient>
                      <View style={styles.rightText}>
                        <Text style={[styles.cardTxt, { color: '#f1f1f1' }]}>{convoTabData?.data[0]["Title"]}</Text>
                        <View style={styles.smallDetails}>
                          <Text style={[styles.textSmall, { color: '#f1f1f1' }]}>Apply for Convocation</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  :
                  convoTabData?.data?.length > 0 && convoTabData?.data?.[0]?.ConvoRegistrationStatus == 1 ?
                    <TouchableOpacity style={[styles.cardFull, { backgroundColor: "#2FA84F" }]} onPress={() => { closeMenu(); navigation.navigate('Convocation', { convoData: convoTabData?.data[0] }) }}>
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={[styles.iconOuter]}
                      >
                        {/* <MaterialCommunityIcons name='certificate' size={20} color={'white'} /> */}
                        <FontAwesome6Icon name='graduation-cap' color={'white'} size={18} />
                      </LinearGradient>
                      <View style={styles.rightText}>
                        <Text style={[styles.cardTxt, { color: '#f1f1f1' }]}>{convoTabData?.data[0]["Title"]}</Text>
                        <View style={styles.smallDetails}>
                          <Text style={[styles.textSmall, { color: '#f1f1f1' }]}>Check Status of your registration</Text>
                        </View>
                      </View>
                    </TouchableOpacity> : null
              }
              {birthdayTab && (
                <>
                  <BirthdayCard name={profileData['StudentName']} />
                  <BirthdaySparkle show={true} />
                </>
              )}
              {
                feePending?.flag == 1 && (
                  <FeesAlert
                    feeMessage={feePending.message}
                  />
                )
              }
              {/* NEW STRUCTURE */}
              {/* All dashboard tabs */}
              <LinearGradient
                colors={colors.gradientBlue}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '92%', alignSelf: 'center', marginVertical: 16, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, }}>
                <Text style={{ left: 20, top: 10, color: colors.uniBlue, fontWeight: '500', fontSize: 16 }}>Student</Text>
                <View style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View style={{ padding: 24, flexDirection: 'row', flexWrap: 'nowrap', columnGap: 8, justifyContent: 'flex-start' }}>
                      {/* Student Library */}
                      {tabsData?.Dashboard_st?.[0]?.['IsVisible'] == 1 && tabsData?.Dashboard_st?.[0]?.ElementName === 'Library' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('StudentLibrary') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <MaterialCommunityIcons name="book-open-page-variant-outline" color={colors.uniBlue} size={30} />
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
                            Library
                          </Text>
                          {isBooksLoading && <Text>Loading...</Text>}
                          {totalBooks && <Text style={styles.subTitleText}>Books Issued:{totalBooks['books'][0]['books']}</Text>}
                          {totalBooks && totalBooks['finedata'][0]['amount'] != null ? <Text style={styles.subTitleText}>Fine: ₹{totalBooks['finedata'][0]['amount']}</Text> : null}
                        </TouchableOpacity>
                      }

                      {/* Notice Board */}
                      {tabsData?.Dashboard_st?.[1]?.['IsVisible'] == 1 && tabsData?.Dashboard_st?.[1]?.ElementName === 'NoticeBoard' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('Notice') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <MaterialCommunityIcons name="clipboard-text-multiple-outline" color={colors.uniBlue} size={30} />
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
                            Notices
                          </Text>
                          <Text style={styles.subTitleText}>Check Notice Board</Text>
                        </TouchableOpacity>
                      }

                      {/* My Certificates */}
                      {tabsData?.Dashboard_st?.[4]?.['IsVisible'] == 1 && tabsData?.Dashboard_st?.[4]?.ElementName === 'MyCertificates' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('MyCertificates') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <Entypo name='documents' color={colors.uniBlue} size={30} />
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
                            Certificates
                          </Text>
                          <Text style={styles.subTitleText}>Check or Upload Certificates</Text>
                        </TouchableOpacity>
                      }

                      {/* All Messages */}

                      {tabsData?.Dashboard_st?.[7]?.['IsVisible'] == 1 && tabsData?.Dashboard_st?.[7]?.ElementName === 'AllMessages' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('MessagesRoot') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <AntDesign name="message1" color={colors.uniBlue} size={30} />
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
                            Messages
                          </Text>
                          <Text style={styles.subTitleText}>Messages from Faculty</Text>
                        </TouchableOpacity>
                      }
                    </View>
                  </ScrollView>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.8)', '#FFFFFF']}
                    locations={[0, 0.15, 0.4, 0.7, 1]}
                    style={{
                      position: 'absolute',
                      right: 0,
                      width: 60,
                      height: '100%', // ✅ Matches ScrollView height exactly
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    }}
                    pointerEvents="none"
                  />
                </View>
              </LinearGradient>


              {/* Facilities */}

              <LinearGradient
                colors={colors.gradientCoral}
                locations={[0, 0.3, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '92%', alignSelf: 'center', marginVertical: 16, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } }}>
                <Text style={{ left: 20, top: 10, color: colors.uniBlue, fontWeight: '500', fontSize: 16 }}>Facilities</Text>
                <View style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>

                    <View style={{ padding: 24, flexDirection: 'row', flexWrap: 'nowrap', columnGap: 8, justifyContent: 'flex-start' }}>

                      {tabsData?.Dashboard_st?.[8]?.['IsVisible'] == 1 && tabsData?.Dashboard_st?.[8]?.ElementName === 'Transport' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { navigation.navigate('BusPassDetails') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <Ionicons name="bus-outline" color={colors.uniBlue} size={30} />
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
                            Transport
                          </Text>
                          <Text style={styles.subTitleText}>Bus Service Details</Text>
                        </TouchableOpacity>
                      }
                      {tabsData?.Dashboard_st?.[9]?.['IsVisible'] == 1 && tabsData?.Dashboard_st?.[9]?.ElementName === 'SmartCard' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { navigation.navigate('ApplyIdCard') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <Ionicons name="id-card-outline" color={colors.uniBlue} size={30} />
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
                            SmartCard
                          </Text>
                          <Text style={styles.subTitleText}>Bus Service Details</Text>
                        </TouchableOpacity>
                      }

                      {/* Grievance */}
                      {tabsData?.Dashboard_st?.[2]?.['IsVisible'] == 1 && tabsData?.Dashboard_st?.[2]?.ElementName === 'Grievance' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('StudentGrievance') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <MaterialCommunityIcons name="shield-plus-outline" color={colors.uniBlue} size={30} />
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
                            Grievance
                          </Text>
                          <Text style={styles.subTitleText}>Check the Grievance</Text>
                        </TouchableOpacity>
                      }
                      {/* Apply Certificates */}
                      {tabsData?.Dashboard_st?.[3]?.['IsVisible'] == 1 && tabsData?.Dashboard_st?.[3]?.ElementName === 'ApplyCertificates' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('ApplyForDocuments') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <Ionicons name="documents-outline" color={colors.uniBlue} size={30} />
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
                            Documents
                          </Text>
                          <Text style={styles.subTitleText}>Transcript, DMC etc.</Text>
                        </TouchableOpacity>
                      }

                      {
                        showElectricityTab &&
                        <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', rowGap: 16, columnGap: 8, justifyContent: 'flex-start' }}>

                          {/* Electrity Bill */}
                          {tabsData?.Dashboard_st?.[5]?.['IsVisible'] == 1 && tabsData?.Dashboard_st?.[5]?.ElementName === 'ElectrityBill' &&
                            <TouchableOpacity
                              activeOpacity={0.85}
                              style={[styles.cardOuterShapeScroll]}
                              onPress={() => { closeMenu(); navigation.navigate('StudentElectricityBill') }}
                            >
                              <View
                                style={styles.iconOuterRing}
                              >
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
                                      <MaterialCommunityIcons name='lightbulb-on-outline' color={colors.uniBlue} size={30} />
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
                                Electricity
                              </Text>
                              <Text style={styles.subTitleText}>Current Bill is : ₹ </Text>
                            </TouchableOpacity>
                          }
                        </View>
                      }
                      {/* hostel */}
                          {tabsData?.Dashboard_st?.[10]?.['IsVisible'] == 1 && tabsData?.Dashboard_st?.[10]?.ElementName === 'Hostel' && hostelTab &&
                            <TouchableOpacity
                              activeOpacity={0.85}
                              style={styles.cardOuterShapeScroll}
                              onPress={() => { navigation.navigate('HostelDetails', {hostelData}) }}
                              // onPress={() => { closeMenu(); navigation.navigate('StudentLeaves') }}
                            >
                              <View
                                style={styles.iconOuterRing}
                              >
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
                                      <MaterialCommunityIcons name="office-building-outline" color={colors.uniBlue} size={30} />
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
                                Hostel
                              </Text>
                              <Text style={styles.subTitleText}>Hostel Details</Text>
                            </TouchableOpacity>
                          }
                    </View>
                  </ScrollView>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.8)', '#FFFFFF']}
                    locations={[0, 0.15, 0.4, 0.7, 1]}
                    style={{
                      position: 'absolute',
                      right: 0,
                      width: 60,
                      height: '100%', // ✅ Matches ScrollView height exactly
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    }}
                    pointerEvents="none"
                  />
                </View>
              </LinearGradient>

              {/* fees card */}
              <LinearGradient
                colors={colors.gradientLavendar}
                locations={[0, 0.3, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '96%', alignSelf: 'center', marginVertical: 16, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, }}>
                <Text style={{ left: 20, top: 10, color: colors.uniBlue, fontWeight: '500', fontSize: 16 }}>Fees</Text>
                <View style={{ padding: 24, flexDirection: 'row', flexWrap: 'wrap', columnGap: 8, justifyContent: 'flex-start' }}>
                  {
                    tabsData?.Fees_st?.[0]?.['IsVisible'] == 1 && tabsData?.Fees_st?.[0]?.ElementName === 'PayNow' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { closeMenu(); navigation.navigate('FeePayment') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
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
                              <Ionicons name='cash-outline' color={colors.uniBlue} size={30} />
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
                        Pay Now
                      </Text>
                      <Text style={styles.subTitleText}>Bus Service Details</Text>
                    </TouchableOpacity>
                  }

                  {
                    tabsData?.Fees_st?.[1]?.['IsVisible'] == 1 && tabsData?.Fees_st?.[1]?.ElementName === 'Receipts' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { closeMenu(); navigation.navigate('Receipts') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
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
                              <Ionicons name='receipt-outline' color={colors.uniBlue} size={30} />
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
                        Receipts
                      </Text>
                      <Text style={styles.subTitleText}>Bus Service Details</Text>
                    </TouchableOpacity>
                  }

                  {
                    tabsData?.Fees_st?.[2]?.['IsVisible'] == 1 && tabsData?.Fees_st?.[2]?.ElementName === 'RecentTransactions' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { closeMenu(); navigation.navigate('RecentTransactions') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
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
                              <MaterialCommunityIcons name='page-previous-outline' color={colors.uniBlue} size={30} />
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
                        Transactions
                      </Text>
                      <Text style={styles.subTitleText}>Bus Service Details</Text>
                    </TouchableOpacity>
                  }
                </View>
              </LinearGradient>


              {/* Exmination card */}
              <LinearGradient
                colors={colors.gradientMint}
                locations={[0, 0.3, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '92%', alignSelf: 'center', marginVertical: 16, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, }}>
                <Text style={{ left: 20, top: 10, color: colors.uniBlue, fontWeight: '500', fontSize: 16 }}>Examination</Text>
                <View style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View style={{ padding: 24, flexDirection: 'row', flexWrap: 'noWrap', columnGap: 8, justifyContent: 'flex-start' }}>
                      {
                        tabsData?.Examination_st?.[0]?.['IsVisible'] == 1 && tabsData?.Examination_st?.[0]?.ElementName === 'RegularExamForm' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { flag == 0 ? navigation.navigate('Examination Form') : flag == 1 ? navigation.navigate('ExaminationFormPhd') : flag == 2 ? navigation.navigate('ExamFormAgricultureDiploma') : null }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <FontAwesome name="pencil-square-o" color={colors.uniBlue} size={32} />
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
                            Regular
                          </Text>
                          <Text style={styles.subTitleText}>Bus Service Details</Text>
                        </TouchableOpacity>
                      }
                      {
                        tabsData?.Examination_st?.[1]?.['IsVisible'] == 1 && tabsData?.Examination_st?.[1]?.ElementName === 'ReAppearExamForm' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { flag == 0 ? navigation.navigate('Reappear Form') : flag == 1 ? navigation.navigate('ReappearFormPhd') : flag == 2 ? navigation.navigate('ReappearFormAgricultureDiploma') : null }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <FontAwesome name="pencil-square-o" color={colors.uniBlue} size={32} />
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
                            Reappear
                          </Text>
                          <Text style={styles.subTitleText}>Bus Service Details</Text>
                        </TouchableOpacity>
                      }

                      {
                        tabsData?.Examination_st?.[4]?.['IsVisible'] == 1 && tabsData?.Examination_st?.[4]?.ElementName === 'PreviousExamForms' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('MyForms') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <MaterialCommunityIcons name='text-box-check-outline' color={colors.uniBlue} size={30} />
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
                            All Forms
                          </Text>
                          <Text style={styles.subTitleText}>Bus Service Details</Text>
                        </TouchableOpacity>
                      }

                      {
                        tabsData?.Examination_st?.[6]?.['IsVisible'] == 1 && tabsData?.Examination_st?.[6]?.ElementName === 'AdmitCard' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('AdmitCard') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <AntDesign name="idcard" color={colors.uniBlue} size={30} />
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
                            Admit Card
                          </Text>
                          <Text style={styles.subTitleText}>Bus Service Details</Text>
                        </TouchableOpacity>
                      }
                      
                      {
                        tabsData?.Examination_st?.[8]?.['IsVisible'] == 1 && tabsData?.Examination_st?.[8]?.ElementName === 'DateSheet' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('DateSheet') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <FontAwesome name="list" color={colors.uniBlue} size={30} />
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
                            Date Sheet
                          </Text>
                          <Text style={styles.subTitleText}>Bus Service Details</Text>
                        </TouchableOpacity>
                      }

                      {
                        tabsData?.Examination_st?.[2]?.['IsVisible'] == 1 && tabsData?.Examination_st?.[2]?.ElementName === 'Results' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('Result') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <MaterialCommunityIcons name="file-search-outline" color={colors.uniBlue} size={30} />
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
                            Result
                          </Text>
                          <Text style={styles.subTitleText}>Bus Service Details</Text>
                        </TouchableOpacity>
                      }

                      {
                        tabsData?.Examination_st?.[3]?.['IsVisible'] == 1 && tabsData?.Examination_st?.[3]?.ElementName === 'AllSubjects' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('AllSubjectsSemWise') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <Entypo name='open-book' color={colors.uniBlue} size={30} />
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
                            All Subjects
                          </Text>
                          <Text style={styles.subTitleText}>Bus Service Details</Text>
                        </TouchableOpacity>
                      }
                      {
                        tabsData?.Examination_st?.[5]?.['IsVisible'] == 1 && tabsData?.Examination_st?.[5]?.ElementName === 'CGPACalculator' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShapeScroll}
                          onPress={() => { closeMenu(); navigation.navigate('CGPA Calculator') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
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
                                  <AntDesign name="dashboard" color={colors.uniBlue} size={30} />
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
                            Calculator
                          </Text>
                          <Text style={styles.subTitleText}>Bus Service Details</Text>
                        </TouchableOpacity>
                      }
                    </View>
                  </ScrollView>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.8)', '#FFFFFF']}
                    locations={[0, 0.15, 0.4, 0.7, 1]}
                    style={{
                      position: 'absolute',
                      right: 0,
                      width: 60,
                      height: '100%', // ✅ Matches ScrollView height exactly
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    }}
                    pointerEvents="none"
                  />
                </View>
              </LinearGradient>



              {/* Academics Tabs */}
              <LinearGradient
                colors={colors.gradientYellow}
                locations={[0, 0.3, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '96%', alignSelf: 'center', marginVertical: 16, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, }}>
                <Text style={{ left: 20, top: 10, color: colors.uniBlue, fontWeight: '500', fontSize: 16 }}>Academics</Text>
                <View style={{ padding: 24, flexDirection: 'row', flexWrap: 'wrap', columnGap: 8, justifyContent: 'flex-start' }}>
                  {
                    tabsData?.Academics_st?.[0]?.['IsVisible'] == 1 && tabsData?.Academics_st?.[0]?.ElementName === 'StudyMaterial' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { navigation.navigate("StudentStudyMaterial") }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
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
                              <MaterialCommunityIcons name='book-search-outline' color={colors.uniBlue} size={30} />
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
                        Study Material
                      </Text>
                      <Text style={styles.subTitleText}>Bus Service Details</Text>
                    </TouchableOpacity>
                  }

                  {
                    tabsData?.Academics_st?.[3]?.['IsVisible'] == 1 && tabsData?.Academics_st?.[3]?.ElementName === 'Attendance' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { navigation.navigate("StudentAttendance") }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
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
                              <MaterialCommunityIcons name='fingerprint' color={colors.uniBlue} size={30} />
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
                        Attendance
                      </Text>
                      <Text style={styles.subTitleText}>Bus Service Details</Text>
                    </TouchableOpacity>
                  }

                  {
                    tabsData?.Academics_st?.[1]?.['IsVisible'] == 1 && tabsData?.Academics_st?.[1]?.ElementName === 'Assignments' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { navigation.navigate('StudentAssignments') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
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
                              <MaterialCommunityIcons name='file-document-multiple-outline' color={colors.uniBlue} size={30} />
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
                        Assignments
                      </Text>
                      <Text style={styles.subTitleText}>Bus Service Details</Text>
                    </TouchableOpacity>
                  }

                  {
                    tabsData?.Academics_st?.[2]?.['IsVisible'] == 1 && tabsData?.Academics_st?.[2]?.ElementName === 'Syllabus' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { navigation.navigate('StudentSyllabus') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
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
                              <MaterialCommunityIcons name="clipboard-list-outline" color={colors.uniBlue} size={30} />
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
                        Syllabus
                      </Text>
                      <Text style={styles.subTitleText}>Bus Service Details</Text>
                    </TouchableOpacity>
                  }
                </View>
              </LinearGradient>
            </View>
          }
        </View>
      </View >
      {/* the plus button for more student options */}
      {/* <PlusButton /> */}
    </ScrollView >
    // </Pressable>
  )
}

export default StudentHome

const styles = StyleSheet.create({
  // outer container CSS
  container: {
    // flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },

  // Carousal container CSS
  // carousalOuter: {
  //   flex: 1,
  //   padding: 16,
  // },

  // common CSS of cards below carousal
  cardFull: {
    paddingVertical: 24,
    width: screenWidth - 32,
    marginBottom: 16,
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    elevation: 2,
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
  smallDetails: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 14
  },
  iconOuter: {
    backgroundColor: colors.uniBlue,
    width: 48,
    height: 48,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },


  cardOuterShapeScroll: {
    width: screenWidth * .23,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 12,
  },
  cardOuterShapeMain: {
    // backgroundColor: '#fff',
    width: '23%',
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 12,
  },
  cardOuterShape: {
    // backgroundColor: '#fff',
    width: '30%',
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 12,
  },
  iconOuterRing: {
    borderColor: colors.uniBlue,
    // borderWidth: 0.2,
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    // backgroundColor: '#f9f9ff',
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOpacity: 0.07,
    // shadowRadius: 6,
    // shadowOffset: { width: 0, height: 3 },
  },


  titleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#223260',
    marginBottom: 2,
    textAlign: 'center',
  },
  subTitleText: {
    fontSize: 11.5,
    color: '#8a8a8a',
    textAlign: 'center',
    display: 'none'
  }
})