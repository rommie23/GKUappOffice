import React, { useEffect, useCallback, useState, useContext } from 'react';
import { RefreshControl, Dimensions, ScrollView, StyleSheet, Pressable, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Card, IconButton, Provider as PaperProvider, Menu } from 'react-native-paper';
import { BASE_URL, IMAGE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { FlatList } from 'react-native-gesture-handler';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const YourComponent = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingLeavesData, setPendingLeavesData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ImageUrl = `${IMAGE_URL}/Images/Staff/`;

  const onRefresh = React.useCallback(() => {
    getPendingLeaves();
  }, []);
  const getPendingLeaves = async () => {
    setIsLoading(true);
    const session = await EncryptedStorage.getItem("user_session");
    if (isLoading || !hasMore) return;
    try {
      const PendingDetails = await fetch(BASE_URL + '/Staff/supervisorApprovedLeaves?page=' + page, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json'
        }
      });
      const staffPendingDetails = await PendingDetails.json();
      // console.log('Fetched Supervisor pending leaves:', staffPendingDetails);
      if (staffPendingDetails.length < 10) setHasMore(false);
      setPendingLeavesData(prev => [...prev, ...staffPendingDetails])
      setPage(prev => prev + 1)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching Supervisor approved leaves:', error);
      submitModel(ALERT_TYPE.DANGER, 'Try Again', 'Network Error')
    }
  };
  // useEffect(() => {
  //   getPendingLeaves();
  // }, []);

    useFocusEffect(
      useCallback(() => {
        getPendingLeaves()
      }, [])
    )

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: setIsLoading(false)
    })

  }
  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ padding: 16 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };
  return (
    <AlertNotificationRoot>
      <View>
        {
          pendingLeavesData.length > 0 ?
            <FlatList
              data={pendingLeavesData}
              keyExtractor={(item, index) => index}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={[styles.bottomCardTop, { flex: 7, justifyContent: 'flex-start' }]}>
                      <Image source={{ uri: ImageUrl + item["Imagepath"] }} style={{ height: 35, width: 35, borderRadius: 20 }} alt="profile" />
                      <View>
                        <Text style={styles.textStyle}>Name : {item["StaffName"].trim()}</Text>
                        <Text style={styles.textStyle}>Emp. ID : {item["StaffId"]}</Text>
                        <Text style={[styles.textStyle]}>Designation :{item["Designation"]?.length > 20
                          ? item["Designation"].slice(0, 20) + "..."
                          : item["Designation"]}</Text>
                      </View>
                    </View>
                    <View style={[styles.bottomCardTop, { flex: 3 }]}>
                      <FontAwesome5Icon
                        name={
                          item['Status'] == "Pending to Authority" ? "clock"
                            : item['Status'] == "Pending to VC" ? "clock"
                              : item['Status'] == "Approved" ? "check"
                                : null

                        } size={24} color={
                          item['Status'] == 'Pending to Authority' ? '#eed202'
                            : item['Status'] == 'Pending to VC' ? '#eed202'
                              : item['Status'] == 'Approved' ? 'green'
                                : colors.uniBlue} />
                      <Text style={[styles.textStyle, {
                        fontWeight: '600', color: item['Status'] == 'Pending to Authority' ? '#eed202'
                          : item['Status'] == 'Pending to VC' ? '#eed202'
                            : item['Status'] == "Approved" ? "green"
                              : colors.uniBlue
                      }]}>

                        {item['Status'] == 'Pending to Authority' ? 'Pending'
                          : item['Status'] == 'Pending to VC' ? 'Pending to VC'
                            : item['Status'] == 'Approved' ? 'Approved'
                              : null}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.topCard}>

                    <View style={{ width: '30%' }}>
                      <Text style={[styles.textSmall]}>Start Date</Text>
                      <Text style={[styles.textStyle, styles.rowMiddle]}>{item['StartDate'].split("T")[0].split("-").reverse().join("-")}</Text>
                    </View>
                    <View style={{ width: '30%' }}>
                      <Text style={[styles.textSmall]}>End Date</Text>
                      <Text style={styles.textStyle}>{item['EndDate'].split("T")[0].split("-").reverse().join("-")}</Text>
                    </View>
                    <View style={{ width: '35%' }}>
                      <Text style={[styles.textSmall]}>Leave Type</Text>
                      <Text style={styles.textStyle}>{item['LeaveTypeName']}</Text>
                    </View>

                  </View>
                  <View style={styles.transaction}>
                    <View style={{ width: '60%' }} >
                      <Text style={styles.textSmall}>Apply Date Time</Text>
                      <Text style={[styles.textStyle]}>{item["ApplyDate"] ? `${item["ApplyDate"].split('T')[0].split('-').reverse().join("-")} ${item["ApplyDate"].substr(11, 5)}` : 'N/A'}</Text>
                    </View>
                    <View style={{ width: '35%' }}>
                      <Text style={[styles.textSmall]}>Duration</Text>
                      <Text style={[styles.textStyle]}>{`${item["LeaveDurationsTime"] > 0 ? item["LeaveDurationsTime"] : item["LeaveDuration"]}`}</Text>
                    </View>
                  </View>
                  <View style={[styles.transaction, { marginTop: 4 }]}>
                    <View >
                      <Text style={styles.textSmall}>Reason</Text>
                      <Text style={[styles.textStyle]}>{item['LeaveReason']}</Text>
                    </View>
                  </View>
                </View>
              )}
              onEndReached={getPendingLeaves}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooter}
            /> :
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'black', alignSelf: 'center' }}>No Record Found</Text>
        }
      </View>

    </AlertNotificationRoot>
  );
};

const SupervisorLeavesAccepted = () => {
  return (
    <PaperProvider >
      <YourComponent />
    </PaperProvider>
  );
};
export default SupervisorLeavesAccepted;

const styles = StyleSheet.create({
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
    fontSize: 12
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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

  //////////////// CSS of madal ////////////////
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: 'black',
    elevation: 2,
    alignItems: 'center',
    width: '80%',
    paddingTop: 48
  },
  modalBtn: {
    backgroundColor: colors.uniBlue,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8
  },
})
