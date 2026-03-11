import { View, Text, StyleSheet, Dimensions, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Modal } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import colors from '../../../colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL, IMAGE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import WebView from 'react-native-webview';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const NoticeBoard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [noticesData, setNoticesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)

  const navigation = useNavigation();

  const getNotices = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      console.log('get notices');
      try {
        const NoticesDetails = await fetch(BASE_URL + '/student/noticeBoard', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          },
        })
        const NoticesDetailsData = await NoticesDetails.json()
        setNoticesData(NoticesDetailsData.data)
        console.log('data froms', NoticesDetailsData)
        setLoading(false)
      } catch (error) {
        console.log('Error fetching noticeBoard data:', error)
        setLoading(false)
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something Went wrong.`)
      }
    }
  }

  const forDownloadPDf = (id) => {
    const url = `${IMAGE_URL}Notices/${id}`;
    console.log('id is ::', url);

    try {
      const url = `${IMAGE_URL}Notices/${id}`;
      setPdfUrl(url);
    } catch {
      errorModel(ALERT_TYPE.WARNING, "Selection", `please try again`)
    }
  };

  useEffect(() => {
    getNotices();
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getNotices()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const errorModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: () => navigation.goBack()
    })
  }
  return (
    <AlertNotificationRoot>
      <View>
        <ScrollView style={{marginBottom:110}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? <ActivityIndicator /> :
            noticesData.length == 0 ?
              <View>
                <Text style={{ color: 'gray' }}>No data found</Text>
              </View> :
              noticesData.map((notice, i) => (
                <View style={styles.card} key={i}>
                  <View style={styles.topCard}>
                    <View style={styles.cardTop}>
                      <Text style={[styles.textStyle]}>{notice['Subject']}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-start' }} >
                    <View style={styles.bottomCardBottom}>
                      <View style={styles.dates}>
                        <Text style={[styles.textSmall]}>Date</Text>
                        <Text style={[styles.textStyle, { color: colors.uniRed }]}>{(JSON.stringify(notice['Date']).slice(1, 11)).split("-").reverse().join("-")}</Text>
                      </View>
                      <View style={styles.dates}>
                        <Text style={[styles.textSmall]}></Text>
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

export default NoticeBoard

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
    marginBottom: 16,
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
})