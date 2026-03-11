import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Pressable, TouchableWithoutFeedback, Platform } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
// import Carousel from 'react-native-reanimated-carousel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo'
import { images } from '../../images';
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
import Foundation from 'react-native-vector-icons/Foundation';
import { askForRating } from '../../services/askForRatings';
import PlusButton from '../components/PlusButton'
import BirthdaySparkle from '../../StaffSide/components/BirthdaySparkle'
import BirthdayCard from '../../StaffSide/components/BirthdayCard'


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
  const [showRedDot, setShowRedDot] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [electricityData, setElectricityData] = useState([])
  const [showElectricityTab, setShowElectricityTab] = useState(false)
  const [tabsData, setTabsData] = useState([])
  const [convoTabData, setConvoTabData] = useState([])
  const [birthdayTab, setBirthdayTab] = useState(false)


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
            pageName: 'Dashboard_st'
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
        console.log("convoTab :::: ", pageTabsData);

        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
  }



  useEffect(() => {
    checkBooks()
    checkSession()
    checkTabs();
    convoTab();
  }, [])


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkBooks()
    checkSession()
    checkTabs();
    convoTab();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  ///////////////////  UI of the Page home ////////////////
  return (
    <Pressable onPress={closeMenu}>
      <ScrollView style={{ backgroundColor: '#f1f1f1', }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{ backgroundColor: '#f1f1f1', minHeight: screenHeight / 1.26 }}>

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

                {/* <TouchableOpacity style={styles.cardFull} onPress={() => { navigation.navigate('StudentNotification') }}>
            <View style={styles.iconOuter}>
              <IonIcon name='notifications-outline' size={20} color={'white'} />
              <View style={styles.notificationDot}><Text></Text></View>
            </View>
            <View style={styles.rightText}>
              <Text style={styles.cardTxt}>
                Notification
              </Text>
              <View style={styles.smallDetails}>
                <Text style={styles.textSmall}>Check Notifications</Text>
              </View>
            </View>
          </TouchableOpacity> */}
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
                {/* {
                  // Library Tab //
                  tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'Library' &&
                  <TouchableOpacity style={styles.cardFull} onPress={() => { closeMenu(); navigation.navigate('StudentLibrary') }} >
                    <LinearGradient
                      colors={[colors.uniRed, colors.uniBlue]}
                      style={styles.iconOuter}
                    >
                      <FontAwesome5 name='book-reader' size={18} color={'white'} />
                    </LinearGradient>
                    <View style={styles.rightText}>
                      <Text style={styles.cardTxt}>
                        Library
                      </Text>
                      <View style={styles.smallDetails}>
                        {isBooksLoading && <Text>Loading...</Text>}
                        {totalBooks && <Text style={styles.textSmall}>Books Issued:{totalBooks['books'][0]['books']}</Text>}
                        {totalBooks && totalBooks['finedata'][0]['amount'] != null ? <Text style={styles.textSmall}>Fine: ₹{totalBooks['finedata'][0]['amount']}</Text> : null}
                      </View>
                    </View>
                  </TouchableOpacity>
                } */}

                {/* NEW STRUCTURE */}

                <View style={{ width: '92%', alignSelf: 'center', paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', rowGap: 16, columnGap: 28, justifyContent: 'flex-start', marginVertical: 16 }}>

                  {/* Student Library */}
                  {tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'Library' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { closeMenu(); navigation.navigate('StudentLibrary') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
                        <LinearGradient
                          colors={[colors.uniRed, colors.uniBlue]}
                          style={styles.iconOuter}
                        >
                          <FontAwesome5 name='book-reader' size={18} color={'white'} />
                        </LinearGradient>
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
                  {tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'NoticeBoard' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { closeMenu(); navigation.navigate('Notice') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
                        <LinearGradient
                          colors={[colors.uniRed, colors.uniBlue]}
                          style={styles.iconOuter}
                        >
                          <Entypo name='blackboard' size={20} color={'white'} />
                        </LinearGradient>
                      </View>
                      <Text
                        style={styles.titleText}
                      >
                        Notice Board
                      </Text>
                      <Text style={styles.subTitleText}>Check Notice Board</Text>
                    </TouchableOpacity>
                  }

                  {/* Grievance */}
                  {tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'Grievance' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { closeMenu(); navigation.navigate('StudentGrievance') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
                        <LinearGradient
                          colors={[colors.uniRed, colors.uniBlue]}
                          style={styles.iconOuter}
                        >
                          <FontAwesome5 name='shield-alt' size={20} color={'white'} />
                        </LinearGradient>
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
                  {tabsData?.[3]?.['IsVisible'] == 1 && tabsData?.[3]?.ElementName === 'ApplyCertificates' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { closeMenu(); navigation.navigate('ApplyForDocuments') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
                        <LinearGradient
                          colors={[colors.uniRed, colors.uniBlue]}
                          style={styles.iconOuter}
                        >
                          <Foundation name="page-multiple" color="white" size={24} />

                        </LinearGradient>
                      </View>
                      <Text
                        style={styles.titleText}
                      >
                        Apply Documents
                      </Text>
                      <Text style={styles.subTitleText}>Transcript, DMC etc.</Text>
                    </TouchableOpacity>
                  }


                  {/* My Certificates */}
                  {tabsData?.[4]?.['IsVisible'] == 1 && tabsData?.[4]?.ElementName === 'MyCertificates' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { closeMenu(); navigation.navigate('MyCertificates') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
                        <LinearGradient
                          colors={[colors.uniRed, colors.uniBlue]}
                          style={styles.iconOuter}
                        >
                          <Entypo name='documents' size={20} color={'white'} />
                        </LinearGradient>
                      </View>
                      <Text
                        style={styles.titleText}
                      >
                        My Certificates
                      </Text>
                      <Text style={styles.subTitleText}>Check or Upload Certificates</Text>
                    </TouchableOpacity>
                  }

                  {
                    showElectricityTab &&
                    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', rowGap: 16, columnGap: 28, justifyContent: 'flex-start' }}>

                      {/* Electrity Bill */}
                      {tabsData?.[5]?.['IsVisible'] == 1 && tabsData?.[5]?.ElementName === 'ElectrityBill' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={[styles.cardOuterShape]}
                          onPress={() => { closeMenu(); navigation.navigate('StudentElectricityBill') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={styles.iconOuter}
                            >
                              <MaterialCommunityIcons name='lightbulb-on-outline' size={24} color={'white'} />
                            </LinearGradient>
                          </View>
                          <Text
                            style={styles.titleText}
                          >
                            Electricity Bill ({electricityData["article_no"]})
                          </Text>
                          <Text style={styles.subTitleText}>Current Bill is : ₹ {Number(electricityData['amount'].split(' ')[0]).toFixed(2)} {electricityData['amount'].split(' ')[1]} {electricityData['amount'].split(' ')[2]}</Text>
                        </TouchableOpacity>
                      }

                      {/* Apply Certificates */}
                      {tabsData?.[6]?.['IsVisible'] == 1 && tabsData?.[6]?.ElementName === 'SudentLeave' &&
                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={styles.cardOuterShape}
                          onPress={() => { closeMenu(); navigation.navigate('StudentLeaves') }}
                        >
                          <View
                            style={styles.iconOuterRing}
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={styles.iconOuter}
                            >
                              <FontAwesome6Icon name='user-plus' color={'white'} size={18} />
                            </LinearGradient>
                          </View>
                          <Text
                            style={styles.titleText}
                          >
                            Apply Leave
                          </Text>
                          <Text style={styles.subTitleText}>Apply Leave for Hostel Students</Text>
                        </TouchableOpacity>
                      }
                    </View>

                  }

                  {/* All Messages */}

                  {tabsData?.[7]?.['IsVisible'] == 1 && tabsData?.[7]?.ElementName === 'AllMessages' &&
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cardOuterShape}
                      onPress={() => { closeMenu(); navigation.navigate('MessagesRoot') }}
                    >
                      <View
                        style={styles.iconOuterRing}
                      >
                        <LinearGradient
                          colors={[colors.uniRed, colors.uniBlue]}
                          style={styles.iconOuter}
                        >
                          <MaterialCommunityIcons name='message-badge' size={24} color={'white'} />
                        </LinearGradient>
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


                {/* Notice board
                // {
                //   tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'NoticeBoard' &&
                //   <TouchableOpacity style={styles.cardFull} onPress={() => { closeMenu(); navigation.navigate('Notice') }}>
                //     <LinearGradient
                //       colors={[colors.uniRed, colors.uniBlue]}
                //       style={styles.iconOuter}
                //     >
                //       <Entypo name='blackboard' size={20} color={'white'} />
                //       {showRedDot &&
                //         <View style={styles.notificationDot}><Text></Text></View>
                //       }

                //     </LinearGradient>
                //     <View style={styles.rightText}>
                //       <Text style={styles.cardTxt}>
                //         Notice Board
                //       </Text>
                //       <View style={styles.smallDetails}>
                //         <Text style={styles.textSmall}>Check Notice Board</Text>
                //       </View>
                //     </View>
                //   </TouchableOpacity>
                // } */}

                {/* Grievance */}
                {/* {
                  tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'Grievance' &&
                  <TouchableOpacity style={styles.cardFull} onPress={() => { closeMenu(); navigation.navigate('StudentGrievance') }}>
                    <LinearGradient
                      colors={[colors.uniRed, colors.uniBlue]}
                      style={[styles.iconOuter]}
                    >
                      <FontAwesome5 name='shield-alt' size={20} color={'white'} />
                    </LinearGradient>
                    <View style={styles.rightText}>
                      <Text style={styles.cardTxt}>
                        Grievance
                      </Text>
                      <View style={styles.smallDetails}>
                        <Text style={styles.textSmall}>Check the Grievance</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                } */}

                {/* Apply Certificates */}

                {/* {
                  tabsData?.[3]?.['IsVisible'] == 1 && tabsData?.[3]?.ElementName === 'ApplyCertificates' &&
                  <TouchableOpacity style={styles.cardFull} onPress={() => { closeMenu(); navigation.navigate('ApplyForDocuments') }}>
                    <LinearGradient
                      colors={[colors.uniRed, colors.uniBlue]}
                      style={[styles.iconOuter]}
                    >
                      <Entypo name='documents' size={20} color={'white'} />
                    </LinearGradient>
                    <View style={styles.rightText}>
                      <Text style={styles.cardTxt}>
                        Apply Documents
                      </Text>
                      <View style={styles.smallDetails}>
                        <Text style={styles.textSmall}>Transcript, Character Certificate, DMC etc.</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                } */}

                {/* My Certificates */}

                {/* {
                  tabsData?.[4]?.['IsVisible'] == 1 && tabsData?.[4]?.ElementName === 'MyCertificates' &&
                  <TouchableOpacity style={styles.cardFull} onPress={() => { closeMenu(); navigation.navigate('MyCertificates') }}>
                    <LinearGradient
                      colors={[colors.uniRed, colors.uniBlue]}
                      style={[styles.iconOuter]}
                    >
                      <MaterialCommunityIcons name='certificate' size={20} color={'white'} />
                    </LinearGradient>
                    <View style={styles.rightText}>
                      <Text style={styles.cardTxt}>My Certificates</Text>
                      <View style={styles.smallDetails}>
                        <Text style={styles.textSmall}>Check or Upload Certificates</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                } */}


                {
                  // showElectricityTab &&
                  // <View>
                  //   {
                  //     tabsData?.[5]?.['IsVisible'] == 1 && tabsData?.[5]?.ElementName === 'ElectrityBill' &&
                  //     <TouchableOpacity style={styles.cardFull} onPress={() => { closeMenu(); navigation.navigate('StudentElectricityBill') }}>
                  //       <LinearGradient
                  //         colors={[colors.uniRed, colors.uniBlue]}
                  //         style={[styles.iconOuter]}
                  //       >
                  //         <MaterialCommunityIcons name='lightbulb-on-outline' size={24} color={'white'} />
                  //       </LinearGradient>
                  //       <View style={styles.rightText}>
                  //         <Text style={styles.cardTxt}>
                  //           Electricity Bill ({electricityData["article_no"]})
                  //         </Text>
                  //         <View style={styles.smallDetails}>
                  //           <Text style={styles.textSmall}>Current Bill is : ₹ {Number(electricityData['amount'].split(' ')[0]).toFixed(2)} {electricityData['amount'].split(' ')[1]} {electricityData['amount'].split(' ')[2]}</Text>
                  //         </View>
                  //       </View>
                  //     </TouchableOpacity>
                  //   }
                  //   {
                  //     tabsData?.[6]?.['IsVisible'] == 1 && tabsData?.[6]?.ElementName === 'SudentLeave' &&
                  //     <TouchableOpacity style={styles.cardFull} onPress={() => { closeMenu(); navigation.navigate('StudentLeaves') }}>
                  //       <LinearGradient
                  //         colors={[colors.uniRed, colors.uniBlue]}
                  //         style={[styles.iconOuter]}
                  //       >
                  //         {/* <MaterialCommunityIcons name='certificate' size={20} color={'white'} /> */}
                  //         <FontAwesome6Icon name='user-plus' color={'white'} size={18} />
                  //       </LinearGradient>
                  //       <View style={styles.rightText}>
                  //         <Text style={styles.cardTxt}>Apply Leave</Text>
                  //         <View style={styles.smallDetails}>
                  //           <Text style={styles.textSmall}>Apply Leave for Hostel Students</Text>
                  //         </View>
                  //       </View>
                  //     </TouchableOpacity>
                  //   }
                  // </View>
                }

                {
                  // tabsData?.[7]?.['IsVisible'] == 1 && tabsData?.[7]?.ElementName === 'AllMessages' &&
                  // <TouchableOpacity style={styles.cardFull} onPress={() => { closeMenu(); navigation.navigate('MessagesRoot') }}>
                  //   <LinearGradient
                  //     colors={[colors.uniRed, colors.uniBlue]}
                  //     style={[styles.iconOuter]}
                  //   >
                  //     {/* <MaterialCommunityIcons name="message-badge" color="#000" size={24} /> */}
                  //     <MaterialCommunityIcons name='message-badge' size={24} color={'white'} />
                  //   </LinearGradient>
                  //   <View style={styles.rightText}>
                  //     <Text style={styles.cardTxt}>Messages</Text>
                  //     <View style={styles.smallDetails}>
                  //       <Text style={styles.textSmall}>Messages from Faculity</Text>
                  //     </View>
                  //   </View>
                  // </TouchableOpacity>
                }

              </View>
            }
          </View>
        </View>
        {/* the plus button for more student options */}
        <PlusButton />
      </ScrollView>
    </Pressable>
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

  // CSS of red dot over the bell icon
  notificationDot: {
    height: 12,
    width: 12,
    backgroundColor: 'red',
    position: 'absolute',
    left: 25,
    top: -5,
    borderRadius: 10
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 14
  },
  text: {
    color: '#f1f1f1',
  },
  iconOuter: {
    // backgroundColor: colors.uniBlue,
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
})