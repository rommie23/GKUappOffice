import { View, Text, Image, StyleSheet, TouchableHighlight, setIsLoggedin, Dimensions, ImageBackground, Alert, ScrollView, Modal, TouchableOpacity, BackHandler, ActivityIndicator, Platform } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { images } from './images';
import EncryptedStorage from 'react-native-encrypted-storage';
import { StudentContext } from './context/StudentContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { BASE_URL } from '@env';
import NetInfo from '@react-native-community/netinfo'
import { useFocusEffect } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather'
import colors from './colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation-locker';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Footer from './Footer';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const Category = ({ navigation }) => {
  const { setUserType, setIsLoggedin, setData, setStudentIDNo, userType } = useContext(StudentContext);
  const [isloading, setIsLoading] = useState(false)
  const [hasInternet, setHasInternet] = useState(true);
  useFocusEffect(
    useCallback(() => {
      const netInfoSubscription = NetInfo.addEventListener((state) => {
        setHasInternet(state.isConnected);
      });
      return () => {
        netInfoSubscription();
      };
    }, [])
  );
  console.log("BASE_URL :: ", BASE_URL);


  const getUserType = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    setIsLoading(true)
    console.log(session);
    if (session != null) {
      try {
        const userTypeData = await fetch(`${BASE_URL}/staff/status`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const myUserTypeData = await userTypeData.json()
        setUserType(myUserTypeData['data'][0]['LoginType'])
        // console.log(myUserTypeData['data'][0]['LoginType']);
        setIsLoggedin(true)
        setIsLoading(false)
        // console.log('data in state variable',userTypeData['data'][0]['LoginType'])
      } catch (error) {
        console.log('Error fetching myusertype APi :category:', error)
        newModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went worng!");
        // setShowModal(true)
        setIsLoading(false)
      }
    }
    setIsLoading(false)
  }
  console.log(isloading);

  useEffect(() => {
    getUserType()
    // removeSession()
  }, [hasInternet])

  const newModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }

  const removeSession = async () => {
    try {
      await EncryptedStorage.removeItem('user_session')
      // navigation.navigate('Login')
      setIsLoggedin(false)
    } catch (error) {
      console.log('Error in sessionDestroy StudentHome:', error);
    }
  }

  useEffect(() => {
    // Lock to portrait on component mount
    Orientation.lockToPortrait();

    // Cleanup: Unlock orientation on component unmount
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    !hasInternet ?
      <View style={{ flex: 1, alignItems: 'center', rowGap: 16 }}>
        <View>
          <Text style={{ color: '#223260', fontWeight: '600', fontSize: 25, marginBottom: 10, marginTop: screenHeight / 15, alignSelf: 'center' }}>Welcome to</Text>
          <Text style={{ color: '#223260', fontWeight: '600', fontSize: 25, alignSelf: 'center' }}>Guru Kashi University</Text>
        </View>
        <Image style={styles.logoImage} source={images.logo} />
        <Feather
          name={'wifi-off'}
          size={40}
          color={colors.uniRed}
          style={styles.icon}
        />
        <Text style={{ color: colors.uniRed, fontSize: 16 }}>Please check your internet</Text>
        {/* <Image style={styles.naacLogoStyle} source={images.naacLogo} /> */}

      </View>
      :
      <ScrollView style={{backgroundColor:'#fff'}}>
        {isloading && <ActivityIndicator />}
        <View>
          {/* Banner Image */}
          <Image
            source={{ uri: 'https://www.gku.ac.in/public/uploads/pages/9CnZSWY06hQIP1uacRQyHng0IGBnQz0OgoFmAiJq.webp' }}
            style={styles.banner}
          />
          <View style={styles.cardContainer}>
            {
              Platform.OS == 'ios' &&
              <TouchableOpacity style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', columnGap: 8, marginLeft: 8 }} onPress={() => navigation.goBack()}>
                <FontAwesome name='angle-left' size={24} color={`blue`} />
                <Text style={{ color: 'blue', fontSize: 16 }}>Back</Text>
              </TouchableOpacity>
            }
            <Text style={{ color: '#223260', fontWeight: '600', fontSize: 25, alignSelf: 'center' }}>Welcome to</Text>
            <Text style={{ color: '#223260', fontWeight: '600', fontSize: 25, alignSelf: 'center', marginBottom: 12 }}>Guru Kashi University</Text>
            <Image source={{ uri: 'https://www.gku.ac.in/public/uploads/editors/gku-dv382gZJ.png' }} style={styles.smallPhoto} />

            <View style={{flexDirection:'row', width:screenWidth-100, alignSelf:'center', justifyContent:'space-between', marginVertical:'16'}}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  {
                    backgroundColor: '#fff',          // clean white like cards
                    borderWidth: 2,
                    borderRadius: 36,
                    borderColor: colors.uniBlue,
                    paddingVertical: 14,
                    elevation: 4,
                    // shadowColor: '#000',
                    // shadowOpacity: 0.08,
                    // shadowRadius: 8,
                    // shadowOffset: { width: 0, height: 4 },
                    paddingHorizontal: 24,
                    marginBottom: 16,
                  },
                ]}
                onPress={() => navigation.navigate('StaffLogin')}
              >
                {/* Optional icon inside button */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >

                  <Text
                    style={[
                      styles.selectionbtnText,
                      {
                        color: '#223260',
                        fontSize: 15,
                        fontWeight: '600',
                        letterSpacing: 0.5,
                      },
                    ]}
                  >Employee</Text>
                  <AntDesign name="login" color="#000" size={24} />

                </View>
              </TouchableOpacity>


              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  {
                    backgroundColor: '#fff',          // clean white like cards
                    borderWidth: 2,
                    borderRadius: 36,
                    borderColor: colors.uniBlue,
                    paddingVertical: 14,
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                    paddingHorizontal: 24,
                    marginBottom: 16,
                  },
                ]}
                onPress={() => navigation.navigate('Login')}
              >
                {/* Optional icon inside button */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >

                  <Text
                    style={[
                      styles.selectionbtnText,
                      {
                        color: '#223260',
                        fontSize: 15,
                        fontWeight: '600',
                        letterSpacing: 0.5,
                      },
                    ]}
                  >Student</Text>
                  <AntDesign name="login" color="#000" size={24} />

                </View>
              </TouchableOpacity>
            </View>
            <Footer />
          </View>
          {/* <Text onPress={() => removeSession()}>Logout</Text> */}
        </View>
      </ScrollView>
  )
}

