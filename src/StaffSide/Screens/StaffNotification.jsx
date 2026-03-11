import { StyleSheet, Image, ActivityIndicator, View, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Card, Text } from 'react-native-paper'
import Entypo from 'react-native-vector-icons/Entypo'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env';
import colors from '../../colors'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

const StaffNotification = () => {

  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [allNotifications, setAllNotifications] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const navigation = useNavigation()

  const recentNotifications = async (pageNumber = 1) => {
  
    if (pageNumber === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
  
    const session = await EncryptedStorage.getItem("user_session")
  
    if (session) {
      try {
  
        const res = await fetch(`${BASE_URL}/notifiaction/allNotification?page=${pageNumber}&limit=10`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
  
        const response = await res.json()
  
        if (pageNumber === 1) {
          setAllNotifications(response)
        } else {
          setAllNotifications(prev => [...prev, ...response])
        }
  
        setPage(pageNumber)
  
        // 👇 Important check
        if (response.length < 10) {
          setHasMore(false)
        }
  
      } catch (error) {
        console.log(error)
      }
  
      setLoading(false)
      setLoadingMore(false)
    }
  }
  
    const loadMore = () => {
    if (!loadingMore && hasMore) {
      recentNotifications(page + 1)
    }
  }

  const readNotifications = async (notificationId, screenName) => {

    const session = await EncryptedStorage.getItem("user_session")

    if (session) {
      try {

        await fetch(`${BASE_URL}/notifiaction/readNotification`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({
            notificationId
          })
        })

        screenName
          ? navigation.navigate(screenName)
          : navigation.goBack()

      } catch (error) {
        console.log(error)
      }
    }
  }

  const bulkNotificationAction = (notificationData) => {
    notificationData.ScreenName
      ? navigation.navigate(notificationData.ScreenName, { notificationData })
      : navigation.goBack()
  }

  useFocusEffect(
    useCallback(() => {
      recentNotifications(1)
    }, [])
  )

  const onRefresh = () => {
    setRefreshing(true)
    recentNotifications(1)
    setRefreshing(false)
  }

  const renderItem = ({ item }) => (

    <Card
      style={item.Status == 1 ? styles.notificationCardRead : styles.notificationCardsPending}
      onPress={() =>
        item.EmpID != null
          ? readNotifications(item.ID, item.ScreenName)
          : bulkNotificationAction(item)
      }
    >

      <Card.Title
        title={item.Subject}
        subtitle={item.DateTime?.split('T')[0].split('-').reverse().join("-")}
        left={() => (
          <View style={styles.iconContainer}>
            <Entypo name='bell' size={24} color={'white'} />
          </View>
        )}
        titleStyle={{ fontWeight: '800' }}
        right={() => <Entypo name="eye" color={colors.uniBlue} size={28} style={{ marginRight: 12 }} />}
      />

      <Card.Content>
        <Text>{item.Discriptions}</Text>
      </Card.Content>

    </Card>
  )

  return (

    <FlatList
      data={allNotifications}
      keyExtractor={(item) => item.ID.toString()}
      renderItem={renderItem}

      onEndReached={loadMore}
      onEndReachedThreshold={0.5}

      ListFooterComponent={
        loadingMore ? <ActivityIndicator style={{ margin: 20 }} /> : null
      }

      ListEmptyComponent={
        !loading ? <Text style={{ alignSelf: 'center', padding: 50 }}>No Notifications</Text> : null
      }

      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }

      contentContainerStyle={{ paddingBottom: 20 }}
    />

  )
}

export default StaffNotification

const styles = StyleSheet.create({

  notificationCardsPending: {
    padding: 4,
    elevation: 1,
    backgroundColor: '#E6E6FA',
    margin: 2
  },

  notificationCardRead: {
    padding: 4,
    elevation: 1,
    backgroundColor: '#f1f1f1',
    margin: 2
  },

  iconContainer: {
    backgroundColor: colors.uniRed,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderRadius: 32,
    borderColor: colors.uniBlue,
    borderWidth: 3
  }

})