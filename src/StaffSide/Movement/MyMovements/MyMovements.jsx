import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MovementReports from './MovementReports';
import MovementPending from './MovementPending';
// import MovementRequestHistory from './MovementRequestHistory';
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import colors from '../../../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height


const MyMovements = () => {

    const SecondRoute = () => (
        <MovementPending />
    );
    const ThirdRoute = () => (
        <MovementReports />
    );

    const renderScene = SceneMap({
        CurrentMovements: SecondRoute,
        Reports: ThirdRoute,
    });
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'CurrentMovements', title: 'Current Movements' },
        { key: 'Reports', title: 'Reports' },
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
          <TabBar {...props} style={{ backgroundColor: colors.uniBlue, color: 'white' }} />}

      />
    </View>
  )
}

export default MyMovements

const styles = StyleSheet.create({})