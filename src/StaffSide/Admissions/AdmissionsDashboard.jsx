import { View, Text, StyleSheet, Dimensions, Image, ScrollView, RefreshControl, ActivityIndicator, Pressable, Switch } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import colors from '../../colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SelectList } from 'react-native-dropdown-select-list';

const screenWidth = Dimensions.get('window').width;

const AdmissionsDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [admissionData, setAdmissionData] = useState({})
  const [sessionAdmissionData, setSessionAdmissionData] = useState({})
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [leet, setLeet] = useState(false);
  const [sessionList, setSessionList] = useState("");
  const [selectedSession, setSelectedSession] = useState("");


  const allSessionsList = async (leet) => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    try {
      const sessionList = await fetch(BASE_URL + '/staff/allSessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          Accept: "application/json",
          'Content-Type': "application/json"
        }
      })
      const sessionListData = await sessionList.json()
      console.log('sessionListData ::::::', sessionListData);
      setSessionList(sessionListData.map((item) => ({
        key: item.label, value: item.value
      })));
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log('inout api error ::', error);
    }
  }

  const dashboardData = async (leet) => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    try {
      const admissionDashboard = await fetch(BASE_URL + '/staff/admissionsDashboard', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          Accept: "application/json",
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          leet,
          session: selectedSession
        })
      })
      const admissionDashboardData = await admissionDashboard.json()
      // console.log('admissionDashboardData ::::::', admissionDashboardData);
      setAdmissionData(admissionDashboardData);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log('inout api error ::', error);
    }
  }

  // const dashboardDataForSession = async (leet) => {
  //   setIsLoading(true)
  //   const session = await EncryptedStorage.getItem("user_session")
  //   try {
  //     const admissionDashboard = await fetch(BASE_URL + '/staff/admissionsDashboard', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${session}`,
  //         Accept: "application/json",
  //         'Content-Type': "application/json"
  //       },
  //       body: JSON.stringify({
  //         leet
  //       })
  //     })
  //     const admissionDashboardData = await admissionDashboard.json()
  //     console.log('admissionDashboardData ::::::', admissionDashboardData);
  //     setSessionAdmissionData(admissionDashboardData);
  //     setIsLoading(false)
  //   } catch (error) {
  //     setIsLoading(false)
  //     console.log('inout api error ::', error);
  //   }
  // }

  useEffect(() => {
    dashboardData(leet);
    allSessionsList();
  }, [])

  const showStartDatePicker = () => {
    // console.log("showDatePickershowDatePicker");
    setStartDatePickerVisible(true);
  };
  const showEndDatePicker = () => {
    // console.log("setEndDatePickerVisible");
    setEndDatePickerVisible(true);
  };

  const handleStartConfirm = (date) => {
    // console.log(date);
    setSelectedStartDate(date);
    setStartDatePickerVisible(false);
  };

  const handleEndConfirm = (date) => {
    // console.log(date);
    setSelectedEndDate(date);
    setEndDatePickerVisible(false);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months start at 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setSelectedEndDate(null)
      setSelectedStartDate(null)
      dashboardData(leet);
      setRefreshing(false);
    }, 2000);
  }, []);


  const SessionRow = ({ icon, title, value, color }) => (
    <View style={styles.sessionRow}>

      <View style={[
        styles.sessionIcon,
        { backgroundColor: color + '20' }
      ]}>
        <MaterialCommunityIcons name={icon} size={20} color={color}
        />
      </View>


      <Text style={styles.sessionLabel}>
        {title}
      </Text>


      <Text style={[styles.sessionValue, { color }]}>
        {value ?? 0}
      </Text>

    </View>
  )


  return (
    <View >
      {
        <ScrollView style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {<View>
            <View
              style={{
                backgroundColor: colors.uniBlue,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                marginHorizontal: 12,
                marginVertical: 8,
              }}
            >

              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
                <MaterialIcon
                  name="filter-list"
                  size={22}
                  color="white"
                />

                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '700',
                    marginLeft: 8
                  }}
                >
                  Filters
                </Text>
              </View>


              {/* Session */}
              <View style={{ marginBottom: 12 }}>

                <Text style={[styles.textSmall, { color: '#fff', fontWeight: '600' }]}>
                  Session
                </Text>

                <SelectList
                  setSelected={(value) => setSelectedSession(value)}
                  data={sessionList}
                  placeholder="Select Session"

                  search={false}

                  boxStyles={{ backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 0, borderRadius: 10, height: 48, alignItems: 'center', paddingHorizontal: 14, }}

                  inputStyles={{ color: 'white', fontSize: 15, fontWeight: '600', }}

                  arrowicon={
                    <MaterialIcon name="keyboard-arrow-down" size={24} color="white" />
                  }
                  dropdownStyles={{ backgroundColor: 'white', borderWidth: 0, borderRadius: 10, marginTop: 5, elevation: 5, }}
                  dropdownItemStyles={{ paddingVertical: 12, paddingHorizontal: 14, }}
                  dropdownTextStyles={{ color: '#222', fontSize: 15, fontWeight: '500', }}
                />

              </View>



              {/* Dates */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >

                <Pressable
                  onPress={showStartDatePicker}
                  style={{ width: '48%', backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 8 }}>
                  <Text style={{ color: '#ddd', fontSize: 12 }}>From Date</Text>

                  <Text style={{ color: 'white', fontWeight: '600' }}>
                    {selectedStartDate
                      ? formatDate(selectedStartDate)
                      : 'Select Date'}
                  </Text>
                </Pressable>
                <DateTimePickerModal
                  date={selectedStartDate || new Date()}
                  isVisible={startDatePickerVisible}
                  mode="date"
                  onConfirm={handleStartConfirm}
                  onCancel={() => setStartDatePickerVisible(false)}
                />

                <Pressable
                  onPress={showEndDatePicker}
                  style={{ width: '48%', backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 8 }}>
                  <Text style={{ color: '#ddd', fontSize: 12 }}>To Date</Text>
                  <Text style={{ color: 'white', fontWeight: '600' }}>
                    {selectedEndDate
                      ? formatDate(selectedEndDate)
                      : 'Select Date'}
                  </Text>
                </Pressable>
                <DateTimePickerModal
                  date={selectedEndDate || new Date()}
                  isVisible={endDatePickerVisible}
                  mode="date"
                  onConfirm={handleEndConfirm}
                  onCancel={() => setEndDatePickerVisible(false)}
                />

              </View>

              {/* LEET + Search */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 12
                }}
              >

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >

                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      marginRight: 8
                    }}
                  >
                    LEET Only
                  </Text>

                  <Switch
                    value={leet}
                    onValueChange={setLeet}
                  />

                </View>

                <Pressable
                  onPress={() => dashboardData(leet)}
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 24,
                    paddingVertical: 10,
                    borderRadius: 8
                  }}
                >

                  <Text
                    style={{
                      color: colors.uniBlue,
                      fontWeight: '700'
                    }}
                  >
                    Search
                  </Text>

                </Pressable>

              </View>


            </View>

            {
              isLoading ? <ActivityIndicator />
                :
                <View style={styles.statsContainer}>

                  <View style={[styles.statCard, { width: '100%' }]}>
                    <MaterialCommunityIcons name="account-group" size={28} color={colors.uniBlue} />
                    <Text style={styles.statValue}> {admissionData?.total ?? 0}</Text>
                    <Text style={styles.statLabel}>Total Admissions</Text>
                  </View>

                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="account-check" size={28} color="#2E7D32" />
                    <Text style={styles.statValue}>{admissionData?.active ?? 0}</Text>
                    <Text style={styles.statLabel}>Active Students</Text>
                  </View>

                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="account-arrow-right" size={28} color="#EF6C00" />
                    <Text style={styles.statValue}>{admissionData?.left ?? 0}</Text>
                    <Text style={styles.statLabel}>Left Students</Text>
                  </View>

                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="check-decagram" size={28} color="#00897B" />
                    <Text style={styles.statValue}>{admissionData?.eligible ?? 0}</Text>
                    <Text style={styles.statLabel}>Eligible Students</Text>
                  </View>

                  <View style={styles.statCard}>
                    <MaterialCommunityIcons name="close-octagon" size={28} color={colors.uniRed} />
                    <Text style={styles.statValue}>{admissionData?.nonEligible ?? 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.uniRed }]}> Not Eligible</Text>
                  </View>

                </View>
            }

            {/* <View style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View>
                  <Text style={styles.sessionTitle}>
                    Session Summary
                  </Text>

                </View>

                <MaterialCommunityIcons
                  name="chart-box-outline"
                  size={28}
                  color={colors.uniBlue}
                />

              </View>

              <SessionRow
                icon="account-group"
                title="Total Admissions"
                value={sessionAdmissionData?.total}
                color={colors.uniBlue}
              />

              <SessionRow
                icon="account-check"
                title="Active Students"
                value={sessionAdmissionData?.active}
                color="#2E7D32"
              />

              <SessionRow
                icon="account-arrow-right"
                title="Left Students"
                value={sessionAdmissionData?.left}
                color="#EF6C00"
              />

              <SessionRow
                icon="check-decagram"
                title="Eligible Students"
                value={sessionAdmissionData?.eligible}
                color="#00897B"
              />

              <SessionRow
                icon="close-octagon"
                title="Not Eligible"
                value={sessionAdmissionData?.nonEligible}
                color={colors.uniRed}
              />

            </View> */}

          </View>
          }
        </ScrollView>
      }
    </View>
  )
}

export default AdmissionsDashboard

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 12,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 12,

    alignItems: 'center',

    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1b1b1b',
    marginTop: 8,
  },

  statLabel: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  sessionCard: {
    backgroundColor: 'white',
    width: screenWidth - 24,
    alignSelf: 'center',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    elevation: 4,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 8,
    borderBottomWidth: .5,
    borderBottomColor: '#ddd'
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222'
  },
  sessionSubTitle: {
    color: '#777',
    marginTop: 4,
    fontSize: 14
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: .5,
    borderBottomColor: '#eee'
  },
  sessionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#333'
  },
  sessionValue: {
    fontSize: 20,
    fontWeight: '800'
  }
})