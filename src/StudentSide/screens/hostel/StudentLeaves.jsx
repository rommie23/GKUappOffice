import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image, Pressable } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ApplyLeaves from './ApplyLeaves'
import ViewStudentLeaves from './ViewStudentLeaves';
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

import { useNavigation } from '@react-navigation/native';
const SecondRoute = () => (
    <ApplyLeaves />
);
const ThirdRoute = () => (
    <ViewStudentLeaves />
);

const renderScene = SceneMap({
  ApplyLeaves: SecondRoute,
  ViewStudentLeaves: ThirdRoute,
});

export default function StudentLeaves() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'ApplyLeaves', title: 'Apply Leave' },
    { key: 'ViewStudentLeaves', title: 'View Leaves' },
  ]);

  return (
    <View style={{ height:screenHeight}}>
      <TabView
      lazy
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
