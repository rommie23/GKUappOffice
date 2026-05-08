// import { View, Text, StyleSheet, Dimensions, TouchableHighlight, Alert, TouchableOpacity, ScrollView, ActivityIndicator, Pressable } from 'react-native'
// import React, { useContext, useEffect, useState } from 'react'
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Entypo from 'react-native-vector-icons/Entypo'
// import colors from '../../colors';
// import { useNavigation } from '@react-navigation/native';
// import EncryptedStorage from 'react-native-encrypted-storage';
// import { BASE_URL } from '@env';
// import MaskedView from '@react-native-masked-view/masked-view';
// import LinearGradient from 'react-native-linear-gradient';
// import { StudentContext } from '../../context/StudentContext';
// const screenHeight = Dimensions.get('window').height
// const screenWidth = Dimensions.get('window').width


// const Examination = ({ }) => {
//   const { closeMenu } = useContext(StudentContext);
//   const [flag, setFlag] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [tabsData, setTabsData] = useState([])

//   const getCourseFlag = async () => {
//     setLoading(true)
//     const session = await EncryptedStorage.getItem("user_session")
//     if (session != null) {
//       try {
//         const courseFlag = await fetch(BASE_URL + '/student/checkbutton', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${session}`
//           },
//         })
//         const courseFlagDetails = await courseFlag.json()
//         setFlag(courseFlagDetails)
//         // console.log('data froms api flags:::',courseFlagDetails['statusopen'][0]['flag'])
//         setFlag(courseFlagDetails['statusopen'][0]['flag'])
//         setLoading(false)
//         // console.log(transactions);
//       } catch (error) {
//         console.log('Error fetching flags data:examination:', error)
//         setLoading(false)
//       }
//     }
//   }

//   const checkTabs = async () => {
//     setLoading(true)
//     const session = await EncryptedStorage.getItem("user_session")
//     if (session != null) {
//       try {
//         const tabsData = await fetch(`${BASE_URL}/student/tabsToShowStudent`, {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${session}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             pageName: 'Examination_st'
//           })
//         })
//         const pageTabsData = await tabsData.json()
//         setTabsData(pageTabsData)
//         // console.log(pageTabsData);

//         setLoading(false)
//       } catch (error) {
//         console.log(error);
//         setLoading(false)
//       }
//     }
//   }
//   useEffect(() => {
//     getCourseFlag()
//     checkTabs()
//   }, [])

//   const navigation = useNavigation()
//   return (

//     // UI of the page with all tabs in page //
//     <Pressable onPress={closeMenu} style={{ flex: 1 }}>
//       <View>
//         <ScrollView>

//           {/* ////////////////////Regular exam buttons///////////////// */}
//           {
//             loading ? <ActivityIndicator /> :
//               <View>
//                 <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, columnGap: screenWidth / 30, paddingHorizontal: 24, justifyContent: 'flex-start', rowGap: 16, paddingBottom: 4 }}>
//                   {
//                     tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'RegularExamForm' &&
//                     <View>
//                       {
//                         flag == 0 ?
//                           <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('Examination Form') }}>
//                             <View style={styles.cardCont}>

//                               <View style={styles.iconOuter}>
//                                 <MaskedView
//                                   style={{ flexDirection: 'row', height: 24, width: 24 }}
//                                   maskElement={
//                                     <View
//                                       style={{
//                                         backgroundColor: 'transparent',
//                                         flex: 1,
//                                         justifyContent: 'center',
//                                         alignItems: 'center',
//                                       }}
//                                     >
//                                       <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
//                                     </View>
//                                   }
//                                 >
//                                   {/* Shows behind the mask, you can put anything here, such as an image */}
//                                   <LinearGradient
//                                     colors={[colors.uniRed, colors.uniBlue]}
//                                     style={{ flex: 1 }}
//                                   />
//                                 </MaskedView>
//                               </View>
//                               <Text style={styles.cardText}>Regular Exam Form</Text>
//                             </View>
//                           </TouchableOpacity>
//                           :
//                           flag == 1 ?

//                             // Phd Regular Button

