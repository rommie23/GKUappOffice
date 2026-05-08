import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Image, View, TouchableOpacity, Text, Dimensions, Modal, Pressable, Platform } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainFile from './MainFile';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntIcon from 'react-native-vector-icons/AntDesign'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { images } from '../../images';
import { StudentContext } from '../../context/StudentContext';
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { IMAGE_URL, BASE_URL } from '@env';
import { getFocusedRouteNameFromRoute, useFocusEffect } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

const HeaderTop = ({ navigation }) => {
  const { StaffIDNo, setStaffIDNo, setIsLoggedin, setUserType, staffImage, imageStatus, mobileToken, data } = useContext(StudentContext)
  // console.log(data.data);
  
  const [pendingNotification, setPendingNotifications] = useState('')
  const [menuVisible, setMenuVisible] = useState(false);
  const ImageUrl = `${IMAGE_URL}Images/Staff/`;
  const Drawer = createDrawerNavigator();




  // ///////////////// Animation setup /////////////////
  const translateX = useSharedValue(-screenWidth * 0.8);
  const overlayOpacity = useSharedValue(0);

  const openMenu = () => {
    setMenuVisible(true);
    translateX.value = withTiming(0, { duration: 300 });
    overlayOpacity.value = withTiming(1, { duration: 300 });
  };

  const closeMenu = () => {
    translateX.value = withTiming(-screenWidth * 0.8, { duration: 250 });
    overlayOpacity.value = withTiming(0, { duration: 250 });

    setTimeout(() => setMenuVisible(false), 250); // wait for animation
  };

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));


  ///////////////// Animation Setup end ////////////

  let menuOptions;
  if (Platform.OS == 'android') {
    menuOptions = [
      { path: 'StaffProfile', title: 'Profile' },
      { path: 'ApplyLeaveForm', title: 'Apply Leave' },
      { path: 'MovementRequest', title: 'Apply Movement' },
      { path: 'Calendar', title: 'Attendance' },
      { path: 'ChangePassword', title: 'Change Password' },
    ]
  } else {
    menuOptions = [
      { path: 'ApplyLeaveForm', title: 'Apply Leave' },
      { path: 'MovementRequest', title: 'Apply Movement' },
      { path: 'Calendar', title: 'Attendance' },
      { path: 'ChangePassword', title: 'Change Password' },
    ]
  }

  const getMenuIcon = (title) => {
    switch (title) {
      case 'Profile':
        return <FeatherIcon name="user" size={18} color="#333" />;
      case 'Apply Leave':
        return <FeatherIcon name="edit" size={18} color="#333" />;
      case 'Apply Movement':
        return <FeatherIcon name="map-pin" size={18} color="#333" />;
      case 'Attendance':
        return <FeatherIcon name="calendar" size={18} color="#333" />;
      case 'Change Password':
        return <FeatherIcon name="lock" size={18} color="#333" />;
      default:
        return <FeatherIcon name="circle" size={18} color="#333" />;
    }
  };

  const menuOptionSelect = (nav) => {
    closeMenu()
    navigation.navigate(nav)
  }

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



  const pendingNotificationCount = async () => {
    const session = await EncryptedStorage.getItem("user_session")

    if (session != null) {
      try {
        const pendingNotifications = await fetch(BASE_URL + '/notifiaction/pendingNotifications', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
          }
        })
        const response = await pendingNotifications.json();
        setPendingNotifications(response["PNotification"])
        console.log("pendingNotifications", response);
      } catch (error) {
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong`)
        console.log(error);
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      pendingNotificationCount();
    }, [])
  )

  function getHeaderTitle(routeName) {
    switch (routeName) {
      case 'Home': return 'Dashboard';
      case 'Leave': return 'Leave';
      case 'Movement': return 'Movement';
      case 'Profile': return 'Profile';
      default: return 'Dashboard';
    }
  }


  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }
  return (
    <AlertNotificationRoot>
      <View style={{ flex: 1 }}>
        <Drawer.Navigator
          screenOptions={{
            headerShown: true,
            swipeEnabled: false,
            headerLeft: () => (
              <TouchableOpacity>
                <View
                  style={
                    Platform.OS === 'android' && {
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }
                  }>
                  <Button onPress={openMenu}>
                    <FeatherIcon name="menu" size={24} />
                  </Button>
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', marginRight: 10 }}>

                <TouchableOpacity onPress={() => { closeMenu(); navigation.navigate('StaffNotification') }}>
                  <FeatherIcon name="bell" size={24} color="black" style={{ marginRight: 15 }} />
                  {pendingNotification > 0 && (
                    <View style={{ position: 'absolute', top: -5, right: 10, backgroundColor: '#a62535', borderRadius: 10, width: 15, height: 15, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: 'white', fontSize: 8 }}>{pendingNotification}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { closeMenu(); navigation.push('StaffProfile') }}>
                  {
                    imageStatus == 2 ?
                      <Image
                        source={images.profileReject}
                        style={{ width: 24, height: 24, borderRadius: 12, marginRight: 10 }}
                      /> : imageStatus == 0 ?
                        <Image
                          source={{ uri: ImageUrl + staffImage }}
                          style={{ width: 24, height: 24, borderRadius: 12, marginRight: 10 }}
                        /> :
                        <View>
                          <Image
                            source={{ uri: ImageUrl + staffImage }}
                            style={{ width: 24, height: 24, borderRadius: 12, marginRight: 10 }}
                          />
                          <IonIcon name='checkmark-circle' size={12} color='#1338BE' style={{ position: 'absolute', right: 5, bottom: -5 }} />
                        </View>
                  }
                </TouchableOpacity>
              </View>
            ),
          }}
        >
          <Drawer.Screen name="Dashboard" component={MainFile} options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
            return {
              headerTitle: getHeaderTitle(routeName)
            }
          }
          } />

        </Drawer.Navigator>
        {/* Overlay to detect outside press */}
        {menuVisible && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >

            {/* 🔥 Overlay */}
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                },
                overlayStyle,
              ]}
            >
              <Pressable style={{ flex: 1 }} onPress={closeMenu} />
            </Animated.View>

            {/* 🔥 Sliding Drawer */}
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: screenWidth * 0.75,
                  backgroundColor: '#fff',
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                  paddingTop: Platform.OS === 'ios' ? 60 : 40,
                  paddingHorizontal: 16,
                  elevation: 10,
                },
                drawerStyle,
              ]}
            >

              {/* Header */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>
                  {data.data[0]['Name']} ({StaffIDNo})
                </Text>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  {data.data[0]['CollegeName']}
                </Text>
              </View>

              {/* Menu */}
              {menuOptions.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    closeMenu();
                    setTimeout(() => menuOptionSelect(item.path), 200);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    marginBottom: 6,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: '#f1f5f9',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    {getMenuIcon(item.title)}
                  </View>

                  <Text style={{ fontSize: 15, fontWeight: '500' }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Logout */}
              <TouchableOpacity
                onPress={removeSession}
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: '#fff1f2',
                }}
              >
                <FeatherIcon name="log-out" size={18} color="#ef4444" />
                <Text style={{ marginLeft: 10, color: '#ef4444', fontWeight: '600' }}>
                  Logout
                </Text>
              </TouchableOpacity>

            </Animated.View>
          </View>
        )}
      </View>
    </AlertNotificationRoot>
  );
};

export default HeaderTop;
