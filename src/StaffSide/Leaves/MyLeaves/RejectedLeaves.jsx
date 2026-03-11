import * as React from 'react';
import { RefreshControl, Dimensions, ScrollView, StyleSheet, Pressable, Text, View } from 'react-native';
import { Card, IconButton, Provider as PaperProvider, Menu } from 'react-native-paper';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const YourComponent = () => {
  const [openMenuIndex, setOpenMenuIndex] = React.useState(-1);
  const openMenu = (index) => {
    setOpenMenuIndex(index);
  };
  const closeMenu = () => {
    setOpenMenuIndex(-1);
  };
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = React.useState(false);
  const [getRejectedLeavesData, setRejectedLeaves] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [getLeaveID, setLeaveID] = React.useState(null);
  const [getLeaveDurationCount, setLeaveDurationCount] = React.useState(null);
  const [getScheduleTime, setScheduleTime] = React.useState([]);
  const onRefresh = React.useCallback(() => {
    getRejectedLeaves();
  }, []);
  const getRejectedLeaves = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    try {
      setIsLoading(true)
      const rejectedDetails = await fetch(BASE_URL + '/Staff/rejectleave', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`
        }
      })
      const staffRejectedDetails = await rejectedDetails.json()
      setRejectedLeaves(staffRejectedDetails['Reject'] || []);
      // console.log(staffRejectedDetails);
      if(staffRejectedDetails['Reject'][0]['DurationTime']!=0)
        {
          setLeaveDurationCount(staffRejectedDetails['Reject'][0]['DurationTime']);
        }
        else{
          setLeaveDurationCount(staffRejectedDetails['Reject'][0]['Duration']);
        }
        if(staffRejectedDetails['Reject'][0]['LeaveSchoduleTime']=='1')
          {

            setScheduleTime('First half')
          }
          else if(staffRejectedDetails['Reject'][0]['LeaveSchoduleTime']=='2'){
            setScheduleTime('Second half')

          }
      setIsLoading(false)
    }
    catch (error) {
      // console.log('kk');
      setIsLoading(false)
    }
  }
  React.useEffect(() => {
    getRejectedLeaves();
  }, [])
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  return (
    <View>
      {isLoading && <Spinner visible={isLoading} />}
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {(getRejectedLeavesData.length === 0) ? (
          <Text style={styles.norecordText}>No records found</Text>
        ) : (
          getRejectedLeavesData.map((item, i) => (
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
                        contentStyle={{ marginTop: -55 }}
                      >
                        {/* <Menu.Item onPress={() => {}} title="Option 1" />
          <Menu.Item onPress={() => {}} title="Option 2" /> */}
                        <Menu.Item onPress={() => {
                          setLeaveID(item.LeaveID);
                          navigation.navigate('ViewLeave', { leaveID: item.LeaveID });
                        }} title="View" />
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

  )
}

const RejectedLeaves = () => {
  return (
    <PaperProvider >
      <YourComponent />
    </PaperProvider>
  );
};
export default RejectedLeaves
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