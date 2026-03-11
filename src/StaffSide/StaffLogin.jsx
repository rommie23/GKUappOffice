import { View, Text, Image, StyleSheet, Dimensions, Alert, ScrollView, TextInput, Pressable, Modal, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { images } from '../images';
// import { ScrollView, TextInput } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StudentContext } from '../context/StudentContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Footer from '../Footer';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import AntDesign from 'react-native-vector-icons/AntDesign';


const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const Login = () => {
    const navigation = useNavigation()
    const { setData, setIsLoggedin, setUserType, setStaffIDNo } = useContext(StudentContext);
    const [password, setPassword] = useState('')
    const [studentId, setStudentId] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isloading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    ///////////////////// toggle for password show and hide in login page /////////////////////////////
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    // //////////// Check if user is already login and send user to studentDashboard /////////////////
    // on hit of login button login user and check user id then get data from db according to the user id //
    const checkSession = async () => {
        // setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session) {
            // navigation.navigate('StaffDashboard')
            try {
                const studentDetails = await fetch(BASE_URL + '/Staff/profile/', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                })

                if (studentDetails.status === 401) {
                    await EncryptedStorage.removeItem("user_session")
                    setIsLoggedin(false)
                    setIsLoading(false)
                    submitModel(ALERT_TYPE.DANGER, "Check Status", "You are marked as Left")
                    return
                }
                const studentDetailsData = await studentDetails.json()
                // console.log(studentDetailsData)
                setData(studentDetailsData)
                setIsLoggedin(true)
                setUserType('Staff')
                setIsLoading(false)
                setStaffIDNo(studentDetailsData['data'][0]['IDNo']);

            } catch (error) {
                // console.log('Error fetching Guri data:Login:', error);
                setIsLoading(false)
            }
        }

    }
    useEffect(() => {
        checkSession()
    }, [])


    // function to send data for 

    const clickLoginButton = async () => {
        // console.log(studentId, password)
        setIsLoading(true)
        try {
            const apiData = await fetch(BASE_URL + '/staff/login', {
                method: 'POST',
                headers: {
                    Accept: "applicaion/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    username: studentId,
                    password: password
                }),
            })
            const result = await apiData.json()
            console.log(result);

            if (!result['token']) {
                setIsLoading(false)
                errorModel(ALERT_TYPE.WARNING, "Login Error", result["message"])
                return;
            }
            // console.log('Result:',result['token'])
            else {
                setData(result)
                setUserType('staff')
                try {
                    await EncryptedStorage.setItem(
                        "user_session",
                        result['token']

                    )
                    setIsLoggedin(false)
                } catch (error) {
                    console.log('storage error loginFile', error);
                }
                ////////////////// sending token with user ID to get data from another table /////////////////
                const session = await EncryptedStorage.getItem("user_session")
                if (session !== null) {
                    checkSession();
                }
                else {
                    console.log();

                    Alert.alert('Invalid Credential please check id and password !!!!')
                    setIsLoading(false)
                    errorModel(ALERT_TYPE.WARNING, "Invalid Credentials", `please check id and password`)
                    // setShowModal(true)
                    return;
                }
            }
        } catch (error) {
            console.log('promise rejected', error);
            submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
            setIsLoading(false)
            return;
        }
    }

    ///////////////////////////// modal appears when something went wrong ///////////////////////////
    const errorModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
            onHide: () => navigation.goBack()
        })
    }
    const submitModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
            onHide: setIsLoading(false)
        })

    }
    return (
        <AlertNotificationRoot>
            <View>
                {isloading &&
                    <Spinner
                        visible={isloading}
                    // textContent='loading...'
                    />
                }
                {/* <View style={{backgroundColor:'#ffbc3b', paddingHorizontal:20, paddingVertical:8, zIndex:999}}>
            <Image style={styles.logoTop} source={images.topLogo}/>
        </View> */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={0}
                >
                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                        {/* <ImageBackground source={images.bgLogin} style={{height:'100%', width:'100%'}} imageStyle={{opacity:0.8}}> */}
                        {/* //////////////// Login form //////////////////// */}
                        {
                            Platform.OS == 'ios' &&
                            <TouchableOpacity style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', columnGap: 8, marginLeft: 8, marginTop: 50 }} onPress={() => navigation.goBack()}>
                                <FontAwesome name='angle-left' size={24} color={`blue`} />
                                <Text style={{ color: 'blue', fontSize: 16 }}>Back</Text>
                            </TouchableOpacity>
                        }
                        <View style={[styles.container, { paddingTop: Platform.OS == 'ios' ? 50 : 100, marginBottom: 24 }]}>
                            <Image style={styles.logoImage} source={images.logo} />
                            <Text style={styles.title}>Employee Login</Text>
                            <View style={styles.inputView}>
                                <View style={styles.loginInput} collapsable={false}>
                                    <FontAwesome
                                        name='user'
                                        size={24}
                                        color="#223260"
                                        style={styles.icon}
                                    />
                                    <TextInput
                                        style={styles.inputBox}
                                        placeholder='Enter Employee ID'
                                        onChange={e => setStudentId(e.nativeEvent.text)}
                                        placeholderTextColor={'#666666'}
                                        keyboardType='numeric'
                                        underlineColorAndroid="transparent"
                                        importantForAutofill="no"
                                        autoCorrect={false}
                                        allowFontScaling={false}
                                    />
                                </View>
                                <View style={styles.loginInput}>
                                    <FontAwesome
                                        name={'lock'}
                                        size={24}
                                        color="#223260"
                                        style={styles.icon}
                                    />
                                    <TextInput
                                        style={styles.inputBox}
                                        placeholder='Enter Your Password'
                                        secureTextEntry={!showPassword}
                                        onChange={e => setPassword(e.nativeEvent.text)}
                                        placeholderTextColor={'#666666'}
                                    />
                                    <MaterialCommunityIcons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={24}
                                        color="#223260"
                                        style={styles.icon}
                                        onPress={toggleShowPassword}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('PasswordForgot')}>
                                    <View>
                                        <Text style={{ fontWeight: '800', color: '#223260' }}>Forgot Password</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={[
                                        styles.selectionbtnFull,
                                        {
                                            backgroundColor: '#fff',
                                            borderWidth: 2,
                                            borderRadius: 36,
                                            borderColor: colors.uniBlue,
                                            paddingVertical: 14,
                                            elevation: 4,
                                            shadowColor: '#000',
                                            shadowOpacity: 0.08,
                                            shadowRadius: 8,
                                            shadowOffset: { width: 0, height: 4 },
                                            paddingHorizontal: 36,
                                            marginBottom: 16,
                                            width: '50%',
                                            alignSelf: 'center',
                                            alignItems: 'center'
                                        },
                                    ]}
                                    onPress={() => clickLoginButton()}
                                >
                                    {/* Optional icon inside button */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.selectionbtnText,
                                                {
                                                    color: '#223260',
                                                    fontSize: 15,
                                                    fontWeight: '600',
                                                    letterSpacing: 0.5,
                                                },
                                            ]}
                                        >Login</Text>
                                        <AntDesign name="login" color="#000" size={24} />

                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* ///////////////////// social media icons////////////////// */}
                        <Footer />

                        {/* </ImageBackground> */}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </AlertNotificationRoot>
    )
}

export default Login


//////////////////// CSS of the page ///////////////////////////

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 50,
    },
    logoTop: {
        width: screenWidth,
        height: screenHeight / 25,
        resizeMode: 'contain',
    },
    logoImage: {
        //   opacity:0.8,
        height: 160,
        width: 170,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        // textTransform : "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: "#223260"
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 5
    },
    inputBox: {
        height: 55,
        paddingHorizontal: 20,
        width: '90%',
        color: 'black',
    },
    loginInput: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 24,
        // justifyContent:'space-between',
        alignItems: 'center',
        borderColor: "#223260",
        borderWidth: 1,
        borderRadius: 30,
        //   paddingBottom:0
        backgroundColor: '#fff'

    },
    button: {
        backgroundColor: "#223260",
        height: 55,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },
    btnText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
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
        paddingTop: 48
    },
    modalBtn: {
        backgroundColor: colors.uniBlue,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginVertical: 8
    },
    textSmall: {
        color: 'gray',
        fontSize: 16
    }
});