import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BASE_URL } from '@env'
import colors from '../../../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

export default function OriginalDocumentReturn({navigation}) {
  const [documents, setDocuments] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSelection = (id) => {
    setDocuments(prev =>
      prev.map(item =>
        item.SerialNo === id
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const docsListFn = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session")
    try {
      if (session != null) {
        const list = await fetch(`${BASE_URL}/student/submittedDocsList`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'Content-Type': 'application/json'
          }
        })
        const listData = await list.json();
        setDocuments(listData['data'])
      }
    } catch (error) {
      console.log('Error fetching paymentDataFetch Api ::', error);
      errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went wrong.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    docsListFn()
  }, [])



  const submitRequest = async () => {
    const selectedDocs = documents.filter(item => item.selected);
    
    if (selectedDocs.length === 0) {
      Alert.alert('Please select at least one document.');
      return;
    }
    const selectedDocsId = selectedDocs.map((doc) => doc.SerialNo)    
    const session = await EncryptedStorage.getItem("user_session")
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/student/submitReturnRequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          selectedDocsId, remarks
        })
      })
      const response = await res.json();
      console.log(response);

      if (res.status === 200) {
        errorModel(ALERT_TYPE.SUCCESS, 'Success', response.message)
      }else if (res.status === 409){
        errorModel(ALERT_TYPE.INFO, 'Already Exist', response.message)
      }else{
        errorModel(ALERT_TYPE.DANGER, "Oops!!!", "Something went wrong !!!")
      }

    } catch (error) {
      console.log('submitNewAddress bind :: ', error);
    }
    finally{
      setLoading(false)
    }
  };

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close',
      onHide: setLoading(false)
    })
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {
            loading ? <ActivityIndicator />
              :

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.heading}>
                  Select Original Documents
                </Text>

                <Text style={styles.subHeading}>
                  Choose the documents you want to collect from the university.
                </Text>

                {documents?.map(item => (
                  <TouchableOpacity
                    key={item.SerialNo}
                    style={styles.card}
                    onPress={() => toggleSelection(item.SerialNo)}>
                    <FontAwesome5
                      name={item.selected ? 'check-square' : 'square'}
                      size={22}
                      color="#0066CC"
                    />
                    <Text style={styles.title}>
                      {item.DocumentsRequired}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TextInput
                  style={styles.input}
                  placeholder="Remarks (Optional)"
                  placeholderTextColor="#999"
                  multiline
                  value={remarks}
                  onChangeText={setRemarks}
                  textAlignVertical="top"
                />

              </ScrollView>
          }
          <TouchableOpacity
            style={[styles.button, {opacity: documents.length == 0 && 0.5}]}
            onPress={submitRequest}
            disabled={documents.length == 0}
          >
            <Text style={styles.buttonText}>
              Submit Request
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 16,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  subHeading: {
    color: '#666',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },

  title: {
    marginLeft: 14,
    fontSize: 16,
    color: '#222',
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    minHeight: 100,
    padding: 15,
    textAlignVertical: 'top',
    marginTop: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: colors.uniBlue,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});