import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SelectList } from 'react-native-dropdown-select-list'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

const screenWidth = Dimensions.get('window').width;
const BookSearch = () => {

  const navigation = useNavigation()
  const [sortBy, setSortBy] = useState('')
  const [searchBy, setSearchBy] = useState('')
  const [keywords, setKeywords] = useState('')
  const [booksData, setBooksData] = useState({})
  const [laoding, setLoading] = useState(false)


  // sending the details to backend
  const sendBookDetails = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const books = await fetch(BASE_URL + `/student/searchBooks/${sortBy}/${searchBy}/${keywords}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const allBooks = await books.json()
        setBooksData(allBooks)
        setLoading(false)
        console.log(allBooks);

      } catch (error) {
        console.log('Error fetching book search ::', error);
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
        setLoading(false)

        // setShowModal(true)
      }
    }
  }

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
      <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View>
            <View style={[styles.innerContainer]}>

              {/* selecting purpose of the movement */}
              <View style={[styles.eachInput]}>
                <Text style={styles.txtStyle}>Sort By</Text>
                <SelectList boxStyles={{ padding: 10, width: "100%" }}
                  setSelected={(val) => setSortBy(val)}
                  fontFamily='time'
                  data={[
                    { key: 'All', value: 'All' },
                    { key: 'Issued', value: 'Issued' },
                    { key: 'Available', value: 'Available' },
                  ]}
                  arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                  search={false}
                  defaultOption={{ key: '0', value: 'Select' }}
                  inputStyles={{ color: 'black' }}
                  dropdownTextStyles={{ color: 'black' }}
                />
              </View>


              {/* selecting movement inside or outside */}

              <View style={styles.eachInput}>
                <Text style={styles.txtStyle}>Search By</Text>
                <SelectList boxStyles={{ padding: 10, width: "100%" }}
                  setSelected={(val) => setSearchBy(val)}
                  fontFamily='time'
                  data={[
                    { key: 'Title', value: 'Title' },
                    { key: 'AccessionNo', value: 'AccessionNo' },
                    { key: 'Auther', value: 'Auther' },
                    { key: 'Edition', value: 'Edition' },
                    { key: 'Publisher', value: 'Publisher' },
                  ]}
                  arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                  search={false}
                  defaultOption={{ key: '0', value: 'Select' }}
                  inputStyles={{ color: 'black' }}
                  dropdownTextStyles={{ color: 'black' }}
                />
              </View>

              {/* to write down auther/bookname */}
              <View style={styles.eachInput}>
                <Text style={styles.txtStyle}>Search Keyword</Text>
                <TextInput
                  value={keywords}
                  style={[styles.inputBox, { color: 'black' }]}
                  onChangeText={setKeywords}
                />
              </View>
              <View style={styles.eachInput}>
                <TouchableOpacity style={[styles.btn, { opacity: keywords.length > 0 ? 1 : 0.5 }]} onPress={() => { sendBookDetails() }} disabled={keywords.length > 0 ? false : true}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            {
              laoding ? <ActivityIndicator/> :
              booksData['data'] && booksData['data'].map((book,i)=>(
                <View key={i} style={styles.card}>
                <View style={styles.topCard}>
                  <View style={styles.cardTop}>
                    <Text style={[styles.textStyle]}>Title : {book['Title']}</Text>
                    <Text style={[styles.textSmall]}>Author : {book['Author']}</Text>
                  </View>
                    <Text style={[styles.textStyle, {color:colors.uniBlue}]}>{book['AccessionNo']}</Text>
                </View>
                <View style={styles.bottomCardBottom}>
                  {/* <View style={[styles.dates, {width:'50%'}]}>
                    <Text style={[styles.textSmall]}>Author</Text>
                    <Text style={[styles.textSmall,{color:colors.uniBlue}]}>{book['Author']}</Text>
                  </View> */}
                  <View style={[styles.dates, {width:'50%'}]}>
                    <Text style={[styles.textSmall]}>Publisher</Text>
                    <Text style={[styles.textSmall,{color:colors.uniRed}]}>{book['Publisher']}</Text>
                  </View>
                </View>
              </View>
              ))

            }
            

          </View>
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  )
}

export default BookSearch

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: '#f1f1f1',

  },
  innerContainer: {
    backgroundColor: 'white',
    elevation: 2,
    // borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 16
  },
  eachInput: {
    marginTop: 16,
    rowGap: 4
  },
  inputBox: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 8,
    color: 'black',
    backgroundColor: '#fffafa'
  },

  btn: {
    marginVertical: 4,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.uniBlue,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  txtStyle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600'
  },
  card: {
    backgroundColor: 'white',
    height: 'contain',
    width: screenWidth - 24,
    marginVertical: 12,
    borderRadius: 16,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  cardTop:{
    width:'80%'
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
    marginBottom: 4,
    borderBottomColor: 'lightgray',
    paddingVertical: 4
  },
  bottomCardTop: {
    flexDirection: 'row',
    columnGap: 16,
    alignItems: 'center',
    marginTop: 4,
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
    justifyContent:'space-between'
  },
  bottomCardBottomLeft: {
    width: '85%'
  },
  smallText:{
    color:'black'
  }
})