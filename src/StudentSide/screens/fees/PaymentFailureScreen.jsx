import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6'
import colors from '../../../colors'
import { useNavigation } from '@react-navigation/native'

const { height, width } = Dimensions.get('window')


const PaymentFailureScreen = ({ route }) => {
    const status = route?.params?.status;
    console.log(status);
    const navigation = useNavigation()
    return (
        <View style={{ height, width, alignItems: 'center' }}>
            <View style={{ backgroundColor: 'white', paddingHorizontal: 24, marginTop: 24, borderRadius: 32, elevation: 1 }}>
                <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginTop: 24 }}>
                    <View style={{ backgroundColor: '#FF0024', height: 150, width: 150, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                        <FontAwesome6Icon name='x' size={120} color={'white'} />
                    </View>
                    <Text style={{ color: '#FF0024', fontSize: 28 }}>Payment Failed</Text>
                    <Text style={{ color: '#FF0024', fontSize: 18, marginBottom: 16 }}>Try again after sometime</Text>

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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1b1b1b' }}>TXN ID:</Text>
                            <Text style={{ fontSize: 16, color: '#1b1b1b', flexShrink: 1, textAlign: 'right' }}>{status['txnid']}</Text>
                        </View> 

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1b1b1b' }}>Status:</Text>
                            <Text style={{ fontSize: 16, color: '#1b1b1b', flexShrink: 1, textAlign: 'right' }}>{status['status']}</Text>
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
    )
}

export default PaymentFailureScreen

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