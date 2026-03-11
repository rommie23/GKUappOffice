import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import CreateStaffNotice from './CreateStaffNotice';
import CreateStudentNotice from './CreateStudentNotice';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import colors from '../../../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width

const CreateNotificationMain = () => {
    const SecondRoute = () => (
        <CreateStaffNotice />
    );
    const ThirdRoute = () => (
        <CreateStudentNotice />
    );


    const renderScene = SceneMap({
        Staff: SecondRoute,
        Student: ThirdRoute,
    });
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'Staff', title: 'Staff' },
        { key: 'Student', title: 'Student' },
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

export default CreateNotificationMain

const styles = StyleSheet.create({})