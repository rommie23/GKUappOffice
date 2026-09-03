import { ScrollView, StyleSheet, Text, TouchableHighlight, View, Modal, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../../colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';

import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

const StudentFilledExamForm = ({ route }) => {
  const { formId } = route.params;
  const [loading, setLoading] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [basicData, setBasicData] = useState([]);

  const navigation = useNavigation();

  const getExamsubjects = async () => {
    setLoading(true);

    const session = await EncryptedStorage.getItem('user_session');

    if (session != null) {
      try {
        const ExamSubjects = await fetch(
          `${BASE_URL}/Student/examform/${formId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session}`,
            },
          },
        );

        const ExamSubjectsDetails = await ExamSubjects.json();

        setAllSubjects(ExamSubjectsDetails['data1']);
        setBasicData(ExamSubjectsDetails['data']);

        setLoading(false);
      } catch (error) {
        console.log(
          'Error fetching Guri data:Login:',
          error,
        );

        setLoading(false);

        errorModel(
          ALERT_TYPE.DANGER,
          'Oops!!!',
          `Something Went wrong.`,
        );
      }
    }
  };

  useEffect(() => {
    getExamsubjects();
  }, []);

  const errorModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: () => navigation.goBack(),
    });
  };

  return (
    <AlertNotificationRoot>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {
          loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                size="large"
                color="#52665E"
              />

              <Text style={styles.loadingText}>
                Loading exam form...
              </Text>
            </View>
          ) : (

            <View>

              {/* =========================
              COURSE INFORMATION
          ========================= */}

              {basicData.map((info, i) => (
                <View
                  style={styles.infoCard}
                  key={i}
                >
                  <View style={styles.infoHeader}>
                    <View style={styles.infoIcon}>
                      <FontAwesome
                        name="graduation-cap"
                        size={17}
                        color="#52665E"
                      />
                    </View>

                    <View>
                      <Text style={styles.infoLabel}>
                        EXAMINATION FORM
                      </Text>

                      <Text style={styles.infoTitle}>
                        Course Details
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.detailLabel}>Course</Text>

                      <Text
                        style={styles.detailValue}
                        numberOfLines={2}>{info['Course']}</Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.detailLabel}>
                        Batch
                      </Text>

                      <Text style={styles.detailValue}>
                        {info['Batch']}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {allSubjects.map((subject, i) => (
                <View
                  style={styles.subjectCard}
                  key={i}>

                  {/* Subject Header */}
                  <View style={styles.subjectHeader}>
                    <View style={styles.subjectNumber}>
                      <Text style={styles.subjectNumberText}>
                        {i + 1}
                      </Text>
                    </View>
                    <View style={styles.subjectNameContainer}>
                      <Text style={styles.subjectLabel}>
                        SUBJECT
                      </Text>
                      <Text
                        style={styles.subjectName}
                        numberOfLines={2}>
                        {subject['SubjectName']}
                      </Text>
                    </View>
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeText}>
                        {subject['SubjectCode']}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.subjectDivider} />

                  {/* Subject Details */}
                  <View style={styles.subjectDetails}>
                    <View style={styles.examStatusContainer}>
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor:
                              subject['ExternalExam'] == 'Y'
                                ? '#5E8B72'
                                : '#9A9DA1',
                          },
                        ]}/>

                      <Text style={styles.statusLabel}>
                        External Exam
                      </Text>

                      <Text
                        style={[
                          styles.statusValue,
                          {
                            color:
                              subject['ExternalExam'] == 'Y'
                                ? '#4F765F'
                                : '#777B80',
                          },
                        ]}>
                        {subject['ExternalExam'] == 'Y'
                          ? 'Yes'
                          : 'No'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

            </View>
          )
        }
      </ScrollView>
    </AlertNotificationRoot>
  );
};

export default StudentFilledExamForm;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },

  contentContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },

  infoCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EEF2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  infoLabel: {
    fontSize: 10,
    color: '#8A8F94',
    fontWeight: '600',
    letterSpacing: 0.6,
    marginBottom: 2,
  },

  infoTitle: {
    fontSize: 16,
    color: '#202124',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#ECEDEF',
    marginVertical: 15,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },

  infoItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 11,
    color: '#8A8F94',
    fontWeight: '500',
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    color: '#25272A',
    fontWeight: '600',
    lineHeight: 20,
  },

  /* ====== SUBJECT CARD ====== */
  subjectCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  /* ====== SUBJECT HEADER ====== */
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },

  subjectNumber: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#EEF2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  subjectNumberText: {
    fontSize: 11,
    color: '#52665E',
    fontWeight: '700',
  },

  subjectNameContainer: {
    flex: 1,
    paddingRight: 8,
  },

  subjectLabel: {
    fontSize: 9,
    color: '#9A9DA1',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  subjectName: {
    fontSize: 14,
    color: '#202124',
    fontWeight: '600',
    lineHeight: 19,
  },

  /* ====== SUBJECT CODE ====== */
  codeBadge: {
    backgroundColor: '#F1F3F5',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EA',
    maxWidth: '28%',
  },

  codeText: {
    fontSize: 10,
    color: '#555B61',
    fontWeight: '600',
    textAlign: 'center',
  },


  /* ====== SUBJECT DIVIDER ====== */

  subjectDivider: {
    height: 1,
    backgroundColor: '#F0F1F2',
    marginVertical: 13,
  },


  /* ====== EXAM STATUS ====== */

  subjectDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  examStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8F8',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  statusLabel: {
    fontSize: 11,
    color: '#777B80',
    fontWeight: '500',
    marginRight: 5,
  },

  statusValue: {
    fontSize: 11,
    fontWeight: '700',
  },


  /* ====== OLD / EXISTING STYLES ====== */

  heading: {
    flex: 1,
    alignItems: 'center',
  },

  headingTxt: {
    fontSize: 20,
    color: 'gray',
  },

  SubjectTxt: {
    fontSize: 14,
    color: '#000',
  },

  smallText: {
    fontSize: 12,
    color: 'green',
    fontWeight: '400',
  },

  SubjectTabs: {
    marginBottom: 4,
    borderRadius: 12,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: 'black',
    elevation: 2,
    alignItems: 'center',
    width: '80%',
    paddingTop: 48,
  },

  modalBtn: {
    backgroundColor: colors.uniRed,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
  },
});