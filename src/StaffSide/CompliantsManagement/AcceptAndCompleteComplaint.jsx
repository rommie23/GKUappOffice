import { ActivityIndicator, Alert, Dimensions, FlatList, Linking, PermissionsAndroid, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BASE_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';
import { convertUTCToISTComplaintUse } from '../../services/dateUTCToIST'
import Geolocation from '@react-native-community/geolocation'
import EncryptedStorage from 'react-native-encrypted-storage';


const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const AcceptAndCompleteComplaint = () => {
  const { StaffIDNo } = useContext(StudentContext);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complainData, setComplainData] = useState([])
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigation = useNavigation();

  const complains = async (reset = false) => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (!session) return;
    try {
      const response = await axios.post(
        `${BASE_URL}/complain/complainsAssignedToEmployee`,
        {
          page: reset ? 1 : page,
          limit: 50
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          }
        }
      );
      const newRecords = Array.isArray(response.data) ? response.data : [];

      if (reset) {
        setComplainData(newRecords)
        setPage(2)
      } else {
        setComplainData(prev => {
          const merged = [...prev, ...newRecords];
          // console.log("merged::", merged);
          const seen = new Set();
          return merged.filter(item => {
            if (seen.has(item.id)) {
              return false;
            }

            seen.add(item.id);
            return true;
          });
        });
        setPage(prev => prev + 1)
      }
      setHasMore(newRecords.length > 0);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    complains()
  }, []))

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        console.log("requestLocationPermission");
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your location to provide GPS features.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Now check if location services are ON
          Geolocation.getCurrentPosition(
            () => true, // Success = location enabled
            (error) => {
              if (error.code === 2) {
                // Location provider disabled
                Alert.alert(
                  'Enable Location',
                  'Location is turned off. Please enable it.',
                );
              }
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
          );

          return true;
        } else {
          Alert.alert(
            'Permission Required',
            'Location access is required. Please enable it in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          return false;
        }
        // return granted === PermissionsAndroid.RESULTS.GRANTED;

      } catch (err) {
        setError('Permission error: ' + err.message);
        return false;
      }
    }
    return true;
  };

  // Function to get current location
  const getLocation = async (taskId, action) => {
    setLoading(true)
    console.log("getlocation called");

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('Location permission denied');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        buttonHandle(taskId, action, latitude, longitude)
        setError(null);
        setLoading(false)
      },
      (err) => {
        setError('Location error: ' + err.message);
        setLocation(null);
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  // const buttonHandle = async (assignId = 0, action = 0, latitude = 0, longitude = 0) => {
  //   console.log(assignId, action, latitude, longitude);

  //   setLoading(true)
  //   const session = await EncryptedStorage.getItem("user_session")
  //   if (!session) return;
  //   try {
  //     const response = await axios.post(`${BASE_URL}/complain/taskActions`, {
  //       assignId, action, latitude, longitude, StaffIDNo
  //     },
  //     {
  //       headers:{
  //         Authorization: `Bearer ${session}`,
  //         "Content-Type": "application/json",
  //       }
  //     }
  //   )
  //     const responseData = response.data;
  //     console.log(responseData);
  //     if (action == 1 && responseData.flag == 1) {
  //       newModel(ALERT_TYPE.SUCCESS, 'Task Accepted', 'Task accepted successfully.')
  //     } else if (action == 2 && responseData.flag == 1) {
  //       newModel(ALERT_TYPE.SUCCESS, 'Task Started', 'Task started successfully.')
  //     }else{
  //       newModel(ALERT_TYPE.DANGER, 'Task Update Failed', 'Please try again after sometime.')
  //     }
  //     await complains();
  //   } catch (error) {
  //     newModel(ALERT_TYPE.DANGER, 'Task Update Failed', 'Please try again after sometime.')
  //     console.log(error);
  //   } finally {
  //   setLoading(false);
  // }
  // }

  const buttonHandle = async (
    assignId = 0,
    action = 0,
    latitude = 0,
    longitude = 0
  ) => {
    setLoading(true);
    try {
      const session = await EncryptedStorage.getItem("user_session");
      if (!session) return;

      const response = await axios.post(
        `${BASE_URL}/complain/taskActions`,
        {
          assignId, action, latitude, longitude, StaffIDNo,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response.data;
      console.log(responseData);
      if (action == 1 && responseData.flag == 1) {
        newModel(ALERT_TYPE.SUCCESS, "Task Accepted", "Task accepted successfully.");
      } else if (action == 2 && responseData.flag == 1) {
        newModel(ALERT_TYPE.SUCCESS, "Task Started", "Task started successfully.");
      } else {
        newModel(ALERT_TYPE.DANGER, "Task Update Failed", "Please try again after sometime.");
      }

      await complains(true);
    } catch (error) {
      newModel(ALERT_TYPE.DANGER, "Task Update Failed", "Please try again after sometime.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmAndExecute = (taskId, action) => {
    Alert.alert(
      "Confirm Action",
      action == 1 ? "Are you sure you want to Accept Task ?" : "Are you sure you want to Start Task ?",
      [
        {
          text: "No",
          style: "cancel",
          onPress: () => {
            console.log("User cancelled");
          },
        },
        {
          text: "Yes",
          onPress: () => {
            buttonHandle(taskId, action)
            // getLocation(taskId, action);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const newModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }

  const onRefresh = useCallback(() => {
    complains();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  const ComplainCard = ({ item, navigation }) => {
    return (
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={styles.bottomCardTop}>
            <FontAwesome5 name='walking' size={24} color={colors.uniBlue} />
            <Text style={styles.textStyle}>Assignment No. {item['assignId']}</Text>
          </View>

        </View>
        <View style={styles.transaction}>
          <View style={{ width: '50%' }}>
            <Text style={[styles.textSmall]}>Complaint Date/Time</Text>
            <Text style={[styles.textStyle, styles.rowMiddle]}>{convertUTCToISTComplaintUse(item['CreatedDate'])}</Text>
          </View>
          <View style={{ width: '30%' }}>
            <Text style={[styles.textSmall]}>Category</Text>
            <Text style={styles.textStyle}>{item['CategoryName']}</Text>
          </View>
        </View>
        <View style={styles.transaction}>
          <View style={{ width: '100%' }}>
            <Text style={styles.textSmall}>Location</Text>
            <Text style={[styles.textStyle]}>{`Block ${item['BlockName']} Floor ${item['Floor']}, Room No. ${item['RoomNo']}`}</Text>
          </View>
        </View>
        <View style={styles.transaction}>
          <View style={{ width: '100%' }}>
            <Text style={styles.textSmall}>Title</Text>
            <Text style={[styles.textStyle]}>{item['title']}</Text>
          </View>
        </View>
        <View style={styles.transaction}>
          <View style={{ width: '100%' }}>
            <Text style={styles.textSmall}>Description</Text>
            <Text style={[styles.textStyle]}>{item["description"]}</Text>
          </View>
        </View>
        <View style={[styles.transaction, { flexDirection: 'column' }]}>
          {
            item['Status'] == 0 ? //pending
              <TouchableOpacity
                style={[{ backgroundColor: colors.uniBlue, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16, width: '50%' }]} onPress={() => buttonHandle(item['assignId'], 1)}>
                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Accept Task</Text>
              </TouchableOpacity> :
              item['Status'] == 1 ?  //accepted
                <View>
                  {/* {location && (
                                    <Text style={styles.text}>
                                        Latitude: {location.latitude}{"\n"}
                                        Longitude: {location.longitude}
                                    </Text>
                                )} */}
                  {error && <Text style={styles.error}>{error}</Text>}
                  <TouchableOpacity
                    style={[{ backgroundColor: colors.uniBlue, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16, width: '50%' }]} onPress={() => confirmAndExecute(item['assignId'], 2)}>

                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Start Task</Text>
                  </TouchableOpacity>
                </View>
                : item['Status'] == 2 ?  //in_progress
                  <View>
                    <TouchableOpacity
                      style={[{ backgroundColor: colors.uniBlue, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16, width: '50%' }]} onPress={() => navigation.navigate("CompleteTaskScreen", { complainId: item['assignId'] })}>
                      <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Complete Task</Text>
                    </TouchableOpacity>
                  </View> :
                  item['Status'] == 3 &&  //completed
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
                    <View style={{ width: '70%' }}>
                      <Text style={styles.textSmall}>Task Status</Text>
                      <Text style={[styles.textStyle, { color: 'green', fontWeight: '600', fontSize: 14 }]}>Completed</Text>
                    </View>
                    <View style={{ width: '30%' }}>
                      <Text style={styles.textSmall}>View Photo</Text>
                      <TouchableOpacity onPress={() => navigation.navigate('OpenImage', { imageURI: `TMSUploads/${item['Images']}` })}>
                        <FontAwesome5 name='eye' size={24} color={colors.uniBlue} />
                      </TouchableOpacity>
                    </View>
                  </View>
          }
        </View>
      </View>
    )
  }
  return (
    <AlertNotificationRoot>
      <View style={{ flex: 1 }}>
        {
          loading && complainData.length == 0 ?
            <ActivityIndicator style={{ flex: 1 }} /> :
            <FlatList
              data={complainData}
              renderItem={({ item }) => (
                <ComplainCard item={item} navigation={navigation} />
              )}
              keyExtractor={(item, index) => `${item.assignId}-${index}`}
              onEndReached={() => {
                if (hasMore && !loading) {
                  complains();
                }
              }}
              ListEmptyComponent={
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                  <Text>No complaints found</Text>
                </View>
              }
              ListFooterComponent={
                loading && complainData.length > 0 ? (
                  <ActivityIndicator style={{ marginVertical: 20 }} />
                ) : null
              }
            />
        }
      </View>
    </AlertNotificationRoot>
  )
}

export default AcceptAndCompleteComplaint

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: '#000',
    height: 38,
    backgroundColor: 'white'
  },
  // Common CSS for every card 
  card: {
    backgroundColor: 'white',
    width: screenWidth - 24,
    marginVertical: 12,
    borderRadius: 16,
    alignSelf: 'center',
    padding: 16,
    elevation: 2
  },

  // CSS for images inside the cards
  topCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems:'center',
    paddingVertical: 12
  },
  textStyle: {
    color: '#1b1b1b',
    fontSize: 12,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  bottomCardTop: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 10
  },
  inputBox: {
    height: 42,
    paddingHorizontal: 20,
    width: '100%',
    color: 'black'
  },
  loginInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#1b1b1b",
    borderWidth: 1,
    borderRadius: 8
  }
})