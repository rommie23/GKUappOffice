// import { View, Text, Image, StyleSheet, TouchableHighlight, Alert, TouchableOpacity } from 'react-native'
// import React, { useContext } from 'react'
// import { images } from '../../images';
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
// import { useNavigation } from '@react-navigation/native';
// import colors from '../../colors';
// import { StudentContext } from '../../context/StudentContext';


// const StudentHeader = ({openDrawer}) => {
//     const { studentIDNo } = useContext(StudentContext)
//     const ImageUrl = "http://erp.gku.ac.in:86//Images/Students/";
//     const ImageExtensions = ".PNG";
//     const naviation = useNavigation();
//     return (
//         // <View></View>
//         // <View
//         //     style={
//         //         {
//         //             flex: 1, flexDirection: 'row',
//         //             justifyContent: 'space-between',
//         //             alignItems: 'center',
//         //             maxHeight: 50,
//         //             paddingHorizontal: 16,
//         //             elevation: 1,
//         //             backgroundColor: 'white'
//         //         }
//         //     }>
//         //     <TouchableOpacity style={styles.barLeft} onPress={(openDrawer)} >
//         //         <FontAwesome name="navicon" size={32} color={colors.uniBlue} />
//         //     </TouchableOpacity>

//         //     {/* <Image style={styles.barCenter} source={images.topLogo} /> */}


//         //     <TouchableOpacity style={styles.barRight} onPress={() => { naviation.navigate('Account') }} >
//         //         <Image source={{
//         //             uri: ImageUrl + studentIDNo + ImageExtensions,
//         //         }} style={styles.barRightImg} />
//         //     </TouchableOpacity>

//         // </View>
//     )
// }

// export default StudentHeader

// const styles = StyleSheet.create({
//     barCenter: {
//         width: '80%',
//         height: 28,
//         objectFit: 'contain',
//     },
//     barRight: {
//         width: "10%",
//         height: 40,
//     },
//     barLeft: {
//         width: "10%",
//         height: 40,
//     },
//     barRightImg: {
//         height: '100%',
//         width: '100%',
//         borderRadius: 20,
//     }
// })