import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

import CircularProgress from 'react-native-circular-progress-indicator';
import EncryptedStorage from 'react-native-encrypted-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors';
import { BASE_URL } from '@env'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';


const { width } = Dimensions.get('window');

const StudentAttendance = () => {
  const [subjectAttendance, setSubjectsAttendance] = useState([])
  const [overallAttendance, setOverallAttendance] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = percentage => {
    if (percentage >= 90) return colors.approved;
    if (percentage >= 75) return colors.pending;
    return colors.rejected;
  };

  const getStatusText = percentage => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good Standing';
    return 'Attendance Shortage';
  };
  
  const studentAttendance = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    console.log("subjectsAttendancesubjectsAttendance");
    if (session != null) {
      try {
        const res = await fetch(`${BASE_URL}/student/studentAttendance`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          }
        })
        const response = await res.json();
        console.log("studentAttendance:::", response);
        if (response.flag == 1) {
          setOverallAttendance(response.overallAttendance)
          setSubjectsAttendance(response.subjectAttendance)
        } else {
          submitModel(ALERT_TYPE.INFO, 'No data found', response.message);
        }
      } catch (error) {
        submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong !!`)
      } finally {
        setIsLoading(false)
      }

    }
  }

  useEffect(() => {
    studentAttendance();
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
      {
        isLoading && <ActivityIndicator />
      }
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 18 }}
        showsVerticalScrollIndicator={false}>

        {/* Header */}

        <Text style={styles.heading}>Attendance</Text>

        {/* Circular Attendance */}

        <View style={styles.attendanceCard}>

          <View style={styles.circleContainer}>
            <CircularProgress
              value={overallAttendance.Percentage}
              radius={90}
              maxValue={100}
              activeStrokeColor={getStatusColor(overallAttendance.Percentage)}
              inActiveStrokeColor="#E7ECF4"
              activeStrokeWidth={16}
              inActiveStrokeWidth={16}
              progressValueColor="transparent"
              valueSuffix=""
            />

            <View style={styles.circleTextContainer}>
              <Text style={styles.circlePercentage}>
                {Number(overallAttendance.Percentage).toFixed(1)}%
              </Text>
            </View>
          </View>

          <Text style={styles.presentText}>
            {overallAttendance.PresentLectures} / {overallAttendance.TotalLectures} Classes Present
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusColor(
                  overallAttendance.Percentage,
                ),
              },
            ]}>
            <Text style={styles.statusText}>
              {getStatusText(overallAttendance.Percentage)}
            </Text>
          </View>

        </View>

        {/* Summary */}

        <View style={styles.summaryRow}>

          <View style={styles.summaryCard}>
            <MaterialCommunityIcons
              name="check-circle"
              color="#22C55E"
              size={30}
            />

            <Text style={styles.summaryNumber}>
              {overallAttendance.PresentLectures}
            </Text>

            <Text style={styles.summaryLabel}>
              Present
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <MaterialCommunityIcons
              name="close-circle"
              color="#EF4444"
              size={30}
            />

            <Text style={styles.summaryNumber}>
              {overallAttendance.AbsentLectures}
            </Text>

            <Text style={styles.summaryLabel}>
              Absent
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <MaterialCommunityIcons
              name="calendar-month"
              color={colors.uniBlue}
              size={30}
            />

            <Text style={styles.summaryNumber}>
              {overallAttendance.TotalLectures}
            </Text>

            <Text style={styles.summaryLabel}>
              Total
            </Text>
          </View>

        </View>

        {/* Required Attendance */}

        {/* <View style={styles.requiredCard}>
          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color={colors.uniBlue}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.requiredTitle}>
              Minimum Attendance Required
            </Text>
            <Text style={styles.requiredSubTitle}>
              {attendance.required}% required to appear in examinations.
            </Text>
          </View>
        </View> */}

        {/* Subject Heading */}

        <Text style={styles.subjectHeading}>
          Subject Wise Attendance
        </Text>

        {/* Subject Cards */}

        {subjectAttendance.length > 0 ? subjectAttendance.map((item, index) => (

          <View
            key={index}
            style={styles.subjectCard}>

            <View style={styles.subjectTop}>

              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}>

                <MaterialCommunityIcons name="book-open-page-variant" size={20} color={colors.uniBlue} />

                <Text style={styles.subjectName}>
                  {item.SubjectName}/{item.SubjectCode}
                </Text>

              </View>
              <Text
                style={[styles.subjectPercent, { color: getStatusColor(item.Percentage) }]}>
                {item.Percentage}%
              </Text>
            </View>

            {/* Progress */}

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${item.Percentage}%`,
                    backgroundColor: getStatusColor(
                      item.Percentage,
                    ),
                  },
                ]}
              />
            </View>

            {/* Footer */}
            <View style={styles.subjectFooter}>
              <Text style={styles.footerText}>
                Present : {item.PresentLectures}
              </Text>
              <Text style={styles.footerText}>
                Total : {item.TotalLectures}
              </Text>
            </View>
          </View>
        ))
          : <Text style={styles.subjectName}>No Subject Attendance Found</Text>
        }

      </ScrollView>
    </AlertNotificationRoot>
  );
}

export default StudentAttendance

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.uniBlue,
    marginBottom: 18,
  },

  attendanceCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    paddingVertical: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  presentText: {
    marginTop: 18,
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
  },

  statusBadge: {
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
  },

  statusText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  summaryCard: {
    width: (width - 52) / 3,
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  summaryNumber: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },

  summaryLabel: {
    marginTop: 5,
    color: '#777',
    fontSize: 14,
  },

  requiredCard: {
    marginTop: 22,
    backgroundColor: '#EAF2FF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  requiredTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.uniBlue,
  },

  requiredSubTitle: {
    marginTop: 3,
    color: '#555',
    lineHeight: 20,
  },

  subjectHeading: {
    marginTop: 28,
    marginBottom: 15,
    fontSize: 22,
    fontWeight: '700',
    color: colors.uniBlue,
  },

  subjectCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  subjectTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  subjectName: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    width: '70%'
  },

  subjectPercent: {
    fontSize: 15,
    fontWeight: '700',
  },

  progressBackground: {
    marginTop: 8,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
  },

  subjectFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  footerText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },


  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circlePercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.uniBlue,
  },
});