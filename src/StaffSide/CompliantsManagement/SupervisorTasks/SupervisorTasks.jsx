import { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

import { useNavigation } from '@react-navigation/native';
import SupervisorPendingTask from './SupervisorPendingTask';
import SupervisorCompletedTask from './SupervisorCompletedTask';
import SupervisorRejectedTasks from './SupervisorRejectedTasks';
import SupervisorAssignedTasks from './SupervisorAssignedTasks';
import SupervisorInProgressTasks from './SupervisorInProgressTasks';

const SecondRoute = () => (
  <SupervisorPendingTask />
);
const ThirdRoute = () => (
  <SupervisorCompletedTask />
);
const FourthRoute = () => (
  <SupervisorInProgressTasks />
);

const FifthRoute = ()=>(
  <SupervisorAssignedTasks/>
)
const renderScene = SceneMap({
  Pending: SecondRoute,
  Assigned: FifthRoute,
  ongoing: FourthRoute,
  Completed: ThirdRoute,
});

export default function SupervisorTasks() {
  const navigation = useNavigation()
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'Pending', title: 'Pending' },
    { key: 'Assigned', title: 'Assigned' },
    { key: 'ongoing', title: 'ongoing' },
    { key: 'Completed', title: 'Completed' },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={props =>
          <TabBar {...props} 
          style={{ backgroundColor: '#223260', color: 'white' }} 
          labelStyle ={{fontSize:12, fontWeight:'bold'}}
          indicatorStyle={{height: 3 }}
          />}

      />
    </View>
  );
}

