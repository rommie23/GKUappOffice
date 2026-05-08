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

  return (
    <View style={{flex:1}}>
      <FooterBottom/>
    </View>
  )
  
}
export default MainFile

// import React, { useEffect, useState, useCallback } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import FooterBottom from './FooterBottom';
// import { useNavigationState, useFocusEffect } from "@react-navigation/native";
// import EncryptedStorage from 'react-native-encrypted-storage';
// import { BASE_URL } from '@env';

// const MainFile = ({ navigation }) => { 

//   const [checking, setChecking] = useState(true);
//   const [blocked, setBlocked] = useState(false);

//   const state = useNavigationState((state)=> state);

//   // 🔥 Fix your current route logic (your version is broken)
//   const currentTabRoute =
//     state.routes[state.index]?.state?.routes?.[
//       state.routes[state.index]?.state?.index || 0
//     ]?.name || 'Home';

//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: getHeaderTitle(currentTabRoute),
//     });
//   }, [currentTabRoute]);

//   const getHeaderTitle = (routeName) => {
//     switch (routeName) {
//       case 'Home': return 'Dashboard';
//       case 'Leave': return 'Leave';
//       case 'Movement': return 'Movement';
//       case 'Profile': return 'Profile';
//       default: return 'Dashboard';
//     }
//   };

//   const checkRestriction = async () => {
//     try {
//       const session = await EncryptedStorage.getItem("user_session");
//       if (!session) return;
//       const res = await fetch(`${BASE_URL}/staff/checkUserRestrictions`, {
//         method:'POST',
//           headers:{
//             Authorization: `Bearer ${session}`,
//             Accept: "application/json",
//             'Content-Type': "application/json"
//           }
//       });

//       const data = await res.json();
      
//       console.log("checkRestriction", data);
      
//       if (data.blocked) {
//         setBlocked(true);

//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'SubmitReportScreen' }],
//         });

//       } else {
//         setBlocked(false);
//       }

//     } catch (err) {
//       console.log("Restriction check error:", err);
//     } finally {
//       setChecking(false);
//     }
//   };

//   // ✅ Run on mount
//   useEffect(() => {
//     checkRestriction();
//   }, []);

//   // ✅ Run when screen comes into focus (important)
//   useFocusEffect(
//     useCallback(() => {
//       checkRestriction();
//     }, [])
//   );

//   // 🔒 Don't render app while checking
//   if (checking) {
//     return (
//       <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // 🔒 Optional hard block
//   if (blocked) {
//     return null;
//   }

//   return (
//     <View style={{ flex:1 }}>
//       <FooterBottom />
//     </View>
//   );
// };

// export default MainFile;