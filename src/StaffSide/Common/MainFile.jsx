import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import FooterBottom from './FooterBottom'
import { View } from 'react-native'
const Stack = createStackNavigator()
import { getFocusedRouteNameFromRoute, useFocusEffect, useNavigationState } from "@react-navigation/native";

const MainFile = ({ navigation, route }) => { 

  const state = useNavigationState((state)=> state)
  const currentTabRoute = [state.routes.find((r)=> r.name === 'MainFile')?.state?.index || 0]?.name

  useEffect(()=>{
    if (currentTabRoute) {
      navigation.setOptions({
        headerTitle:getHeaderTitle(currentTabRoute),
      })
    }
  },[currentTabRoute, navigation])

    const getHeaderTitle = (routeName) => {
    switch (routeName) {
      case 'Home': return 'Dashboard';
      case 'Leave': return 'Leave';
      case 'Movement': return 'Movement';
      case 'Profile': return 'Profile';
      default: return 'Dashboard';
    }
  };
  // function getHeaderTitle(routeName) {
  //   if (routeName == 'Home') {
  //     return 'Dashboard'
  //   }else if (routeName == 'Leave'){
  //     return 'Leave'
  //   }else if (routeName == 'Movement'){
  //     return 'Movement'
  //   }else if (routeName == 'Profile'){
  //     return 'Profile'
  //   }
  // }

  // useLayoutEffect(() => {
  //   const routeName = getFocusedRouteNameFromRoute(route) ?? "Dashboard";
  //   console.log("routeName::::",routeName);
    

  //   navigation.setOptions({
  //     headerTitle: getHeaderTitle(routeName),
  //   });
  // }, [navigation, route]);
  

  return (
    <View style={{flex:1}}>
      <FooterBottom/>
    </View>
  )
  
}
export default MainFile