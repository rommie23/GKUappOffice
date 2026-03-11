// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const ScanqrScreen = () => {
//   return (
//     <View>
//       <Text>ScanqrScreen</Text>
//     </View>
//   )
// }

// export default ScanqrScreen

// const styles = StyleSheet.create({})

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

export default function ScanqrScreen() {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedValue, setScannedValue] = useState(null);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const value = codes[0].value;
        console.log('Scanned:', value);
        setScannedValue(value);
      }
    },
  });

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
    })();
  }, []);

  if (!device || !hasPermission) {
    return <View style={styles.center}><Text>Loading camera...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      {scannedValue && (
        <View style={styles.overlay}>
          <Text style={styles.text}>Scanned: {scannedValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'black',
    padding: 10,
  },
  text: { color: 'white' },
});