import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, StatusBar, Image, ScrollView } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { BASE_URL, IMAGE_URL } from '@env';
import colors from '../../colors';

export default function ScanqrScreen() {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedValue, setScannedValue] = useState(null);
  const [student, setStudent] = useState({})
  const [busDetails, setBusDetails] = useState({})
  const [hostelDetails, setHostelDetails] = useState({})
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const ImageUrl = `${IMAGE_URL}Images/Students/`;

  const floorMap = {
    0: "Ground Floor",
    1: "1st Floor",
    2: "2nd Floor",
    3: "3rd Floor",
    4: "4th Floor",
    5: "5th Floor",
    6: "6th Floor",
    7: "7th Floor",
    8: "8th Floor",
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: async (codes) => {
      // Prevent multiple scans
      if (scanned || loading) {
        return;
      }
      // Validate scanned data
      if (
        !codes ||
        codes.length === 0 ||
        !codes[0]?.value
      ) {
        return;
      }
      let stId;
      console.log("upeerValue", codes);

      if (codes[0].value.length > 15) {
        stId = codes[0].value.split("=")[1];
      } else {
        stId = codes[0].value.trim();
      }

      console.log('Scanned Value:', stId);
      setScanned(true);
      setScannedValue(stId);

      // API CALL
      await getStudentData(stId);
    },
  });

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
    })();
  }, []);


  const getStudentData = async (studentIDNo) => {
    console.log("getStudentData::", studentIDNo);

    const session = await EncryptedStorage.getItem("user_session");
    if (!session) return;
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/staff/securityCheck`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          StudentIdNo: studentIDNo
        })
      });
      const data = await res.json();
      console.log("studentDataScan::::", data);

      setStudent(data['studentData'])
      setBusDetails(data['busPassData'])
      setHostelDetails(data['hostelData'])

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      // Allow scan again after 2 sec
      setTimeout(() => {
        setScanned(false);
      }, 2000);
    }
  };

  if (!device || !hasPermission) {
    return <View style={styles.center}><Text>Loading camera...</Text></View>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>

        <Text style={styles.heading}>
          Scan Student ID
        </Text>

        {/* Camera Box */}
        <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
      </View>

        {/* Student Card */}
        {student && (
          <View style={styles.card}>

            {/* Top Image */}
            <Image
              source={{ uri: ImageUrl + student.Image }}
              style={styles.image}
            />

            {/* Details */}
            <View style={styles.detailsContainer}>

              <Text style={styles.name}>
                {student.StudentName}
              </Text>

              <Text style={styles.detail}>
                Uni Roll No: {student.UniRollNo}
              </Text>

              <Text style={styles.detail}>
                Class Roll No: {student.ClassRollNo}
              </Text>

              <Text style={styles.detail}>
                Course: {student.Course}
              </Text>

              <Text style={styles.detail}>
                College: {student.CollegeName}
              </Text>

            </View>

          </View>
        )}
        {
          busDetails && (
            <View style={styles.card}>
              <View style={styles.detailsContainer}>

                <Text style={styles.name}>Transport Details</Text>
                <Text style={styles.detail}>Pass Number: {busDetails.SerialNo}</Text>
                <Text style={styles.detail}>Route: {busDetails.route}</Text>
                <Text style={styles.detail}>Spot: {busDetails.spot}</Text>
                <Text style={styles.detail}>Session: {busDetails.session}</Text>
                <Text style={[styles.detail, { color: colors.rejected }]}>Expiry: {busDetails.expiryDate?.split("T")[0].split("-").reverse().join("-")}</Text>
              </View>
            </View>
          )
        }

        {
          hostelDetails && (
            <View style={styles.card}>
              <View style={styles.detailsContainer}>

                <Text style={styles.name}>Hostel Details</Text>
                <Text style={styles.detail}>Hostel Name: {hostelDetails?.HostelName}</Text>
                <Text style={styles.detail}>Floor/Room: {floorMap[hostelDetails?.Floor]}/{hostelDetails?.RoomNo}</Text>
                <Text style={[styles.detail]}>Allotment Date: {hostelDetails?.AllotmentDate?.split("T")[0].split("-").reverse().join("-")}</Text>
                <Text style={styles.detail}>Warden: {hostelDetails?.WardenName}({hostelDetails?.WardenID})</Text>
                <Text style={styles.detail}>Warnden Contact: {hostelDetails?.ContactNo}</Text>
              </View>
            </View>
          )
        }

      </View>
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   container: { height:250, width:250, alignSelf:'center', marginTop:20, backgroundColor:'red' },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   overlay: {
//     position: 'absolute',
//     bottom: 50,
//     alignSelf: 'center',
//     backgroundColor: 'black',
//     padding: 10,
//   },
//   text: { color: 'red' },
// });

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingTop: 20,
    alignItems: 'center',
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },

  cameraContainer: {
    width: '90%',
    height: 260,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 5,
  },

  camera: {
    flex: 1,
  },

  card: {
    width: '92%',
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 5,
  },

  image: {
    width: 125,
    height: 125,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },

  detailsContainer: {
    width: '100%',
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 10,
  },

  detail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },

})