export default Category

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  naacLogoStyle: {
    // opacity:0.8,
    height: 70,
    width: 140,
    marginTop: screenHeight / 25,
    marginBottom: screenHeight / 30,
    alignSelf: 'center',
  },
  logoImage: {
    // opacity:0.8,
    height: 200,
    width: screenWidth / 2,
    marginTop: screenHeight / 25,
    marginBottom: screenHeight / 30,
    alignSelf: 'center',
  },
  selectionbtn: {
    backgroundColor: "#223260",
    activeOpacity: 0.6,
    underlayColor: "#DDDDDD",
    paddingHorizontal: 48,
    paddingVertical: 16,
    marginVertical: 10,
    width: screenWidth / 1.4,
    alignSelf: 'center',
    borderRadius: 15
  },
  selectionbtnText: {
    color: 'white',
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: '500'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  banner: {
    width: '100%',
    height: screenWidth * 0.60,
    resizeMode: 'cover',
  },
  cardContainer: {
    backgroundColor: '#fff',
    marginTop: -30,
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  joinLogo: {
    height: 43,
    width: screenWidth - 100,
    marginTop: 12,
    marginBottom: 12,
    alignSelf: 'center',
  },
  smallPhoto: {
    width: screenWidth - 100,
    alignSelf: 'center',
    height: 130,
    borderRadius: 12,
    marginBottom: 20
  },
}
)