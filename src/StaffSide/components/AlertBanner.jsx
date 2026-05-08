import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AlertBanner = ({ alerts }) => {
  if (!Array.isArray(alerts) || alerts.length === 0) return null;
  console.log("AlertBanner::",alerts);
  const Navigation = useNavigation()
  

  return (
    <View style={styles.container}>
      {alerts.map((item, index) => (
        <View key={index} style={styles.alertBox}>
          <Text style={styles.alertText}>{item.message}</Text>
          <TouchableOpacity style={{backgroundColor:'#FFA500', paddingHorizontal:4, paddingVertical:4, borderRadius:4}} 
          onPress={()=> Navigation.navigate(item.screen)}>
            <Text>Upload</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default AlertBanner;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginTop: 10,
  },
  alertBox: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  alertText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});