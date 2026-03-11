import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native'
import React, { useCallback, useContext } from 'react'
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { images } from '../../images/index';
import { StudentContext } from '../../context/StudentContext';

const PlusButton = () => {
    const { closeMenu } = useContext(StudentContext)

    const navigation = useNavigation()

    const firstValue = useSharedValue(30);
    const secondValue = useSharedValue(30);
    const thirdValue = useSharedValue(30);
    const firstWidth = useSharedValue(60);
    const secondWidth = useSharedValue(60);
    const thirdWidth = useSharedValue(60);
    const isOpen = useSharedValue(false);
    const opacity = useSharedValue(0);
    const progress = useDerivedValue(() =>
        isOpen.value ? withTiming(1) : withTiming(0),
    );
    const handlePress = () => {
        const config = {
            easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
            duration: 500,
        };

        if (isOpen.value) {
            // COLLAPSE animation
            opacity.value = withTiming(0, { duration: 200 });

            thirdWidth.value = withTiming(60, { duration: 200 });
            secondWidth.value = withDelay(50, withTiming(60, { duration: 200 }));
            firstWidth.value = withDelay(100, withTiming(60, { duration: 200 }));

            thirdValue.value = withDelay(200, withTiming(30, config));
            secondValue.value = withDelay(250, withTiming(30, config));
            firstValue.value = withDelay(300, withTiming(30, config));

            // Delay setting isOpen = false until collapse animation is done
            setTimeout(() => {
                isOpen.value = false;
            }, 700); // slightly longer than total collapse duration

        } else {
            // EXPAND animation
            firstValue.value = withDelay(200, withSpring(130));
            secondValue.value = withDelay(100, withSpring(210));
            thirdValue.value = withSpring(290);

            firstWidth.value = withDelay(1200, withSpring(200));
            secondWidth.value = withDelay(1100, withSpring(200));
            thirdWidth.value = withDelay(1000, withSpring(200));
            opacity.value = withDelay(1200, withSpring(1));

            isOpen.value = true;
        }
    };


    const opacityText = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });
    const firstWidthStyle = useAnimatedStyle(() => {
        return {
            width: firstWidth.value,
            height: isOpen.value ? 60 : 0,
            zIndex: isOpen.value ? 1 : -1,
        };
    });

    const secondWidthStyle = useAnimatedStyle(() => {
        return {
            width: secondWidth.value,
            height: isOpen.value ? 60 : 0,
            zIndex: isOpen.value ? 1 : -1,
        };
    });
    const thirdWidthStyle = useAnimatedStyle(() => {
        return {
            width: thirdWidth.value,
            height: isOpen.value ? 60 : 0,
            zIndex: isOpen.value ? 1 : -1,
        };
    });

    const firstIcon = useAnimatedStyle(() => {
        const scale = interpolate(
            firstValue.value,
            [30, 130],
            [0, 1],
            Extrapolation.CLAMP,
        );

        return {
            bottom: firstValue.value,
            transform: [{ scale: scale }],
        };
    });

    const secondIcon = useAnimatedStyle(() => {
        const scale = interpolate(
            secondValue.value,
            [30, 210],
            [0, 1],
            Extrapolation.CLAMP,
        );

        return {
            bottom: secondValue.value,
            transform: [{ scale: scale }],
        };
    });

    const thirdIcon = useAnimatedStyle(() => {
        const scale = interpolate(
            thirdValue.value,
            [30, 290],
            [0, 1],
            Extrapolation.CLAMP,
        );

        return {
            bottom: thirdValue.value,
            transform: [{ scale: scale }],
        };
    });

    const plusIcon = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${progress.value * 45}deg` }],
        };
    });

    // onPressHandler = () => {
    //   // Your onPress logic goes here
    //   // console.log('Animated.View pressed!');

    // };
    const ApplyIdCardFunction = () => {
        isOpen.value = true
        navigation.navigate('ApplyIdCard');

        // Alert.alert('gg')
    }
    const ApplyBusPassFunction = () => {
        navigation.navigate('ApplyBusPass')

        // Alert.alert('gg')
    }
    const StudentDetailsCorrection = () => {
        navigation.navigate('StudentDetailsCorrection')

        // Alert.alert('gg')
    }
    return (
        <View style={styles.container}>

            <TouchableOpacity onPressIn={() => ApplyIdCardFunction()} >
                <Animated.View style={[styles.contentContainer, thirdIcon, thirdWidthStyle]} >
                    <View style={styles.iconContainer} >
                        <Image
                            source={images.logo}
                            style={styles.icon}
                        />
                    </View>
                    <Animated.Text style={[styles.text, opacityText]}>
                        Apply Smart Card
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity onPressIn={() => ApplyBusPassFunction()}>
                <Animated.View
                    style={[styles.contentContainer, secondIcon, secondWidthStyle]}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={images.logo}
                            style={styles.icon}
                        />
                    </View>
                    <Animated.Text style={[styles.text, opacityText]}>
                        Apply Bus Pass
                    </Animated.Text>

                </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity onPressIn={() => StudentDetailsCorrection()}>
                <Animated.View
                    style={[styles.contentContainer, firstIcon, firstWidthStyle]}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={images.logo}
                            style={styles.icon}
                        />
                    </View>
                    <Animated.Text style={[styles.text, opacityText]}>
                        Correction Form
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
            <Pressable
                style={styles.contentContainer}
                onPress={() => {
                    closeMenu();
                    handlePress();
                }}>
                <Animated.View style={[styles.iconContainer, plusIcon]}>
                    <FeatherIcon
                        color="#fff"
                        name="plus"
                        size={20} />
                </Animated.View>
            </Pressable>
        </View>
    )
}

export default PlusButton

const styles = StyleSheet.create({
    // plus icon 
    container: {
        position: 'absolute',
        bottom: 10,
        right: 0,
        backgroundColor: 'red'
    },
    dashboardCards: {
        padding: 12,
        height: 150,
        borderTopEndRadius: 0
    },
    attendanceCard: {
        padding: 10,
        height: 100,
        elevation: 1,
        backgroundColor: 'white',
        margin: 10
    },
    contentContainer: {
        backgroundColor: '#223260',
        position: 'absolute',
        bottom: 30,
        right: 30,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },
    iconContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 26,
        height: 26,
    },
    text: {
        color: 'white',
        fontSize: 15,
        justifyContent: "flex-start"
    },
});