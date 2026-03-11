import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image, Pressable } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import SupervisorLeavesPending from './SupervisorLeavesPending';
import SupervisorLeavesAccepted from './SupervisorLeavesAccepted';
import SupervisorLeavesRejected from './SupervisorLeavesRejected';
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const SecondRoute = () => (

  <SupervisorLeavesPending />
);
const ThirdRoute = () => (
  <SupervisorLeavesAccepted />
);
const FourthRoute = () => (
  <SupervisorLeavesRejected />
);
const renderScene = SceneMap({
  Pending: SecondRoute,
  Approved: ThirdRoute,
  Rejected: FourthRoute,
});

export default function SupervisorLeaves() {
  const navigation = useNavigation()
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'Pending', title: 'Pending' },
    { key: 'Approved', title: 'Approved' },
    { key: 'Rejected', title: 'Rejected' }
  ]);

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1}}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={props =>
          <TabBar {...props} style={{ backgroundColor: '#223260', color: 'white' }} />}

      />
    </View>
  );
}

const styles = StyleSheet.create({
});
