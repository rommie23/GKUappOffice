import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import StudentHeader from '../components/StudentHeader'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomNavigator from '../BottomScreens/BottomNavigator'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

// import { createStackNavigator } from '@react-navigation/stack'

// const Stack = createStackNavigator()


const Main = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  function getHeaderTitle(routeName) {
      if (routeName == 'Home') {
        return 'Dashboard'
      }else if (routeName == 'Examination'){
        return 'Examination'
      }else if (routeName == 'Academics'){
        return 'Academics'
      }else if (routeName == 'Fees'){
        return 'Fees'
      }
    }
  
    // useLayoutEffect(() => {
    //   const routeName = getFocusedRouteNameFromRoute(route) ?? "Dashboard";
  
    //   navigation.setOptions({
    //     headerTitle: getHeaderTitle(routeName),
    //   });
    // }, [navigation, route]);
  // const openDrawer=()=>{
  //   navigation.openDrawer()
  // }
  return (
    <View style={{flex:1}}>
      {/* <StudentHeader openDrawer={openDrawer}/> */}
      <BottomNavigator/>
    </View>
  )
}

export default Main