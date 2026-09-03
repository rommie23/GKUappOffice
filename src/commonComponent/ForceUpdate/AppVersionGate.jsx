import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { BASE_URL } from '@env';

const isVersionLower = (current, minimum) => {
  const currentParts = current.split('.').map(Number);
  const minimumParts = minimum.split('.').map(Number);
  const length = Math.max(currentParts.length, minimumParts.length);

  for (let i = 0; i < length; i++) {
    const currentPart = currentParts[i] || 0;
    const minimumPart = minimumParts[i] || 0;

    if (currentPart < minimumPart) return true;
    if (currentPart > minimumPart) return false;
  }

  return false;
};

const AppVersionGate = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [updateRequired, setUpdateRequired] = useState(false);
  const [updateUrl, setUpdateUrl] = useState(null);

  useEffect(() => {
    checkVersion();
  }, []);

  const checkVersion = async () => {
    try {

      const formatBytes = (bytes, decimals = 2) => {
        if (!bytes || bytes <= 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
      };


      const currentVersion = DeviceInfo.getVersion();
      // console.log("Total Storage::", formatBytes(await DeviceInfo.getTotalDiskCapacity()));
      // console.log("Free storage::", formatBytes(await DeviceInfo.getFreeDiskStorage()));
      // console.log("brand::", DeviceInfo.getBrand());
      // console.log("manufacturer::", await DeviceInfo.getManufacturer());
      // console.log("DeviceName::", await DeviceInfo.getDeviceName());
      // console.log("RAM ::", formatBytes(await DeviceInfo.getTotalMemory()));
      // console.log("Used RAM ::", formatBytes(await DeviceInfo.getUsedMemory()));

      const platform = Platform.OS === 'ios' ? 'ios' : 'android';

      // console.log('Current Version:', currentVersion);
      // console.log('Platform:', platform);

      const response = await fetch(`${BASE_URL}/student/appVersion`, {
        method: 'POST'
      });
      const result = await response.json();

      // console.log('Version Response:', result);

      if (!result?.success) {
        return;
      }

      const config = result[platform];

      if (!config) {
        console.log('No config for platform:', platform);
        return;
      }

      // console.log('Minimum Version:', config.minimumVersion);
      // console.log('Update URL:', config.updateUrl);

      if (isVersionLower(currentVersion, config.minimumVersion)) {
        setUpdateUrl(config.updateUrl);
        setUpdateRequired(true);
      }
    } catch (error) {
      console.log('Version Check Error:', error);
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator size="large" />

        <Text style={{ marginTop: 10 }}>
          Checking app version...
        </Text>
      </View>
    );
  }

  if (updateRequired) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 30,
          backgroundColor: '#fff',
        }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: '#111827',
            marginBottom: 12,
          }}>
          Update Required
        </Text>

        <Text
          style={{
            fontSize: 15,
            lineHeight: 22,
            textAlign: 'center',
            color: '#6B7280',
            marginBottom: 25,
          }}>
          A new version of the app is available. Please update the app to
          continue using it.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (updateUrl) {
              Linking.openURL(updateUrl);
            }
          }}
          style={{
            backgroundColor: '#2563EB',
            paddingHorizontal: 30,
            paddingVertical: 14,
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 15,
              fontWeight: '700',
            }}>
            Update Now
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return children;
};

export default AppVersionGate;