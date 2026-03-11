import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL, IMAGE_URL } from '@env';
import { ActivityIndicator, Avatar, Button, List } from 'react-native-paper';
import colors from '../../colors';
import { StudentContext } from '../../context/StudentContext';

const TrackNoDues = ({ route }) => {
  let { noDueId, acceptStatus: initialAcceptStatus } = route.params;
  const {data} = useContext(StudentContext)

  const [acceptStatus, setAcceptStatus] = useState(initialAcceptStatus);
  const [authList, setAuthList] = useState(false)
  const [recepients, setRecepients] = useState([])
  // const [showAuthList, setShowAuthList] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);


  console.log("noDueId::", noDueId, acceptStatus);

  const clickAccept = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    console.log("clickAcceptclickAccept")
    if (session != null) {
      try {
        const noDueTab = await fetch(`${BASE_URL}/staff/acceptNoDues`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            { noDueId: noDueId }
          )
        })
        const result = await noDueTab.json()
        if (result.flag === 1) {
          setAcceptStatus(1);
          await listOfAuth();
          notificationfunction(recepients)
        }
        // console.log("noDuesAccept:::", showTab);
        setIsLoading(false)
      } catch (error) {
        console.log("checkSendNoticeAuth:::", error);
        setIsLoading(false)
      }
    }
  }


  const listOfAuth = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const noDueTab = await fetch(`${BASE_URL}/staff/noDuesAuthList`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            { noDueId }
          )
        })
        const showTab = await noDueTab.json()
        const recepientsId = showTab['noDuesData'].map((item)=> {return item.NoDuesID})
        // console.log("recepientsId::", recepientsId);
        setRecepients(recepientsId)
        
        // console.log("listOfAuth:::", showTab);
        setAuthList(showTab['noDuesData'])
        setIsLoading(false)
      } catch (error) {
        console.log("listOfAuth:::", error);
        setIsLoading(false)
      }
    }
  }


  const notificationfunction = async (recepients) => {
    console.log("notificationfunction", recepients);
    
    const session = await EncryptedStorage.getItem("user_session");
    try {
      if (session != null) {
        const res = await fetch(BASE_URL + '/notifiaction/sendNotificationSelected', {
          method: 'POST',
          headers: {
            Accept: "application/json",
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            sendby: data.data[0].IDNo,
            receipients: recepients,
            Title: "No Dues Request",
            body: `${data.data[0].Name} has Requested for No Dues Approval.`,
            screenName: 'ApproveNodues',
            webUrl: 'staff-no-dues-approve.php'
          })
        })
        const response = await res.json()
        console.log(response);
      }
    } catch (error) {
      console.log("error in Notification::", error);

    }
  }

  useEffect(() => {
    listOfAuth();
  }, [])

  const onRefresh = useCallback(() => {
    listOfAuth();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  return (
    <View style={{ width: '92%', alignSelf: 'center' }}>
      <View style={[styles.cardFull]} >
        <View style={styles.rightText}>
          <Text style={[styles.cardTxt]}>No Dues are Generated</Text>
          <Text style={[styles.textSmall]}>Press Accept for further process</Text>
        </View>
        <View>
          {
            acceptStatus == 1 ? <Text style={{ color: 'green', fontWeight: '600', fontSize: 16 }} >Accepted</Text> :
              <TouchableOpacity style={{ backgroundColor: '#4dce41', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 }} onPress={() => clickAccept()}>
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Accept</Text>
              </TouchableOpacity>
          }
        </View>
      </View>
      <ScrollView style={{ backgroundColor: '#fff', borderRadius: 16, paddingBottom: acceptStatus == 1 ? 16 : 0, marginBottom:120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }

      >
        {
          isLoading ? <ActivityIndicator /> :
            acceptStatus == 1 && authList.length > 0 &&
            authList.map((item) => {
              const name = item.Name.trim()
              return (
                <List.Item
                  key={item.ID}
                  title={`${name}(${item.NoDuesID})`}
                  description={item?.AuthDepartmentName}
                  titleStyle={styles.title}
                  left={() => (
                    item.Imagepath != null || item.Imagepath != undefined ?
                      <Avatar.Image
                        size={40}
                        source={{ uri: `${IMAGE_URL}Images/Staff/${item.Imagepath}` }}
                        style={styles.avatar}
                      /> :

                      <Avatar.Text
                        size={40}
                        label={name.charAt(0).toUpperCase()}
                        style={styles.avatar}
                      />
                  )}
                  right={() => (
                    item.Status == 1 ? <Text style={{ color: 'green', fontWeight: '600', fontSize: 16 }} >Accepted</Text> : <Text style={{ color: colors.uniBlue, fontWeight: '600', fontSize: 16 }} >Pending</Text>
                  )}
                  style={styles.item}
                />
              )
            })
        }
      </ScrollView>
    </View>
  )
}

export default TrackNoDues

const styles = StyleSheet.create({
  cardFull: {
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    gap: 16,
    flexDirection: 'row',
    elevation: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 16
  },
  rightText: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  cardTxt: {
    color: '#3b5998',
    fontSize: 20,
    fontWeight: '600'
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 14
  },
  item: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#a1a1a1',
    marginVertical: 6,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: "#e6e9f5",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  }
})