import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Pressable, Animated } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwsome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../colors';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';
import LinearGradient from 'react-native-linear-gradient';
import { StudentContext } from '../../context/StudentContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Academics = () => {
    const { closeMenu } = useContext(StudentContext);
    const [loading, setLoading] = useState(false);
    const [tabsData, setTabsData] = useState([]);
    const navigation = useNavigation();

    // Animation values for each card
    const scaleValues = useRef([...Array(4)].map(() => new Animated.Value(1))).current;

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
                        pageName: 'Academics_st'
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
                <ActivityIndicator />
            );
        }

        const cards = [
            {
                condition: tabsData?.[0]?.['IsVisible'] == 1 && tabsData?.[0]?.ElementName === 'StudyMaterial',
                title: 'Study Material',
                icon: 'text-box-search',
                iconFamily: MaterialCommunityIcons,
                route: 'StudentStudyMaterial',
                gradient: [colors.gradientCoral[1], colors.gradientCoral[2]],
                description: 'Access notes, books & resources'
            },
            {
                condition: tabsData?.[3]?.['IsVisible'] == 1 && tabsData?.[3]?.ElementName === 'Attendance',
                title: 'Attendance',
                icon: 'fingerprint',
                iconFamily: MaterialCommunityIcons,
                route: 'StudentAttendance',
                gradient: [colors.gradientBlue[1], colors.gradientBlue[2]],
                description: 'Track your presence'
            },
            {
                condition: tabsData?.[1]?.['IsVisible'] == 1 && tabsData?.[1]?.ElementName === 'Assignments',
                title: 'Assignments',
                icon: 'file-document-multiple',
                iconFamily: MaterialCommunityIcons,
                route: 'StudentAssignments',
                gradient: [colors.gradientLavendar[1], colors.gradientLavendar[2]],
                description: 'Submit & check tasks'
            },
            {
                condition: tabsData?.[2]?.['IsVisible'] == 1 && tabsData?.[2]?.ElementName === 'Syllabus',
                title: 'Syllabus',
                icon: 'clipboard-list',
                iconFamily: FontAwsome6,
                route: 'StudentSyllabus',
                gradient: [colors.gradientMint[1], colors.gradientMint[2]],
                description: 'Course structure & plan'
            }
        ];

        const visibleCards = cards.filter(card => card.condition);

        return (
            <View style={styles.cardsContainer}>
                {/* Header */}
                {/* <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Academics</Text>
                    <Text style={styles.headerSubtitle}>Your learning tools</Text>
                </View> */}
                <View style={[styles.gridContainer]}>
                    {visibleCards.map((card, index) => (
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
                                        <card.iconFamily name={card.icon} size={32} color={colors.uniBlue} />
                                    </View>
                                    <Text style={styles.cardTitle}>{card.title}</Text>
                                    <Text style={styles.cardDescription}>{card.description}</Text>
                                </View>
                            </LinearGradient>
                        </Card>
                    ))}
                </View>

                {visibleCards.length === 0 && !loading && (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="book-open-variant" size={60} color="#DDD" />
                        <Text style={styles.emptyText}>No academic modules available</Text>
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
    safeArea: {
        flex: 1,
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
    loadingGradient: {
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        gap: 15,
    },
    loadingText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    headerGradient: {
        paddingHorizontal: 24,
        paddingVertical: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        shadowColor: '#764ba2',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
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
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.06,
        gap: 16,
        paddingVertical:24
    },
    cardWrapper: {
        width: width * 0.40,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
        alignSelf: 'flex-end'
    },
    cardGradient: {
        padding: 2,
        borderRadius: 24,
    },
    cardContent: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 12,
        height: 175,
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
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
    cardFooter: {
        marginTop: 'auto',
    },
    exploreText: {
        fontSize: 12,
        color: '#555555',
        fontWeight: '600',
        opacity: 0.9,
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
    iconGradient: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Academics;