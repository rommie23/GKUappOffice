import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import Feather from 'react-native-vector-icons/Feather';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/native';
import { StudentContext } from '../../../context/StudentContext';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

const SubmitReportScreen = ({ route }) => {
  const {leaveId} = route.params || 0;
  const { setIsLoggedin, setUserType, mobileToken, setBlocked, blocked } = useContext(StudentContext)
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const session = await EncryptedStorage.getItem("user_session");
      const res = await fetch(`${BASE_URL}/staff/pendingAcademicLeaves`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            Accept: "application/json",
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            leaveId
          })
        }
      );
      const data = await res.json();
      const formatted = (data || []).map(item => ({
        ...item,
        file: null
      }));

      setLeaves(formatted);
    } catch (e) {
      console.log(e);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  // 📎 File picker
  const pickFile = useCallback(async (id) => {
    try {
      const response = await pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.images],
      });
      const file = response[0];

      if (file && file.size <= 5000000) {

        const updated = leaves.map(item =>
          item.Id === id
            ? {
              ...item,
              file: {
                uri: file.uri,
                name: file.name || 'report.pdf',
                type: file.type || 'application/pdf',
                size: file.size
              }
            }
            : item
        );

        setLeaves(updated);

      } else {
        submitModel(
          ALERT_TYPE.DANGER,
          "File Size",
          "PDF file size should be less than 5 MB"
        );
      }

    } catch (err) {
      if (err?.code === 'DOCUMENT_PICKER_CANCELED') return;

      console.log("Document Picker Error:", err);
    }
  }, [leaves]);


  // ✅ Check if all uploaded
  const allUploaded = leaves.every(item => item.file);

  // 🚀 Submit all
  const handleSubmitAll = async () => {
    try {
      const formData = new FormData();
      const leaveIds = []; // ✅ FIX: define it

      leaves.forEach((item) => {
        if (item.file && item.file.uri) {
          formData.append('files', {
            uri: item.file.uri,
            name: item.file.name || `file_${item.Id}.pdf`,
            type: item.file.type || 'application/pdf',
          });

          leaveIds.push(item.Id);
        }
      });
      // ❌ No files selected
      if (leaveIds.length === 0) {
        alert('Please select at least one file');
        return;
      }

      formData.append('leaveIds', JSON.stringify(leaveIds));

      const session = await EncryptedStorage.getItem("user_session");

      const res = await fetch(`${BASE_URL}/staff/addAcademicLeaveReport`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
        },
        body: formData,
      });

      // ✅ safer parsing
      const responseText = await res.text();
      let response;

      try {
        response = JSON.parse(responseText);
      } catch {
        console.log('Non-JSON response:', responseText);
        throw new Error('Server error');
      }

      if (!res.ok) {
        throw new Error(response?.message || 'Upload failed');
      } else {
        console.log('Upload success:', response);
        alert('Uploaded successfully');
        if (blocked) {
          removeSession();
          setIsLoggedin(false);
          setBlocked(false);
        }
      }


    } catch (e) {
      console.log('Upload error:', e);
      alert('Upload failed. Try again.');
    }
  };

  const removeSession = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    if (!session) return;

    try {
      if (mobileToken) {
        const offNotification = await fetch(
          `${BASE_URL}/notifiaction/logoutNotification`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              deviceToken: mobileToken,
            }),
          }
        );

        const response = await offNotification.json();

        if (response.flag !== 1) {
          console.log(response.message);
          return;
        }
      } else {
        console.log("No device token (iOS simulator / permission denied)");
      }
      await EncryptedStorage.removeItem('user_session');
      setIsLoggedin(false);
      setUserType('');

    } catch (error) {
      console.log(error);
    }
  };

  const submitModel = (type, title, message) => {
      Dialog.show({
        type: type,
        title: title,
        textBody: message,
        button: 'close',
      })
    }

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.Id;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            setExpandedId(isExpanded ? null : item.Id)
          }
          style={styles.headerRow}
        >
          <View>
            <Text style={styles.title}>
              {'Academic Leave'}
            </Text>
            <Text style={styles.sub}>
              {item.StartDate.split('T')[0].split("-").reverse().join("-")} → {item.EndDate.split('T')[0].split("-").reverse().join("-")}
            </Text>
          </View>

          <Feather
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expand}>
            <Text style={styles.reason}>
              {item.LeaveReason || 'No reason'}
            </Text>

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => pickFile(item.Id)}
            >
              <Feather name="upload" size={16} color="#fff" />
              <Text style={styles.uploadTxt}>
                {item.file ? 'Replace File' : 'Upload Report'}
              </Text>
            </TouchableOpacity>

            {item.file && (
              <Text style={styles.fileName}>
                ✅ {item.file.name}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>

        <Text style={styles.header}>
          Pending Reports
        </Text>

        <FlatList
          data={leaves}
          keyExtractor={(item, i) => String(i)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        <TouchableOpacity
          style={[
            styles.submitBtn,
            !allUploaded && { opacity: 0.5 }
          ]}
          disabled={!allUploaded}
          onPress={handleSubmitAll}
        >
          <Text style={styles.submitTxt}>
            Submit All Reports
          </Text>
        </TouchableOpacity>

      </View>
    </AlertNotificationRoot>
  );
};

export default SubmitReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 16
  },

  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 14,
    elevation: 2
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: {
    fontSize: 16,
    fontWeight: '600'
  },

  sub: {
    fontSize: 13,
    color: '#666'
  },

  expand: {
    marginTop: 12
  },

  reason: {
    fontSize: 13,
    color: '#777',
    marginBottom: 10
  },

  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a62535',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 6
  },

  uploadTxt: {
    color: '#fff',
    fontWeight: '600'
  },

  fileName: {
    marginTop: 8,
    color: 'green',
    fontSize: 12
  },

  submitBtn: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },

  submitTxt: {
    color: '#fff',
    fontWeight: '600'
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});