//                             <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('ExaminationFormPhd') }}>
//                               <View style={styles.cardCont}>
//                                 <View style={styles.iconOuter}>
//                                   <MaskedView
//                                     style={{ flexDirection: 'row', height: 24, width: 24 }}
//                                     maskElement={
//                                       <View
//                                         style={{
//                                           backgroundColor: 'transparent',
//                                           flex: 1,
//                                           justifyContent: 'center',
//                                           alignItems: 'center',
//                                         }}
//                                       >
//                                         <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
//                                       </View>
//                                     }
//                                   >
//                                     <LinearGradient
//                                       colors={[colors.uniRed, colors.uniBlue]}
//                                       style={{ flex: 1 }}
//                                     />
//                                   </MaskedView>
//                                 </View>
//                                 {/* <Text style={styles.cardText}>Regular Exam Form Phd</Text> */}
//                                 <Text style={styles.cardText}>Regular Exam Form</Text>
//                               </View>
//                             </TouchableOpacity>

//                             // Agriculture Diploma Regular Button
//                             : flag == 2 ?
//                               <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('ExamFormAgricultureDiploma') }}>
//                                 <View style={styles.cardCont}>
//                                   <View style={styles.iconOuter}>
//                                     <MaskedView
//                                       style={{ flexDirection: 'row', height: 24, width: 24 }}
//                                       maskElement={
//                                         <View
//                                           style={{
//                                             backgroundColor: 'transparent',
//                                             flex: 1,
//                                             justifyContent: 'center',
//                                             alignItems: 'center',
//                                           }}
//                                         >
//                                           <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
//                                         </View>
//                                       }
//                                     >
//                                       {/* Shows behind the mask, you can put anything here, such as an image */}
//                                       <LinearGradient
//                                         colors={[colors.uniRed, colors.uniBlue]}
//                                         style={{ flex: 1 }}
//                                       />
//                                     </MaskedView>
//                                   </View>
//                                   <Text style={styles.cardText}>Regular Exam Form</Text>
//                                   {/* <Text style={styles.cardText}>Regular Exam Form Diploma Agriculture</Text> */}
//                                 </View>
//                               </TouchableOpacity>
//                               : null
//                       }
//                     </View>
//                   }
//                   {/* ////////////////////Reappear exam buttons///////////////// */}
//                   {
//                     tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'ReAppearExamForm' &&
//                     <View>
//                       {
//                         flag == 0 ?
//                           <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('Reappear Form') }}>
//                             <View style={styles.cardCont}>
//                               <View style={styles.iconOuter}>
//                                 <MaskedView
//                                   style={{ flexDirection: 'row', height: 24, width: 24 }}
//                                   maskElement={
//                                     <View
//                                       style={{
//                                         backgroundColor: 'transparent',
//                                         flex: 1,
//                                         justifyContent: 'center',
//                                         alignItems: 'center',
//                                       }}
//                                     >
//                                       <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
//                                     </View>
//                                   }
//                                 >
//                                   <LinearGradient
//                                     colors={[colors.uniRed, colors.uniBlue]}
//                                     style={{ flex: 1 }}
//                                   />
//                                 </MaskedView>
//                               </View>
//                               <Text style={styles.cardText}>Re-Appear Exam Form</Text>
//                             </View>
//                           </TouchableOpacity>
//                           : flag == 1 ?
//                             <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('ReappearFormPhd') }}>
//                               <View style={styles.cardCont}>
//                                 <View style={styles.iconOuter}>
//                                   <MaskedView
//                                     style={{ flexDirection: 'row', height: 24, width: 24 }}
//                                     maskElement={
//                                       <View
//                                         style={{
//                                           backgroundColor: 'transparent',
//                                           flex: 1,
//                                           justifyContent: 'center',
//                                           alignItems: 'center',
//                                         }}
//                                       >
//                                         <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
//                                       </View>
//                                     }
//                                   >
//                                     <LinearGradient
//                                       colors={[colors.uniRed, colors.uniBlue]}
//                                       style={{ flex: 1 }}
//                                     />
//                                   </MaskedView>
//                                 </View>
//                                 <Text style={styles.cardText}>Re-Appear Exam Form</Text>
//                                 {/* <Text style={styles.cardText}>Re-Appear Exam Form Phd</Text> */}
//                               </View>
//                             </TouchableOpacity>
//                             : flag == 2 ?
//                               <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('ReappearFormAgricultureDiploma') }}>
//                                 <View style={styles.cardCont}>
//                                   <View style={styles.iconOuter}>
//                                     <MaskedView
//                                       style={{ flexDirection: 'row', height: 24, width: 24 }}
//                                       maskElement={
//                                         <View
//                                           style={{
//                                             backgroundColor: 'transparent',
//                                             flex: 1,
//                                             justifyContent: 'center',
//                                             alignItems: 'center',
//                                           }}
//                                         >
//                                           <MaterialCommunityIcons name='lead-pencil' size={24} color={colors.uniBlue} />
//                                         </View>
//                                       }
//                                     >
//                                       <LinearGradient
//                                         colors={[colors.uniRed, colors.uniBlue]}
//                                         style={{ flex: 1 }}
//                                       />
//                                     </MaskedView>
//                                   </View>
//                                   <Text style={styles.cardText}>Re-Appear Exam Form</Text>
//                                   {/* <Text style={styles.cardText}>Re-Appear Exam Form Diploma Agriculture</Text> */}
//                                 </View>
//                               </TouchableOpacity>
//                               : null
//                       }
//                     </View>
//                   }

