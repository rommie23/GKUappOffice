import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image, Pressable } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import NoticeBoard from './NoticeBoard';
import OfficeOrder from './OfficeOrder';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { images } from '../../images/index';
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

import { useNavigation } from '@react-navigation/native';
const SecondRoute = () => (
    <OfficeOrder />
);
const ThirdRoute = () => (
    <NoticeBoard />
);

const renderScene = SceneMap({
  OfficeOrder: SecondRoute,
  NoticeBoard: ThirdRoute,
});

export default function MyLeaves() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'OfficeOrder', title: 'Office Order' },
    { key: 'NoticeBoard', title: 'Notice Board' },
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
