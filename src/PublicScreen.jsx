
import { View, Text, Image, StyleSheet, TouchableHighlight, setIsLoggedin, Dimensions, ImageBackground, Alert, ScrollView, Modal, TouchableOpacity, BackHandler, ActivityIndicator } from 'react-native'
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
import Carousel from 'react-native-reanimated-carousel';
import Orientation from 'react-native-orientation-locker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import LinearGradient from 'react-native-linear-gradient';
import Footer from './Footer';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const PublicScreen = ({ navigation }) => {
  const { setUserType, setIsLoggedin, setData, setStudentIDNo, userType } = useContext(StudentContext);
  const [isloading, setIsLoading] = useState(false)
  const [hasInternet, setHasInternet] = useState(true);
  const [carousalPhotos, setCarousalPhotos] = useState(
    [
      'https://www.gku.ac.in/public/uploads/pages/9CnZSWY06hQIP1uacRQyHng0IGBnQz0OgoFmAiJq.webp',
      'https://www.gku.ac.in/public/uploads/pages/8N9RbzTzD2LzyFIvx26wyex7oMkAaxVdEX8Japnp.webp',
      'https://www.gku.ac.in/public/uploads/pages/oIF8sT7cNRseYvL6pgWk2kg9tUp06LYkwsj7A5cp.webp',
      'https://www.gku.ac.in/public/uploads/pages/DLjmY0EfL7Qs9FC3eFrfGVYC1JoABDFMuWrboEdy.webp',
      'https://www.gku.ac.in/public/uploads/pages/y4HArFQLOLwYwQ74KDGS7yRsncg2WoyH9rdw7giU.webp',
    ])
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
        console.log('Error fetching myusertype APi :PublicScreen:', error)
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

      </View>
      :
      <ScrollView style={{ flex: 1, backgroundColor:'#fff' }}>
        {isloading && <ActivityIndicator />}

        <View>
          {/* <View style={{}}>
            <Image style={styles.joinLogo} source={images.topLogo} />
          </View> */}

          {/* <Image style={styles.logoImage} source={images.logo} /> */}
          {/* <View style={styles.carousalOuter}>
            <Carousel
              loop
              width={screenWidth - 64}
              height={screenHeight / 5 - 30}
              pagingEnabled
              autoPlay={true}
              data={carousalPhotos}
              scrollAnimationDuration={1000}
              style={{ elevation: 1, borderRadius: 8 }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width: '100%', height: '100%', borderRadius: 10 }}
                  resizeMode="cover"
                />
              )}
            />

          </View> */}

          {/* Banner Image */}
          <Image
            source={{ uri: 'https://www.gku.ac.in/public/uploads/pages/9CnZSWY06hQIP1uacRQyHng0IGBnQz0OgoFmAiJq.webp' }}
            style={styles.banner}
          />



          <View style={styles.cardContainer}>
            {/* Photo Grid */}
            <Image style={styles.joinLogo} source={images.topLogo} />
            <Image source={{ uri: 'https://www.gku.ac.in/public/uploads/editors/gku-dv382gZJ.png' }} style={styles.smallPhoto} />

            {/* Row 1 */}
            <View style={styles.row}>
              <TouchableOpacity
                style={[{ backgroundColor: 'transparent', alignContent: 'center' }]}
                onPress={() => navigation.navigate('AboutUniversity')}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ padding: 8, borderWidth: 1.5, borderRadius: 36, borderColor: colors.uniBlue }}>
                    <FontAwesome name="university" color={colors.uniBlue} size={20} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.uniBlue }}>‎  About  ‎ </Text>
                </View>

              </TouchableOpacity>

              <TouchableOpacity
                style={[{ backgroundColor: 'transparent', alignContent: 'center' }]}
                onPress={() => navigation.navigate('Admissions')}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ padding: 6, borderWidth: 1.5, borderRadius: 36, borderColor: colors.uniBlue }}>
                    <MaterialIcons name="motion-photos-auto" color={colors.uniBlue} size={24} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.uniBlue }}>Join-Us</Text>
                </View>

              </TouchableOpacity>

              <TouchableOpacity
                style={[{ backgroundColor: 'transparent', alignContent: 'center' }]}
                onPress={() => navigation.navigate('LifeAtGKU')}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ padding: 8, borderWidth: 1.5, borderRadius: 36, borderColor: colors.uniBlue }}>
                    <MaterialIcons name="diversity-2" color={colors.uniBlue} size={20} />

                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.uniBlue }}>Life@GKU</Text>
                </View>

              </TouchableOpacity>

            </View>

            {/* Row 2 */}
            <View style={[styles.row]}>
              <TouchableOpacity
                style={[{ backgroundColor: 'transparent', alignContent: 'center' }]}
                onPress={() => navigation.navigate('Contact')}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ padding: 8, borderWidth: 1.5, borderRadius: 36, borderColor: colors.uniBlue }}>
                    <MaterialIcons name="local-phone" color={colors.uniBlue} size={20} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.uniBlue }}>Contact</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[{ backgroundColor: 'transparent', alignContent: 'center' }]}
                onPress={() => navigation.navigate('Streams')}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ padding: 6, borderWidth: 1.5, borderRadius: 36, borderColor: colors.uniBlue }}>
                    <MaterialIcons name="stream" color={colors.uniBlue} size={24} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.uniBlue }}> Streams</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[{ backgroundColor: 'transparent', alignContent: 'center' }]}
                onPress={() => navigation.navigate('Why-Choose-GKU')}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ padding: 8, borderWidth: 1.5, borderRadius: 36, borderColor: colors.uniBlue }}>
                    <MaterialIcons name="question-mark" color={colors.uniBlue} size={20} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.uniBlue }}>Why GKU</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Big Full-Width Login Button */}
            {/* <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.selectionbtnFull,
                {
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderRadius: 36,
                  borderColor: colors.uniBlue,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 4,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  width: "66%",
                },
              ]}
              onPress={() => navigation.navigate('Category')}
            >
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
                >
                  Login
                </Text>
              </View>
            </TouchableOpacity> */}



            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.selectionbtnFull,
                {
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderRadius: 36,
                  borderColor: colors.uniBlue,
                  paddingVertical: 14,
                  elevation: 4,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  paddingHorizontal:36,
                  marginBottom:16
                },
              ]}
              onPress={() => navigation.navigate('Category')}
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
                >
                  Login
                </Text>
                <AntDesign name="login" color="#000" size={24} />

              </View>
            </TouchableOpacity>

            <Footer />

          </View>





          {/* <Text onPress={() => removeSession()}>Logout</Text> */}
          {/* <Image style={styles.naacLogoStyle} source={images.naacLogo} /> */}

        </View>
      </ScrollView>
  )
}

export default PublicScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  carousalOuter: {
    margin: 16,
    alignItems: 'center'
  },
  naacLogoStyle: {
    // opacity:0.8,
    height: 70,
    width: 140,
    marginTop: screenHeight / 25,
    marginBottom: screenHeight / 30,
    alignSelf: 'center',
  },
  joinLogo: {
    height: 43,
    width: screenWidth - 100,
    marginTop: 12,
    marginBottom: 12,
    alignSelf: 'center',
  },
  logoImage: {
    marginTop: screenHeight / 7,
    height: 150,
    width: screenWidth / 3,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: screenWidth / 1.2,
    alignSelf: 'center',
    marginVertical: 10,
  },
  selectionbtnFull: {
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectionbtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
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
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 20,
    // elevation: 6,
    flexGrow: 1,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
  },
  smallPhoto: {
    width: screenWidth-100,
    alignSelf:'center',
    height: 130,
    borderRadius: 12,
    marginBottom:20
  },
}
)