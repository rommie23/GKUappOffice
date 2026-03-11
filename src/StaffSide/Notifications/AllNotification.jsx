import { ActivityIndicator, Dimensions, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import IonIcons from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const AllNotification = () => {
  const [notices, setNotices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null)

  const getNotices = async () => {
    setIsLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    console.log("getNotices called");

    if (session != null) {
      try {
        const notices = await fetch(BASE_URL + '/staff/allNotices/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const totalnoticesData = await notices.json()
        console.log('total sem data ::', totalnoticesData);
        if (totalnoticesData.length < 1) {
          errorModel(ALERT_TYPE.WARNING, "No Notice", "There are no notices to show");
        }
        else {
          setNotices(totalnoticesData)
        }
        setIsLoading(false)
      } catch (error) {
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!");
        console.log('Error fetching Guri data:AllsubjectsSemwise:', error);
        setIsLoading(false)
      }
    }
  }
  useEffect(() => {
    getNotices()
  }, [])

  const forDownloadPDf = (id) => {
    const url = `${IMAGE_URL}/Notices/${id}`;
    console.log('id is ::', url);

    try {
      const url = `${IMAGE_URL}/Notices/${id}`;
      setPdfUrl(url);
    } catch {
      errorModel(ALERT_TYPE.WARNING, "Selection", `please try again`)
    }
  };

  const errorModel = (type, title, message) => {
          Dialog.show({
              type: type,
              title: title,
              textBody: message,
              button: 'close',
              onHide: () => navigation.goBack()
          })
      }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getNotices()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <AlertNotificationRoot>
      <View>

        <ScrollView style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? <ActivityIndicator /> :
            notices.length == 0 ?
              <View>
                <Text style={{ color: 'gray' }}>No data found</Text>
              </View> :
              notices.map((notice, i) => (
                <View style={styles.card} key={i}>
                  <View style={styles.topCard}>
                    <View style={styles.cardTop}>
                      <Text style={[styles.textStyle]}>{notice['Subject']}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-start' }} >
                    <View>
                      <Text style={{ color: '#4C4E52', fontSize: 14 }}>{notice.NoticeDetail}</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <View style={styles.dates}>
                          <Text style={[styles.textSmall]}>Date</Text>
                          <Text style={[styles.textStyle, { color: colors.uniRed }]}>{(JSON.stringify(notice['Date'])?.slice(1, 11))?.split("-")?.reverse()?.join("-")}</Text>
                        </View>
                        <View style={styles.dates}>
                          {notice?.FileName ? (
                            <TouchableOpacity
                              style={{
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                backgroundColor: colors.uniRed,
                                borderRadius: 8,
                              }}
                              onPress={() => forDownloadPDf(notice.FileName)}
                            >
                              <Text style={{ color: 'white', fontWeight: '600' }}>Download</Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>

                      </View>


                    </View>
                  </View>
                </View>

              ))
          }
          {pdfUrl && (
            <WebView
              source={{ uri: pdfUrl }}
              style={{ marginTop: 20, width: '100%', height: '80%' }}
            />
          )}

        </ScrollView>
      </View>
    </AlertNotificationRoot>
  )
}

export default AllNotification

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    height: 'contain',
    width: screenWidth - 24,
    marginVertical: 12,
    borderRadius: 16,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  cardTop: {
    width: '80%'
  },
  topCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 0.5,
    paddingVertical: 12
  },
  textStyle: {
    fontSize: 15,
    color: '#1b1b1b',
    fontWeight: '500'
  },
  dates: {
    borderBottomColor: 'lightgray',
    paddingVertical: 12
  },
  bottomCardTop: {
    flexDirection: 'row',
    columnGap: 16,
    alignItems: 'center',
    // marginTop: 12,
  },
  textSmall: {
    color: '#4C4E52',
    fontSize: 12,
  },
  rowMiddle: {
    width: '60%'
  },
  bottomCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  bottomCardBottomLeft: {
    width: '85%'
  },
  downloadBtn: {
    backgroundColor: colors.uniBlue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  btnTxt: {
    color: 'white'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})