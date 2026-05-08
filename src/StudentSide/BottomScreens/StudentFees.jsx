// import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Pressable, Linking } from 'react-native'
// import React, { useContext, useEffect, useState } from 'react'
// import LinearGradient from 'react-native-linear-gradient'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import IonIcons from 'react-native-vector-icons/Ionicons'
// import colors from '../../colors'
// import { useNavigation } from '@react-navigation/native'
// // import notifee from '@notifee/react-native';
// import MaskedView from '@react-native-masked-view/masked-view'
// import { StudentContext } from '../../context/StudentContext'
// import EncryptedStorage from 'react-native-encrypted-storage'
// import { BASE_URL } from '@env';

// const screenHeight = Dimensions.get('window').height
// const screenWidth = Dimensions.get('window').width



// const StudentFees = () => {
//   const { closeMenu } = useContext(StudentContext);
//   const [loading, setLoading] = useState(false)
//   const [tabsData, setTabsData] = useState([])
//   const navigation = useNavigation()

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
//             pageName: 'Fees_st'
//           })
//         })
//         const pageTabsData = await tabsData.json()
//         setTabsData(pageTabsData)
//         console.log(pageTabsData);

//         setLoading(false)
//       } catch (error) {
//         console.log(error);
//         setLoading(false)
//       }
//     }
//   }
//   useEffect(() => {
//     checkTabs();
//   }, [])

//   return (
//       <ScrollView style={styles.scrollCont}>
//         <View style={styles.outerContainer}>
//           <View style={styles.container}>
//             {/* ///////////////////// cards list ////////////////////// */}
//             <View style={styles.containerLeft}>

//               {
//                 tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'PayNow' &&
//                 <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('FeePayment') }}>
//                   {/* <TouchableOpacity style={styles.cards}onPress={()=>{Linking.openURL(IMAGE_URL)}}> */}
//                   <View style={[styles.cardCont]}>
//                     <Text style={styles.cardText}>Pay Now</Text>
//                     <MaskedView
//                       style={{ flexDirection: 'row', height: 36, width: 36 }}
//                       maskElement={
//                         <View
//                           style={{
//                             backgroundColor: 'transparent',
//                             flex: 1,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <IonIcons name='cash-outline' size={36} color={colors.uniBlue} />
//                         </View>
//                       }
//                     >
//                       <LinearGradient
//                         colors={[colors.uniRed, colors.uniBlue]}
//                         style={{ flex: 1 }}
//                       />
//                     </MaskedView>
//                   </View>
//                 </TouchableOpacity>
//               }

//               {
//                 tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'Receipts' &&
//                 <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('Receipts') }}>
//                   <View style={[styles.cardCont]}>
//                     <Text style={styles.cardText}>Receipts</Text>
//                     <MaskedView
//                       style={{ flexDirection: 'row', height: 36, width: 36 }}
//                       maskElement={
//                         <View
//                           style={{
//                             backgroundColor: 'transparent',
//                             flex: 1,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <IonIcons name='receipt-outline' size={36} color={colors.uniBlue} />
//                         </View>
//                       }
//                     >
//                       <LinearGradient
//                         colors={[colors.uniRed, colors.uniBlue]}
//                         style={{ flex: 1 }}
//                       />
//                     </MaskedView>

//                   </View>
//                 </TouchableOpacity>
//               }

//               {
//                 tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'RecentTransactions' &&
//                 <TouchableOpacity style={styles.cards} onPress={() => { closeMenu(); navigation.navigate('RecentTransactions') }} >
//                   <View style={styles.cardCont}>
//                     <Text style={styles.cardText}>Recent Transactions</Text>
//                     <MaskedView
//                       style={{ flexDirection: 'row', height: 36, width: 36 }}
//                       maskElement={
//                         <View
//                           style={{
//                             backgroundColor: 'transparent',
//                             flex: 1,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <MaterialCommunityIcons name='page-previous-outline' size={36} color={colors.uniBlue} />
//                         </View>
//                       }
//                     >
//                       <LinearGradient
//                         colors={[colors.uniRed, colors.uniBlue]}
//                         style={{ flex: 1 }}
//                       />
//                     </MaskedView>

//                   </View>

