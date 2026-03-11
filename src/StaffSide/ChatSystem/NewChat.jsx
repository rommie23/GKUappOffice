import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BASE_URL, IMAGE_URL } from '@env';
import { pick, types, isCancel } from '@react-native-documents/picker'
import EncryptedStorage from 'react-native-encrypted-storage';
import colors from '../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { List, Avatar, IconButton, Portal, Modal, Button } from "react-native-paper";
import { StudentContext } from '../../context/StudentContext';
import { launchImageLibrary } from 'react-native-image-picker';


const NewChat = ({ route }) => {
    const { StaffIDNo, data } = useContext(StudentContext);
    const forwardMessage = route.params?.forwardMessage ?? null;

    const [selectedTabTop, setSelectedTabTop] = useState("");
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [fileResponse, setFileResponse] = useState([]);
    const [groupes, setGroupes] = useState(false);
    const [groupList, setGroupList] = useState([]);
    const [groupMembersList, setGroupMembersList] = useState([]);
    const [staffTree, setStaffTree] = useState(false)
    const [singleStaffTree, setSingleStaffTree] = useState(false)
    const [singleStudentfTree, setSingleStudentTree] = useState(false)
    const [singleStaffId, setSingleStaffId] = useState('')
    const [singleStaffData, setSingleStaffData] = useState([])

    const [studentTree, setStudentTree] = useState(false)
    const [facultyList, setFacultyList] = useState([])
    const [facultyId, setFacultyId] = useState('')
    const [departmentList, setDepartmentList] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState('')
    const [selectedCourse, setSelectedCourse] = useState('')
    const [courseList, setCourseList] = useState([])
    const [batchList, setBatchList] = useState([])
    const [selectedBatch, setSelectedBatch] = useState('')
    const [peopleList, setPeopleList] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    // console.log("forwardMessage::", forwardMessage);

    const [selectedFile, setSelectedFile] = useState(null);
    const [attachmentMenu, setAttachmentMenu] = useState(false);

    useEffect(() => {
        if (forwardMessage) {
            setDescription(forwardMessage.Message)
        } else {
            setDescription('')
        }
    }, [forwardMessage])

    const getFacultyList = async () => {
        // console.log("getFacultyListgetFacultyList");
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {
                const res = await fetch(BASE_URL + "/notifiaction/facultyList", {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "application/json"
                    }
                })
                const response = await res.json();
                console.log(response);
                if (!Array.isArray(response)) {
                    console.log("Invalid API response:", response);
                    setLoading(false);
                    return;
                }
                const list = response.map((item, i) => (
                    { key: item["CollegeID"], value: item['CollegeName'] }
                ))
                // console.log(list);

                setFacultyList(list)
                setLoading(false)
            } catch (error) {
                console.log("createstaffnotice/getFaculty", error);
                setLoading(false)
            }
        }
    }

    const getDepartmentList = async (facultyId) => {
        if (!facultyId || facultyId == '0') return;
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {
                console.log("facultyId:::", facultyId);

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
                if (!Array.isArray(response)) {
                    console.log("Invalid API response Department:", response);
                    setLoading(false);
                    return;
                }
                const list = response.map((item, i) => (
                    { key: item["Id"], value: item['Department'] }
                ))
                setDepartmentList(list)
                setLoading(false)
            } catch (error) {
                console.log("createstaffnotice/departmentList", error);
                setLoading(false)
            }
        }
    }

    const getDepartmentWiseCourse = async (val) => {
        if (!val || val == '0' || val === 'Select Course') return;
        console.log("selectedDepartment:::", val);

        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {

                const res = await fetch(BASE_URL + "/notifiaction/departmentWiseCourse", {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        departmentId: val
                    })
                })
                const response = await res.json();
                console.log(response);
                if (!Array.isArray(response)) {
                    console.log("Invalid API response Course:", response);
                    setLoading(false);
                    return;
                }
                const list = response.map((item, i) => (
                    { key: item["CourseID"], value: item['LateralEntry'] == 'Yes' ? `${item['Course']}(Lateral)` : item['Course'] }
                ))
                setCourseList(list)
                setLoading(false)
            } catch (error) {
                console.log("createstaffnotice/departmentWiseCourse", error);
                setLoading(false)
            }
        }
    }



    const getCourseWiseBatch = async (val) => {
        if (!val || val == '0' || val === 'Select Batch') return;
        console.log("selectedCourse:::", selectedCourse);

        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {
                // console.log("facultyId:::", facultyId);

                const res = await fetch(BASE_URL + "/notifiaction/courseWiseBatch", {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        courseId: val
                    })
                })
                const response = await res.json();
                // console.log(response);
                if (!Array.isArray(response)) {
                    // console.log("Invalid API response Batch:", response);
                    setLoading(false);
                    return;
                }
                const list = response.map((item, i) => (
                    { key: item["Batch"], value: item['Batch'] }
                ))
                setBatchList(list)
                setLoading(false)
            } catch (error) {
                console.log("createstaffnotice/departmentWiseCourse", error);
                setLoading(false)
            }
        }
    }


    useEffect(() => {
        getFacultyList();
    }, []);


    // useEffect(() => {
    //     if (!facultyId) return;
    //     setSelectedDepartment('');
    //     setSelectedCourse('');
    //     setSelectedBatch('');

    //     setDepartmentList([]);
    //     setCourseList([]);
    //     setBatchList([]);

    //     getDepartmentList();
    // }, [facultyId]);


    const onFacultySelect = (val) => {
        setFacultyId(val)
        // console.log("setFacultyId", val);

        setSelectedDepartment('');
        setSelectedCourse('');
        setSelectedBatch('');

        setDepartmentList([]);
        setCourseList([]);
        setBatchList([]);

        getDepartmentList(val);
    }

    const onDepartmentSelect = (val) => {
        setSelectedDepartment(val)
        // console.log("setSelectedDepartment", val);
        setSelectedCourse('');
        setSelectedBatch('');

        setCourseList([]);
        setBatchList([]);

        getDepartmentWiseCourse(val);
        setLoading(false)
    }

    const onCourseSelect = (val) => {
        setSelectedCourse(val)
        setSelectedBatch('');
        setBatchList([]);

        getCourseWiseBatch(val);
    }

    // useEffect(() => {
    //     if (!selectedDepartment) return;
    //     setSelectedCourse('');
    //     setSelectedBatch('');

    //     setCourseList([]);
    //     setBatchList([]);

    //     getDepartmentWiseCourse();
    // }, [selectedDepartment]);


    // useEffect(() => {
    //     if (!selectedCourse) return;

    // setSelectedBatch('');
    // setBatchList([]);

    // getCourseWiseBatch();
    // }, [selectedCourse]);

    // console.log("selectedBatch:::", selectedBatch);

    const tabSelect = (value) => {
        setSelectedTabTop(value);
        if (value == 1) {
            setGroupes(true)
            setStaffTree(false)
            setStudentTree(false)
            setSingleStaffTree(false)
            setSingleStudentTree(false)
            setPeopleList([])
            fetchGroups();
        } else if (value == 2) {
            setGroupes(false)
            setStaffTree(true)
            setStudentTree(false)
            setSingleStaffTree(false)
            setSingleStudentTree(false)
            setGroupMembersList([])
            setPeopleList([])
            setSelectedGroupId(null)
        } else if (value == 3) {
            setGroupes(false)
            setStaffTree(false)
            setStudentTree(true)
            setSingleStaffTree(false)
            setSingleStudentTree(false)
            setGroupMembersList([])
            setPeopleList([])
            setSelectedGroupId(null)
        } else if (value == 4) {
            setGroupes(false)
            setStaffTree(false)
            setStudentTree(false)
            setSingleStaffTree(true)
            setSingleStudentTree(false)
            setPeopleList([])
            setGroupMembersList([])
        } else if (value == 5) {
            setGroupes(false)
            setStaffTree(false)
            setStudentTree(false)
            setSingleStaffTree(false)
            setSingleStudentTree(true)
            setPeopleList([])
            setGroupMembersList([])
            // UI and functioning of singleStudent is remaining
        }
    }

    const searchHandleStaff = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {
                const res = await fetch(BASE_URL + '/notifiaction/staffList', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        departmentId: selectedDepartment
                    })
                })
                const staffList = await res.json();
                // console.log("staffList::", staffList);

                setPeopleList(staffList);
                setLoading(false)

            } catch (error) {
                console.log("SearchHandleStaff error ::: ", error);
                setLoading(false)
            }
        }
    }

    const searchHandleStudent = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        // console.log({ selectedCourse, selectedBatch });

        if (session != null) {
            try {
                const res = await fetch(BASE_URL + '/notifiaction/studentsList', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        courseId: selectedCourse,
                        batch: selectedBatch
                    })
                })
                const studentL = await res.json()
                // console.log("studentList ::::", studentL);
                setPeopleList(studentL)
                setLoading(false)
            } catch (error) {
                console.log("SearchHandleStaff error ::: ", error);
                setLoading(false)
            }
        }
    }

    const fetchGroups = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {
                const res = await fetch(BASE_URL + '/notifiaction/groupesForAdmins', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "application/json"
                    }
                })
                const groupList = await res.json()
                // console.log("groupList::", groupList.flag);
                if (groupList.flag == '0') {
                    submitModel(ALERT_TYPE.WARNING, "No data found", 'No group found for you')
                }
                setGroupList(groupList)
                setLoading(false)

            } catch (error) {
                console.log("fetchGroups error ::: ", error);
                setLoading(false)
            }
        }
    }

    const groupMemberList = async (id) => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {
                const res = await fetch(BASE_URL + '/notifiaction/getGroupMembersList', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: id
                    })
                })
                const membersList = await res.json();
                // console.log("membersList::", membersList);
                setSelectedGroups(id)
                setGroupMembersList(membersList)
                setLoading(false)

            } catch (error) {
                console.log("fetchGroups error ::: ", error);
                setLoading(false)
            }
        }
    }

    const searchSingleStaff = async () => {
        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");
        if (session != null) {
            try {
                const res = await fetch(BASE_URL + '/notifiaction/singleStaff', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        staffId: singleStaffId
                    })
                })
                const staffData = await res.json();
                console.log("staffData ::", staffData);

                setSingleStaffData(staffData);
                setLoading(false)

            } catch (error) {
                console.log("SearchHandleStaff error ::: ", error);
                setLoading(false)
            }
        }
    }

    // const sendMessageGroup = async () => {
    //     if (!description.trim()) {
    //         alert("Please enter message");
    //         return;
    //     }

    //     setSelectedUsers(groupMembersList)

    //     const payload = {
    //         message: description,
    //         recipients: [selectedGroups],
    //         chatType: 'group',
    //         SenderName: `${data.data[0].Name}`,
    //     };

    //     // console.log("payload:::", payload);
    //     const session = await EncryptedStorage.getItem("user_session");
    //     try {
    //         const res = await fetch(BASE_URL + '/notifiaction/sendMessage', {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${session}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         const result = await res.json();
    //         // console.log(result);

    //         console.log("result:::", payload);


    //         if (res.ok) {
    //             alert("Message sent successfully");
    //             setDescription("");
    //             setSelectedUsers([]);
    //             // notificationfunction('group', payload.recipients)
    //         } else {
    //             alert("GroupMessage::", result.message || "Something went wrong");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         alert("Network error");
    //     }
    // };

    const sendMessageGroup = async () => {

        if (!description.trim() && !selectedFile) {
            alert("Please enter message or select file");
            return;
        }

        const session = await EncryptedStorage.getItem("user_session");

        try {

            const formData = new FormData();

            // optional file support
            if (selectedFile) {
                formData.append("file", {
                    uri: selectedFile.uri,
                    name: selectedFile.name,
                    type: selectedFile.type,
                });
            }

            formData.append("message", description || "");

            // group expects array with groupId
            formData.append(
                "recipients",
                JSON.stringify([selectedGroups])
            );

            formData.append("chatType", "group");

            formData.append(
                "SenderName",
                data.data[0].Name
            );

            const res = await fetch(
                BASE_URL + '/notifiaction/sendMessageUniversal',
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "multipart/form-data",
                    },
                    body: formData,
                }
            );

            const result = await res.json();

            console.log("result:::", result);

            if (res.ok) {

                alert("Group message sent successfully");

                setDescription("");
                setSelectedUsers([]);
                setSelectedFile(null);

            } else {

                alert(result.message || "Something went wrong");

            }

        } catch (error) {

            console.error(error);
            alert("Network error");

        }
    };



    // const sendMessageSingle = async () => {
    //     if (!description.trim()) {
    //         alert("Please enter message");
    //         return;
    //     }

    //     const payload = {
    //         message: description,
    //         recipients: selectedUsers.map(u => u.IDNo),
    //         chatType: 'personal',
    //         SenderName: `${data.data[0].Name}`,
    //     };
    //     const session = await EncryptedStorage.getItem("user_session");
    //     setLoading(true)
    //     try {
    //         const res = await fetch(BASE_URL + '/notifiaction/sendMessage', {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${session}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         const result = await res.json();
    //         console.log("result:::", payload);


    //         if (res.ok) {
    //             alert("Message sent successfully");
    //             setDescription("");
    //             setSelectedUsers([]);
    //             setSingleStaffData([])
    //             setLoading(false)
    //             // result.data.map((item)=>{
    //             //     notificationfunction('personal', payload.recipients, item['ID']);
    //             // })
    //             // notificationfunction('personal', payload.recipients)
    //         } else {
    //             setLoading(false)
    //             alert(result.message || "Something went wrong");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         setLoading(false)
    //         alert("Network error");
    //     }
    // };

    const sendMessageSingle = async () => {

        if (!description.trim() && !selectedFile) {
            alert("Please enter message or select file");
            return;
        }

        const session = await EncryptedStorage.getItem("user_session");

        setLoading(true);

        try {

            const formData = new FormData();

            // optional file support (future ready)
            if (selectedFile) {
                formData.append("file", {
                    uri: selectedFile.uri,
                    name: selectedFile.name,
                    type: selectedFile.type,
                });
            }

            formData.append("message", description || "");
            formData.append(
                "recipients",
                JSON.stringify(selectedUsers.map(u => u.IDNo))
            );
            formData.append("chatType", "personal");
            formData.append("SenderName", data.data[0].Name);

            const res = await fetch(
                BASE_URL + '/notifiaction/sendMessageUniversal',
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session}`,
                        "Content-Type": "multipart/form-data",
                    },
                    body: formData,
                }
            );
            const result = await res.json();
            console.log("result:::", result);
            if (res.ok) {
                alert("Message sent successfully");
                setDescription("");
                setSelectedUsers([]);
                setSingleStaffData([]);
                setSelectedFile(null); // clear file if exists
            } else {
                alert(result.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };


    const sendMessage = async () => {
        if (!description.trim()) {
            alert("Please enter message");
            return;
        }

        if (selectedUsers.length === 0) {
            alert("Please select at least one user");
            return;
        }

        console.log("selectedUsers:::", selectedUsers);
        const payload = {
            message: description,
            recipients: selectedUsers.map(u => u.IDNo),
            chatType: 'personal',
            SenderName: `${data.data[0].Name}`,
        };
        const session = await EncryptedStorage.getItem("user_session");
        setLoading(true)
        try {
            const res = await fetch(BASE_URL + '/notifiaction/sendMessage', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log("result:::", payload);


            if (res.ok) {
                alert("Message sent successfully");
                setDescription("");
                setSelectedUsers([]);
                setLoading(false)
                // result.data.map((item)=>{
                //     notificationfunction('personal', payload.recipients, item['ID']);
                // })
                // notificationfunction('personal', payload.recipients)
            } else {
                alert(result.message || "Something went wrong");
                setLoading(false)
            }
        } catch (error) {
            console.error(error);
            setLoading(false)
            alert("Network error");
        }
    };

    // //////////////// PICK DOCUMNENT FUNCTION //////////////
    const pickDocument = useCallback(async () => {
        try {
            const response = await pick({
                presentationStyle: 'fullScreen',
                type: [types.pdf, types.images],
                multi: false,
            });
            const file = response[0];
            if (file && file.size <= 5000000) {
                setSelectedFile(file);
                // setPreviewVisible(true);
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

    const pickImageFromGallery = () => {
    
            const options = {
                mediaType: 'photo',
                quality: 1,
                selectionLimit: 1,
            };
    
            launchImageLibrary(options, (response) => {
    
                if (response.didCancel) {
                    return;
                }
    
                if (response.errorCode) {
                    console.log("ImagePicker Error:", response.errorMessage);
                    return;
                }
    
                const asset = response.assets[0];
    
                const file = {
                    uri: asset.uri,
                    name: asset.fileName || `image_${Date.now()}.jpg`,
                    type: asset.type,
                    size: asset.fileSize,
                };
    
                if (file.size <= 5000000) {
    
                    setSelectedFile(file);
                    setAttachmentMenu(false)
    
                    console.log("Selected image:", file);
    
                } else {
    
                    submitModel(
                        ALERT_TYPE.DANGER,
                        "Image Size",
                        "Image must be less than 5 MB"
                    );
    
                }
    
            });
        }

    const notificationfunction = async (chatType, recepientId, messageId) => {
        console.log("notificationfunction");
        console.log(chatType, recepientId, messageId);

        const session = await EncryptedStorage.getItem("user_session");
        try {
            if (session != null) {
                const res = await fetch(BASE_URL + '/notifiaction/chatNotifications', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        sendby: StaffIDNo,
                        receipients: recepientId,
                        Title: `${data.data[0].Name}`,
                        body: `${description}`,
                        screenName: 'AllChats',
                        webUrl: 'send-message.php',
                        chatType: chatType,
                        messageId
                    })
                })
                const response = await res.json()
                console.log(response);
            }
        } catch (error) {
            console.log("error in Notification::", error);

        }
    };

    const toptabs = [
        { sn: "1", title: "Groups", icon: "account-group" },
        { sn: "2", title: "Staff", icon: "account-tie" },
        { sn: "3", title: "Students", icon: "school" },
        { sn: "4", title: "Individual Staff", icon: "account" },
        // { sn: "5", title: "Individual Students", icon: "account-school" },
    ];


    const submitModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close'
        })
    }

    const allSelected =
        peopleList &&
        selectedUsers.length === peopleList.length &&
        peopleList.length > 0;
    return (
        <AlertNotificationRoot>
            <ScrollView style={styles.formContainer}>
                <View style={styles.formSelectors}>
                    <ScrollView horizontal={true}>
                        {
                            toptabs.map((tab) => {
                                const isActive = selectedTabTop === tab.sn;
                                return (
                                    <TouchableOpacity
                                        key={tab.sn}
                                        style={{
                                            backgroundColor: isActive ? colors.uniBlue : "white",
                                            borderWidth: 1,
                                            paddingHorizontal: 16,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            justifyContent: 'center',
                                            marginRight: 12,
                                            borderColor: colors.uniBlue,
                                            alignItems: 'center'
                                        }}
                                        onPress={() =>
                                            tabSelect(tab.sn)
                                        }
                                    >
                                        <MaterialCommunityIcons name={tab.icon} color={isActive ? "white" : colors.uniBlue} size={20} />
                                        <Text style={{ color: isActive ? "white" : "black", fontSize: 9 }}>
                                            {tab.title}
                                        </Text>

                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>



                    {/* ///////////////////// STAFF TREE ////////////////////////////////// */}
                    {staffTree &&
                        <View style={{ rowGap: 16 }}>
                            <SelectList boxStyles={{ padding: 10 }}
                                setSelected={(val) => onFacultySelect(val)}
                                fontFamily='time'
                                data={facultyList}
                                search={false}
                                defaultOption={{ key: '0', value: 'Select Faculty' }}
                                inputStyles={{ color: 'black' }}
                                dropdownTextStyles={{ color: 'black' }}
                            />
                            <SelectList boxStyles={{ padding: 10 }}
                                setSelected={(val) => onDepartmentSelect(val)}
                                fontFamily='time'
                                data={departmentList}
                                search={false}
                                defaultOption={{ key: '0', value: 'Select Department' }}
                                inputStyles={{ color: 'black' }}
                                dropdownTextStyles={{ color: 'black' }}
                            />
                            {selectedDepartment != '' ?
                                <TouchableOpacity
                                    style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 16, width: '40%' }]}
                                    onPress={() => searchHandleStaff()}>
                                    <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                        {
                                            loading ? <ActivityIndicator /> :
                                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Search</Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 16, width: '40%', opacity: .7 }]}>
                                    <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Search</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    }

                    {/* ///////////////////// STUDENT TREE ////////////////////////////////// */}
                    {
                        studentTree &&
                        <View style={{ rowGap: 16 }}>
                            <SelectList boxStyles={{ padding: 10 }}
                                setSelected={(val) => onFacultySelect(val)}
                                fontFamily='time'
                                data={facultyList}
                                search={false}
                                defaultOption={{ key: '0', value: 'Select Faculty' }}
                                inputStyles={{ color: 'black' }}
                                dropdownTextStyles={{ color: 'black' }}
                            />
                            <SelectList boxStyles={{ padding: 10 }}
                                setSelected={(val) => onDepartmentSelect(val)}
                                fontFamily='time'
                                data={departmentList}
                                search={false}
                                defaultOption={{ key: '0', value: 'Select Department' }}
                                inputStyles={{ color: 'black' }}
                                dropdownTextStyles={{ color: 'black' }}
                            />
                            <SelectList boxStyles={{ padding: 10 }}
                                setSelected={(val) => onCourseSelect(val)}
                                fontFamily='time'
                                data={courseList}
                                search={false}
                                defaultOption={{ key: '0', value: 'Select Course' }}
                                inputStyles={{ color: 'black' }}
                                dropdownTextStyles={{ color: 'black' }}
                            />
                            <SelectList boxStyles={{ padding: 10 }}
                                setSelected={(val) => setSelectedBatch(val)}
                                fontFamily='time'
                                data={batchList}
                                search={false}
                                defaultOption={{ key: '0', value: 'Select Batch' }}
                                inputStyles={{ color: 'black' }}
                                dropdownTextStyles={{ color: 'black' }}
                            />
                            {selectedBatch != '' ?
                                <TouchableOpacity
                                    style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 16, width: '40%' }]}
                                    onPress={() => searchHandleStudent()}>
                                    <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                        {
                                            loading ? <ActivityIndicator /> :
                                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Search</Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 16, width: '40%', opacity: .7 }]}>
                                    <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Search</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    }

                    {/* ///////////////////// GROUP TREE ////////////////////////////////// */}
                    {
                        groupes && groupList.length > 0 &&
                        <View style={{ flexDirection: "row", columnGap: 16, rowGap: 12, flexWrap: "wrap", borderTopWidth: 1, paddingTop: 12 }}>
                            {groupList.map((item) => {
                                const isSelected = selectedGroupId === item.Id;

                                return (
                                    <TouchableOpacity
                                        key={item.Id}
                                        onPress={() => {
                                            setSelectedGroupId(item.Id);
                                            groupMemberList(item.Id);
                                        }}
                                        style={{
                                            backgroundColor: isSelected ? colors.uniBlue : "white",
                                            borderWidth: 1,
                                            borderColor: colors.uniBlue,
                                            paddingHorizontal: 16,
                                            paddingVertical: 8,
                                            borderRadius: 24,
                                        }}
                                    >
                                        <Text style={{ color: isSelected ? "white" : "black" }}>
                                            {`${item.GroupName}`}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    }


                </View>


                {/* ///////////////////// GROUP PEOPLE LIST AND SEND ////////////////////////////////// */}
                <View>
                    <View>
                        {
                            groupes &&
                            <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12 }}>
                                <View style={[styles.loginInput]}>
                                    <TextInput
                                        style={[styles.inputBox, { textAlignVertical: 'top', height: 80 }]}
                                        placeholder="Enter Message"
                                        value={description}
                                        onChangeText={setDescription}
                                        placeholderTextColor="#666666"
                                        multiline={true}
                                    />
                                </View>
                                {
                                    selectedFile &&
                                    <Text style={{ marginTop: 12, color: 'black' }}>{selectedFile.name}</Text>
                                }
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity
                                        style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%' }]}
                                        onPress={() => Platform.OS == 'android' ? pickDocument() : setAttachmentMenu(true)}>
                                        <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                            {
                                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Attach File</Text>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                    {
                                        groupMembersList.length > 0 ?
                                            <TouchableOpacity
                                                style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%' }]}
                                                onPress={() => sendMessageGroup()}>
                                                <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                                    {
                                                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Send</Text>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                                style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%', opacity: .7 }]}>
                                                <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Send</Text>
                                                </View>
                                            </TouchableOpacity>
                                    }
                                </View>

                            </View>
                        }
                    </View>

                    {
                        groupMembersList.length > 0 &&
                        groupMembersList.map((item) => {
                            const name = item.Name.trim()
                            return (
                                <List.Item
                                    key={item.IDNo}
                                    title={`${name}(${item.IDNo})`}
                                    description={`${item.Department}`}
                                    titleStyle={styles.title}
                                    left={() => (
                                        item.Imagepath != null || item.Imagepath != undefined ?
                                            <Avatar.Image
                                                size={40}
                                                source={{ uri: item.MemberType == 'Staff' ? `${IMAGE_URL}Images/Staff/${item.Imagepath}` : `${IMAGE_URL}Images/Students/${item.Imagepath}` }}
                                                style={styles.avatar}
                                            /> :

                                            <Avatar.Text
                                                size={40}
                                                label={name.charAt(0).toUpperCase()}
                                                style={styles.avatar}
                                            />
                                    )}
                                    style={styles.item}
                                />
                            )
                        })
                    }


                    {/* ///////////////////// SINGLE SELECTED STAFF/STUDENT LIST ////////////////////////////////// */}

                    {selectedUsers.length > 0 && (
                        <>
                            <Text style={styles.selectedTitle}>Selected Users</Text>

                            {selectedUsers.map((user) => {
                                const name = user.Name.trim();

                                return (
                                    <List.Item
                                        key={`selected-${user.IDNo}`}
                                        title={`${name} (${user.IDNo})`}
                                        titleStyle={styles.title}
                                        left={() =>
                                            user.ImagePath ? (
                                                <Avatar.Image
                                                    size={36}
                                                    source={{ uri: `${IMAGE_URL}Images/Staff/${user.ImagePath}` }}
                                                />
                                            ) : (
                                                <Avatar.Text
                                                    size={36}
                                                    label={name.charAt(0).toUpperCase()}
                                                />
                                            )
                                        }
                                        right={() => (
                                            <IconButton
                                                icon="close"
                                                iconColor="red"
                                                onPress={() =>
                                                    setSelectedUsers((prev) =>
                                                        prev.filter((u) => u.IDNo !== user.IDNo)
                                                    )
                                                }
                                            />
                                        )}
                                        style={[styles.selectedItem, { flexDirection: 'row', alignItems: 'center' }]}
                                    />
                                );
                            })}
                        </>
                    )}

                    {/* STAFF SEND */}
                    {
                        ( peopleList.length > 0 || singleStaffData.length > 0 )&& selectedUsers.length > 0 &&
                        <View style={{ backgroundColor: '#fff', marginBottom: 16, padding: 16, borderRadius: 16 }}>
                            <View style={[styles.loginInput]}>
                                <TextInput
                                    style={[styles.inputBox, { textAlignVertical: 'top', height: 80 }]}
                                    placeholder="Enter Message"
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholderTextColor="#666666"
                                    multiline={true}
                                />
                            </View>
                            {
                                selectedFile &&
                                <Text style={{ marginTop: 12, color: 'black' }}>{selectedFile.name}</Text>
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%' }]}
                                    onPress={() => Platform.OS == 'android' ? pickDocument() : setAttachmentMenu(true)}>
                                    <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                        {
                                            <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Attach File</Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                                {
                                    description.length > 0 ?
                                        <TouchableOpacity
                                            style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%' }]}
                                            onPress={() => sendMessageSingle()}>
                                            <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                                {
                                                    loading ? <ActivityIndicator /> :
                                                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Send</Text>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%', opacity: .7 }]}>
                                            <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Send</Text>
                                            </View>
                                        </TouchableOpacity>
                                }
                            </View>
                        </View>
                    }
                    {/* /////////////////////// INDIVIDUAL STAFF TREE AND LIST ///////////////////////////// */}
                    {
                        singleStaffTree &&
                        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, elevation: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <View style={{ borderBottomWidth: 1, width: '60%', alignSelf: 'center' }}>
                                    <TextInput
                                        style={{ height: 36 }}
                                        placeholder="Search Here"
                                        value={singleStaffId}
                                        onChangeText={setSingleStaffId}
                                        placeholderTextColor="#666666"
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[{ backgroundColor: colors.uniBlue, padding: 4, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8 }]}
                                    onPress={() => searchSingleStaff()}>
                                    <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                        <MaterialIcons name="search" color="#fff" size={22} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {loading ? <ActivityIndicator /> :
                                singleStaffData.length > 0 &&
                                singleStaffData.map((item) => {
                                    const name = item.Name.trim()
                                    const isSelected = selectedUsers.some(
                                        (u) => u.IDNo === item.IDNo
                                    );

                                    const onAddUser = () => {
                                        setSelectedUsers((prev) =>
                                            prev.some((u) => u.IDNo === item.IDNo)
                                                ? prev.filter((u) => u.IDNo !== item.IDNo)
                                                : [...prev, item]
                                        );
                                    };
                                    return (
                                        <List.Item
                                            key={item.IDNo}
                                            title={`${name}(${item.IDNo})`}
                                            description={`${item.Department}`}
                                            titleStyle={styles.title}
                                            left={() => (
                                                item.ImagePath != null || item.ImagePath != undefined ?
                                                    <Avatar.Image
                                                        size={40}
                                                        source={{ uri: `${IMAGE_URL}Images/Staff/${item.ImagePath}` }}
                                                        style={styles.avatar}
                                                    /> :

                                                    <Avatar.Text
                                                        size={40}
                                                        label={name.charAt(0).toUpperCase()}
                                                        style={styles.avatar}
                                                    />
                                            )}
                                            right={() => (
                                                <IconButton
                                                    icon={isSelected ? "check" : "plus"}
                                                    iconColor={isSelected ? "#2e7d32" : "#223260"}
                                                    onPress={onAddUser}
                                                />
                                            )}
                                            style={styles.item}
                                        />
                                    )
                                })
                            }
                        </View>
                    }
                </View>
                {/* {
                        peopleList.length > 0 && selectedUsers.length > 0 &&
                        <View style={{ backgroundColor: '#fff', marginBottom: 16, padding: 16, borderRadius: 16 }}>
                            <View style={[styles.loginInput]}>
                                <TextInput
                                    style={[styles.inputBox, { textAlignVertical: 'top', height: 80 }]}
                                    placeholder="Enter Message"
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholderTextColor="#666666"
                                    multiline={true}
                                />
                            </View>
                            {
                                selectedFile &&
                                <Text style={{ marginTop: 12, color: 'black' }}>{selectedFile.name}</Text>
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%' }]}
                                    onPress={() => Platform.OS == 'android' ? pickDocument() : setAttachmentMenu(true)}>
                                    <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                        {
                                            <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Attach File</Text>
                                        }
                                    </View>
                                </TouchableOpacity>
                                {
                                    description.length > 0 ?
                                        <TouchableOpacity
                                            style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%' }]}
                                            onPress={() => sendMessageSingle()}>
                                            <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                                {
                                                    loading ? <ActivityIndicator /> :
                                                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Send</Text>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%', opacity: .7 }]}>
                                            <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Send</Text>
                                            </View>
                                        </TouchableOpacity>
                                }
                            </View>
                        </View>
                    } */}

                <View style={{ marginBottom: 24 }}>
                    {peopleList && peopleList.length > 0 && (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8, backgroundColor: '#fff', padding: 12, borderRadius: 12, alignItems: 'center' }}>
                            <Text style={{ color: '#1b1b1b', fontSize: 16, fontWeight: '500' }}>Recipient List</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    if (allSelected) {
                                        setSelectedUsers([]); // Clear all
                                    } else {
                                        setSelectedUsers(peopleList); // Select all
                                    }
                                }}
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 16,
                                    backgroundColor: allSelected ? "#eee" : colors.uniBlue,
                                }}
                            >
                                <Text style={{ color: allSelected ? "#000" : "#fff", fontWeight: "500" }}>
                                    {allSelected ? "Clear All" : "Select All"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}


                    {/* ////////////////////// SELECTED PEOPLE LIST AND SEND MESSAGE ////////////////// */}

                    {peopleList && peopleList.map((item, i) => {
                        const name = item.Name.trim();

                        const isSelected = selectedUsers.some(
                            (u) => u.IDNo === item.IDNo
                        );

                        const onAddUser = () => {
                            setSelectedUsers((prev) =>
                                prev.some((u) => u.IDNo === item.IDNo)
                                    ? prev.filter((u) => u.IDNo !== item.IDNo)
                                    : [...prev, item]
                            );
                        };

                        return (
                            <List.Item
                                key={item.IDNo}
                                title={staffTree ? `${name}(${item.IDNo})` : `${name}(${item.ClassRollNo})`}
                                description={`${item.Department}`}
                                titleStyle={styles.title}
                                left={() => (
                                    item.ImagePath != null || item.ImagePath != undefined ?
                                        <Avatar.Image
                                            size={40}
                                            source={{ uri: staffTree ? `${IMAGE_URL}Images/Staff/${item.ImagePath}` : `${IMAGE_URL}Images/Students/${item.ImagePath}` }}
                                            style={styles.avatar}
                                        /> :

                                        <Avatar.Text
                                            size={40}
                                            label={name.charAt(0).toUpperCase()}
                                            style={styles.avatar}
                                        />
                                )}
                                right={() => (
                                    <IconButton
                                        icon={isSelected ? "check" : "plus"}
                                        iconColor={isSelected ? "#2e7d32" : "#223260"}
                                        onPress={onAddUser}
                                    />
                                )}
                                style={[styles.item, { flexDirection: 'row', alignItems: 'center' }]}
                            />
                        );
                    })}
                    {
                        // peopleList.length > 0 && selectedUsers.length > 0 &&
                        // <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
                        //     <View style={[styles.loginInput]}>
                        //         <TextInput
                        //             style={[styles.inputBox, { textAlignVertical: 'top', height: 80 }]}
                        //             placeholder="Enter Message"
                        //             value={description}
                        //             onChangeText={setDescription}
                        //             placeholderTextColor="#666666"
                        //             multiline={true}
                        //         />
                        //     </View>
                        //     {
                        //         selectedFile &&
                        //         <Text style={{ marginTop: 12, color: 'black' }}>{selectedFile.name}</Text>
                        //     }
                        //     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        //         <TouchableOpacity
                        //             style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%' }]}
                        //             onPress={() => pickDocument()}>
                        //             <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                        //                 {
                        //                     <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Attach File</Text>
                        //                 }
                        //             </View>
                        //         </TouchableOpacity>
                        //         {
                        //             description.length > 0 ?
                        //                 <TouchableOpacity
                        //                     style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%' }]}
                        //                     onPress={() => sendMessage()}>
                        //                     <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                        //                         {
                        //                             loading ? <ActivityIndicator /> :
                        //                                 <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Send</Text>
                        //                         }
                        //                     </View>
                        //                 </TouchableOpacity>
                        //                 :
                        //                 <TouchableOpacity
                        //                     style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, paddingHorizontal: 16, width: '40%', opacity: .7 }]}>
                        //                     <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                        //                         <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Send</Text>
                        //                     </View>
                        //                 </TouchableOpacity>
                        //         }
                        //     </View>

                        // </View>
                    }
                </View>

            </ScrollView>
            <Portal>
                    <Modal
                        visible={attachmentMenu}
                        onDismiss={() => setAttachmentMenu(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <Button
                            mode="text"
                            onPress={() => pickDocument()}
                        >
                            Document
                        </Button>
                            <Button
                                textColor="red"
                                onPress={() => pickImageFromGallery()}
                            >
                                Photo
                            </Button>
                        <Button onPress={() => setAttachmentMenu(false)}>
                            Cancel
                        </Button>
                    </Modal>
                </Portal>

        </AlertNotificationRoot>
    )
}

export default NewChat

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
    },
    item: {
        backgroundColor: "#fff",
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
    },
    selectedTitle: {
        marginTop: 0,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
    },

    selectedItem: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 4,
        paddingVertical: 0,
        paddingHorizontal: 16
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 16,
        marginHorizontal: 32,
        borderRadius: 12,
    },

})