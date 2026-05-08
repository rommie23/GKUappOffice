// import { View, Text, Pressable, Alert, TouchableWithoutFeedback } from 'react-native'
// import React, { useContext } from 'react'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import StudentHome from './StudentHome';
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
// import StudentProfile from './StudentProfile';
// import Examination from './Examination';
// import StudentFees from './StudentFees'
// // import { Title } from 'react-native-paper';
// import colors from '../../colors';
// import Academics from './Academics';
// import { StudentContext } from '../../context/StudentContext';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const Bottom = createBottomTabNavigator();

// const BottomNavigator = ({navigation}) => {
//   const {closeMenu} = useContext(StudentContext)
//   const insets = useSafeAreaInsets();

//   return (
//     <Bottom.Navigator screenOptions={({ route })=>({
//       tabBarIcon:({color})=>{
//         let iconName;
        
//         if(route.name === 'Home'){
//           iconName = "home";
//         }
//         else if(route.name === 'Examination'){
//           iconName = "file-text";
//         }
//         else if(route.name === 'Result'){
//           iconName = 'th-list'
//         }
//         // else if(route.name === 'Account'){
//         //   iconName = 'user'
//         // }
//         else if(route.name === 'Fees'){
//           iconName = 'money'
//         }
//         else if(route.name === 'Academics'){
//           iconName = 'graduation-cap'
//         }
//         return <FontAwesome name={iconName} size={26} color={color} />
//       },
//       tabBarStyle:{height:72},
//       tabBarLabelStyle:{fontSize:12},
//       tabBarActiveTintColor: colors.uniRed,
//       tabBarInactiveTintColor : colors.uniBlue,
//     })}>
//         <Bottom.Screen name='Home' component={StudentHome} options={{headerShown:false}}/>
//         <Bottom.Screen name='Academics' component={Academics} options={{headerShown:false}}/>
//         <Bottom.Screen name='Examination' component={Examination} options={{headerShown:false}}/>
//         <Bottom.Screen name='Fees' component={StudentFees} options={{headerShown:false}}/>
//         {/* <Bottom.Screen name='Account' component={StudentProfile} options={{headerShown:false}}/> */}
//     </Bottom.Navigator>
//   )
// }

// export default BottomNavigator


import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Vibration,
  Platform
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

import StudentHome from './StudentHome';
import Academics from './Academics';
import Examination from './Examination';
import StudentFees from './StudentFees';
import colors from '../../colors';

const Tab = createBottomTabNavigator();

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;

const ICONS = {
  Home: 'home',
  Academics: 'graduation-cap',
  Examination: 'file-text',
  Fees: 'money'
};



// 🔥 SPRING CONFIG (magic values)
const SPRING_CONFIG = {
  damping: 12,
  stiffness: 180,
  mass: 0.6,
};



// 🔥 Tab Item (BOUNCY)
const TabItem = ({ route, isFocused, onPress }) => {

  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(isFocused ? 1.15 : 1, SPRING_CONFIG);
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Pressable
      style={styles.tab}
      android_ripple={{
        color: 'rgba(0,0,0,0.08)',
        borderless: true
      }}
      onPress={() => {
        if (Platform.OS === 'android') {
          Vibration.vibrate(10);
        }
        onPress();
      }}
    >
      <Animated.View style={[styles.inner, animatedStyle]}>
        <FontAwesome
          name={ICONS[route.name]}
          size={20}
          color={isFocused ? "#fff" : colors.uniBlue}
        />

        <Text style={[
          styles.label,
          { color: isFocused ? "#fff" : colors.uniBlue }
        ]}>
          {route.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
};



// 🔥 Custom Tab Bar (BOUNCY SLIDE)
const CustomTabBar = ({ state, navigation }) => {

  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withSpring(
      state.index * TAB_WIDTH,
      SPRING_CONFIG
    );
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  return (
    <View style={styles.container}>

      {/* 🔥 Bouncy Pill */}
      <Animated.View style={[styles.indicator, indicatorStyle]} />

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        return (
          <TabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </View>
  );
};



// 🔥 Navigator
const BottomNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={StudentHome} />
      <Tab.Screen name="Fees" component={StudentFees} />
      <Tab.Screen name="Examination" component={Examination} />
      <Tab.Screen name="Academics" component={Academics} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;



// 🎨 Styles
const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
  },

  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inner: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4
  },

  label: {
    fontSize: 11,
    fontWeight: '500'
  },

  indicator: {
    position: 'absolute',
    width: TAB_WIDTH - 16,
    height: 50,
    top: 10,
    left: 8,
    borderRadius: 14,
    backgroundColor: '#7e93d1',
  }

});