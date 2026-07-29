import React, { useContext, useRef, useState } from 'react';
import {
  View,
  ActivityIndicator,
  BackHandler,
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { StudentContext } from '../../../context/StudentContext';

const EasyPayScreen = ({ navigation, route }) => {
  const { data } = useContext(StudentContext)
  const { sem, fees, feetype, remarks } = route.params
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const { IDNo, StudentName, EmailID, StudentMobileNo } = data.data[0];

  console.log(
    {
      IDNo,
      StudentName,
      EmailID,
      StudentMobileNo,
      productinfo: feetype,
      remarks: remarks,
      amount: fees,
      requestid: -1,
      semester: sem
    }
  );


  // 🔙 Handle Back Button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (canGoBack) {
          // 👉 go back inside WebView
          webviewRef.current.goBack();
        } else {
          // 👉 exit screen (or go to specific screen)
          Alert.alert(
            "Exit Payment",
            "Do you want to cancel the payment?",
            [
              { text: "No", style: "cancel" },
              {
                text: "Yes",
                onPress: () => navigation.replace('StudentDashboard') // 👈 change screen here
              }
            ]
          );
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [canGoBack])
  );

  return (
    <View style={{ flex: 1 }}>
      {/* <WebView
        source={{ html: formHtml }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={(event) => {
          const status = JSON.parse(event.nativeEvent.data);
          console.log('WebView says:', status);
          if (status['status'] == 'success') {
            navigation.replace('PaymentSuccessScreen', { status });
          } else {
            navigation.replace('PaymentFailureScreen', { status });
          }
        }}
      /> */}
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{
          uri: `https://adm.gkuonline.in/eazypay-payment.php?id=${IDNo}`
        }}
        javaScriptEnabled
        domStorageEnabled

        // ✅ track navigation state
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}

        // ✅ loader
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}

        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}
        onMessage={(event) => {
          const status = JSON.parse(event.nativeEvent.data);
          console.log('WebView says:', status);
          if (status['status'] == 'success') {
            navigation.replace('PaymentSuccessScreen', { status });
          } else {
            navigation.replace('PaymentFailureScreen', { status });
          }
        }}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%'
          }}
        />
      )}
    </View>
  );
};

export default EasyPayScreen;