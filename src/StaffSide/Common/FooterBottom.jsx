import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import StaffHome from '../StaffHome';
import Leaves from '../Leaves/Leaves';
import StaffProfile from '../StaffProfile';
import Movements from '../Movement/Movements';
import colors from '../../colors';
import { View, Text } from 'react-native';
import AnimatedBottomTab from '../components/AnimatedBottomTab'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Tab = createBottomTabNavigator();

function FooterBottom() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={()=>({
        tabBarActiveTintColor:colors.uniRed,
        tabBarInactiveTintColor : colors.uniBlue,
        tabBarLabelStyle:{fontSize:12},
        tabBarStyle:{height:72}})}
      
      // screenOptions={{
      //   headerShown: false,
      //   tabBarStyle: {
      //     position: 'absolute',
      //     bottom: 16,
      //     left: 16,
      //     right: 16,
      //     height:50 + insets.bottom,
      //     borderRadius: 30,
      //     backgroundColor: 'transparent',
      //     elevation: 0,
      //     paddingBottom:insets.bottom
      //   },
      // }}
      // tabBar={props => <AnimatedBottomTab {...props} />}
      >
      <Tab.Screen name="Home" component={StaffHome} options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={28} />
        ), headerShown: false
      }} />
      <Tab.Screen name="Leave" component={Leaves} options={{
        tabBarLabel: 'Leave',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="gesture-tap-hold" color={color} size={28} />
        ), headerShown: false
      }} />
      <Tab.Screen name="Movement" component={Movements} options={{
        tabBarLabel: 'Movement',
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="walking" color={color} size={28} />
        ), headerShown: false
      }} />
      <Tab.Screen name="Profile" component={StaffProfile} options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account" color={color} size={28} />
        ), headerShown: false
      }} />
    </Tab.Navigator>

  );
}
export default FooterBottom
