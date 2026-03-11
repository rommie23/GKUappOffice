import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const VerifyModal = () => {
  return (
    <View>
      <Text>VerifyModal</Text>
    </View>
  )
}

export default VerifyModal

const styles = StyleSheet.create({})

// import React, { useRef, useState } from 'react';
// import { View, Button, Text, StyleSheet, Alert } from 'react-native';
// import OTPTextInput from 'react-native-otp-textinput';

// const VerifyModal = () => {
//     const [otp, setOtp] = useState('');
//     const otpInput = useRef(null);

//     const handleVerifyOTP = () => {
//         if (otp === '123456') {
//             Alert.alert('Success', 'OTP verified successfully!');
//         } else {
//             Alert.alert('Error', 'Invalid OTP. Please try again.');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Enter OTP</Text>
//             <OTPTextInput
//                 ref={otpInput}
//                 handleTextChange={setOtp}
//                 inputCount={6} // Number of OTP digits
//                 textInputStyle={styles.otpInput}
//             />
//             <Button title="Verify OTP" onPress={handleVerifyOTP} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     otpInput: {
//         borderBottomWidth: 2,
//         borderBottomColor: '#000',
//         width: 40,
//         height: 40,
//         margin: 5,
//         fontSize: 20,
//         textAlign: 'center',
//     },
// });

// export default VerifyModal;
