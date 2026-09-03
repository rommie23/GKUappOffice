import {View, Text, StyleSheet, Dimensions, TouchableOpacity, TouchableHighlight,ActivityIndicator} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import React, {useCallback, useContext, useEffect, useState} from 'react';

import { StudentContext } from '../../../context/StudentContext';
import Spinner from 'react-native-loading-spinner-overlay';
import {ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
const screenWidth = Dimensions.get('window').width;
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/native';

const AllSubjectsSemWise = () => {
  const { data } = useContext(StudentContext);

  const [accordionSelected, setaccordionSelected] = useState(null);
  const [allSemesters, setAllSemesters] = useState({});
  const [allSubjects, setAllSubjects] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [isloadingNew, setIsLoadingNew] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  // get all the subjects form the backend
  const getSemesters = async () => {
    const session = await EncryptedStorage.getItem('user_session');
    if (session != null) {
      try {
        const semesters = await fetch(BASE_URL + '/Student/noofsem/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
          },
        });
        const totalsemestersData = await semesters.json();
        if (
          totalsemestersData['semesters']['rowsAffected'] == 0
        ) {
          newModel(ALERT_TYPE.WARNING, 'No Subjects', 'There are no subjects to show');
        }
        setAllSemesters(totalsemestersData);
        setIsLoading(false);
      } catch (error) {
        newModel(
          ALERT_TYPE.DANGER,
          'Oops!!!',
          'Something went wrong !!!',
        );

        console.log(
          'Error fetching Guri data:AllsubjectsSemwise:',
          error,
        );
      }
    }
  };

  useEffect(() => {
    getSemesters();
  }, []);

  // pass the semester value to backend
  // so the api will give data according to the semester
  const getSubjects = async (semid) => {
    setIsLoadingNew(true);

    const session = await EncryptedStorage.getItem('user_session');

    if (session != null) {
      try {
        const subjects = await fetch(
          `${BASE_URL}/student/subjects/${semid}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-type': 'application/json',
              Authorization: `Bearer ${session}`,
            },
            body: JSON.stringify({
              semid: semid,
            }),
          },
        );

        const subjectsData = await subjects.json();

        setAllSubjects(
          subjectsData['semesters']['recordsets'][0],
        );

        setIsLoadingNew(false);
      } catch (error) {
        console.log(
          'Error fetching subjects data:AllsubjectsSemwise:',
          error,
        );
        setIsLoadingNew(false);
        newModel(
          ALERT_TYPE.DANGER,
          'Oops!!!',
          'Something went wrong !!!',
        );
      }
    }
  };

  const toggle = (i) => {
    if (accordionSelected == i) {
      return setaccordionSelected(null);
    }
    setaccordionSelected(i);
  };

  const accordianClick = (i, semid) => {
    getSubjects(semid);
    toggle(i);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getSemesters();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const newModel = (type, title, message) => {
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
      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#5A6F66"
            />
          }
        >
          {isloading ? (
            <Spinner
              visible={isloading}
              size={'large'}
            />
          ) : (
            allSemesters.semesters.recordset.map((item, i) => (
              <View
                key={i}
                style={styles.card}
              >
                {/* Semester Header */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={styles.topCard}
                  onPress={() =>
                    accordianClick(
                      i,
                      item['SemesterId'],
                    )
                  }
                >
                  <View style={styles.semesterInfo}>
                    <View style={styles.semesterIcon}>
                      <Feather
                        name="book-open"
                        size={17}
                        color="#52665E"
                      />
                    </View>

                    <View>
                      <Text style={styles.sectionLabel}>
                        ACADEMIC SEMESTER
                      </Text>

                      <Text style={styles.textStyle}>
                        Semester {item.SemesterId}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.touchBtn}
                    onPress={() =>
                      accordianClick(
                        i,
                        item['SemesterId'],
                      )
                    }
                  >
                    <Feather
                      name={
                        accordionSelected === i
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={19}
                      color="#4B5055"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                {/* Expanded Subjects */}
                <View
                  style={{
                    height:
                      accordionSelected != i
                        ? 0
                        : isloadingNew
                        ? 60
                        : null,
                  }}
                >
                  {allSubjects.map((subject, index) => (
                    <View
                      key={index}
                      style={styles.SubjectView}
                    >
                      {accordionSelected == i &&
                      isloadingNew ? (
                        <View style={styles.loaderContainer}>
                          <ActivityIndicator
                            size="small"
                            color="#5A6F66"
                          />
                        </View>
                      ) : (
                        <>
                          {/* Subject Name */}
                          <View style={styles.subjectHeader}>
                            <View style={styles.subjectNumber}>
                              <Text style={styles.subjectNumberText}>
                                {index + 1}
                              </Text>
                            </View>

                            <Text
                              style={styles.SubjectTxt}
                              numberOfLines={2}
                            >
                              {subject.SubjectName}
                            </Text>
                          </View>

                          {/* Subject Details */}
                          <View style={styles.subjectDetails}>
                            <TouchableHighlight
                              style={styles.SubjectTabs}
                              underlayColor="#E7E9EB"
                            >
                              <Text style={styles.smallText}>
                                SEM - {subject.SemesterID}
                              </Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                              style={styles.SubjectTabs}
                              underlayColor="#E7E9EB"
                            >
                              <Text style={styles.smallText}>
                                {subject.SubjectType == 'T'
                                  ? 'Theory'
                                  : 'Practical'}
                              </Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                              style={styles.SubjectTabs}
                              underlayColor="#E7E9EB"
                            >
                              <Text style={styles.smallText}>
                                {subject.SubjectCode}
                              </Text>
                            </TouchableHighlight>
                          </View>
                        </>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  );
};

export default AllSubjectsSemWise;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 7,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: screenWidth - 24,
    marginVertical: 7,
    borderRadius: 16,
    alignSelf: 'center',
    overflow: 'hidden',

    // Android
    elevation: 2,

    // iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  topCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  semesterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  semesterIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 10,
    color: '#8A8F94',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  textStyle: {
    color: '#202124',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  touchBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SubjectView: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FAFAFB',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F2',
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subjectNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#52665E',
  },
  SubjectTxt: {
    flex: 1,
    fontSize: 15,
    color: '#202124',
    fontWeight: '500',
    lineHeight: 21,
  },
  subjectDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 13,
  },
  SubjectTabs: {
    backgroundColor: '#F0F2F4',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EA',
  },
  smallText: {
    fontSize: 10,
    color: '#555B61',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  loaderContainer: {
    height: 28,

    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#777B80',
    fontSize: 12,
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
    paddingTop: 48,
    borderRadius: 20,
    shadowColor: 'black',
    elevation: 2,
    alignItems: 'center',
    width: '80%',
  },
  modalBtn: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 12,
  },
});