//                   {
//                     tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'Results' &&
//                     <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('Result') }}>
//                       <View style={styles.cardCont}>
//                         <View style={styles.iconOuter}>
//                           <MaskedView
//                             style={{ flexDirection: 'row', height: 27, width: 27 }}
//                             maskElement={
//                               <View
//                                 style={{
//                                   backgroundColor: 'transparent',
//                                   flex: 1,
//                                   justifyContent: 'center',
//                                   alignItems: 'center',
//                                 }}
//                               >
//                                 <Entypo name='graduation-cap' size={27} color={colors.uniBlue} />
//                               </View>
//                             }
//                           >
//                             <LinearGradient
//                               colors={[colors.uniRed, colors.uniBlue]}
//                               style={{ flex: 1 }}
//                             />
//                           </MaskedView>

//                         </View>
//                         <Text style={styles.cardText}>Result</Text>
//                       </View>
//                     </TouchableOpacity>
//                   }

//                   {
//                     tabsData?.[3]?.['IsVisible'] == 1 && tabsData?.[3]?.ElementName === 'AllSubjects' &&
//                     <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('AllSubjectsSemWise') }}>
//                       <View style={styles.cardCont}>
//                         <View style={styles.iconOuter}>
//                           <MaskedView
//                             style={{ flexDirection: 'row', height: 24, width: 24 }}
//                             maskElement={
//                               <View
//                                 style={{
//                                   backgroundColor: 'transparent',
//                                   flex: 1,
//                                   justifyContent: 'center',
//                                   alignItems: 'center',
//                                 }}
//                               >
//                                 <Entypo name='open-book' size={24} color={colors.uniBlue} />
//                               </View>
//                             }
//                           >
//                             <LinearGradient
//                               colors={[colors.uniRed, colors.uniBlue]}
//                               style={{ flex: 1 }}
//                             />
//                           </MaskedView>

//                         </View>
//                         <Text style={styles.cardText}>All Subjects</Text>
//                       </View>
//                     </TouchableOpacity>
//                   }

//                   {
//                     tabsData?.[4]?.['IsVisible'] == 1 && tabsData?.[4]?.ElementName === 'PreviousExamForms' &&
//                     <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('MyForms') }}>
//                       <View style={styles.cardCont}>
//                         <View style={styles.iconOuter}>
//                           <MaskedView
//                             style={{ flexDirection: 'row', height: 24, width: 24 }}
//                             maskElement={
//                               <View
//                                 style={{
//                                   backgroundColor: 'transparent',
//                                   flex: 1,
//                                   justifyContent: 'center',
//                                   alignItems: 'center',
//                                 }}
//                               >
//                                 <MaterialCommunityIcons name='text-box-check-outline' color={colors.uniBlue} size={24} />
//                               </View>
//                             }
//                           >
//                             <LinearGradient
//                               colors={[colors.uniRed, colors.uniBlue]}
//                               style={{ flex: 1 }}
//                             />
//                           </MaskedView>

//                         </View>
//                         <Text style={styles.cardText} >Previous Exam Forms</Text>
//                       </View>
//                     </TouchableOpacity>
//                   }

//                   {
//                     tabsData?.[5]?.['IsVisible'] == 1 && tabsData?.[5]?.ElementName === 'CGPACalculator' &&
//                     <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('CGPA Calculator') }}>
//                       <View style={styles.cardCont}>
//                         <View style={styles.iconOuter}>
//                           <MaskedView
//                             style={{ flexDirection: 'row', height: 24, width: 24 }}
//                             maskElement={
//                               <View
//                                 style={{
//                                   backgroundColor: 'transparent',
//                                   flex: 1,
//                                   justifyContent: 'center',
//                                   alignItems: 'center',
//                                 }}
//                               >
//                                 <FontAwesome name='dashboard' color={colors.uniBlue} size={24} />
//                               </View>
//                             }
//                           >
//                             <LinearGradient
//                               colors={[colors.uniRed, colors.uniBlue]}
//                               style={{ flex: 1 }}
//                             />
//                           </MaskedView>

