import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image, RefreshControl, Dimensions,
  Pressable,
  Platform
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL,IMAGE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { StudentContext } from '../context/StudentContext';
import Spinner from 'react-native-loading-spinner-overlay';
// import StaffEditProfile from './Screens/StaffEditProfile';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { images } from '../images'
import IonIcon from 'react-native-vector-icons/Ionicons'

import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

export default function StaffProfile() {
  const { setData, setIsLoggedin, StaffIDNo, setStaffIDNo, staffImage, setStaffImage, closeMenu, setImageStatus, mobileToken } = useContext(StudentContext);

  const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState(false);
  const [getStaffDetails, setStaffDetails] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [tabsData, setTabsData] = useState([])
  const ImageUrl = `${IMAGE_URL}Images/Staff/`;
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStaffProfile();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const getStaffProfile = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    try {
      setIsLoading(true)
      const staffDetails = await fetch(BASE_URL + '/Staff/profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`
        }
      })
      const staffDetailsData = await staffDetails.json()
      setStaffDetails(staffDetailsData['data'][0]);
      setData(staffDetailsData);
      // console.log(staffDetailsData['data'][0]['Imagepath']);
      setStaffIDNo(staffDetailsData['data'][0]['IDNo']);
      setStaffImage(staffDetailsData['data'][0]['Imagepath'])
      setImageStatus(staffDetailsData['data'][0]['ImageStatus'])

      setIsLoading(false)
    }
    catch (error) {
      console.log(StaffIDNo);
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getStaffProfile();
    checkTabs();
  }, [])

  //   const removeSession = async () => {
  //   const session = await EncryptedStorage.getItem("user_session")
  //   if (session != null) {
  //     if (Platform.OS == "android") {
  //       try {
  //         await EncryptedStorage.removeItem('user_session') //remove those two when notifications configured
  //           setIsLoggedin(false)
  //         const offNotification = await fetch(BASE_URL + '/notifiaction/logoutNotification', {
  //           method: 'POST',
  //           headers: {
  //             Authorization: `Bearer ${session}`,
  //             "Content-Type" : 'application/json'
  //           },
  //           body: JSON.stringify({
  //             deviceToken : mobileToken
  //           })
  //         })
  //         const response = await offNotification.json()
  //         console.log("response::",response);
          
  //         if (response.flag == 1) {
  //           console.log('logout success');
  //           await EncryptedStorage.removeItem('user_session')
  //           setIsLoggedin(false)
  //         } else {
  //           console.log("Logout Failed");
  //           submitModel(ALERT_TYPE.DANGER,"Network Error", `${response['message']}`)
  //         }
  //       } catch (error) {
  //         submitModel(ALERT_TYPE.DANGER,"Oops!!!", `Something went wrong.`)
  //         console.log(error);
  //       }
  //     }else{
  //       console.log('logout success IOS');
  //       await EncryptedStorage.removeItem('user_session')
  //       setIsLoggedin(false)
  //     }
  //   }
  // }

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
        await EncryptedStorage.removeItem('user_session');
        setIsLoggedin(false);
        setUserType('');
  
      } catch (error) {
        console.log(error);
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong.");
      }
    };

  const checkTabs = async () => {
    setIsLoading(true)
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
            pageName: 'Profile_fc'
          })
        })
        const pageTabsData = await tabsData.json()
        setTabsData(pageTabsData)
        console.log(pageTabsData);

        setIsLoading(false)
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }
  }

  console.log(ImageUrl + staffImage);
  

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: setIsLoading(false)
    })
  }
  return (
    <AlertNotificationRoot>
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
        style={{ backgroundColor: 'white' }}>
        <Pressable onPress={closeMenu}>
          {isLoading &&
            <Spinner
              visible={isLoading}
            // textContent='loading...'
            />
          }
          <View style={styles.container}>
            <ScrollView>
              <View style={styles.profile} >
                <TouchableOpacity onPress={() => { navigation.navigate('StaffProfileEdit') }}>
                  {
                    getStaffDetails['ImageStatus'] == 2 ?
                      <Image
                        alt=""
                        source={images.profileReject}
                        style={styles.profileAvatar} />
                      : getStaffDetails['ImageStatus'] == 0 ?
                        <Image
                          alt=""
                          source={{
                            uri: ImageUrl + staffImage
                          }}
                          style={styles.profileAvatar} /> :
                        <View>
                          <Image
                            alt=""
                            source={{
                              uri: ImageUrl + staffImage
                            }}
                            style={styles.profileAvatar} />

                          <IonIcon name='checkmark-circle' size={24} color='#1338BE' style={{ position: 'absolute', right: -10, bottom: -5 }} />
                        </View>
                  }
                </TouchableOpacity>
                <Text style={styles.profileName}>{getStaffDetails['Name']}</Text>

                <Text style={styles.profileEmail}>{getStaffDetails['Designation']}</Text>
                <Text style={styles.profileEmail}>{getStaffDetails['Department']}</Text>

              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic  Details</Text>
                <View style={styles.sectionBody}>
                  <View style={styles.rowSpacer} />
                  <View style={styles.rowWrapper}>
                    <View
                      style={styles.row}>
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={styles.rowIcon}
                      >
                        <FeatherIcon
                          color="#fff"
                          name="user"
                          size={20} />
                      </LinearGradient>
                      <Text style={styles.rowLabel}>{getStaffDetails['IDNo']}</Text>
                      <View style={styles.rowSpacer} />
                    </View>
                  </View>
                  <View style={styles.rowWrapper}>
                    <View
                      style={styles.row}>
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={styles.rowIcon}
                      >
                        <MaterialCommunityIcons
                          color="#fff"
                          name="face-man"
                          size={20} />
                      </LinearGradient>
                      <Text style={styles.rowLabel}>{getStaffDetails['FatherName']}</Text>
                      <View style={styles.rowSpacer} />
                    </View>
                  </View>
                  <View style={styles.rowWrapper}>
                    <View
                      style={styles.row}>
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={styles.rowIcon}
                      >
                        <MaterialCommunityIcons
                          color="#fff"
                          name="face-woman"
                          size={20} />
                      </LinearGradient>
                      <Text style={styles.rowLabel}>{getStaffDetails['MotherName']}</Text>
                      <View style={styles.rowSpacer} />
                    </View>
                  </View>

                  <View style={styles.rowWrapper}>
                    <View style={styles.row}>
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={styles.rowIcon}
                      >
                        <FeatherIcon
                          color="#fff"
                          name="phone"
                          size={20} />
                      </LinearGradient>
                      <Text style={styles.rowLabel}>{getStaffDetails['MobileNo']}</Text>
                    </View>
                  </View>

                  <View style={styles.rowWrapper}>
                    <View
                      style={styles.row}>
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={styles.rowIcon}
                      >
                        <FeatherIcon
                          color="#fff"
                          name="at-sign"
                          size={20} />
                      </LinearGradient>
                      <Text style={styles.rowLabel}>{getStaffDetails['EmailID']}</Text>
                      <View style={styles.rowSpacer} />
                    </View>
                  </View>
                  
                  <View style={styles.rowWrapper}>
                    <View
                      style={styles.row}>
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={styles.rowIcon}
                      >
                        <FeatherIcon
                          color="#fff"
                          name="at-sign"
                          size={20} />
                      </LinearGradient>
                      <Text style={styles.rowLabel}>{getStaffDetails?.['OfficialEmailID']}</Text>
                      <View style={styles.rowSpacer} />
                    </View>
                  </View>

                  <View style={styles.rowWrapper}>
                    <View
                      style={styles.row}>
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={styles.rowIcon}
                      >
                        <MaterialIcons
                          color="#fff"
                          name="child-care"
                          size={20} />
                      </LinearGradient>
                      <Text style={styles.rowLabel}>{formatDate(getStaffDetails['DateOfBirth'])}</Text>
                      <View style={styles.rowSpacer} />
                    </View>
                  </View>
                  <View style={styles.rowWrapper}>
                    <View
                      style={styles.row}>
                      <LinearGradient
                        colors={[colors.uniRed, colors.uniBlue]}
                        style={styles.rowIcon}
                      >
                        {/* {
                          getStaffDetails['Gender'] == 'Male' ? 
                          <MaterialIcons
                            color="#fff"
                            name="male"
                            size={20} /> :
                            <MaterialIcons
                            color="#fff"
                            name="female"
                            size={20} />
                        } */}
                        <MaterialCommunityIcons
                          color="#fff"
                          name="google"
                          size={20} />
                      </LinearGradient>
                      <Text style={styles.rowLabel}>{getStaffDetails['Gender']}</Text>
                      <View style={styles.rowSpacer} />
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Address</Text>
                  {/* ----------------------------------------------------------- */}
                  <View style={styles.sectionBody}>
                    <View style={[styles.rowWrapper, styles.rowFirst]}>
                      <View style={[styles.row]}>
                        <LinearGradient
                          colors={[colors.uniRed, colors.uniBlue]}
                          style={styles.rowIcon}
                        >
                          <MaterialIcons
                            color="#fff"
                            name="location-pin"
                            size={20} />
                        </LinearGradient>
                        <Text style={styles.rowLabel}>{getStaffDetails['PermanentAddress']}</Text>
                        <View style={styles.rowSpacer} />
                      </View>
                    </View>
                  </View>
                  {/* ------------------------------------------------------------- */}


                </View>
              </View>
              <View style={styles.bottomBtn}>
                {
                  tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.TabName === 'EditProfile' &&
                <TouchableOpacity style={[styles.btn, { backgroundColor: colors.uniBlue }]} onPress={() => { navigation.navigate('StaffProfileEdit') }}>
                  <Text style={styles.btnTxt}>Edit Profile</Text>
                </TouchableOpacity>
                }
                
                <TouchableOpacity style={[styles.btn, { backgroundColor: colors.uniRed }]} onPress={() => { removeSession() }}>
                  <Text style={styles.btnTxt}>Logout</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

        </Pressable>
      </ScrollView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Profile */
  profile: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#090909',
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '400',
    color: '#848484',
  },
  /** Section */
  section: {
    paddingTop: 12,
  },
  sectionTitle: {
    marginVertical: 8,
    marginHorizontal: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#a7a7a7',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionBody: {
    paddingLeft: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16,
    minHeight: 50,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    fontWeight: '500',
    color: '#000',
    width: screenWidth,
    paddingRight: 100,
    fontSize: 16,
    // height:'100%',

  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  bottomBtn: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btnTxt: {
    color: '#f1f1f1',
    fontWeight: '600',
    fontSize: 16

  },
  btn: {
    marginVertical: 16,
    width: screenWidth / 3,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ff6961',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});