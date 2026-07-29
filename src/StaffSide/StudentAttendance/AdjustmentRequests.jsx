import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

const toWords = {
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th',
  6: '6th',
  7: '7th',
  8: '8th',
  9: '9th',
  10: '10th',
  11: '11th',
  12: '12th',
}

const AdjustmentRequests = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [lectureRequests, setLectureRequests] = useState([])

  const dailyLecturesData = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    try {
      setIsLoading(true)
      const dailyLectures = await fetch(BASE_URL + '/Staff/adjustmentLecturesList', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`
        }
      })
      const DailyLecturesDataDetail = await dailyLectures.json()
      console.log("AdjustmentRequests",DailyLecturesDataDetail['adjustmentLectures']);
      
      if (DailyLecturesDataDetail['adjustmentLectures'].length > 0) {
        setLectureRequests(DailyLecturesDataDetail['adjustmentLectures']);
      }
      else {
        submitModel(ALERT_TYPE.WARNING, "No Data Found", DailyLecturesDataDetail.message)
      }
      setIsLoading(false)
    } catch (error) {
      console.log('inout api error ::', error);
      submitModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `Please try again after sometime`)
    }
  }


  const handleButtons = async (action, id, OriginalTeacherID, subjectName, adjustmentType) => {
    const session = await EncryptedStorage.getItem("user_session")
    try {
      setIsLoading(true)
      const res = await fetch(BASE_URL + '/Staff/adjustmentAction', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          action,
          adjustmentId : id
        })
      })
      const response = await res.json()
      // console.log('Adjustment response ::::::', response);
      if (response.flag == 1) {
        submitModel(ALERT_TYPE.SUCCESS, "Successfully updates", response.message)
        await dailyLecturesData()
        console.log({action, adjustmentType});
        
        let notificationId;
        if (adjustmentType == 'Merge') {
          if (action == 1) {
            notificationId = '13'
          }else{ notificationId = '15'}
        }else{
          if (action == 1) {
            notificationId = '12'
          }else{notificationId = '14'}
        }

        console.log("notificationId::", notificationId);
        
        await notificationfunction(OriginalTeacherID, subjectName, notificationId)
      }
      else {
        submitModel(ALERT_TYPE.WARNING, "No Data Found", response.message)
      }
      setIsLoading(false)
    } catch (error) {
      console.log('inout api error ::', error);
      submitModel(ALERT_TYPE.DANGER, "OOPS!! Something went wrong", `Please try again after sometime`)
    }
  }

  const notificationfunction = async (recipient, subjectName, notificationId) => {
      console.log("notificationfunction called");
      const session = await EncryptedStorage.getItem("user_session");
      if (!session) return;
        const fetchWithTimeout = (url, options, timeout = 5000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
          ),
        ]);
      };
  
      try {
        const res = await fetchWithTimeout(`${BASE_URL}/notifiaction/sendDynamicNotifications`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            Accept: "application/json",
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            receipients: [recipient],
            notificationId: notificationId,
            variables:{
              SubjectName:subjectName
            }
          })
        });
  
        const response = await res.json();
        console.log("Notification API response:", response);  
  
        if (res.ok) {
          console.warn("Notification Success");
        } else {
          console.warn("Notification failed but continuing...");
        }
  
      } catch (error) {
        if (error.message === "Timeout") {
          console.warn("Notification timeout — proceeding anyway.");
        } else {
          console.error("Notification error:", error);
        }
      }
    };

  useEffect(() => {
    dailyLecturesData();
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
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}>

        {lectureRequests.map(item => (
          <View key={item.AdjustmentID} style={styles.card}>

            {/* Header */}

            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.teacherName}>
                  {item.OriginalTeacher}
                </Text>

                <Text style={styles.department}>
                  {item.OriginalDepartment}
                </Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.Status}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Details */}

            <View style={styles.row}>
              <Text style={styles.label}>📚 Subject</Text>
              <Text style={styles.value}>{item.OriginalSubjectName}({item.OriginalSubject})</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>🏫 Class</Text>
              <Text style={styles.value}>{item.OriginalCourse}/{toWords[item.OriginalSemester]}-Sem</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>📅 Date</Text>
              <Text style={styles.value}>{item.AdjustmentDate.split('T')[0].split('-').reverse().join('-')}({item.OriginalLectureDay})</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>⏰ Lecture</Text>
              <Text style={styles.value}>{toWords[item.OriginalLecture]}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>🔗 Type</Text>
              <Text style={styles.value}>{item.AdjustmentType === 'Merge' ? 'Merge':'Adjustment'}</Text>
            </View>

            {/* Buttons */}
          {
            item.Status == 'Pending' &&
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.acceptBtn}
                  onPress={() => handleButtons(1, item.AdjustmentID, item.OriginalTeacherID, item.OriginalSubjectName, item.AdjustmentType)}
                  disabled={isLoading ? true : false}>
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Loading...' : 'Accept'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rejectBtn}
                  onPress={() => handleButtons(2, item.AdjustmentID, item.OriginalTeacherID, item.OriginalSubjectName, item.AdjustmentType)}
                  disabled={isLoading ? true : false}>
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Loading...' : 'Reject'}
                  </Text>
                </TouchableOpacity>
              </View>
          }

          </View>
        ))}
      </ScrollView>
    </AlertNotificationRoot>
  );
};

export default AdjustmentRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  teacherName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  department: {
    marginTop: 2,
    color: '#666',
    fontSize: 14,
  },

  badge: {
    backgroundColor: '#FFF3D8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: '#C98A00',
    fontWeight: '700',
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginVertical: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  label: {
    width: '36%',
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },

  value: {
    width: '64%',
    color: '#222',
    fontWeight: '600',
    textAlign: 'right',
    fontSize: 14,
  },

  reasonContainer: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
  },

  reasonText: {
    marginTop: 6,
    color: '#444',
    lineHeight: 20,
    fontSize: 14,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  rejectBtn: {
    width: '48%',
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  acceptBtn: {
    width: '48%',
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});