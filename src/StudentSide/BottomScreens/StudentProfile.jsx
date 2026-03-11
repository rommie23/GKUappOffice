import { View, Text, Image, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, Platform } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { StudentContext } from '../../context/StudentContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import colors from '../../colors';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import { launchImageLibrary } from 'react-native-image-picker'
import { BASE_URL, IMAGE_URL } from '@env';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

global.Buffer = global.Buffer || require('buffer').Buffer

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const StudentProfile = () => {
  const { data, setData, setIsLoggedin, studentIDNo, setStudentIDNo, setUserType, studentImage, setStudentImage, mobileToken } = useContext(StudentContext)
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [clubData, setClubData] = useState([])
  const navigation = useNavigation()
  const [tabsData, setTabsData] = useState([])
  const insets = useSafeAreaInsets();
  // Student photograph /////////////
  const ImageUrl = `${IMAGE_URL}Images/Students/`;
  // setStudentIDNo(data['data'][0]['IDNo'])

  // ////////////////////////// hit api to refresh data of profile //////////////////////// //

  const refreshProfile = async () => {
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
        // console.log(studentDetailsData)
        setData(studentDetailsData)
        setStudentIDNo(studentDetailsData['data'][0]['IDNo'])
        setStudentImage(studentDetailsData['data'][0]['Image'])

        setIsLoading(false)
        // console.log('sessoin at Amrik details',session);
      } catch (error) {
        console.log('Error fetching Guri data:Login:', error);
        setIsLoading(false)
      }
    }
  }
  useFocusEffect(useCallback(() => {
    refreshProfile()
    checkEntry()
  }, []))



  // ///////////////////////////// SEND Image to BackEnd ///////////////////////////// //
  // const sendFileToBackend = () => {
  //   const options = {
  //     mediaType: 'photo',
  //     includeBase64: false,
  //     maxHeight: screenHeight,
  //     maxWidth: screenWidth,
  //   };

  //   launchImageLibrary(options, handleResponse);

  //   const form = new FormData()
  //   form.append("files", {
  //     name: `Image-${studentIDNo}.jpg`,
  //     uri: selectedImageUri,
  //     type: 'image/jpg'
  //   })
  // }
  // const handleResponse = (response) => {
  //   if (response.didCancel) {
  //     console.log('User cancelled image picker');
  //   } else if (response.error) {
  //     console.log('Image picker error: ', response.error);
  //   } else {
  //     let imageUri = response.uri || response.assets?.[0]?.uri;
  //     setSelectedImageUri(imageUri);
  //     console.log(imageUri);
  //   }
  // }

  ////////////////////// Check the club entry ///////////////////

  const checkEntry = async () => {
    // setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session");
    try {
      if (session != null) {
        const res = await fetch(BASE_URL + '/Student/checkClubEntry', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            Accept: "application/json",
            'Content-Type': "application/json"
          }
        })
        const response = await res.json()
        if (response?.data && response.data.length > 0) {
          setClubData(response.data[0]);
        } else {
          setClubData(null);
        }
        console.log("clubEntry :::", response);
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  }


  //////////////// check the buttons to show or hide from backend response ////////////////

  const checkTabs = async () => {
    setIsLoading(true)
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
            pageName: 'Profile_st'
          })
        })
        const pageTabsData = await tabsData.json()
        setTabsData(pageTabsData)
        // console.log(pageTabsData);

        setIsLoading(false)
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    checkTabs();
  }, [])


  ////////////////////////// Make user logout of the app and set local storage to blank ////////////////
  const removeSession = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    if (!session) return;

    try {
      if (mobileToken) {
        const offNotification = await fetch(
          `${BASE_URL}/notifiaction/logoutNotification`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              deviceToken: mobileToken,
            }),
          }
        );

        const response = await offNotification.json();

        if (response.flag !== 1) {
          submitModel(
            ALERT_TYPE.DANGER,
            "Network Error",
            response.message
          );
          return;
        }
      } else {
        console.log("No device token (iOS simulator / permission denied)");
      }

      // ✅ ALWAYS logout locally
      await EncryptedStorage.removeItem('user_session');
      setIsLoggedin(false);
      setUserType('');

    } catch (error) {
      console.log(error);
      submitModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong.");
    }
  };


  // call the function again if the user drag and pull for refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshProfile();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ backgroundColor: '#f1f1f1' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* /////////// top of student details/////////////////// */}
        <View style={{ flex: 1, alignItems: 'center', height: 'contain', paddingVertical: 32, backgroundColor: 'white' }}>
          <View>
            <Image source={{
              uri: ImageUrl + studentImage
            }} style={{ height: 100, width: 100, borderRadius: 50 }} alt='No Image' />
            {/* <TouchableOpacity onPress={() => sendFileToBackend()}
            style={[{ backgroundColor: '#223260', height: 20, width: 20, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, bottom: 0 }]}>
            <FeatherIcon
              color="#fff"
              name="edit"
              size={16} />
          </TouchableOpacity> */}
          </View>

          <Text style={{ color: '#1d1d1d' }}>ID: {data['data'][0]['IDNo']}</Text>
          <Text style={{ fontSize: 18, color: '#1d1d1d', fontWeight: '600' }}>{data['data'][0]['StudentName']}</Text>
          <Text style={{ color: '#1d1d1d' }}>University Roll No: {data['data'][0]['UniRollNo']}</Text>
          <Text style={{ color: '#1d1d1d' }}>Class Roll No: {data['data'][0]['ClassRollNo']}</Text>
          {
            tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'UpdateProfile' &&
            <TouchableOpacity style={[styles.btn, { backgroundColor: colors.uniBlue }]} onPress={() => navigation.navigate('StudentProfileUpdate')}>
              <Text style={styles.btnTxt}>Update Profile</Text>
            </TouchableOpacity>
          }
        </View>

        <Text style={styles.headingsTxt}>Basic Details</Text>

        <View style={styles.downCont}>
          {/* //////////////////// details of student /////////////////// */}
          <View style={styles.downLeft}>
            <View style={styles.tab}>
              <LinearGradient
                colors={[colors.uniRed, colors.uniBlue]}
                style={styles.rowIcon}
              >
                <FeatherIcon
                  color="#fff"
                  name="layers"
                  size={20} />
              </LinearGradient>
              <Text style={styles.tabText}> {data['data'][0]['Batch']}</Text>
            </View>
            <View style={styles.tab}>
              <LinearGradient
                colors={[colors.uniRed, colors.uniBlue]}
                style={styles.rowIcon}
              >
                <FontAwesome5
                  color="#fff"
                  name="graduation-cap"
                  size={20} />
              </LinearGradient>
              <Text style={[styles.tabText]}>{data['data'][0]['Course']}</Text>
            </View>
            <View style={styles.tab}>
              <LinearGradient
                colors={[colors.uniRed, colors.uniBlue]}
                style={styles.rowIcon}
              >
                <FontAwesome5
                  color="#fff"
                  name="building"
                  size={20} />
              </LinearGradient>
              <Text style={styles.tabText}> {data['data'][0]['CollegeName']}</Text>
            </View>
            <View style={styles.tab}>
              <LinearGradient
                colors={[colors.uniRed, colors.uniBlue]}
                style={styles.rowIcon}
              >
                <FontAwesome5
                  color="#fff"
                  name="users"
                  size={20} />
              </LinearGradient>
              {
                clubData != null ?
                  <Text style={styles.tabText}> Club: {clubData['Name']}</Text> :
                  <Text style={[styles.tabText, { color: 'red' }]}>** Join a Club in Update Profile **</Text>
              }
            </View>
            <View style={styles.tab}>
              <LinearGradient
                colors={[colors.uniRed, colors.uniBlue]}
                style={styles.rowIcon}
              >
                <FontAwesome5
                  color="#fff"
                  name="mobile-alt"
                  size={20} />
              </LinearGradient>
              <Text style={styles.tabText}> {data['data'][0]['StudentMobileNo']}</Text>
            </View>

            <View style={styles.tab}>
              <LinearGradient
                colors={[colors.uniRed, colors.uniBlue]}
                style={styles.rowIcon}
              >
                <MaterialIcons
                  color="#fff"
                  name="alternate-email"
                  size={20} />
              </LinearGradient>
              <Text style={styles.tabText}> {data['data'][0]['EmailID']}</Text>
            </View>

            <View style={styles.tab}>
              <LinearGradient
                colors={[colors.uniRed, colors.uniBlue]}
                style={styles.rowIcon}
              >
                <MaterialCommunityIcons
                  color="#fff"
                  name="face-man"
                  size={20} />
              </LinearGradient>
              <Text style={styles.tabText}> {data['data'][0]['FatherName']}</Text>
            </View>
            <View style={styles.tab}>
              <LinearGradient
                colors={[colors.uniRed, colors.uniBlue]}
                style={styles.rowIcon}
              >
                <MaterialCommunityIcons
                  color="#fff"
                  name="face-woman"
                  size={20} />
              </LinearGradient>
              <Text style={styles.tabText}> {data['data'][0]['MotherName']}</Text>

            </View>
            <View style={styles.tab}>
              <LinearGradient
                colors={[colors.uniRed, colors.uniBlue]}
                style={styles.rowIcon}
              >
                <FeatherIcon
                  color="#fff"
                  name="flag"
                  size={20} />
              </LinearGradient>
              <Text style={styles.tabText}> {data['data'][0]['Nationality']}</Text>
            </View>
            <View style={styles.tab}>
              <LinearGradient
                colors={[colors.uniRed, colors.uniBlue]}
                style={styles.rowIcon}
              >
                <MaterialIcons
                  color="#fff"
                  name="location-pin"
                  size={20} />
              </LinearGradient>
              <Text style={styles.tabText}> {data['data'][0]['PermanentAddress']} </Text>
            </View>
            <View style={styles.bottomBtn}>
              {
                tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'DetailsCorrection' &&
                <TouchableOpacity style={[styles.btn, { backgroundColor: colors.uniBlue }]} onPress={() => navigation.navigate('StudentDetailsCorrection')}>
                  <Text style={styles.btnTxt}>Details Correction</Text>
                </TouchableOpacity>
              }
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.uniRed }]} onPress={() => { removeSession() }}>
                <Text style={styles.btnTxt}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  headingsTxt: {
    marginVertical: 12,
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: '600',
    paddingLeft: 24,
    color: '#1d1d1d'
  },
  downCont: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 16,
    backgroundColor: 'white',
    paddingBottom: 20
  },
  downLeft: {
    width: '100%',
    padding: 8,
  },
  tab: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tabText: {
    fontSize: 16,
    color: '#1b1b1b',
    fontWeight: '500',
    width: '90%'
  },

  btn: {
    marginVertical: 16,
    width: screenWidth / 2.3,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ff6961',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  btnTxt: {
    color: '#f1f1f1',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomBtn: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
})

export default StudentProfile