import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Dimensions, Platform, Pressable } from 'react-native'
import React, { useCallback, useContext, useRef, useState } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Main from './Main'
import { StudentContext } from '../../context/StudentContext';
import FeatherIcon from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFocusedRouteNameFromRoute, useFocusEffect, useNavigation } from '@react-navigation/native'
import colors from '../../colors'
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage'
import { IMAGE_URL, BASE_URL } from '@env'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

// const Drawer = createDrawerNavigator()
const Drawer = createDrawerNavigator();
const screenWidth = Dimensions.get('window').width

const StudentDashboard = () => {
  const { studentIDNo, setIsLoggedin, setUserType, studentImage, mobileToken, data } = useContext(StudentContext)
  console.log("profile Data ", data);
  
  const navigation = useNavigation()
  const ImageUrl = `${IMAGE_URL}Images/Students/`;
  const [menuVisible, setMenuVisible] = useState(false);
  const [pendingNotification, setPendingNotifications] = useState('')


  ////////////////////// Animation style start ///////////////////////
  const translateX = useSharedValue(-screenWidth * 0.75);
  const overlayOpacity = useSharedValue(0);

  const openMenu = () => {
    setMenuVisible(true);
    translateX.value = withTiming(0, { duration: 280 });
    overlayOpacity.value = withTiming(1, { duration: 280 });
  };

  const closeMenu = () => {
    translateX.value = withTiming(-screenWidth * 0.75, { duration: 220 });
    overlayOpacity.value = withTiming(0, { duration: 220 });

    setTimeout(() => setMenuVisible(false), 220);
  };

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  ////////////////////// Animation style end ///////////////////////

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

  const removeSession = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    if (!session) return;
    console.log("removeSessionremoveSession::");


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

  const menuOptions = [
    { path: 'Account', title: 'Profile' },
    { path: 'ApplyIdCard', title: 'ID/Smart Card' },
    { path: 'ChangePassword', title: 'Change Password' },
    { path: 'BusPassDetails', title: 'Bus Pass'},
    { path: 'FeePayment', title: 'Pay Fees'},
  ]

  const getMenuIcon = (title) => {
  switch (title) {
    case 'Profile':
      return <FeatherIcon name="user" size={18} color="#333" />;
    case 'ID/Smart Card':
      return <FeatherIcon name="credit-card" size={18} color="#333" />;
    case 'Change Password':
      return <FeatherIcon name="lock" size={18} color="#333" />;
    case 'Bus Pass':
      return <Ionicons name="bus-outline" size={18} color="#000" />
    case 'Pay Fees':
      return <Ionicons name="cash-outline" size={18} color="#000" />
    default:
      return <FeatherIcon name="circle" size={18} color="#333" />;
  }
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const formatName = (name) => {
  return name
    ?.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

  const menuOptionSelect = (nav) => {
    navigation.navigate(nav)
    closeMenu()
  }

  function getHeaderTitle(routeName) {
    switch (routeName) {
      case 'Home': return 'Dashboard';
      case 'Fees': return 'Fees';
      case 'Examination': return 'Examination';
      case 'Academics': return 'Academics';
      default: return 'Dashboard';
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: true,
          swipeEnabled: false,
          headerLeft: () => (
            <TouchableOpacity>
              {/* <PaperProvider> */}
              <View
                style={
                  Platform.OS === 'android' && {
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }
                }
              >
                <Button onPress={() => openMenu()}>
                  <FeatherIcon
                    name= 'menu'
                    size={24}
                    color="black"
                  />
                </Button>
              </View>
              {/* </PaperProvider> */}
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              <TouchableOpacity onPress={() => { closeMenu(); navigation.navigate('StudentNotification') }}>
                <FeatherIcon name="bell" size={24} color="black" style={{ marginRight: 15 }} />
                {pendingNotification > 0 && (
                  <View style={{ position: 'absolute', top: -5, right: 10, backgroundColor: '#a62535', borderRadius: 10, width: 15, height: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 8 }}>{pendingNotification}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Account');
                }}
              >
                {studentImage == '' || studentImage == null ? (
                  <Image
                    source={require('../../images/UserProfile.png')}
                    style={{ width: 24, height: 24, borderRadius: 12, marginRight: 10 }}
                  />
                ) : (
                  <Image
                    source={{ uri: ImageUrl + studentImage }}
                    style={{ width: 24, height: 24, borderRadius: 12, marginRight: 10 }}
                  />
                )}
              </TouchableOpacity>
            </View>
          ),
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={Main}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
            return {
              headerTitle: getHeaderTitle(routeName),
            };
          }}
        />
      </Drawer.Navigator>

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

          {/* 🔥 Sliding Sidebar */}
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
                elevation: 12,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 12,
              },
              drawerStyle,
            ]}
          >

            {/* 🔥 Header */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#111' }}>
                {formatName(data.data[0]['StudentName'])}
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                {data.data[0]['ClassRollNo']}
              </Text>
            </View>

            {/* 🔥 Menu Items */}
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

                {/* Icon */}
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

                {/* Text */}
                <Text style={{ fontSize: 15, color: '#222', fontWeight: '500' }}>
                  {item.title}
                </Text>

              </TouchableOpacity>
            ))}

            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: '#eee',
                marginVertical: 12,
              }}
            />

            {/* 🔥 Logout */}
            <TouchableOpacity
              onPress={removeSession}
              style={{
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
  );
}

export default StudentDashboard

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})