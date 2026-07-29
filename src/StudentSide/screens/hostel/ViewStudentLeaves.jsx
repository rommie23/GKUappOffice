import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../colors';


const ViewStudentLeaves = ({ navigation }) => {
  const [leaves, setLeaves] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const ViewLeaveRequests = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    setIsLoading(true)
    if (session != null) {
      try {
        const leaves = await fetch(BASE_URL + '/student/showAllLeaves', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            Accept: "application/json",
            'Content-Type': "application/json"
          }
        })
        const response = await leaves.json();
        if (response.flag == 1) {
          console.log("ViewLeaveRequests ::: ", response);
          setLeaves(response.studentLeaves)
        } else {
          errorModel(ALERT_TYPE.DANGER, "Oops!!!", response.message)
        }
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      }
    }
  }

  useEffect(() => {
    ViewLeaveRequests();
  }, [])

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }

  const errorModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: () => navigation.goBack()
    })
  }
  return (
    <AlertNotificationRoot>
      {
        isLoading ? <ActivityIndicator /> :
          <View style={{ height: '90%' }}>
            <ScrollView
              contentContainerStyle={{ padding: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {leaves.length > 0 ? (
                leaves.map((leave, index) => (
                  <View key={index} style={styles.leaveCard}>

                    {/* Header */}
                    <View style={styles.leaveHeader}>
                      <Text style={styles.leaveTitle}>
                        Leave #{index + 1}
                      </Text>
                      <View style={{backgroundColor: leave.Status == 1 ? colors.approved : leave.Status == 2 ? colors.rejected : colors.pending, paddingVertical:4, paddingHorizontal:8, borderRadius:8 }}>
                        <Text style={{color:'#fff', fontWeight:'600', fontSize:12}}>{leave.Status == 1 ? 'Approved' : leave.Status == 2 ? 'Rejected' : 'Pending'}</Text>
                      </View>
                    </View>

                    {/* Duration */}
                    <View style={styles.leaveRow}>
                      <MaterialCommunityIcons
                        name="calendar-range"
                        size={20}
                        color="#0E4A86"
                      />

                      <View style={{ marginLeft: 12 }}>
                        <Text style={styles.label}>
                          Leave Duration
                        </Text>

                        <Text style={styles.value}>
                          {leave.StartDate.split('T')[0].split("-").reverse().join("-")}
                          {"  "}→{"  "}
                          {leave.EndDate.split('T')[0].split("-").reverse().join("-")}
                        </Text>
                      </View>
                    </View>

                    {/* Remarks */}
                    <View style={styles.leaveRow}>
                      <MaterialCommunityIcons
                        name="text-box-outline"
                        size={20}
                        color="#0E4A86"
                      />

                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.label}>
                          Remarks
                        </Text>

                        <Text style={styles.value}>
                          {leave.Remarks}
                        </Text>
                      </View>
                    </View>

                  </View>
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <MaterialCommunityIcons
                    name="calendar-remove"
                    size={60}
                    color="#BBB"
                  />

                  <Text style={styles.emptyTitle}>
                    No Leave Applications
                  </Text>

                  <Text style={styles.emptySubTitle}>
                    Your leave history will appear here.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
      }
    </AlertNotificationRoot>
  )
}

export default ViewStudentLeaves

const styles = StyleSheet.create({
  leaveCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },

  leaveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  leaveTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  pendingBadge: {
    backgroundColor: "#FFF4D6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  pendingText: {
    color: "#D18A00",
    fontWeight: "700",
    fontSize: 12,
  },

  leaveRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  label: {
    color: "#666",
    fontSize: 13,
  },

  value: {
    color: "#222",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },

  emptyCard: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#444",
    marginTop: 12,
  },

  emptySubTitle: {
    color: "#888",
    marginTop: 4,
  },
})