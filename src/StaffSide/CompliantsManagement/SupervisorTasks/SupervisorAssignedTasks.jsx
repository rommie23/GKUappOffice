import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { BASE_URL, LIMS_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import axios from 'axios';
import { convertUTCToISTComplaintUse } from '../../../services/dateUTCToIST'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StudentContext } from '../../../context/StudentContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import { FlatList } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get("window").width

const SupervisorPendingTask = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complainData, setComplainData] = useState([])
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigation = useNavigation()

  const assignedTasks = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    const session = await EncryptedStorage.getItem("user_session");
    if (!session) return;
    try {
      const response = await axios.post(`${BASE_URL}/complain/assignedTasksSupervisor`,
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
      )
      const newRecords = Array.isArray(response.data) ? response.data : [];
      // console.log("newRecords::", newRecords);
      if (reset) {
        setComplainData(newRecords)
        setPage(2)
      } else {
        setComplainData(prev => {
          const merged = [...prev, ...newRecords];
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
      // console.log("assignedTasksData::", assignedTasksData);
      setLoading(false)
    } catch (error) {
      console.log(error);
      newModel(ALERT_TYPE.DANGER, 'oops something went wrong !', 'Try after Sometime')
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    assignedTasks();
  }, []))

  const newModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: () => navigation.goBack()
    })
  }


  const onRefresh = useCallback(() => {
    setRefreshing(true)
    assignedTasks()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);



  const ComplainCard = ({ item, navigation }) => {
    return (
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={[styles.bottomCardTop, { width: '70%' }]}>
            <FontAwesome5 name='walking' size={24} color={colors.uniBlue} />
            <Text style={styles.textStyle}>Complain No. {item['id']}</Text>
          </View>
          <View style={[styles.bottomCardTop, { width: '30%' }]}>
            <Text style={styles.textStyle}>Assign No. {item['assignId']}</Text>
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
          <View style={{ width: '70%' }}>
            <Text style={styles.textSmall}>Location</Text>
            <Text style={[styles.textStyle]}>{`Block ${item['BlockName']} Floor ${item['Floor']}, Room No. ${item['RoomNo']}`}</Text>
          </View>
          <View style={{ width: '30%' }}>
            <Text style={[styles.textSmall]}>Status</Text>
            <Text style={[styles.textStyle, { color: item['Status'] == '1' ? 'green' : colors.uniBlue, fontWeight: '500' }]}>{`${item['Status'] == 1 ? 'Accepted' : 'Pending'}`}</Text>
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
        <View style={[styles.transaction]}>
          <View >
            <TouchableOpacity
              style={[{ backgroundColor: colors.uniRed, paddingVertical: 6, borderRadius: 8, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }]}>
              <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }} onPress={() => navigation.navigate('AssignTaskEach', { taskId: item['id'] })}>View Task/ Assign to More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
  return (
    <AlertNotificationRoot>
      <View style={{ flex: 1 }}>
        {
          loading && complainData.length == 0 ?
            <ActivityIndicator style={{ flex: 1 }} />
            :
            <FlatList
              data={complainData}
              renderItem={({ item }) => (
                <ComplainCard item={item} navigation={navigation} />
              )}
              keyExtractor={(item, index) => `${item.assignId}-${index}`}
              onEndReached={() => {
                if (hasMore && !loading) {
                  assignedTasks();
                }
              }}
              ListEmptyComponent={
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                  <Text style={{ color: '#1b1b1b' }}>No complaints found</Text>
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

export default SupervisorPendingTask

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
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 10
  },
})