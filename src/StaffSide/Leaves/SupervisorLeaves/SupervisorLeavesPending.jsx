import React, { useState, useEffect, useCallback } from 'react';
import { RefreshControl, Dimensions, ScrollView, StyleSheet, Pressable, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Card, IconButton, Provider as PaperProvider, Menu } from 'react-native-paper';
import { BASE_URL, IMAGE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const YourComponent = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [getLeaveID, setLeaveID] = useState(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingLeavesData, setPendingLeavesData] = useState([]);
  const [getLeaveDurationCount, setLeaveDurationCount] = useState([]);
  const [getScheduleTime, setScheduleTime] = useState([]);
  const [VCId, setVCId] = useState('')

  const ImageUrl = `${IMAGE_URL}/Images/Staff/`;

  const getCurrentVC = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    try {
      setIsLoading(true);
      const currentvcData = await fetch(BASE_URL + '/Staff/currentVC', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json'
        }
      });
      const currentvcDataDetails = await currentvcData.json();
      console.log('Fetched VCID pending leaves::::::::::::', currentvcDataDetails);
      setVCId(currentvcDataDetails)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching Supervisor pending leaves:', error);
    }
  }

  const onRefresh = useCallback(() => {
    getPendingLeaves();
  }, []);
  const getPendingLeaves = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    try {
      setIsLoading(true);
      const PendingDetails = await fetch(BASE_URL + '/Staff/supervisorPendingLeaves', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json'
        }
      });
      const staffPendingDetails = await PendingDetails.json();
      console.log('Fetched Supervisor pending leaves::::::::::::', staffPendingDetails);
      setPendingLeavesData(staffPendingDetails)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching Supervisor pending leaves:', error);
    }
  };

  const forwardOrApproveButton = (leaveId, name, buttonType) => {
    navigation.navigate('EachLeaveForward', { leaveId, name, buttonType, VCId })

  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  useFocusEffect(
    useCallback(() => {
      getPendingLeaves()
      getCurrentVC()
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
  return (
    <AlertNotificationRoot>
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* each card which has data of movement */}
          {isLoading ? <ActivityIndicator />
            :
            // console.log(movements);
            pendingLeavesData.length > 0 ? pendingLeavesData.map((item, i) => (
              <View key={i} style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={[styles.bottomCardTop, {flex: 7, justifyContent:'flex-start' }]}>
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
                      name={item['Status'] == "Approved" ? "check" : "clock"

                      } size={24} color={
                        item['Status'] == 'Approved' ? 'green' : '#eed202'} />
                    <Text style={[styles.textStyle, {
                      fontWeight: '600', color: item['Status'] == "Approved" ? "green" : '#eed202'
                    }]}>

                      {`${item['Status']}`}
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
                  <View style={{ width: '30%' }} >
                    <Text style={styles.textSmall}>Apply Date Time</Text>
                    <Text style={[styles.textStyle]}>{item["ApplyDate"] ? `${item["ApplyDate"].split('T')[0].split('-').reverse().join("-")} ${item["ApplyDate"].substr(11, 5)}` : 'N/A'}</Text>
                  </View>
                  <View style={{ width: '35%' }}>
                    <Text style={[styles.textSmall]}>Duration</Text>
                    <Text style={[styles.textStyle]}>{`${item["LeaveDurationsTime"] > 0 ? item["LeaveDurationsTime"] : item["LeaveDuration"]}`}</Text>
                  </View>
                  {/* <View style={{width:'30%'}}>
                          <Text style={[styles.textSmall]}>Actual In Time</Text>
                          <Text style={[styles.textStyle]}>{`item["CheckIn"] ? item["CheckIn"].substr(11,5) : 'N/A'`}</Text>
                        </View>*/}
                </View>
                <View style={[styles.transaction, { marginTop: 4 }]}>
                  <View >
                    <Text style={styles.textSmall}>Reason</Text>
                    <Text style={[styles.textStyle]}>{item['LeaveReason']}</Text>
                  </View>
                </View>
                <View style={[styles.transaction, { borderTopWidth: 0.5, marginTop: 8, paddingTop: 8, justifyContent: "space-around" }]}>
                  {
                    item['SanctionId'] != item['AuthorityId'] && item['Status'] == "Pending to Sanction" ?
                      <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '90%' }}>
                        <TouchableOpacity style={{ paddingHorizontal: 24, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                          onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 1)}>
                          <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Forward to Authority</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 24, paddingVertical: 8, backgroundColor: colors.uniRed, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                          onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 3)}>
                          <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Reject Leave</Text>
                        </TouchableOpacity>
                      </View> :
                      item['SanctionId'] == item['AuthorityId'] ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                          {
                            item['AuthorityId'] != VCId && item['SanctionId'] != VCId && item['Status'] != 'Pending to VC' && item['LeaveDuration'] > 2 ?
                              <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                                onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 2)}>
                                <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Forward to VC</Text>
                              </TouchableOpacity>
                              :
                              <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                                onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 4)}>
                                <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Approve Leave</Text>
                              </TouchableOpacity>
                          }
                          <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.uniRed, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                            onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 3)}>
                            <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Reject Leave</Text>
                          </TouchableOpacity>
                        </View> :
                        item['SanctionId'] != item['AuthorityId'] && item['Status'] == "Pending to Authority" ?
                          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                            {
                              item['LeaveDuration'] > 2 ?
                                <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                                  onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 2)}>
                                  <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Forward to VC</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                                  onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 4)}>
                                  <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Approve Leave</Text>
                                </TouchableOpacity>

                            }
                            <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.uniRed, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                              onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 3)}>
                              <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Reject Leave</Text>
                            </TouchableOpacity>
                          </View> :
                          (item['SanctionId'] == VCId || item['AuthorityId'] == VCId) && (item['Status'] == 'Pending to VC' || item['Status'] == 'Pending to Sanction') ?
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                              <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                                onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 4)}>
                                <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Approve Leave</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.uniRed, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                                onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 3)}>
                                <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Reject Leave</Text>
                              </TouchableOpacity>
                            </View> : (item['SanctionId'] != VCId || item['AuthorityId'] != VCId) && (item['Status'] == 'Pending to VC') ? 
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                              <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.uniBlue, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                                onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 4)}>
                                <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Approve Leave</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.uniRed, alignItems: 'center', alignSelf: 'center', borderRadius: 6 }}
                                onPress={() => forwardOrApproveButton(item["Id"], item["StaffName"].trim(), 3)}>
                                <Text style={[styles.textStyle, { color: 'white', fontWeight: '600' }]}>Reject Leave</Text>
                              </TouchableOpacity>
                            </View> : null
                  }
                </View>

              </View>
            )
            ) : <Text style={{ fontSize: 14, fontWeight: '600', color: 'black', alignSelf: 'center' }}>No Record Found</Text>

          }
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  );
};

const SupervisorLeavesPending = () => {
  return (
    <PaperProvider >
      <YourComponent />
    </PaperProvider>
  );
};
export default SupervisorLeavesPending;

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
