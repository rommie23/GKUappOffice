import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL, IMAGE_URL } from '@env'
import axios from 'axios';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

const HostelRoomCheck = () => {
  const [hostelList, setHostelList] = useState([]);
  const [floorList, setFloorList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [students, setStudents] = useState([]);
  const [hostel, setHostel] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const ImageUrl = `${IMAGE_URL}Images/Students/`;

  // Dummy Data

  const getHostelList = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const res = await axios.get(`${BASE_URL}/staff/hostelList`,
          {
            headers: {
              Authorization: `Bearer ${session}`,
              Accept: "application/json",
              'Content-Type': "application/json"
            }
          })
        if (res.data.flag == 1) {
          const list = res.data.hostelList.map((item) => {
            // console.log({ key: item['BuildingID'], value: item['HostelName'] });

            return { key: item['BuildingID'], value: item['HostelName'] }
          })
          setHostelList(list);
          setFloor('')
          setRoom('')
        }
      } catch (error) {
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      } finally {
        setIsLoading(false)
      }
    }
  };

  const getFloorsList = async (hostelId) => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const res = await axios.post(`${BASE_URL}/staff/floorList`,
          {
            blockId: hostelId
          },
          {
            headers: {
              Authorization: `Bearer ${session}`,
              Accept: "application/json",
              'Content-Type': "application/json"
            }
          })
        // console.log(res.data);

        if (res.data.flag == 1) {
          const list = res.data.floorList.map((item) => {
            return { key: item['key'], value: item['value'] }
          })
          setFloorList(list);
          setHostel(hostelId);
          setRoom('')
        }
      } catch (error) {
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      } finally {
        setIsLoading(false)
      }
    }
  };

  const getRoomsList = async (floorNo) => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const res = await axios.post(`${BASE_URL}/staff/roomsList`,
          {
            blockId: hostel,
            floor: floorNo
          },
          {
            headers: {
              Authorization: `Bearer ${session}`,
              Accept: "application/json",
              'Content-Type': "application/json"
            }
          })
        // console.log(res.data);

        if (res.data.flag == 1) {
          const list = res.data.roomList.map((item) => {
            return { key: item['ID'], value: item['RoomNo'] }
          })
          setRoomList(list);
          setFloor(floorNo);
        }
      } catch (error) {
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      } finally {
        setIsLoading(false)
      }
    }
  };

  const getStudents = async () => {
    console.log({hostel, floor, room});
    
    if (!hostel || !floor || !room) {
      return submitModel(
        ALERT_TYPE.INFO,
        "Missing Fields",
        "Please select Hostel, Floor and Room."
      );
    }
    setIsLoading(true)
    setStudents([])
    // console.log("getStudents::", room);
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const res = await axios.post(`${BASE_URL}/staff/studentsList`,
          {
            locationId: room
          },
          {
            headers: {
              Authorization: `Bearer ${session}`,
              Accept: "application/json",
              'Content-Type': "application/json"
            }
          })
        // console.log(res.data);
        if (res.data.studentList.length === 0) {
          return submitModel(ALERT_TYPE.INFO, "Oops!!!", res.data.message)
        } else {
          setStudents(res.data.studentList);
        }
      } catch (error) {
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      } finally {
        setIsLoading(false)
      }
    }
  };

  useEffect(() => {
    getHostelList();
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
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* Filters */}

        <View style={styles.filterCard}>

          <Text style={styles.label}>Hostel<Text style={{color:'red'}}>*</Text></Text>

          <SelectList
            data={hostelList}
            setSelected={(val) => getFloorsList(val)}
            search={false}
            placeholder="Select Hostel"
            boxStyles={styles.selectBox}
            dropdownStyles={styles.dropdown}
          />

          <View style={styles.row}>

            <View style={styles.half}>

              <Text style={styles.label}>Floor<Text style={{color:'red'}}>*</Text></Text>

              <SelectList
                data={floorList}
                setSelected={(val) => getRoomsList(val)}
                search={false}
                placeholder="Floor"
                boxStyles={styles.selectBox}
                dropdownStyles={styles.dropdown}
              />

            </View>

            <View style={styles.half}>

              <Text style={styles.label}>Room<Text style={{color:'red'}}>*</Text></Text>

              <SelectList
                data={roomList}
                setSelected={setRoom}
                search={false}
                placeholder="Room"
                boxStyles={styles.selectBox}
                dropdownStyles={styles.dropdown}
              />

            </View>

          </View>

          <TouchableOpacity style={[styles.searchButton, { opacity: isLoading ? '0.5' : '1' }]}
            onPress={() => getStudents()}
            disabled={isLoading ? true : false}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color="#FFF"
            />
            <Text style={styles.searchText}>
              {isLoading ? 'Loading...' : 'Search Room'}
            </Text>
          </TouchableOpacity>

        </View>

        {/* Students */}

        <Text style={styles.sectionTitle}>
          Students
        </Text>

        {students.map((student) => (
          <View key={student.ID} style={styles.studentCard}>
            <Image
              source={{ uri: ImageUrl + student.Image }}
              style={styles.image}
            />

            <View style={styles.studentDetails}>
              <Text numberOfLines={1} style={styles.studentName}>
                {student.StudentName}
              </Text>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="school-outline"
                  size={18}
                  color={colors.uniBlue}
                />
                <Text numberOfLines={1} style={styles.infoText}>
                  {student.CollegeName}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="card-account-details-outline"
                  size={18}
                  color={colors.uniBlue}
                />
                <Text style={styles.infoText}>
                  {student.UniRollNo}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="cash-check"
                  size={18}
                  color={colors.uniBlue}
                />
                <Text style={styles.infoText}>
                  {student.FeeType}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={18}
                  color={colors.uniBlue}
                />
                <Text style={styles.infoText}>
                  {student.StudentMobileNo}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 25 }} />

      </ScrollView>
    </AlertNotificationRoot>
  );
};

export default HostelRoomCheck;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  filterCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },

  selectBox: {
    borderRadius: 10,
    borderColor: '#DDD',
    marginBottom: 12,
    minHeight: 48,
  },

  dropdown: {
    borderColor: '#DDD',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  half: {
    width: '48%',
  },

  searchButton: {
    marginTop: 8,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.uniBlue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },

  summaryCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.uniBlue,
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderColor: '#EEE',
  },

  summaryLabel: {
    color: '#666',
    fontWeight: '600',
  },

  summaryValue: {
    color: '#222',
    fontWeight: '700',
  },

  sectionTitle: {
    margin: 16,
    marginBottom: 8,
    fontSize: 22,
    fontWeight: '700',
    color: colors.uniBlue,
  },

  studentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    borderRadius: 16,
    elevation: 3,
    alignItems: 'center',
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.uniBlue,
    marginRight: 14,
  },

  studentDetails: {
    flex: 1,
  },

  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  infoText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
    flex: 1,
  },


});