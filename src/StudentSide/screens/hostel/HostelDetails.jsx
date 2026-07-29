import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { BASE_URL, IMAGE_URL, LIMS_URL } from '@env';

import { StudentContext } from '../../../context/StudentContext';
import colors from '../../../colors';
import EncryptedStorage from 'react-native-encrypted-storage';

const HostelDetails = ({ route, navigation }) => {
  const { data } = useContext(StudentContext)
  const { hostelData } = route.params;
  const [electricityData, setElectricityData] = useState([])
  const [showElectricityTab, setShowElectricityTab] = useState(false)
  const profileData = data.data[0];
  const ImageUrl = `${IMAGE_URL}Images/Students/`;
  // console.log(hostelData);

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

  //////////////////////////// meter bill Api //////////////////////////
  const electricityBills = async (studentId) => {
    const session = await EncryptedStorage.getItem("user_session")
    if (session != null) {
      try {
        const res = await fetch(LIMS_URL + '/student/meterReading/' + studentId, {
          method: 'POST',
        })
        const response = await res.json();
        // console.log("response:::::", response);
        setElectricityData(response[0])
        response.length > 0 ? setShowElectricityTab(true) : null
      } catch (error) {
        console.log('meter data :: ', error);
      }
    }
  }

  useEffect(()=>{
    electricityBills(profileData['IDNo'])
  },[])

const getFloorName = (floor) => floorMap[floor] || "Unknown Floor";
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* Student Card */}

      <View style={styles.card}>

        <Image
          source={{ uri: ImageUrl + profileData.Image }}
          style={styles.image}
        />

        <Text style={styles.studentName}>
          {profileData.StudentName}
        </Text>

        <Text style={styles.rollNo}>
          {profileData.UniRollNo}
        </Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Session</Text>
          <Text style={styles.value}>{profileData.Session}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Course</Text>
          <Text style={styles.value}>{profileData.Course}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>College</Text>
          <Text style={styles.value}>{profileData.CollegeName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>{profileData.PermanentAddress}</Text>
        </View>

      </View>



      {/* Hostel */}

      <View style={styles.card}>

        <Text style={styles.heading}>
          Hostel Information
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Hostel</Text>
          <Text style={styles.value}>{hostelData.HostelName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Allotment</Text>
          <Text style={styles.value}>
            {hostelData.AllotmentDate?.split("T")[0].split("-").reverse().join("-")}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Floor</Text>
          <Text style={styles.value}>{getFloorName(hostelData.Floor)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Room / Bed</Text>
          <Text style={styles.value}>{hostelData.RoomNo} / {hostelData.BedNo}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Check In</Text>
          <Text style={styles.value}>
            {hostelData.CheckIn?.split("T")[0].split("-").reverse().join("-")}
          </Text>
        </View>

      </View>



      {/* Warden */}

      <View style={styles.card}>

        <Text style={styles.heading}>
          Warden Details
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{hostelData?.WardenName} ({hostelData.WardenID})</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{hostelData?.ContactNo}</Text>
        </View>
      </View>



      {/* Buttons */}

      <View style={styles.buttonRow}>

        {/* <TouchableOpacity style={styles.button}
          onPress={() => { navigation.navigate('StudentElectricityBill')}}>
          <Text style={styles.buttonText}>
            Electricity Bill
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.button}
          onPress={() => { navigation.navigate('StudentMovement')}}>
          <Text style={styles.buttonText}>
            Apply Movement
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
          onPress={() => { navigation.navigate('StudentLeaves')}}>
          <Text style={styles.buttonText}>
            Apply Leave
          </Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  )
}

export default HostelDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA"
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 18,
    elevation: 4,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: "center",
    marginBottom: 12
  },

  studentName: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#222"
  },

  rollNo: {
    textAlign: "center",
    color: "gray",
    marginTop: 4,
    marginBottom: 12
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 12
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0E4A86",
    marginBottom: 12
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: .5,
    borderColor: "#eee"
  },

  label: {
    fontWeight: "600",
    color: "#666",
    width: "40%"
  },

  value: {
    width: "60%",
    textAlign: "right",
    color: "#222",
    fontWeight: "500"
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
    marginBottom: 30
  },

  button: {
    width: "48%",
    backgroundColor: colors.uniBlue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15
  }
})