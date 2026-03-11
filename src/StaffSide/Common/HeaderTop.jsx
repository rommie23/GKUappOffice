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

const screenWidth = Dimensions.get('window').width;

const HeaderTop = ({ navigation }) => {
  const { StaffIDNo, setStaffIDNo, setIsLoggedin, setUserType, staffImage, imageStatus, mobileToken } = useContext(StudentContext)
  const [pendingNotification, setPendingNotifications] = useState('')
  const [menuVisible, setMenuVisible] = useState(false);
  const ImageUrl = `${IMAGE_URL}Images/Staff/`;
  const Drawer = createDrawerNavigator();

  let menuOptions;
  if (Platform.OS == 'android') {
    menuOptions = [
      { path: 'StaffProfile', title: 'Profile' },
      { path: 'ApplyLeaveForm', title: 'Apply Leave' },
      { path: 'MovementRequest', title: 'Apply Movement' },
      { path: 'Calendar', title: 'Attendance' },
      { path: 'ChangePassword', title: 'Change Password' },
    ]
  }else{
    menuOptions = [
      { path: 'MovementRequest', title: 'Apply Movement' },
      { path: 'Calendar', title: 'Attendance' },
      { path: 'ChangePassword', title: 'Change Password' },
    ]
  }

  const menuOptionSelect = (nav) => {
    closeMenu()
    navigation.navigate(nav)
  }

  const closeMenu = () => {
    setMenuVisible(false);
  };

  //   const removeSession = async () => {
  //   const session = await EncryptedStorage.getItem("user_session")
  //   if (session != null) {
  //   if (Platform.OS == "android") {
  //       try {
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
  //         // console.log("response::",response);
          
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
  //       }else{
  //         await EncryptedStorage.removeItem('user_session')
  //         setIsLoggedin(false)
  //       }
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
            headerLeft: () => (
              <TouchableOpacity>
                {/* <PaperProvider> */}
                <View
                  style={
                    Platform.OS === 'android' && {
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }
                  }>
                  <Button onPress={() => setMenuVisible(!menuVisible)}><FeatherIcon name={menuVisible ? 'x' : 'menu'} size={24} color="black" /></Button>
                  {/* <Menu
                    contentStyle={{ backgroundColor: 'white' }}
                    style={{ width: screenWidth / 2 }}
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                    <Button onPress={() => setMenuVisible(!menuVisible)}><FeatherIcon name={menuVisible ? 'x' : 'menu'} size={24} color="black" /></Button>
                    }> */}
                  {/* <Menu.Item onPress={() => menuOptionSelect('StaffProfile')} titleStyle={{ color: "black" }} title="Profile" />
                    <Divider />
                    {/* <Menu.Item onPress={() => menuOptionSelect('ApplyLeaveForm')} titleStyle={{color:"black"}} title="Apply Leave" />
                <Divider /> */}
                  {/* <Divider />
                    <Menu.Item onPress={() => menuOptionSelect('MovementRequest')} titleStyle={{ color: "black" }} title="Apply Movement" />
                    <Divider />
                    <Menu.Item onPress={() => menuOptionSelect('Calendar')} titleStyle={{ color: "black" }} title="Attendance" /> */}
                  {/* <Divider />
                    <Menu.Item onPress={() => menuOptionSelect('ChangePassword')} titleStyle={{ color: "black" }} title="Change Password" />
                    <Divider /> */}
                  {/* <Menu.Item onPress={() => removeSession()} title="Logout" titleStyle={{ color: 'red', fontWeight: '600' }} />  */}
                  {/* </Menu> */}
                </View>
                {/* </PaperProvider> */}
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
    </AlertNotificationRoot>
  );
};

export default HeaderTop;
