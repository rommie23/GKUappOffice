import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwsome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../colors';
import { useNavigation } from '@react-navigation/native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';


const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const StudentGrievance = () => {
    const navigation = useNavigation()

    const errorModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
        })
    }
    return (
        <View>
            <ScrollView>
                {
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, columnGap: screenWidth / 30, paddingHorizontal: 24, justifyContent: 'flex-start', rowGap: 16, paddingBottom: 4 }}>
                            <TouchableOpacity style={[styles.cards]} onPress={() => navigation.navigate("GrievanceForm")}>
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
                                    <Text style={[styles.cardText, { marginTop: 6 }]} >Grievance Form</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.cards]} onPress={() => navigation.navigate("TrackGrievance")}>
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
                                                    <FontAwsome6 name='user-shield' color={colors.uniBlue} size={21} />
                                                </View>
                                            }
                                        >
                                            <LinearGradient
                                                colors={[colors.uniRed, colors.uniBlue]}
                                                style={{ flex: 1 }}
                                            />
                                        </MaskedView>

                                    </View>
                                    <Text style={[styles.cardText, { marginTop: 6 }]} >Track Grievance</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </ScrollView>
        </View>
    )
}

export default StudentGrievance

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