import 'react-native-gesture-handler'
import { StyleSheet } from 'react-native';
import {StudentContextProvider} from './src/context/StudentContext'
import AppNavigator from './src/AppNavigator'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function App() {

  return (
    <StudentContextProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{flex:1}}>
          <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
            <AppNavigator/>
          </SafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </StudentContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
