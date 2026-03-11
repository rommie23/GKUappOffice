import * as React from 'react';
import { RefreshControl, Dimensions, ScrollView, StyleSheet, Pressable, Text, View } from 'react-native';
import { Card, IconButton, Provider as PaperProvider, Menu } from 'react-native-paper';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot} from 'react-native-alert-notification';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const YourComponent = () => {
  const [openMenuIndex, setOpenMenuIndex] = React.useState(-1);
  const openMenu = (index) => {
    setOpenMenuIndex(index);
  };
  const closeMenu = () => {
    setOpenMenuIndex(-1);
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const [getLeaveID, setLeaveID] = React.useState(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [getPendingLeavesData, setPendingLeaves] = React.useState([]);
  const [getLeaveDurationCount, setLeaveDurationCount] = React.useState([]);
  const [getScheduleTime, setScheduleTime] = React.useState([]);
  const onRefresh = React.useCallback(() => {
    getPendingLeaves();
  }, []);
  const getPendingLeaves = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    try {
      setIsLoading(true);
      const PendingDetails = await fetch(BASE_URL + '/Staff/pendingleave', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`
        }
      });
      const staffPendingDetails = await PendingDetails.json();
      // console.log('Fetched pending leaves:', staffPendingDetails);
  
      const data1 = staffPendingDetails['data1'];
      if (data1 && data1.length > 0) {
        const firstPendingLeave = data1[0];
        setPendingLeaves(data1);
  
        if (firstPendingLeave['DurationTime'] != 0) {
          setLeaveDurationCount(firstPendingLeave['DurationTime']);
        } else {
          setLeaveDurationCount(firstPendingLeave['Duration']);
        }
  
        if (firstPendingLeave['LeaveSchoduleTime'] === '1') {
          setScheduleTime('First half');
        } else if (firstPendingLeave['LeaveSchoduleTime'] === '2') {
          setScheduleTime('Second half');
        } else {
          setScheduleTime('');
        }
      } else {
        // console.warn('No pending leaves found.');
        setPendingLeaves([]);
        setLeaveDurationCount(0);
        setScheduleTime('');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteLeave = async (leaveID) => {
    // console.log(leaveID);
    const session = await EncryptedStorage.getItem("user_session");
    try {
      setIsLoading(true);
      const leaveDeleteResponse = await fetch(`${BASE_URL}/staff/leavedel/${leaveID}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leaveid: leaveID
        }),
      });
      const leaveDeleteResponseJson = await leaveDeleteResponse.json();
    //  console.log(leaveDeleteResponseJson)
      setIsLoading(false);
      submitModel(ALERT_TYPE.SUCCESS,"Success", "Leave Deleted Successfully")
      getPendingLeaves([]);
    }

    catch (error) {
      console.error('Error deleting leave:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  React.useEffect(() => {
    getPendingLeaves();
  }, []);

  const submitModel = (type, title, message)=> {
    Dialog.show({
        type: type ,
        title: title,
        textBody: message,
        button: 'close',
        onHide: setIsLoading(false)
        })
        
}
  return (
    <AlertNotificationRoot>
    <View>
      {isLoading && <Spinner visible={isLoading} />}
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {(getPendingLeavesData.length === 0) ? (
          <Text style={styles.norecordText}>No records found</Text>
        ) : (
          getPendingLeavesData.map((item, i) => (
            <View key={i}>
              <Card style={styles.leavecard} onPress={() => {
                setLeaveID(item.LeaveID);
                navigation.navigate('ViewLeave', { leaveID: item.LeaveID });
              }}>
                <Card.Title
                  title={`${item['LeaveTypeName']} (${item["DurationTime"] > 0 ? item["DurationTime"] : item["Duration"]})`}
                  subtitle={formatDate(item['SubmitDate'])}
                  left=""
                  right={(props) => (
                    <>
                      <Menu
                        visible={openMenuIndex === i}
                        onDismiss={closeMenu}
                        anchor={<IconButton icon="dots-vertical" onPress={() => openMenu(i)} />}
                        contentStyle={{ marginTop: -60 }}
                      >
                        {/* <Menu.Item onPress={() => {}} title="Option 1" />
          <Menu.Item onPress={() => {}} title="Option 2" /> */}
                        <Menu.Item onPress={() => {
                          setLeaveID(item.LeaveID);
                          deleteLeave(item.LeaveID);
                        }} title="Delete" style={{color:'#000'}} />
                      </Menu>
                    </>
                  )}
                  titleStyle={{ color: '#223260', fontSize: 15, fontWeight: '800' }}
                  subtitleStyle={{ color: 'black', fontSize: 13, fontWeight: '800' }}
                />
              </Card>

            </View>
          ))
        )}
      </ScrollView>
    </View>
    </AlertNotificationRoot>
  );
};

const ApplyLeaveForm = () => {
  return (
    <PaperProvider >
      <YourComponent />
    </PaperProvider>
  );
};
export default ApplyLeaveForm;

const styles = StyleSheet.create({
  leavecard: {
    paddingVertical: 5,
    paddingHorizontal: 0,
    marginVertical: 1,
    elevation: 0,
    backgroundColor: 'white',
    borderRadius: 3
  },
  norecordText: {
    color: 'black',
    alignSelf: 'center',
    marginTop: 20
  }
});
