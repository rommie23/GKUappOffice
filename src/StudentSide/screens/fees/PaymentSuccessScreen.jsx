import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6'
import { useNavigation } from '@react-navigation/native'

const { height, width } = Dimensions.get('window')

const PaymentSuccessScreen = ({ route }) => {
    const status = route?.params?.status;
    console.log(status);
    const navigation = useNavigation()

    return (
        <ScrollView>

            <View style={{ height, width, alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', paddingHorizontal: 24, marginTop: 24, borderRadius: 32, elevation: 1 }}>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 24 }}>
                        <View style={{ backgroundColor: '#5CE65C', height: 150, width: 150, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                            <FontAwesome6Icon name='check' size={120} color={'white'} />
                        </View>
                        <Text style={{ color: '#5CE65C', fontSize: 28 }}>Payment Success</Text>
                        <View
                            style={{
                                width: '100%',
                                marginVertical: 26,
                                backgroundColor: '#fff',
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                padding: 12,

                            }}
                        >
                            <View style={{ justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: '#727070' }}>TXN ID:</Text>
                                <Text style={{ fontSize: 16, color: '#1b1b1b', flexShrink: 1 }}>{status['txnid']}</Text>
                            </View>

                            <View style={{ justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: '#727070' }}>Amount:</Text>
                                <Text style={{ fontSize: 16, color: '#1b1b1b', flexShrink: 1 }}>{ status['amount'] ? status['amount'] : status['Amount']}</Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: '#727070' }}>Name:</Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: '#1b1b1b',
                                        flexShrink: 1,        // allow shrinking
                                        flexWrap: 'wrap',     // allow wrapping
                                        maxWidth: '100%',      // limit width to prevent overlap
                                    }}
                                >
                                    {status['firstname'] ? status['firstname'] : status['Name']}
                                </Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: '#727070' }}>Mobile:</Text>
                                <Text style={{ fontSize: 16, color: '#1b1b1b', flexShrink: 1 }}>{status['phone'] ? status['phone'] : status['MobileNo']}</Text>
                            </View>

                            <View style={{ justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: '#727070' }}>Email:</Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: '#1b1b1b',
                                        flexShrink: 1,        // allow shrinking
                                        flexWrap: 'wrap',     // allow wrapping
                                        maxWidth: '100%',      // limit width to prevent overlap
                                    }}
                                >
                                    {status['email'] ? status['email'] : status['Email']}
                                </Text>
                            </View>

                            <View style={{ justifyContent: 'space-between', paddingVertical: 8 }}>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: '#727070' }}>Status:</Text>
                                <Text style={{ fontSize: 16, color: '#1b1b1b', flexShrink: 1 }}>{status['status'] ? status['status'] : status['Status'] == 'captured' ? 'Success' : 'Failed'}</Text>
                            </View>
                        </View>

                    </View>
                </View>
                <Pressable
                    style={styles.button}
                    onPress={() => { navigation.goBack() }}
                >
                    <Text style={styles.btnText}>Go To Dashboard</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

export default PaymentSuccessScreen

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#223260",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        marginTop: 16,
        paddingHorizontal: 40,
        paddingVertical: 12
    },
    btnText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
})