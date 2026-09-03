import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import colors from '../../../../colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import useConfirm from '../../../../customhooks/useConfirm';

const TrackReturnRequest = () => {

  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const { confirmAction } = useConfirm();

  const ViewLeaveRequests = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    setIsLoading(true)
    if (session != null) {
      try {
        const res = await fetch(BASE_URL + '/student/trackReturnDocuments', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': "application/json"
          }
        })
        const response = await res.json();
        console.log("response :::: ", response);
        setRequests(response['data'])
        if (response['data'].length == 0) {
          submitModel(ALERT_TYPE.WARNING, "No data", `No record found.`)
        }
      } catch (error) {
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      }
      finally {
        setIsLoading(false)
      }
    }
  }
  useFocusEffect(useCallback(() => {
    ViewLeaveRequests();
  }, []))

  const handleAccept = async (id) => {
    const session = await EncryptedStorage.getItem("user_session")
    setIsLoading(true)
    if (session != null) {
      try {
        const res = await fetch(BASE_URL + '/student/acceptDocument', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            requestId: id
          })
        })
        const response = await res.json();
        console.log("response :::: ", response);
        setRequests(response['data'])
        if (response.success) {
          return submitModel(ALERT_TYPE.SUCCESS, "Success", response.message)
        } else {
          return submitModel(ALERT_TYPE.DANGER, "Oops !!", `Something went wrong !!`)

        }
      } catch (error) {
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      }
      finally {
        setIsLoading(false)
      }
    }
  }

  const withdrawRequest = (id) => {
    confirmAction(
      'Are you sure you want to withdraw request?',
      async () => {
        // yes function 
        const session = await EncryptedStorage.getItem("user_session")
        setIsLoading(true)
        try {
          const res = await fetch(BASE_URL + '/student/withdrawDocRequest', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session}`,
              'Content-Type': "application/json"
            },
            body: JSON.stringify({
              requestId: id
            })
          })
          const response = await res.json();
          console.log("response :::: ", response);
          if (response.success) {
            return submitModel(ALERT_TYPE.SUCCESS, "Success", response.message)
          } else {
            return submitModel(ALERT_TYPE.DANGER, "Oops !!", `Something went wrong !!`)
          }
        } catch (error) {
          submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
        } finally {
          setIsLoading(false)
        }
      },
      () => {
        // no function
        console.log("user cancelled request");
      }
    )
  }

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: () => navigation.goBack()
    })
  }

  const inModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
    })
  }

  return (
    <AlertNotificationRoot>
      {isLoading ? <ActivityIndicator />
        : requests?.length == 0 ?
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#1b1b1b', fontWeight: '600' }}>No Records Found</Text>
          :
          <ScrollView
            style={{ flex: 1, backgroundColor: "#F5F6FA" }}
            contentContainerStyle={{ padding: 15 }}
            showsVerticalScrollIndicator={false}
          >
            {requests?.map((request) => (
              <View key={request.requestId} style={styles.card}>

                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.requestId}>
                    Request #{request.requestId}
                  </Text>

                  <View style={[styles.pendingChip, { backgroundColor: request?.basicData[0].RequestStatus == 2 && colors.approved }]}>
                    <Text style={styles.pendingText}>
                      {
                        request?.basicData[0].RequestStatus == 2 ? 'Completed' : 'Pending'
                      }
                    </Text>
                  </View>
                </View>

                <Text style={styles.studentName}>
                  {request?.basicData[0].StudentName}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.sectionTitle}>
                    Documents Requested
                  </Text>
                </View>

                {request?.basicData.map((item) => (
                  <View
                    key={item.SerialNo}
                    style={styles.documentRow}
                  >
                    <Text style={styles.bullet}>•</Text>

                    <Text style={styles.documentName}>
                      {item.DocumentsRequired}
                    </Text>
                  </View>
                ))}

                <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
                  Approval Status
                </Text>

                {request?.statusDataDetail.map((item) => {

                  let statusText = "Pending";
                  let statusColor = colors.pending;
                  let deptRemarks = 'Remarks';

                  if (item.DepartmentStatus === 1) {
                    statusText = "Approved";
                    statusColor = colors.approved;
                  } else if (item.DepartmentStatus === 2) {
                    statusText = "Rejected";
                    statusColor = colors.rejected;
                  }
                  if (item.DepartmentRemarks != null || item.DepartmentRemarks != 'NULL') {
                    deptRemarks = item.DepartmentRemarks
                  }

                  return (
                    <View key={item.id} style={{ borderBottomWidth: 0.5, borderBottomColor: "#ECECEC", paddingVertical: 8, marginBottom: 8 }}>
                      <View
                        key={item.id}
                        style={styles.statusRow}
                      >
                        <Text style={styles.department}>
                          {item.DepartmentName}
                        </Text>

                        <Text
                          style={{
                            color: statusColor,
                            fontWeight: "600",
                          }}
                        >
                          {statusText}
                        </Text>
                      </View>
                      {
                        deptRemarks &&
                        <Text style={{ color: statusColor }}>
                          {deptRemarks}
                        </Text>
                      }
                    </View>
                  );
                })}
                <View>
                  <View>

                  </View>
                  <View style={{ flexDirection: 'row', rowGap: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {
                      (request?.basicData[0].RequestStatus == 1 || request?.basicData[0].RequestStatus == 3) && request?.basicData[0].DueDate &&
                      <Text style={{ color: 'red', fontSize: 14 }}>
                        Document Collection Date: {moment.utc(request?.basicData[0].DueDate).format(
                          "DD MMM YYYY hh:mm A"
                        )}
                      </Text>
                    }
                    {
                      request?.basicData[0].RequestStatus == 3 &&
                      <View>
                        <Text style={[{color:'#1b1b1b'}]}>I confirm that I have received the following original documents:</Text>
                        {request?.basicData
                          .filter(item => item.IsAllowed)
                          .map((item, index) => (
                            <View
                              key={item.SerialNo}
                              style={styles.documentRow}>
                              <Text style={styles.bullet}>•</Text>
                              <Text style={styles.documentName}>
                                {item.DocumentsRequired}
                              </Text>
                            </View>
                          ))}
                        <TouchableOpacity style={[{ backgroundColor: colors.uniBlue, borderRadius: 8, paddingVertical: 8, marginTop: 16 }]} onPress={() => handleAccept(request?.basicData[0].RequestId)}>
                          <Text style={[styles.pendingText, { fontWeight: '600', textAlign:'center' }]}>Confirm Receiving Request</Text>
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                  {
                    request?.basicData[0].RequestStatus == 2 &&
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {request?.basicData
                        .filter(item => item.IsAllowed)
                        .map((item, index) => (
                          <View
                              key={item.SerialNo}
                              style={styles.documentRow}>
                              <Text style={styles.bullet}>•</Text>
                              <Text style={styles.documentName}>
                                {item.DocumentsRequired} ✅
                              </Text>
                            </View>
                        ))}

                      <Text>The above Original documents have been successfully handed over to you. On {moment(request?.basicData[0].DocumentIssueDate)?.format(
                        "DD MMM YYYY"
                      )}</Text>
                    </View>
                  }
                  {
                    request?.basicData[0].RequestStatus != 2 &&
                    <TouchableOpacity style={[{ backgroundColor: colors.uniBlue, borderRadius: 8, paddingVertical: 8, marginTop: 16 }]} onPress={() => withdrawRequest(request?.basicData[0].RequestId)}>
                      <Text style={{ fontWeight: '800', color: '#fff', textAlign: 'center' }}>Withdraw Request</Text>
                    </TouchableOpacity>
                  }
                </View>

              </View>
            ))}
          </ScrollView>}
    </AlertNotificationRoot>
  );
}

export default TrackReturnRequest

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  requestId: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  pendingChip: {
    backgroundColor: colors.pending,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  pendingText: {
    color: "#fff",
    fontWeight: "600",
  },

  studentName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "700",
    color: "#222",
    fontSize: 15,
  },

  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },

  bullet: {
    fontSize: 16,
    marginRight: 8,
  },

  documentName: {
    color: "#444",
    fontSize: 15,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  department: {
    color: "#333",
    fontSize: 15,
  },

  date: {
    marginTop: 15,
    color: "#777",
    fontSize: 13,
  },
});