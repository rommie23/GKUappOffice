import { View, Text, StyleSheet, Dimensions, TouchableHighlight, Alert, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Pressable, TouchableWithoutFeedback } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwsome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../colors';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { StudentContext, StudentContextProvider } from '../../context/StudentContext';
const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width


const Academics = ({ }) => {
    const { closeMenu } = useContext(StudentContext);
    const [loading, setLoading] = useState(false)
    const [tabsData, setTabsData] = useState([])

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
                        pageName: 'Academics_st'
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
        checkTabs();
    }, [])

    const navigation = useNavigation()
    return (

        // UI of the page with all tabs in page //
        <Pressable onPress={() => { closeMenu() }} style={{ flex: 1 }}>
            <View>
                <ScrollView>

                    {
                        loading ? <ActivityIndicator /> :
                            <View>
                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, columnGap: screenWidth / 30, paddingHorizontal: 24, justifyContent: 'flex-start', rowGap: 16, paddingBottom: 4 }}>
                                    {
                                        tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'StudyMaterial' &&
                                        <TouchableOpacity style={[styles.cards]} onPress={() => { navigation.navigate("StudentStudyMaterial"); closeMenu() }}>
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
                                                <Text style={[styles.cardText, { marginTop: 6 }]} >Study Material</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        tabsData?.[3]?.['IsVisible'] == 1 && tabsData?.[3]?.ElementName === 'Attendance' &&
                                        <TouchableOpacity style={[styles.cards]} onPress={() => { closeMenu(); navigation.navigate("StudentAttendance") }}>
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
                                                                <MaterialCommunityIcons name='fingerprint' color={colors.uniBlue} size={27} />
                                                            </View>
                                                        }
                                                    >
                                                        <LinearGradient
                                                            colors={[colors.uniRed, colors.uniBlue]}
                                                            style={{ flex: 1 }}
                                                        />
                                                    </MaskedView>

                                                </View>
                                                <Text style={[styles.cardText, { marginTop: 6 }]} >Attendance</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'Assignments' &&
                                        <TouchableOpacity style={[styles.cards]} onPress={() => { closeMenu(); navigation.navigate("StudentAssignments"); }}>
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
                                                                <MaterialCommunityIcons name='file-document-multiple' color={colors.uniBlue} size={27} />
                                                            </View>
                                                        }
                                                    >
                                                        <LinearGradient
                                                            colors={[colors.uniRed, colors.uniBlue]}
                                                            style={{ flex: 1 }}
                                                        />
                                                    </MaskedView>

                                                </View>
                                                <Text style={[styles.cardText, { marginTop: 6 }]} >Assignment</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    {
                                        tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'Syllabus' &&
                                        <TouchableOpacity style={[styles.cards]} onPress={() => { closeMenu(); navigation.navigate("StudentSyllabus") }}>
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
                                                                <FontAwsome6 name='clipboard-list' color={colors.uniBlue} size={27} />
                                                            </View>
                                                        }
                                                    >
                                                        <LinearGradient
                                                            colors={[colors.uniRed, colors.uniBlue]}
                                                            style={{ flex: 1 }}
                                                        />
                                                    </MaskedView>

                                                </View>
                                                <Text style={[styles.cardText, { marginTop: 6 }]} >Syllabus</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
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

export default Academics