import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { BASE_URL } from '@env';
import { pick, types, isCancel } from '@react-native-documents/picker'
import EncryptedStorage from 'react-native-encrypted-storage';
import colors from '../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

const CreateNotification = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [fileResponse, setFileResponse] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState({
        student: false,
        staff: false,
    });



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

    const submitButton = async () => {

        setLoading(true)
        const session = await EncryptedStorage.getItem("user_session");

        if (session != null) {

            try {
                const formData = new FormData();
                if (fileResponse.length > 0) {
                    formData.append('correction', {
                        uri: fileResponse[0]["uri"],
                        type: fileResponse[0]["type"],
                        name: 'Notice_' + fileResponse[0]['name'],
                    });
                }
                formData.append("title", title)
                formData.append("description", description)
                formData.append("selectedType", JSON.stringify(selectedRoles))
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
                setSelectedRoles({
                    student: false,
                    staff: false,
                })
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
                                backgroundColor: selectedRoles.student ? colors.uniBlue : "white",
                                borderWidth: 1,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 24,
                            }}
                            onPress={() =>
                                setSelectedRoles({ ...selectedRoles, student: !selectedRoles.student })
                            }
                        >
                            <Text style={{ color: selectedRoles.student ? "white" : "black" }}>
                                Student
                            </Text>
                        </TouchableOpacity>

                        {/* Staff */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: selectedRoles.staff ? colors.uniBlue : "white",
                                borderWidth: 1,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 24,
                            }}
                            onPress={() =>
                                setSelectedRoles({ ...selectedRoles, staff: !selectedRoles.staff })
                            }
                        >
                            <Text style={{ color: selectedRoles.staff ? "white" : "black" }}>
                                Staff
                            </Text>
                        </TouchableOpacity>
                    </View>



                    {title != '' && description != '' && (selectedRoles.student || selectedRoles.staff) ?
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

export default CreateNotification

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