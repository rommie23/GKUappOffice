import { View, Text, Pressable, Alert, TouchableWithoutFeedback } from 'react-native'
import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import StudentHome from './StudentHome';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import StudentProfile from './StudentProfile';
import Examination from './Examination';
import StudentFees from './StudentFees'
// import { Title } from 'react-native-paper';
import colors from '../../colors';
import Academics from './Academics';
import { StudentContext } from '../../context/StudentContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Bottom = createBottomTabNavigator();

const BottomNavigator = ({navigation}) => {
  const {closeMenu} = useContext(StudentContext)
  const insets = useSafeAreaInsets();

  return (
    <Bottom.Navigator screenOptions={({ route })=>({
      tabBarIcon:({color})=>{
        let iconName;
        
        if(route.name === 'Home'){
          iconName = "home";
        }
        else if(route.name === 'Examination'){
          iconName = "file-text";
        }
        else if(route.name === 'Result'){
          iconName = 'th-list'
        }
        // else if(route.name === 'Account'){
        //   iconName = 'user'
        // }
        else if(route.name === 'Fees'){
          iconName = 'money'
        }
        else if(route.name === 'Academics'){
          iconName = 'graduation-cap'
        }
        return <FontAwesome name={iconName} size={26} color={color} />
      },
      tabBarStyle:{height:72},
      tabBarLabelStyle:{fontSize:12},
      tabBarActiveTintColor: colors.uniRed,
      tabBarInactiveTintColor : colors.uniBlue,
    })}>
        <Bottom.Screen name='Home' component={StudentHome} options={{headerShown:false}}/>
        <Bottom.Screen name='Academics' component={Academics} options={{headerShown:false}}/>
        <Bottom.Screen name='Examination' component={Examination} options={{headerShown:false}}/>
        <Bottom.Screen name='Fees' component={StudentFees} options={{headerShown:false}}/>
        {/* <Bottom.Screen name='Account' component={StudentProfile} options={{headerShown:false}}/> */}
    </Bottom.Navigator>
  )
}

export default BottomNavigator