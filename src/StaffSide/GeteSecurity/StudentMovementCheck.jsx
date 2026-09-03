import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL, IMAGE_URL } from '@env'
import axios from 'axios';
import colors from '../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';


const StudentMovementCheck = () => {

  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [rollNo, setRollNo] = useState('')
  const ImageUrl = `${IMAGE_URL}Images/Students/`;

  const floorMap = {
    0: "Ground Floor",
    1: "1st Floor",
    2: "2nd Floor",
    3: "3rd Floor",
    4: "4th Floor",
    5: "5th Floor",
    6: "6th Floor",
    7: "7th Floor",
    8: "8th Floor",
  };


  const hostelMovements = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")

    if (session != null) {
      try {
        const res = await axios.get(`${BASE_URL}/staff/approvedHostelMovements`,
          {
            headers: {
              Authorization: `Bearer ${session}`,
              Accept: "application/json",
              'Content-Type': "application/json"
            }
          })
        // console.log(res.data);

        if (res.data.flag == 1) {
          setMovements(res.data.allLeaves)
        }
      } catch (error) {
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      } finally {
        setIsLoading(false)
      }
    }
  };

  const handleButtons = async (action, ID) => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")

    if (session != null) {
      try {
        const res = await axios.post(`${BASE_URL}/staff/movementCheckAction`, {
          action: action,
          movementId: ID
        },
          {
            headers: {
              Authorization: `Bearer ${session}`,
              Accept: "application/json",
              'Content-Type': "application/json"
            }
          })
        console.log(res.data);

        if (res.data.flag == 1) {
          submitModel(ALERT_TYPE.SUCCESS, "Success", res.data.message)
          await hostelMovements();
        } else {
          submitModel(ALERT_TYPE.DANGER, "Request Failed", res.data.message)
        }
      } catch (error) {
        console.log(error);
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      } finally {
        setIsLoading(false)
      }
    }
  };

  const searchStudent = async () => {
    // console.log("searchStudent", rollNo);
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const res = await axios.post(`${BASE_URL}/staff/movementSearchStudent`,
          {
            rollNo: rollNo
          },
          {
            headers: {
              Authorization: `Bearer ${session}`,
              Accept: "application/json",
              'Content-Type': "application/json"
            }
          })
        // console.log("searchStudent::", res.data);

        if (res.data.flag == 1) {
          setMovements(res.data.allLeaves)
        } else {
          submitModel(ALERT_TYPE.INFO, "Check Roll No", res.data.message)
        }
      } catch (error) {
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    hostelMovements();
  }, [])

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
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={22}
          color="#777"
          style={{ marginLeft: 12 }}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Enter Roll Number"
          placeholderTextColor="#999"
          value={rollNo}
          onChangeText={setRollNo}
          keyboardType="numeric"
          returnKeyType="search"
        />

        <TouchableOpacity
          style={[
            styles.searchButton,
            { opacity: rollNo.trim() ? 1 : 0.5 },
          ]}
          disabled={!rollNo.trim()}
          onPress={searchStudent}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={18}
            color="#FFF"
          />
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Student Movement</Text>
        {isLoading ? <ActivityIndicator />
          : movements.length > 0 ? movements.map(item => (
            <View key={item.RequestNo} style={styles.card}>
              {/* Student */}
              <View style={styles.header}>
                <Image
                  source={{ uri: ImageUrl + item.Image }}
                  style={styles.image}
                />

                <View style={{ flex: 1 }}>

                  <Text style={styles.name}>
                    {item.StudentName}
                  </Text>

                  <Text style={styles.roll}>
                    Uni Roll No: {item.UniRollNo}
                  </Text>
                  <Text style={styles.roll}>
                    College: {item.CollegeName}
                  </Text>
                </View>

              </View>

              {/* Divider */}

              <View style={styles.divider} />

              {/* Leave Duration */}
              <View style={styles.roomBadge}>
                <MaterialCommunityIcons
                  name="bed"
                  size={16}
                  color={colors.uniBlue}
                />
                <Text style={styles.roomText}>
                  {item.HostelName} • {floorMap[item.Floor]} • Room {item.RoomNo}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="calendar-range"
                  size={22}
                  color={colors.uniBlue}
                />

                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.label}>
                    Requested Time
                  </Text>
                  <Text style={styles.value}>
                    {item.RequestedCheckOut}
                  </Text>
                </View>
              </View>

              {/* Reason */}

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="text-box-outline"
                  size={22}
                  color={colors.uniBlue}
                />

                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.label}>
                    Purpose
                  </Text>

                  <Text style={styles.value}>
                    {item.Purpose}
                  </Text>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.buttonRow}>
                {
                  item.ActualCheckOut == null && item.CheckIn == null ?
                    <TouchableOpacity style={styles.rejectBtn}
                      onPress={() => handleButtons(1, item.RequestNo)}>
                      <Text style={styles.buttonText}>
                        Check Out Student
                      </Text>
                    </TouchableOpacity>
                    : item.ActualCheckOut != null && item.CheckIn == null ?
                      <TouchableOpacity style={styles.approveBtn}
                        onPress={() => handleButtons(2, item.RequestNo)}>
                        <Text style={styles.buttonText}>
                          Check In Student
                        </Text>
                      </TouchableOpacity>
                      : item.ActualCheckOut != null && item.CheckIn != null ?
                        <Text style={[styles.label, { color: '#2E7D32' }]}>Status : Movement Completed</Text>
                        : null
                }
              </View>

            </View>

          )) :
            (
              <Text style={styles.emptyText}>No Data Found</Text>
            )
        }

      </ScrollView>
    </AlertNotificationRoot>
  );
};

export default StudentMovementCheck;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.uniBlue,
    alignSelf: 'center',
    marginBottom: 8
  },

  subHeading: {
    marginTop: 4,
    marginBottom: 20,
    color: '#666',
    fontSize: 15,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginRight: 14,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  roll: {
    color: '#666',
    marginTop: 2,
  },

  roomBadge: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF5FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  roomText: {
    marginLeft: 6,
    color: colors.uniBlue,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 16,
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },

  label: {
    fontWeight: '700',
    color: '#444',
  },

  value: {
    color: '#555',
    marginTop: 2,
    lineHeight: 22,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  rejectBtn: {
    paddingHorizontal:16,
    backgroundColor: colors.uniRed,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  approveBtn: {
    paddingHorizontal:16,
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    elevation: 2,
    overflow: 'hidden',
    marginBottom: 8
  },

  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#222',
  },

  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.uniBlue,
    paddingHorizontal: 16,
    height: 48,
  },

  searchText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },

});