import { ActivityIndicator, Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BASE_URL, LIMS_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { StudentContext } from '../../../context/StudentContext';
import axios from 'axios';
import { convertUTCToISTComplaintUse } from '../../../services/dateUTCToIST'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const SupervisorPendingTask = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complainData, setComplainData] = useState([])
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigation = useNavigation()

  const complains = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const session = await EncryptedStorage.getItem("user_session");
      if (!session) return;
      const response = await axios.post(
        `${BASE_URL}/complain/complainForSupervisor`,
        {
          page: reset ? 1 : page,
          limit: 50,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        }
      );
      const newRecords = Array.isArray(response.data) ? response.data : []; // or response.data.data
      // console.log("newRecords::", newRecords);
      if (reset) {
        setComplainData(newRecords);
        setPage(2);
      } else {
        setComplainData(prev => [...prev, ...newRecords]);
        setPage(prev => prev + 1);
      }
      setHasMore(newRecords.length > 0);

    } catch (error) {
      console.log("error::", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      complains(true);
    }, [])
  );


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    complains(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);


  const ComplainCard = ({ item, navigation }) => {
    return (
      <View style={styles.card}>

        {/* Top Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
            <FontAwesome5 name='walking' size={22} color={colors.uniBlue} />
            <Text style={styles.cardTitle}>Complain No. {item.id}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 6,
              backgroundColor: "#e8f1ff",
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 12
            }}
          >
            <FontAwesome5 name="clock" size={16} color={colors.uniBlue} />
            <Text style={[styles.cardStatus]}>Pending</Text>
          </View>

        </View>

        {/* Date & Category */}
        <View style={styles.row}>
          <View style={{ width: "50%" }}>
            <Text style={styles.label}>Complaint Date</Text>
            <Text style={styles.value}>{convertUTCToISTComplaintUse(item.CreatedDate)}</Text>
          </View>

          <View style={{ width: "50%" }}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{item.CategoryName}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.row}>
          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>
              Block {item.BlockName}, Floor {item.Floor}, Room {item.RoomNo}
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.row}>
          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{item.title}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.row}>
          <View style={{ width: "100%" }}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{item.description}</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={[styles.row, { marginTop: 10 }]}>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.uniRed }]}
            onPress={() => navigation.navigate('RejectTaskScreen', { taskId: item.id })}
          >
            <Text style={styles.btnText}>Refer Other</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.uniBlue }]}
            onPress={() => navigation.navigate('AssignTaskEach', { taskId: item.id })}
          >
            <Text style={styles.btnText}>Assign Task</Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  };

  return (
    <AlertNotificationRoot>
      <View style={{ flex: 1 }}>
        {
          loading && complainData.length == 0 ? (
            <ActivityIndicator style={{ flex: 1 }} />
          )
            :
            <FlatList
              data={complainData}
              renderItem={({ item }) => (
                <ComplainCard item={item} navigation={navigation} />
              )}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={() => {
                if (hasMore && !loading) {
                  complains();
                }
              }}
              ListFooterComponent={
                loading && complainData.length > 0 ? (
                  <ActivityIndicator style={{ marginVertical: 20 }} />
                ) : null
              }
              ListEmptyComponent={
                complainData.length == 0 &&
                <Text style={{ textAlign: 'center', color: '#1b1b1b', marginVertical: 20 }}>No Records to Show</Text>

              }
            />
        }
      </View>
    </AlertNotificationRoot>
  )
}

export default SupervisorPendingTask

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    width: '92%',
    marginVertical: 10,
    alignSelf: 'center',
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1b1b1b'
  },

  cardStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.uniBlue
  },

  label: {
    fontSize: 11,
    color: '#6a6a6a',
    marginBottom: 2
  },

  value: {
    fontSize: 13,
    color: '#1b1b1b'
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },

  btn: {
    width: "48%",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },

  btnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  }

})