import { View, Text, StyleSheet, Dimensions, Image, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import colors from '../../colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


const LibraryBooks = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [booksIssued, setBooksIssued] = useState([])
  const getStaffBooksIssued = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const BooksDetails = await fetch(BASE_URL + '/staff/issueddetail/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const staffIssuedBooksData = await BooksDetails.json()
        setBooksIssued(staffIssuedBooksData['books'])
        // console.log('data in state variable',booksIssued)
      } catch (error) {
        console.log('Error fetching issuedBooks data:staffBooksIssued:', error)
      }
    }
  }
  useEffect(() => {
    getStaffBooksIssued()
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getStaffBooksIssued()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  // console.log(booksIssued)
  return (
    <View>
      <ScrollView style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {booksIssued.length > 0 ?
          booksIssued.map((book, i) =>
            <View key={i} style={styles.card}>
              <View style={styles.topCard}>
                <View style={styles.cardTop}>
                  <Text style={[styles.textStyle]}>{book['Title']}</Text>
                  <Text style={[styles.textSmall]}>{book['Author']}</Text>
                </View>
                <Text style={[styles.textStyle, { color: colors.uniBlue }]}>{book['AccessionNo']}</Text>
              </View>
              <View style={styles.bottomCardBottom}>
                <View style={styles.dates}>
                  <Text style={[styles.textSmall]}>Book Issue Date</Text>
                  <Text style={[styles.textStyle, { color: colors.uniBlue }]}>{(JSON.stringify(book['IssueDate']).slice(1, 11)).split("-").reverse().join("-")}</Text>
                </View>
                <View style={styles.dates}>
                  <Text style={[styles.textSmall]}>Due Date</Text>
                  <Text style={[styles.textStyle, { color: colors.uniRed }]}>{(JSON.stringify(book['LastReturnDate']).slice(1, 11)).split("-").reverse().join("-")}</Text>
                </View>
              </View>
            </View>
          ) :
          <Text style={styles.norecordText}>No records found</Text>
        }
      </ScrollView>
    </View>
  )
}

export default LibraryBooks

const styles = StyleSheet.create({

  container: {
    // backgroundColor:'#fff'
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
    marginTop: 12,
  },
  bottomCardMiddle: {
    flexDirection: 'row',
    paddingVertical: 12,
    justifyContent: 'space-between'
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
    justifyContent: 'space-between'
  },
  bottomCardBottomLeft: {
    width: '85%'
  },
  norecordText: {
    color: 'black',
    alignSelf: 'center',
    marginTop: 20
  }

})