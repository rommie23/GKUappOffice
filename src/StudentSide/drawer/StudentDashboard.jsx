import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Dimensions, Platform, Pressable } from 'react-native'
import React, { useCallback, useContext, useRef, useState } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Main from './Main'
import { StudentContext } from '../../context/StudentContext';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { getFocusedRouteNameFromRoute, useFocusEffect, useNavigation } from '@react-navigation/native'
import colors from '../../colors'
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage'
import { IMAGE_URL, BASE_URL } from '@env'

// const Drawer = createDrawerNavigator()
const Drawer = createDrawerNavigator();
const screenWidth = Dimensions.get('window').width

const StudentDashboard = () => {
  const { studentIDNo, setIsLoggedin, setUserType, studentImage, mobileToken } = useContext(StudentContext)
  const navigation = useNavigation()
  const ImageUrl = `${IMAGE_URL}Images/Students/`;
  const [menuVisible, setMenuVisible] = useState(false);
  const [pendingNotification, setPendingNotifications] = useState('')

  // const removeSession = async () => {
  //   try {
  //     await EncryptedStorage.removeItem('user_session')
  //     await EncryptedStorage.removeItem('clickTime')
  //     // navigation.navigate('Login')
  //     setIsLoggedin(false)
  //     setUserType('')
  //   } catch (error) {
  //     console.log('Error in sessionDestroy StudentHome:', error);
  //   }
  // }

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
  // const removeSession = async () => {

  //   const session = await EncryptedStorage.getItem("user_session")
  //   if (session != null) {
  //     if (Platform.OS == "android") {
  //       try {
  //         const offNotification = await fetch(BASE_URL + '/notifiaction/logoutNotification', {
  //           method: 'POST',
  //           headers: {
  //             Authorization: `Bearer ${session}`,
  //             "Content-Type": 'application/json'
  //           },
  //           body: JSON.stringify({
  //             deviceToken: mobileToken
  //           })
  //         })
  //         console.log("logout clicked in student side");
  //         const response = await offNotification.json()
  //         // console.log("response::",response);

  //         if (response.flag == 1) {
  //           console.log('logout success');
  //           await EncryptedStorage.removeItem('user_session')
  //           await EncryptedStorage.removeItem('clickTime')
  //           setIsLoggedin(false)
  //           setUserType('')
  //         } else {
  //           console.log("Logout Failed");
  //           submitModel(ALERT_TYPE.DANGER, "Network Error", `${response['message']}`)
  //         }
  //       } catch (error) {
  //         submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
  //         console.log(error);
  //       }
  //     }else{
  //       console.log('logout success ios');
  //       await EncryptedStorage.removeItem('user_session')
  //       await EncryptedStorage.removeItem('clickTime')
  //       setIsLoggedin(false)
  //       setUserType('')
  //     }
  //   }
  // }

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
    { path: 'ApplyBusPass', title: 'Bus Pass' },
    { path: 'ChangePassword', title: 'Change Password' },
  ]

  const menuOptionSelect = (nav) => {
    navigation.navigate(nav)
    closeMenu()
  }
  const closeMenu = () => {
    console.log('cls');
    setMenuVisible(false);
  };

  function getHeaderTitle(routeName) {
    switch (routeName) {
      case 'Home': return 'Dashboard';
      case 'Examination': return 'Examination';
      case 'Academics': return 'Academics';
      case 'Fees': return 'Fees';
      default: return 'Dashboard';
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: true,
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
                <Button onPress={() => setMenuVisible(!menuVisible)}>
                  <FeatherIcon
                    name={menuVisible ? 'x' : 'menu'}
                    size={24}
                    color="black"
                  />
                </Button>
                {/* <Menu
                  contentStyle={{ backgroundColor: 'white' }}
                  style={
                    Platform.OS === 'ios'
                      ? {
                          position: 'absolute',
                          top: 36,
                          right: 10,
                          width: screenWidth / 2,
                          // zIndex: 100,
                        }
                      : { width: screenWidth / 2, top: '50' }
                  }
                  visible={menuVisible}
                  // onDismiss={closeMenu}
                  dismissable={false}
                  anchorPosition="bottom"
                  anchor={
                    <Button onPress={()=>setMenuVisible(!menuVisible)}>
                      <FeatherIcon
                        name={menuVisible ? 'x' : 'menu'}
                        size={24}
                        color="black"
                      />
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={() => menuOptionSelect('Account')}
                    titleStyle={{ color: 'black' }}
                    title="Profile"
                  />
                  <Divider />
                  <Menu.Item
                    onPress={() => menuOptionSelect('Examination')}
                    titleStyle={{ color: 'black' }}
                    title="Examination"
                  />
                  <Divider />
                  <Menu.Item
                    onPress={() => menuOptionSelect('Academics')}
                    titleStyle={{ color: 'black' }}
                    title="Academics"
                  />
                  <Divider />
                  <Menu.Item
                    onPress={() => menuOptionSelect('ApplyIdCard')}
                    titleStyle={{ color: 'black' }}
                    title="ID/Smart Card"
                  />
                  <Divider />
                  <Menu.Item
                    onPress={() => menuOptionSelect('ApplyBusPass')}
                    titleStyle={{ color: 'black' }}
                    title="Bus Pass"
                  />
                  <Divider />
                  <Menu.Item
                    onPress={() => menuOptionSelect('ChangePassword')}
                    titleStyle={{ color: 'black' }}
                    title="Change Password"
                  />
                  <Divider />
                  <Menu.Item
                    onPress={() => removeSession()}
                    title="Logout"
                    titleStyle={{ color: 'red', fontWeight: '600' }}
                  />
                </Menu> */}

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

      {/* ✅ Overlay to detect outside press */}
      {menuVisible && (
        <Modal transparent animationType="fade" visible={menuVisible}>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0)',
            }}
            onPress={closeMenu}
          />
          <View
            style={{
              position: 'absolute',
              top: Platform.OS == 'ios' ? 100 : 50,
              left: 10,
              backgroundColor: 'white',
              borderRadius: 4,
              elevation: 5,
              width: screenWidth / 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            }}
          >
            {menuOptions.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => menuOptionSelect(item.path)}
                style={{ paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#C4C4C4', paddingLeft: 12 }}
              >
                <Text style={{ color: '	#3b444b', fontSize: 16 }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => removeSession()}
              style={{ paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#C4C4C4', paddingLeft: 12 }}
            >
              <Text style={{ color: 'red', fontSize: 16 }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
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