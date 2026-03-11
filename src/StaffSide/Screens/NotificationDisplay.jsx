import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'

const NotificationDisplay = ({ route }) => {
  const { notificationData } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.card}>
          
          <Text style={styles.title}>
            {notificationData.Subject}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.messageLabel}>Message</Text>

          <Text style={styles.message}>
            {notificationData.Discriptions}
          </Text>

        </View>

      </ScrollView>
    </View>
  )
}

export default NotificationDisplay

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F6FA'
  },

  scroll: {
    padding: 16
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222'
  },

  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginVertical: 14
  },

  messageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
    marginBottom: 6
  },

  message: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24
  }

})