//                         </View>
//                         <Text style={styles.cardText} >CGPA Calulator</Text>
//                       </View>
//                     </TouchableOpacity>
//                   }

//                   {
//                     tabsData?.[6]?.['IsVisible'] == 1 && tabsData?.[6]?.ElementName === 'AdmitCard' &&
//                     <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('AdmitCard') }}>
//                       <View style={styles.cardCont}>
//                         <View style={styles.iconOuter}>
//                           <MaskedView
//                             style={{ flexDirection: 'row', height: 24, width: 24 }}
//                             maskElement={
//                               <View
//                                 style={{
//                                   backgroundColor: 'transparent',
//                                   flex: 1,
//                                   justifyContent: 'center',
//                                   alignItems: 'center',
//                                 }}
//                               >
//                                 <Entypo name='v-card' color={colors.uniBlue} size={24} />
//                               </View>
//                             }
//                           >
//                             <LinearGradient
//                               colors={[colors.uniRed, colors.uniBlue]}
//                               style={{ flex: 1 }}
//                             />
//                           </MaskedView>

//                         </View>
//                         <Text style={styles.cardText} >Admit Card</Text>
//                       </View>
//                     </TouchableOpacity>
//                   }

//                   {
//                     tabsData?.[7]?.['IsVisible'] == 1 && tabsData?.[7]?.ElementName === 'PreRequesite' &&
//                     <TouchableOpacity style={[styles.cards]} onPress={() => { closeMenu(); navigation.navigate('PreRequisite') }}>
//                       <View style={styles.cardCont}>
//                         <View style={[styles.iconOuter, { marginTop: -2 }]}>
//                           <MaskedView
//                             style={{ flexDirection: 'row', height: 27, width: 27 }}
//                             maskElement={
//                               <View
//                                 style={{
//                                   backgroundColor: 'transparent',
//                                   flex: 1,
//                                   justifyContent: 'center',
//                                   alignItems: 'center',
//                                 }}
//                               >
//                                 <MaterialCommunityIcons name='text-box-search' color={colors.uniBlue} size={27} />
//                               </View>
//                             }
//                           >
//                             <LinearGradient
//                               colors={[colors.uniRed, colors.uniBlue]}
//                               style={{ flex: 1 }}
//                             />
//                           </MaskedView>

//                         </View>
//                         <Text style={[styles.cardText, { marginTop: 6 }]} >Pre-Requisite</Text>
//                       </View>
//                     </TouchableOpacity>
//                   }
//                   {
//                     tabsData?.[8]?.['IsVisible'] == 1 && tabsData?.[8]?.ElementName === 'DateSheet' &&
//                     <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('DateSheet') }}>
//                       <View style={styles.cardCont}>
//                         <View style={styles.iconOuter}>
//                           <MaskedView
//                             style={{ flexDirection: 'row', height: 24, width: 24 }}
//                             maskElement={
//                               <View
//                                 style={{
//                                   backgroundColor: 'transparent',
//                                   flex: 1,
//                                   justifyContent: 'center',
//                                   alignItems: 'center',
//                                 }}
//                               >
//                                 <FontAwesome name='list' size={24} color={colors.uniBlue} />
//                               </View>
//                             }
//                           >
//                             <LinearGradient
//                               colors={[colors.uniRed, colors.uniBlue]}
//                               style={{ flex: 1 }}
//                             />
//                           </MaskedView>

//                         </View>
//                         <Text style={styles.cardText}>Date Sheet</Text>
//                       </View>
//                     </TouchableOpacity>
//                   }
//                 </View>
//               </View>
//           }
//         </ScrollView>
//       </View>
//     </Pressable>
//   )
// }

// const styles = StyleSheet.create({

//   // Common CSS of all the cards
//   cards: {
//     width: screenWidth / 2.4,
//     paddingBottom: 28,
//     // backgroundColor:'green',
//     alignSelf: 'center',
//     elevation: 2,
//     backgroundColor: 'white',
//     // opacity: disabled? 0.5 :1
//     borderRadius: 8
//   },
//   cardText: {
//     fontSize: 12,
//     textAlign: 'center',
//     marginTop: 8,
//     color: '#1b1b1b'
//   },

