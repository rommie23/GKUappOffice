import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SupervisorMovementsPending from './SupervisorMovementsPending';
import SupervisorMovementsReport from './SupervisorMovementsReport';
import SupervisorMovementGranted from './SupervisorMovementGranted';
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import colors from '../../../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width

const SupervisorMovements = () => {
    const SecondRoute = () => (
        <SupervisorMovementsPending />
    );
    const ThirdRoute = () => (
        <SupervisorMovementGranted />
    );
    const FourthRoute = () => (
        <SupervisorMovementsReport />
    );

    const renderScene = SceneMap({
        Pending: SecondRoute,
        Granted: ThirdRoute,
        Reports: FourthRoute,
    });
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'Pending', title: 'Pending' },
        { key: 'Granted', title: 'Granted' },
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

export default SupervisorMovements

const styles = StyleSheet.create({})