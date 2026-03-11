import { View, Text, StyleSheet, Dimensions, TouchableHighlight, Alert, TouchableOpacity, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import colors from '../../colors';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { StudentContext } from '../../context/StudentContext';
const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width


const Examination = ({ }) => {
  const { closeMenu } = useContext(StudentContext);
  const [flag, setFlag] = useState([])
  const [loading, setLoading] = useState(false)
  const [tabsData, setTabsData] = useState([])

  const getCourseFlag = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const courseFlag = await fetch(BASE_URL + '/student/checkbutton', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          },
        })
        const courseFlagDetails = await courseFlag.json()
        setFlag(courseFlagDetails)
        // console.log('data froms api flags:::',courseFlagDetails['statusopen'][0]['flag'])
        setFlag(courseFlagDetails['statusopen'][0]['flag'])
        setLoading(false)
        // console.log(transactions);
      } catch (error) {
        console.log('Error fetching flags data:examination:', error)
        setLoading(false)
      }
    }
  }

  const checkTabs = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const tabsData = await fetch(`${BASE_URL}/student/tabsToShowStudent`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pageName: 'Examination_st'
          })
        })
        const pageTabsData = await tabsData.json()
        setTabsData(pageTabsData)
        // console.log(pageTabsData);

        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
  }
  useEffect(() => {
    getCourseFlag()
    checkTabs()
  }, [])

  const navigation = useNavigation()
  return (

    // UI of the page with all tabs in page //
    <Pressable onPress={closeMenu} style={{ flex: 1 }}>
      <View>
        <ScrollView>

          {/* ////////////////////Regular exam buttons///////////////// */}
          {
            loading ? <ActivityIndicator /> :
              <View>
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, columnGap: screenWidth / 30, paddingHorizontal: 24, justifyContent: 'flex-start', rowGap: 16, paddingBottom: 4 }}>
                  {
                    tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'RegularExamForm' &&
                    <View>
                      {
                        flag == 0 ?
                          <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('Examination Form') }}>
                            <View style={styles.cardCont}>

                              <View style={styles.iconOuter}>
                                <MaskedView
                                  style={{ flexDirection: 'row', height: 24, width: 24 }}
                                  maskElement={
                                    <View
                                      style={{
                                        backgroundColor: 'transparent',
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
                                    </View>
                                  }
                                >
                                  {/* Shows behind the mask, you can put anything here, such as an image */}
                                  <LinearGradient
                                    colors={[colors.uniRed, colors.uniBlue]}
                                    style={{ flex: 1 }}
                                  />
                                </MaskedView>
                              </View>
                              <Text style={styles.cardText}>Regular Exam Form</Text>
                            </View>
                          </TouchableOpacity>
                          :
                          flag == 1 ?

                            // Phd Regular Button

                            <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('ExaminationFormPhd') }}>
                              <View style={styles.cardCont}>
                                <View style={styles.iconOuter}>
                                  <MaskedView
                                    style={{ flexDirection: 'row', height: 24, width: 24 }}
                                    maskElement={
                                      <View
                                        style={{
                                          backgroundColor: 'transparent',
                                          flex: 1,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
                                      </View>
                                    }
                                  >
                                    <LinearGradient
                                      colors={[colors.uniRed, colors.uniBlue]}
                                      style={{ flex: 1 }}
                                    />
                                  </MaskedView>
                                </View>
                                {/* <Text style={styles.cardText}>Regular Exam Form Phd</Text> */}
                                <Text style={styles.cardText}>Regular Exam Form</Text>
                              </View>
                            </TouchableOpacity>

                            // Agriculture Diploma Regular Button
                            : flag == 2 ?
                              <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('ExamFormAgricultureDiploma') }}>
                                <View style={styles.cardCont}>
                                  <View style={styles.iconOuter}>
                                    <MaskedView
                                      style={{ flexDirection: 'row', height: 24, width: 24 }}
                                      maskElement={
                                        <View
                                          style={{
                                            backgroundColor: 'transparent',
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
                                        </View>
                                      }
                                    >
                                      {/* Shows behind the mask, you can put anything here, such as an image */}
                                      <LinearGradient
                                        colors={[colors.uniRed, colors.uniBlue]}
                                        style={{ flex: 1 }}
                                      />
                                    </MaskedView>
                                  </View>
                                  <Text style={styles.cardText}>Regular Exam Form</Text>
                                  {/* <Text style={styles.cardText}>Regular Exam Form Diploma Agriculture</Text> */}
                                </View>
                              </TouchableOpacity>
                              : null
                      }
                    </View>
                  }
                  {/* ////////////////////Reappear exam buttons///////////////// */}
                  {
                    tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'ReAppearExamForm' &&
                    <View>
                      {
                        flag == 0 ?
                          <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('Reappear Form') }}>
                            <View style={styles.cardCont}>
                              <View style={styles.iconOuter}>
                                <MaskedView
                                  style={{ flexDirection: 'row', height: 24, width: 24 }}
                                  maskElement={
                                    <View
                                      style={{
                                        backgroundColor: 'transparent',
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
                                    </View>
                                  }
                                >
                                  <LinearGradient
                                    colors={[colors.uniRed, colors.uniBlue]}
                                    style={{ flex: 1 }}
                                  />
                                </MaskedView>
                              </View>
                              <Text style={styles.cardText}>Re-Appear Exam Form</Text>
                            </View>
                          </TouchableOpacity>
                          : flag == 1 ?
                            <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('ReappearFormPhd') }}>
                              <View style={styles.cardCont}>
                                <View style={styles.iconOuter}>
                                  <MaskedView
                                    style={{ flexDirection: 'row', height: 24, width: 24 }}
                                    maskElement={
                                      <View
                                        style={{
                                          backgroundColor: 'transparent',
                                          flex: 1,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
                                      </View>
                                    }
                                  >
                                    <LinearGradient
                                      colors={[colors.uniRed, colors.uniBlue]}
                                      style={{ flex: 1 }}
                                    />
                                  </MaskedView>
                                </View>
                                <Text style={styles.cardText}>Re-Appear Exam Form</Text>
                                {/* <Text style={styles.cardText}>Re-Appear Exam Form Phd</Text> */}
                              </View>
                            </TouchableOpacity>
                            : flag == 2 ?
                              <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('ReappearFormAgricultureDiploma') }}>
                                <View style={styles.cardCont}>
                                  <View style={styles.iconOuter}>
                                    <MaskedView
                                      style={{ flexDirection: 'row', height: 24, width: 24 }}
                                      maskElement={
                                        <View
                                          style={{
                                            backgroundColor: 'transparent',
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
                                        </View>
                                      }
                                    >
                                      <LinearGradient
                                        colors={[colors.uniRed, colors.uniBlue]}
                                        style={{ flex: 1 }}
                                      />
                                    </MaskedView>
                                  </View>
                                  <Text style={styles.cardText}>Re-Appear Exam Form</Text>
                                  {/* <Text style={styles.cardText}>Re-Appear Exam Form Diploma Agriculture</Text> */}
                                </View>
                              </TouchableOpacity>
                              : null
                      }
                    </View>
                  }

                  {
                    tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'Results' &&
                    <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('Result') }}>
                      <View style={styles.cardCont}>
                        <View style={styles.iconOuter}>
                          <MaskedView
                            style={{ flexDirection: 'row', height: 27, width: 27 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Entypo name='graduation-cap' size={27} color={colors.uniBlue} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>

                        </View>
                        <Text style={styles.cardText}>Result</Text>
                      </View>
                    </TouchableOpacity>
                  }

                  {
                    tabsData?.[3]?.['IsVisible'] == 1 && tabsData?.[3]?.ElementName === 'AllSubjects' &&
                    <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('AllSubjectsSemWise') }}>
                      <View style={styles.cardCont}>
                        <View style={styles.iconOuter}>
                          <MaskedView
                            style={{ flexDirection: 'row', height: 24, width: 24 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Entypo name='open-book' size={24} color={colors.uniBlue} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>

                        </View>
                        <Text style={styles.cardText}>All Subjects</Text>
                      </View>
                    </TouchableOpacity>
                  }

                  {
                    tabsData?.[4]?.['IsVisible'] == 1 && tabsData?.[4]?.ElementName === 'PreviousExamForms' &&
                    <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('MyForms') }}>
                      <View style={styles.cardCont}>
                        <View style={styles.iconOuter}>
                          <MaskedView
                            style={{ flexDirection: 'row', height: 24, width: 24 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name='text-box-check-outline' color={colors.uniBlue} size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>

                        </View>
                        <Text style={styles.cardText} >Previous Exam Forms</Text>
                      </View>
                    </TouchableOpacity>
                  }

                  {
                    tabsData?.[5]?.['IsVisible'] == 1 && tabsData?.[5]?.ElementName === 'CGPACalculator' &&
                    <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('CGPA Calculator') }}>
                      <View style={styles.cardCont}>
                        <View style={styles.iconOuter}>
                          <MaskedView
                            style={{ flexDirection: 'row', height: 24, width: 24 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <FontAwesome name='dashboard' color={colors.uniBlue} size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>

                        </View>
                        <Text style={styles.cardText} >CGPA Calulator</Text>
                      </View>
                    </TouchableOpacity>
                  }

                  {
                    tabsData?.[6]?.['IsVisible'] == 1 && tabsData?.[6]?.ElementName === 'AdmitCard' &&
                    <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('AdmitCard') }}>
                      <View style={styles.cardCont}>
                        <View style={styles.iconOuter}>
                          <MaskedView
                            style={{ flexDirection: 'row', height: 24, width: 24 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Entypo name='v-card' color={colors.uniBlue} size={24} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>

                        </View>
                        <Text style={styles.cardText} >Admit Card</Text>
                      </View>
                    </TouchableOpacity>
                  }

                  {
                    tabsData?.[7]?.['IsVisible'] == 1 && tabsData?.[7]?.ElementName === 'PreRequesite' &&
                    <TouchableOpacity style={[styles.cards]} onPress={() => { closeMenu(); navigation.navigate('PreRequisite') }}>
                      <View style={styles.cardCont}>
                        <View style={[styles.iconOuter, { marginTop: -2 }]}>
                          <MaskedView
                            style={{ flexDirection: 'row', height: 27, width: 27 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <MaterialCommunityIcons name='text-box-search' color={colors.uniBlue} size={27} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>

                        </View>
                        <Text style={[styles.cardText, { marginTop: 6 }]} >Pre-Requisite</Text>
                      </View>
                    </TouchableOpacity>
                  }
                  {
                    tabsData?.[8]?.['IsVisible'] == 1 && tabsData?.[8]?.ElementName === 'DateSheet' &&
                    <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('DateSheet') }}>
                      <View style={styles.cardCont}>
                        <View style={styles.iconOuter}>
                          <MaskedView
                            style={{ flexDirection: 'row', height: 24, width: 24 }}
                            maskElement={
                              <View
                                style={{
                                  backgroundColor: 'transparent',
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <FontAwesome name='list' size={24} color={colors.uniBlue} />
                              </View>
                            }
                          >
                            <LinearGradient
                              colors={[colors.uniRed, colors.uniBlue]}
                              style={{ flex: 1 }}
                            />
                          </MaskedView>

                        </View>
                        <Text style={styles.cardText}>Date Sheet</Text>
                      </View>
                    </TouchableOpacity>
                  }
                  {/* <TouchableOpacity style={styles.cards} onPress={() => {closeMenu(); navigation.navigate('MyService')}}>
                  <View style={styles.cardCont}>
                    <View style={styles.iconOuter}>
                      <MaskedView
                        style={{ flexDirection: 'row', height: 24, width: 24 }}
                        maskElement={
                          <View
                            style={{
                              backgroundColor: 'transparent',
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <MaterialCommunityIcons name='account-edit' color={colors.uniBlue} size={24} />
                          </View>
                        }
                      >
                        <LinearGradient
                          colors={[colors.uniRed, colors.uniBlue]}
                          style={{ flex: 1 }}
                        />
                      </MaskedView>

                    </View>
                    <Text style={styles.cardText} >My services Test</Text>
                  </View>
                </TouchableOpacity> */}

                </View>
              </View>
          }
        </ScrollView>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({

  // Common CSS of all the cards
  cards: {
    width: screenWidth / 2.4,
    paddingBottom: 28,
    // backgroundColor:'green',
    alignSelf: 'center',
    elevation: 2,
    backgroundColor: 'white',
    // opacity: disabled? 0.5 :1
    borderRadius: 8
  },
  cardText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    color: '#1b1b1b'
  },

  // Card outer container CSS
  cardCont: {
    alignItems: 'center',
    height: screenHeight / 11,
    padding: 8,
    alignSelf: 'center',
  },
  iconOuter: {
    borderColor: colors.uniBlue,
    borderWidth: 1,
    borderRadius: 32,
    padding: 10,
  },
})

export default Examination