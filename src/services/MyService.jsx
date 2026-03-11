import { View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import BackgroundService from 'react-native-background-actions';
import { PERMISSIONS, request } from 'react-native-permissions';
import Config from 'react-native-config';
import notifee from '@notifee/react-native';

const onDisplayNotification = async()=>{
  await notifee.requestPermission()
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  await notifee.displayNotification({
    title: 'Notification Title',
    body: 'Main body content of the notification',
    android: {
      channelId,
      // smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}

const MyService = () => {
  const [sendNotification, setSendNotification] = useState(false)
  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        // i can call api here
        await BackgroundService.updateNotification({ taskDesc: 'counter' +i });
        if(sendNotification == true){
          onDisplayNotification()
          setSendNotification(false)
        }
        
        console.log(i);
        await sleep(delay);
      }
    });
  };
  const options = {
    taskName: 'send notification',
    taskTitle: 'Notification from GKU',
    taskDesc: 'read on click',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: Config.BASE_URL+'/student/result', // See Deep Linking for more info
    parameters: {
      delay: 5000,
    },
  };
  const startBackgroundService = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({ taskDesc: 'counting' });
  }
  const stopBackgroundService = async ()=>{
    await BackgroundService.stop();
  }
  const requestPrmissions = (permission)=>{
    request(permission).then(result=>{
      console.log('permission status', result);
    })
  }
  // useEffect(()=>{
  //   startBackgroundService()
  // },[])
  return (
    <View>
      <Button title='START background service' onPress={()=>{startBackgroundService()}}/>
      <Button title='STOP background service' onPress={()=>{stopBackgroundService()}} />
      <Button title='send a notification' onPress={()=>{setSendNotification(true)}} />
      <Button
        title='foreground permission'
        onPress={()=>requestPrmissions(PERMISSIONS.ANDROID.FOREGROUND_SERVICE)}/>
      <Button
        title='background permission'
        onPress={()=>requestPrmissions(PERMISSIONS.ANDROID.WAKE_LOCK)}/>
    </View>
  )
}

export default MyService