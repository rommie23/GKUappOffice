import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import colors from '../../colors';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 5; // For 5 tabs

export default function AnimatedBottomTab({ state, descriptors, navigation }) {
    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                // Animate capsule expansion
                const animatedStyle = useAnimatedStyle(() => {
                    return {
                        width: withTiming(isFocused ? TAB_WIDTH + 20 : TAB_WIDTH - 10, { duration: 250 }),
                        backgroundColor: withTiming(isFocused ? colors.uniRed : 'transparent', { duration: 250 }),
                    };
                });

                const iconAnimatedStyle = useAnimatedStyle(() => {
                    return {
                        transform: [
                            {
                                scale: withTiming(isFocused ? 1 : 1.25, { duration: 250 }),
                            },
                        ],
                    };
                });

                // Render icon manually (don’t call tabBarIcon directly)
                const IconComponent = options.tabBarIcon?.({
                    color: isFocused ? '#fff' : colors.uniBlue,
                    size: isFocused ? 30 : 24,
                });

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tab}
                        activeOpacity={1}
                    >
                        <Animated.View style={[styles.capsule, animatedStyle]}>
                            <Animated.View style={iconAnimatedStyle}>
                                {IconComponent}
                            </Animated.View>
                            {isFocused && <Text style={styles.label}>{label}</Text>}
                        </Animated.View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#f1f8efff',
        height: 66,
        borderTopWidth: 0,
        elevation: 8,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 6,
        borderRadius: 30,       
        marginHorizontal: 4,   
        marginBottom: 6,       
        overflow: 'hidden',
        paddingHorizontal:4
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    capsule: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        paddingVertical: 6,
        paddingHorizontal: 6,
        gap: 4,
    },
    label: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