//   // Card outer container CSS
//   cardCont: {
//     alignItems: 'center',
//     height: screenHeight / 11,
//     padding: 8,
//     alignSelf: 'center',
//   },
//   iconOuter: {
//     borderColor: colors.uniBlue,
//     borderWidth: 1,
//     borderRadius: 32,
//     padding: 10,
//   },
// })

// export default Examination



import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Pressable, Animated } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import colors from '../../colors';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import LinearGradient from 'react-native-linear-gradient';
import { StudentContext } from '../../context/StudentContext';

const { width, height } = Dimensions.get('window');

const Examination = () => {
    const { closeMenu } = useContext(StudentContext);
    const [flag, setFlag] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tabsData, setTabsData] = useState([]);
    const navigation = useNavigation();
    
    // Animation values for cards (supporting up to 9 cards)
    const scaleValues = useRef([...Array(9)].map(() => new Animated.Value(1))).current;

    const getCourseFlag = async () => {
        setLoading(true);
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {
                const courseFlag = await fetch(BASE_URL + '/student/checkbutton', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    },
                });
                const courseFlagDetails = await courseFlag.json();
                setFlag(courseFlagDetails['statusopen'][0]['flag']);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching flags data:examination:', error);
                setLoading(false);
            }
        }
    };

    const checkTabs = async () => {
        setLoading(true);
        const session = await EncryptedStorage.getItem("user_session");
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
                });
                const pageTabsData = await tabsData.json();
                setTabsData(pageTabsData);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        getCourseFlag();
        checkTabs();
    }, []);

    const handlePressIn = (index) => {
        Animated.spring(scaleValues[index], {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 150,
            friction: 3
        }).start();
    };

    const handlePressOut = (index) => {
        Animated.spring(scaleValues[index], {
            toValue: 1,
            useNativeDriver: true,
            tension: 150,
            friction: 3
        }).start();
    };

    const Card = ({ children, onPress, index }) => (
        <Animated.View style={{ transform: [{ scale: scaleValues[index] }] }}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                style={styles.cardWrapper}
            >
                {children}
            </TouchableOpacity>
        </Animated.View>
    );

    const renderRegularExamForm = () => {
        if (tabsData?.[0]?.['IsVisible'] != 1 || tabsData?.[0]?.ElementName !== 'RegularExamForm') return null;

        let route = '';
        if (flag == 0) route = 'Examination Form';
        else if (flag == 1) route = 'ExaminationFormPhd';
        else if (flag == 2) route = 'ExamFormAgricultureDiploma';
        else return null;

        return {
            title: 'Regular Exam Form',
            icon: 'lead-pencil',
            iconFamily: MaterialCommunityIcons,
            route: route,
            gradient: [colors.gradientBlue[1], colors.gradientBlue[2]],
            description: 'Fill regular form'
        };
    };

    const renderReappearExamForm = () => {
        if (tabsData?.[1]?.['IsVisible'] != 1 || tabsData?.[1]?.ElementName !== 'ReAppearExamForm') return null;

        let route = '';
        if (flag == 0) route = 'Reappear Form';
        else if (flag == 1) route = 'ReappearFormPhd';
        else if (flag == 2) route = 'ReappearFormAgricultureDiploma';
        else return null;

        return {
            title: 'Re-Appear Form',
            icon: 'lead-pencil',
            iconFamily: MaterialCommunityIcons,
            route: route,
            gradient: [colors.gradientCoral[1], colors.gradientCoral[2]],
            description: 'Fill reappear form'
        };
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#555555" />
                </View>
            );
        }

        const cards = [
            renderRegularExamForm(),
            renderReappearExamForm(),
            {
                condition: tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'Results',
                title: 'Result',
                icon: 'graduation-cap',
                iconFamily: Entypo,
                route: 'Result',
                gradient: [colors.gradientLavendar[1],colors.gradientLavendar[2]],
                description: 'View your exam results'
            },
            {
                condition: tabsData?.[3]?.['IsVisible'] == 1 && tabsData?.[3]?.ElementName === 'AllSubjects',
                title: 'All Subjects',
                icon: 'open-book',
                iconFamily: Entypo,
                route: 'AllSubjectsSemWise',
                gradient: [colors.gradientMint[1],colors.gradientMint[2]],
                description: 'Browse semester subjects'
            },
            {
                condition: tabsData?.[4]?.['IsVisible'] == 1 && tabsData?.[4]?.ElementName === 'PreviousExamForms',
                title: 'Previous Forms',
                icon: 'text-box-check-outline',
                iconFamily: MaterialCommunityIcons,
                route: 'MyForms',
                gradient: [colors.gradientYellow[1],colors.gradientYellow[2]],
                description: 'View exam forms'
            },
            {
                condition: tabsData?.[5]?.['IsVisible'] == 1 && tabsData?.[5]?.ElementName === 'CGPACalculator',
                title: 'CGPA Calculator',
                icon: 'dashboard',
                iconFamily: FontAwesome,
                route: 'CGPA Calculator',
                gradient: [colors.gradientBlue[1], colors.gradientBlue[2]],
                description: 'Calculate your CGPA'
            },
            {
                condition: tabsData?.[6]?.['IsVisible'] == 1 && tabsData?.[6]?.ElementName === 'AdmitCard',
                title: 'Admit Card',
                icon: 'v-card',
                iconFamily: Entypo,
                route: 'AdmitCard',
                gradient: [colors.gradientCoral[1],colors.gradientCoral[2]],
                description: 'Download admit card'
            },
            {
                condition: tabsData?.[7]?.['IsVisible'] == 1 && tabsData?.[7]?.ElementName === 'PreRequesite',
                title: 'Pre-Requisite',
                icon: 'text-box-search',
                iconFamily: MaterialCommunityIcons,
                route: 'PreRequisite',
                gradient: [colors.gradientLavendar[1],colors.gradientLavendar[2]],
                description: 'Check prerequisites'
            },
            {
                condition: tabsData?.[8]?.['IsVisible'] == 1 && tabsData?.[8]?.ElementName === 'DateSheet',
                title: 'Date Sheet',
                icon: 'list',
                iconFamily: FontAwesome,
                route: 'DateSheet',
                gradient: [colors.gradientMint[1],colors.gradientMint[2]],
                description: 'Exam schedule & dates'
            }
        ].filter(card => card && card.condition !== false);

        return (
            <View style={styles.cardsContainer}>
                {/* Header */}
                {/* <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Examination</Text>
                    <Text style={styles.headerSubtitle}>Manage your exams & results</Text>
                </View> */}

                <View style={styles.gridContainer}>
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            index={index}
                            onPress={() => {
                                closeMenu();
                                navigation.navigate(card.route);
                            }}
                        >
                            <LinearGradient
                                colors={card.gradient}
                                locations={[0, 0.5, 1]}
                                style={styles.cardGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.cardContent}>
                                    <View style={styles.iconWrapper}>
                                        <card.iconFamily name={card.icon} size={28} color={colors.uniBlue} />
                                    </View>
                                    <Text style={styles.cardTitle}>{card.title}</Text>
                                    <Text style={styles.cardDescription}>{card.description}</Text>
                                </View>
                            </LinearGradient>
                        </Card>
                    ))}
                </View>

                {cards.length === 0 && !loading && (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="file-document-outline" size={60} color="#DDD" />
                        <Text style={styles.emptyText}>No examination modules available</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        // <Pressable onPress={closeMenu} style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                bounces={true}
                contentContainerStyle={styles.scrollContent}
            >
                {renderContent()}
            </ScrollView>
        // </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: height * 0.7,
    },
    headerContainer: {
        paddingHorizontal: 24,
        paddingVertical: 25,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2D3436',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#636E72',
        fontWeight: '400',
        marginTop: 4,
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'center',
        width: '100%',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.06,
        gap: 16,
        paddingVertical: 24
    },
    cardWrapper: {
        width: width * 0.40,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
    },
    cardGradient: {
        padding: 2,
        borderRadius: 24,
      },
      cardContent: {
        borderRadius: 22,
        padding: 16,
        height: 165,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconWrapper: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(158, 158, 158, 0.13)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'rgba(103, 103, 103, 0.34)',
    },
    // iconWrapper: {
    //     width: 70,
    //     height: 70,
    //     borderRadius: 35,
    //     backgroundColor: 'rgba(255,255,255,0.2)',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginBottom: 15,
    //     borderWidth: 2,
    //     borderColor: 'rgba(255,255,255,0.3)',
    // },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555555',
        marginBottom: 6,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 11,
        color: '#555555',
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 14,
        // display:'none'
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 15,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        fontWeight: '500',
    },
});

export default Examination;