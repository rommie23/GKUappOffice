import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { BASE_URL } from '@env';
import { pick, types, isCancel } from '@react-native-documents/picker'
import EncryptedStorage from 'react-native-encrypted-storage';
import colors from '../../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { SelectList } from 'react-native-dropdown-select-list';

const CreateStaffNotice = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileResponse, setFileResponse] = useState([]);
  const [allStaff, setAllStaff] = useState(false);
  const [staffTree, setStaffTree] = useState(false)
  const [staffGroup, setStaffGroup] = useState(false)
  const [facultyList, setFacultyList] = useState([])
  const [facultyId, setFacultyId] = useState('')
  const [departmentList, setDepartmentList] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')


  const getFacultyList = async () => {
    console.log("getFacultyListgetFacultyList");
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session");
    if (session != null) {
      try {
        const res = await fetch(BASE_URL + "/notifiaction/facultyList", {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`
          }
        })
        const response = await res.json();
        console.log(response);
        const list = response.map((item, i) => (
          { key: item["CollegeID"], value: item['CollegeName'] }
        ))
        setFacultyList(list)
        setLoading(false)
      } catch (error) {
        console.log("createstaffnotice/getFaulty", error);
        setLoading(false)
      }
    }
  }
  
  const getDepartmentList = async () => {
    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session");
    if (session != null) {
      try {
        console.log("facultyId:::",facultyId);
        
        const res = await fetch(BASE_URL + "/notifiaction/departmentList", {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            facultyId: facultyId
          })
        })
        const response = await res.json();
        console.log(response);
        const list = response.map((item, i) => (
          { key: item["DepartmentID"], value: item['Department'] }
        ))
        setDepartmentList(list)
        setLoading(false)
      } catch (error) {
        console.log("createstaffnotice/getFaulty", error);
        setLoading(false)
      }
    }
  }

  const categoryList=[
    {key:'6', value:"Teaching"},
    {key:'7', value:"Non - Teaching"}
  ]

  useEffect(() => { getFacultyList() }, [])
  useEffect(() => {
  if (facultyId) {
    getDepartmentList();
  }
}, [facultyId]);






  const pickDocument = useCallback(async () => {
    try {
      const response = await pick({
        presentationStyle: 'fullScreen',
        type: types.pdf
      });

      console.log("the response after file select :::", response);

      // response is an array of selected files
      const file = response[0];

      if (file && file.size <= 5000000) {
        setFileResponse(response);
        console.log("After file select::: ", file);
      } else {
        submitModel(
          ALERT_TYPE.DANGER,
          "Pdf file Size",
          "Pdf file size should be less than 5 MB"
        );
      }
    } catch (err) {
      console.log("Document Picker Error:", err);
    }
  }, []);


  const tabSelect=(value)=>{
    if (value == 1) {
      setAllStaff(true)
      setStaffTree(false)
      setStaffGroup(false)
    }else if (value == 2) {
      setAllStaff(false)
      setStaffTree(true)
      setStaffGroup(false)
    }else{
      setAllStaff(false)
      setStaffTree(false)
      setStaffGroup(true)
    }
  }

  const submitButton = async () => {

    setLoading(true)
    const session = await EncryptedStorage.getItem("user_session");

    if (session != null) {

      try {
        const formData = new FormData();
        if (fileResponse.length > 0) {
          formData.append('notice', {
            uri: fileResponse[0]["uri"],
            type: fileResponse[0]["type"],
            name: 'Notice_' + fileResponse[0]['name'],
          });
        }
        formData.append("title", title)
        formData.append("description", description)
        formData.append("selectedType", allStaff)
        formData.append("selectedFaculty", facultyId)
        formData.append("selectedDepartment", selectedDepartment)
        formData.append("selectedCategory", selectedCategory)
        console.log("sending bulk notifications", formData);
        const res = await fetch(BASE_URL + '/notifiaction/bulkNotifications', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session}`,
            'enctype': 'multipart/form-data',
          },
          body: formData
        })
        const response = await res.json();
        console.log(response);
        submitModel(ALERT_TYPE.SUCCESS, "Success", "Notification Sent Successfully")
        setTitle('')
        setDescription('')
        setFileResponse([])
        setLoading(false)
      } catch (error) {
        console.log("All notification error ::: ", error);
        setLoading(false)
      }
    }
  }

  const submitModel = (type, title, message) => {
    Dialog.show({
      type: type,
      title: title,
      textBody: message,
      button: 'close'
    })
  }
  return (
    <AlertNotificationRoot>
      <View style={styles.formContainer}>
        <View style={styles.formSelectors}>
          <View style={{ alignSelf: 'flex-start' }}>
            <Text style={{ color: '#1b1b1b', marginTop: 10 }}>Title<Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.loginInput}>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter Title of Complaint"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#666666"
              />
            </View>
          </View>
          <View style={{ alignSelf: 'flex-start' }}>
            <Text style={{ color: '#1b1b1b', marginTop: 10 }}>Description<Text style={{ color: 'red' }}>*</Text></Text>
            <View style={[styles.loginInput, { marginBottom: 24 }]}>
              <TextInput
                style={[styles.inputBox, { textAlignVertical: 'top', height: 80 }]}
                placeholder="Enter Description"
                value={description}
                onChangeText={setDescription}
                placeholderTextColor="#666666"
                multiline={true}
              />
            </View>
            {fileResponse.map((file, index) => (
              <Text
                key={index.toString()}
                style={{ color: 'black' }}
                numberOfLines={1}
                ellipsizeMode={'middle'}>
                {file?.name}
              </Text>
            ))}
            <TouchableOpacity
              style={[{ backgroundColor: colors.uniRed, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }]}
              onPress={() => pickDocument()}>
              <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Upload pdf</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", columnGap: 16 }}>
            {/* Student */}
            <TouchableOpacity
              style={{
                backgroundColor: allStaff ? colors.uniBlue : "white",
                borderWidth: 1,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 24,
              }}
              onPress={() =>
                tabSelect(1)
              }
            >
              <Text style={{ color: allStaff ? "white" : "black" }}>
                All Staff
              </Text>
            </TouchableOpacity>

            {/* Selected Staff */}
            <TouchableOpacity
              style={{
                backgroundColor: staffTree ? colors.uniBlue : "white",
                borderWidth: 1,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 24,
              }}
              onPress={() => tabSelect(2)}
            >
              <Text style={{ color: staffTree ? "white" : "black" }}>
                Selected Staff
              </Text>
            </TouchableOpacity>
            {/* Staff Groups */}
            <TouchableOpacity
              style={{
                backgroundColor: staffGroup ? colors.uniBlue : "white",
                borderWidth: 1,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 24,
              }}
              onPress={() => tabSelect(3)}
            >
              <Text style={{ color: staffGroup ? "white" : "black" }}>
                Staff Group
              </Text>
            </TouchableOpacity>
          </View>

          {staffTree &&
            <View style={{rowGap:16}}>
              <SelectList boxStyles={{ padding: 10 }}
                setSelected={(val) => setFacultyId(val)}
                fontFamily='time'
                data={facultyList}
                search={false}
                defaultOption={{ key: '0', value: 'Select Faculty' }}
                inputStyles={{ color: 'black' }}
                dropdownTextStyles={{ color: 'black' }}
              />
              <SelectList boxStyles={{ padding: 10 }}
                setSelected={(val) => setSelectedDepartment(val)}
                fontFamily='time'
                data={departmentList}
                search={false}
                defaultOption={{ key: '0', value: 'Select Department' }}
                inputStyles={{ color: 'black' }}
                dropdownTextStyles={{ color: 'black' }}
              />
              <SelectList boxStyles={{ padding: 10 }}
                setSelected={(val) => setSelectedCategory(val)}
                fontFamily='time'
                data={categoryList}
                search={false}
                defaultOption={{ key: '0', value: 'Select Category' }}
                inputStyles={{ color: 'black' }}
                dropdownTextStyles={{ color: 'black' }}
              />
            </View>
          }
          {
            staffGroup &&
            <View style={{ flexDirection: "row", columnGap: 16 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: staffGroup ? colors.uniBlue : "white",
                  borderWidth: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 24,
                }}
                onPress={() => tabSelect(3)}
              >
                <Text style={{ color: staffGroup ? "white" : "black" }}>
                  All Deans
                </Text>
              </TouchableOpacity>
            </View>
          }



          {title != '' && description != '' && (staffTree || allStaff) ?
            <TouchableOpacity
              style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 16, width: '40%' }]}
              onPress={() => submitButton()}>
              <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                {
                  loading ? <ActivityIndicator /> :
                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Submit</Text>
                }
              </View>
            </TouchableOpacity>
            :
            <TouchableOpacity
              style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 16, width: '40%', opacity: .7 }]}>
              <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Submit</Text>
              </View>
            </TouchableOpacity>
          }
        </View>
      </View>
    </AlertNotificationRoot>
  )
}

export default CreateStaffNotice

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 16,
    width: '100%',
    elevation: 2,
  },
  formSelectors: {
    rowGap: 16,
    marginBottom: 8,
    backgroundColor: 'white',
    elevation: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
  },
  pickerStyle: {
    placeholder: {
      color: 'black'
    },
    inputAndroid: {
      color: 'black'
    }
  },
  label: {
    color: '#1b1b1b'
  },
  inputBox: {
    height: 42,
    paddingHorizontal: 20,
    width: '100%',
    color: 'black'
  },
  loginInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#1b1b1b",
    borderWidth: 1,
    borderRadius: 8
  }
})