//                 </TouchableOpacity>
//               }
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   scrollCont: {
//     backgroundColor: '#f1f1f1',
//   },
//   outerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: screenWidth,
//     //   backgroundColor:'green',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//   },
//   containerLeft: {
//     width: '100%',
//     gap: 20,
//     height: 'contain',
//     // backgroundColor:'red',
//     paddingVertical: 16
//   },
//   cards: {
//     width: '100%',
//     height: screenHeight / 12,
//     backgroundColor: 'white',
//     borderRadius: 16,
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2
//   },
//   cardText: {
//     color: '#3b5998',
//     fontSize: 20,
//     fontWeight: '600'
//   },
//   cardCont: {
//     height: '100%',
//     width: '100%',
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexDirection: 'row',
//     paddingHorizontal: 24
//   },
//   iconOuter: {
//     borderColor: '#3b5998',
//     borderWidth: 1,
//     borderRadius: 32,
//     padding: 12,
//   },
// })

// const darkStyle = StyleSheet.create({
//   scrollCont: {
//     backgroundColor: '#1b1b1b',
//   },
//   outerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1b1b1b',
//   },
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: screenWidth,
//     //   backgroundColor:'green',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginTop: 32,
//     backgroundColor: '#1b1b1b',
//   },
//   containerLeft: {
//     width: '100%',
//     gap: 20,
//     height: 'contain',
//     // backgroundColor:'red',
//     paddingVertical: 8,
//     backgroundColor: '#1b1b1b',
//   },
//   cards: {
//     width: '100%',
//     height: screenHeight / 12,
//     backgroundColor: '#1b1b1b',
//     borderRadius: 16,
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 8,
//     shadowColor: '#f1f1f1',
//   },
//   cardText: {
//     color: '#f1f1f1',
//     fontSize: 20,
//     fontWeight: '600'
//   },
//   cardCont: {
//     height: '100%',
//     width: '100%',
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexDirection: 'row',
//     paddingHorizontal: 24,
//     backgroundColor: '#1b1b1b',
//   },
//   iconOuter: {
//     borderColor: '#f1f1f1',
//     borderWidth: 1,
//     borderRadius: 32,
//     padding: 12,
//   },
// })
// export default StudentFees


import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Pressable, Animated, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcons from 'react-native-vector-icons/Ionicons'
import colors from '../../colors'
import { useNavigation } from '@react-navigation/native'
import { StudentContext } from '../../context/StudentContext'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env';

const { width, height } = Dimensions.get('window');

const StudentFees = () => {
    const { closeMenu } = useContext(StudentContext);
    const [loading, setLoading] = useState(false);
    const [tabsData, setTabsData] = useState([]);
    const navigation = useNavigation();
    
    // Animation values for cards
    const scaleValues = useRef([...Array(3)].map(() => new Animated.Value(1))).current;

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
                        pageName: 'Fees_st'
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

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#555555" />
                </View>
            );
        }

        const cards = [
            {
                condition: tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'PayNow',
                title: 'Pay Now',
                icon: 'cash-outline',
                iconFamily: IonIcons,
                route: 'FeePayment',
                gradient: [colors.gradientBlue[1], colors.gradientBlue[2]],
                description: 'Make fee payments'
            },
            {
                condition: tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'Receipts',
                title: 'Receipts',
                icon: 'receipt-outline',
                iconFamily: IonIcons,
                route: 'Receipts',
                gradient: [colors.gradientCoral[1],colors.gradientCoral[2]],
                description: 'View payment receipts'
            },
            {
                condition: tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'RecentTransactions',
                title: 'Transactions',
                icon: 'page-previous-outline',
                iconFamily: MaterialCommunityIcons,
                route: 'RecentTransactions',
                gradient: [colors.gradientLavendar[1],colors.gradientLavendar[2]],
                description: 'Recent payment history'
            }
        ].filter(card => card.condition);

        return (
            <View style={styles.cardsContainer}>
                {/* Header */}
                {/* <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Fees</Text>
                    <Text style={styles.headerSubtitle}>Manage your fees & payments</Text>
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
                        <MaterialCommunityIcons name="cash-remove" size={60} color="#DDD" />
                        <Text style={styles.emptyText}>No fee modules available</Text>
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
        rowGap: 16,
        paddingVertical:24
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

export default StudentFees;