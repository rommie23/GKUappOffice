import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MyNotification from './MyNotification';
import AllNotification from './AllNotification';
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import colors from '../../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width

const MainNotification = () => {
    const SecondRoute = () => (
        <MyNotification />
    );
    const ThirdRoute = () => (
        <AllNotification />
    );


    const renderScene = SceneMap({
        MyNotices: SecondRoute,
        AllNotices: ThirdRoute,
    });
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'MyNotices', title: 'MyNotices' },
        { key: 'AllNotices', title: 'AllNotices' },
    ]);
    return (
      <View style={{ flex: 1}}>
        <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={props =>
          <TabBar {...props} style={{ backgroundColor: colors.uniBlue, color: 'white' }} />}

      />
    </View>
  )
}

export default MainNotification

const styles = StyleSheet.create({})