import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { RefreshControl, ScrollView, TextInput } from 'react-native-gesture-handler';
import { BASE_URL, LIMS_URL, IMAGE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../../colors';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
// import DocumentPicker from 'react-native-document-picker';
import { pick, types, isCancel } from '@react-native-documents/picker'
import { Image } from 'react-native';
import { StudentContext } from '../../../context/StudentContext';

const TrackEachRequest = ({ route }) => {
    const { data } = useContext(StudentContext)
    const requestId = route?.params?.requestId;

    const [request, setRequest] = useState([])
    const [documents, setDocuments] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [country, setCountry] = useState('')
    const [countryName, setCountryName] = useState('')
    const [stateName, setStateName] = useState('')
    const [stateList, setStateList] = useState('')
    const [cityList, setCityList] = useState('')
    const [cityName, setCityName] = useState('')
    const [pin, setPin] = useState('')
    const [addressLine, setAddressLine] = useState('')

    const [previousAddress, setPreviousAddress] = useState('')

    const [previewUri, setPreviewUri] = useState(null);
    const [previewType, setPreviewType] = useState(null); // 'pdf' or 'image'
    const [previewVisible, setPreviewVisible] = useState(false);

    const [documentCharges, setDocumentCharges] = useState(0)
    const [postalCharges, setPostalCharges] = useState(0)
    const [otherCharges, setOtherCharges] = useState(0)
    const [totalCharges, setTotalCharges] = useState(0)

    const [addressFormShow, setAddressFormShow] = useState(false)
    const [pickedFiles, setPickedFiles] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation()

    const ViewLeaveRequests = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        console.log("ViewLeaveRequests called");

        setIsLoading(true)
        if (session != null) {
            try {
                const res = await fetch(BASE_URL + '/student/eachDocRequest', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        requestId: requestId
                    })
                })
                const response = await res.json();
                console.log("response Each::: ", response);
                setRequest(response['data'][0])
                setDocumentCharges(response['data'][0]['DocumentCharges'])
                setPostalCharges(response['data'][0]['PostalCharges'] || 0)
                setOtherCharges(response['data'][0]['OtherCharges'])
                setTotalCharges(response['data'][0]['TotalAmount'])
                setDocuments(response['data'])
                const preAddress = `${response['data']['AddressLine']}, ${response['data']['District']}, ${response['data']['State']}, ${response['data']['Country']}`

                setPreviousAddress(preAddress)
                
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                console.log("eachDocRequesteachDocRequesteachDocRequesteachDocRequesteachDocRequest");
                submitModel(ALERT_TYPE.DANGER, "Oops!!!", `Something went Wrongss !!`)
            }
        }
    }

    useEffect(() => {
        ViewLeaveRequests()
    }, [])

    const handleViewDocument = (doc) => {
        const baseUrl = `${IMAGE_URL}/Documents/Students/`; // Example if stored on FTP
        const fileUrl = `${baseUrl}${doc.DocumentPath}`;

        if (doc.DocumentPath.endsWith('.pdf')) {
            setPreviewVisible(false);
            navigation.navigate('ViewAttachedDocument', { fileName: fileUrl })
        } else {
            setPreviewUri(fileUrl);
            setPreviewType('image');
            setPreviewVisible(true);
        }
    };

    const bindCountries = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const res = await fetch(LIMS_URL + '/common/allcountries', {
                    method: 'POST',
                })
                // console.log('rare student');       
                const response = await res.json();
                const countriesList = response.map((item) => {
                    return { key: item['id'], value: item['name'] }
                })
                setCountry(countriesList)
                // console.log("response:::::",response);
                return response
            } catch (error) {
                console.log('meter data :: ', error);
            }
        }
    }

    const stateBind = async (countryId) => {
        if (countryId == 101) {
            setCountryName("India")
        } else {
            const selectedCountry = country.find(item => item.key === countryId);
            if (selectedCountry) {
                setCountryName(selectedCountry["value"])
            } else {
                setCountryName('');
            }
        }
        updateFeesOnAddresschange(countryId)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const res = await fetch(`${LIMS_URL}/common/allstates/${countryId}`, {
                    method: 'POST',
                })
                // console.log('rare student');       
                const response = await res.json();
                const statesList = response.map((item) => {
                    return { key: item['id'], value: item['name'] }
                })
                setStateList(statesList)
                // console.log("response:::::", response);
                return response
            } catch (error) {
                console.log('state bind :: ', error);
            }
        }
    }

    const cityBind = async (stateId) => {
        const selectedState = stateList.find(item => item.key === stateId);
        if (selectedState) {
            setStateName(selectedState["value"])
        } else {
            setStateName('');
        }
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const res = await fetch(`${LIMS_URL}/common/allcities/${stateId}`, {
                    method: 'POST',
                })
                // console.log('rare student');       
                const response = await res.json();
                const cityList = response.map((item) => {
                    return { key: item['id'], value: item['name'] }
                })
                setCityList(cityList)
                // console.log("response:::::", response);
                return response
            } catch (error) {
                console.log('city bind :: ', error);
            }
        }
    }

    const cityNameBind = async (cityId) => {
        const selectedCity = cityList.find(item => item.key === cityId);
        if (selectedCity) {
            setCityName(selectedCity.value);
        } else {
            setCityName('');
        }
    }

    const changeAddress = async () => {
        bindCountries()
        // console.log(addressFormShow);
        setAddressFormShow(!addressFormShow)
    }

    const submitNewAddress = async (val) => {
        const session = await EncryptedStorage.getItem("user_session")
        console.log('infunction ::: ', requestId);
        if (session != null) {
            try {
                const res = await fetch(`${BASE_URL}/student/changeAddress`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        purpose: val,
                        id: requestId,
                        countryName,
                        stateName,
                        cityName,
                        pin,
                        addressLine
                    })
                })
                const response = await res.json();
                console.log("response:::::", response);
                submitModel(ALERT_TYPE.SUCCESS, "Success", response.message);
                return response
            } catch (error) {
                console.log('submitNewAddress bind :: ', error);
            }
        }
    }


    const pickDocumentForUpdate = async (docId) => {
        try {
            const response = await pick({
                presentationStyle: 'fullScreen',
                type: [types.pdf, types.images],
            });

            const file = response[0];
            if (file.size <= 5 * 1024 * 1024) {
                setPickedFiles((prev) => ({
                    ...prev,
                    [docId]: {
                        uri: file.uri,
                        name: file.name,
                        type: file.type,
                    },
                }));
            } else {
                submitModel(ALERT_TYPE.DANGER, "File size", "File must be less than 5 MB");
            }
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.log('pickDocumentForUpdate error:', err);
            }
        }
    };

    const saveUpdatedDocument = async (docId) => {
        const selectedFile = pickedFiles[docId];
        if (!selectedFile) {
            console.warn('No file picked for this doc.');
            return;
        }

        const res = await updateDocument(selectedFile, docId);
        if (res) {
            submitModel(ALERT_TYPE.SUCCESS, "Success", "Document updated successfully!");
            setPickedFiles((prev) => {
                const copy = { ...prev };
                delete copy[docId];
                return copy;
            });
        }
    };

    // Update image/pdf by docId

    const updateDocument = async (selectedFile, docId) => {
        try {
            if (!selectedFile || !docId) throw new Error('File or Document ID missing');

            const session = await EncryptedStorage.getItem("user_session");
            if (!session) throw new Error("Session not found");

            const formData = new FormData();
            formData.append('docs', {
                uri: selectedFile.uri,
                type: selectedFile.type,
                name: selectedFile.name,
            });
            formData.append('docId', docId);

            const response = await fetch(`${BASE_URL}/Student/updateDocument`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                },
                body: formData,
            });

            const resData = await response.json();
            if (response.ok) {
                console.log('Updated successfully:', resData);
                return resData;
            } else {
                console.warn('Update failed:', resData.message || 'Unknown error');
                return null;
            }
        } catch (error) {
            console.error('Error updating document:', error.message);
            return null;
        }
    };

    const updateFeesOnAddresschange = async (countryId) => {
        const session = await EncryptedStorage.getItem("user_session")
        console.log(requestId);
        let requestedDocId = request['DocumentRequested'];
        let receivingType = 1;
        let addressType = '';
        if (countryId == 101) {
            addressType = 0
        } else {
            addressType = 1;
        }
        console.log(requestedDocId, receivingType, addressType);
        if (addressType != null) {
            if (session != null) {
                try {
                    const res = await fetch(`${BASE_URL}/student/documentCharges`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${session}`,
                            Accept: "application/json",
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify({
                            docId: requestedDocId,
                            receivingType: receivingType,
                            addressType: addressType,
                        })
                    })
                    const response = await res.json();
                    console.log("updateFeesOnAddresschange:::::", response['data'][0]);
                    setDocumentCharges(response['data'][0]['Fee'])
                    setPostalCharges(response['data'][0]['PostalCharges'])
                    setOtherCharges(response['data'][0]['OtherCharges'])
                    setTotalCharges(response['data'][0]['Fee'] + response['data'][0]['PostalCharges'] + response['data'][0]['OtherCharges'])

                    return response
                } catch (error) {
                    console.log('submitNewAddress bind :: ', error);
                }
            }
        } else {
            console.log("country selection remaining");

        }
    }

    const finalSubmit = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        console.log('infunction ::: ', requestId);
        if (session != null) {
            try {
                const res = await fetch(`${BASE_URL}/student/finalSubmit`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`,
                        Accept: "application/json",
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        id: requestId,
                    })
                })
                const response = await res.json();
                console.log("response:::::", response);
                response.flag == 1 ? outModel(ALERT_TYPE.SUCCESS, "Success", response.message) :
                    response.flag == 0 ? submitModel(ALERT_TYPE.DANGER, "File size", response.message) : null
                return response
            } catch (error) {
                console.log('submitNewAddress bind :: ', error);
            }
        }
    }


    const submitModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
            onHide: ()=> ViewLeaveRequests()
        })
    }
    const outModel = (type, title, message) => {
        Dialog.show({
            type: type,
            title: title,
            textBody: message,
            button: 'close',
            onHide: () => navigation.goBack()
        })
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        ViewLeaveRequests()
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      }, []);


    return (
        <AlertNotificationRoot>
            {
                isLoading ? <ActivityIndicator /> :
                    <View>
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            keyboardShouldPersistTaps="handled"
                        >
                            {
                                request ?
                                    <View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: 'white', marginVertical: 8, elevation: 1, borderRadius: 12 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: '75%' }}>
                                                <View style={{ flexDirection: 'row', columnGap: 4 }}>
                                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>Request ID: </Text>
                                                    <Text style={{ color: 'black', fontSize: 15 }}>{request['Id']}</Text>

                                                </View>
                                                <View style={{ flexDirection: 'row', columnGap: 4 }}>
                                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>Request Date: </Text>
                                                    <Text style={{ color: 'black', fontSize: 15 }}>{request['SubmitDate'] && request['SubmitDate'].split('T')[0].split("-").reverse().join("-")}</Text>
                                                </View>
                                            </View>
                                            <View style={{ width: '25%' }}>
                                                <View style={{ flexDirection: 'row', columnGap: 4, alignSelf: 'center' }}>
                                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>Status </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', columnGap: 4, alignSelf: 'center' }}>
                                                    {
                                                        request['Status'] == 1 ?
                                                            <Text style={{ color: 'green', fontSize: 15 }}>Completed</Text> :
                                                            <Text style={{ color: colors.uniBlue, fontSize: 15 }}>Pending</Text>
                                                    }
                                                </View>
                                            </View>

                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: '75%' }}>
                                                <View style={{ flexDirection: 'row', columnGap: 4 }}>
                                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>Requested Document: </Text>
                                                    <Text style={{ color: 'black', fontSize: 15 }}>{request['AppliedDoc']}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: 'black', fontSize: 15, fontWeight: 600 }}>Receiving Type:
                                                    </Text>
                                                    <Text style={{ color: 'black', fontSize: 15 }}> {request['ReceivingType']}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 24 }}>
                                            <Text style={[styles.boldText, { borderBottomWidth: 1, width: '50%' }]}>Documents Submitted :</Text>
                                            {
                                                documents && documents.map((doc, i) => (
                                                    <View key={i}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <TouchableOpacity
                                                                onPress={() => handleViewDocument(doc)}
                                                                style={{
                                                                    backgroundColor: colors.uniBlue,
                                                                    marginVertical: 8,
                                                                    paddingVertical: 8,
                                                                    borderRadius: 8,
                                                                    alignItems: 'center',
                                                                    width: '70%',
                                                                }}
                                                            >
                                                                <Text style={[styles.boldText, { color: 'white' }]}>
                                                                    {doc['DocName']} : Press to view
                                                                </Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    pickedFiles[doc.DocId]
                                                                        ? saveUpdatedDocument(doc.DocId) 
                                                                        : pickDocumentForUpdate(doc.DocId)
                                                                }
                                                                style={{
                                                                    backgroundColor: pickedFiles[doc.DocId] ? 'green' : colors.uniRed,
                                                                    marginVertical: 8,
                                                                    paddingVertical: 8,
                                                                    borderRadius: 8,
                                                                    alignItems: 'center',
                                                                    width: '20%',
                                                                }}
                                                            >
                                                                <Text style={[styles.boldText, { color: 'white' }]}>
                                                                    {pickedFiles[doc.DocId] ? 'Save' : 'Edit'}
                                                                </Text>
                                                            </TouchableOpacity>

                                                        </View>
                                                    </View>

                                                ))
                                            }
                                            <View style={{ marginVertical: 16 }}>
                                                <Text style={[styles.boldText, { borderBottomWidth: 1, width: '40%' }]}>Contact Details :</Text>
                                                <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                                                    <Text style={[styles.boldText, { color: 'black' }]}>Mobile Number :- </Text>
                                                    <Text style={{ color: 'black' }}>{data['data'][0]['StudentMobileNo']}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={[styles.boldText, { color: 'black' }]}>Email Address :- </Text>
                                                    <Text style={{ color: 'black' }}>{data['data'][0]['EmailID']}</Text>
                                                </View>
                                                <Text style={{ color: 'red', fontSize: 11 }}>*To update Mobile Number or Email Address visit Your Profile Page*</Text>
                                            </View>
                                            {
                                                request['ReceivingType'] == "Home Delivery" ?
                                                    <View style={{ marginTop: 16 }}>
                                                        <Text style={[styles.boldText, { borderBottomWidth: 1, width: '40%' }]}>Delivery Address :</Text>
                                                        <TextInput
                                                            value={previousAddress}
                                                            style={[styles.inputBox, { color: 'black', height: 100, textAlignVertical: 'top' }]}
                                                            maxLength={1000}
                                                            numberOfLines={3}
                                                            multiline={true}
                                                            editable={false}
                                                        />
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <TouchableOpacity style={{ backgroundColor: colors.uniRed, marginVertical: 8, paddingVertical: 8, borderRadius: 8, alignItems: 'center', width: '40%' }} onPress={() => changeAddress()}>
                                                                <Text style={[styles.boldText, { color: 'white' }]}>Change Address</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{ backgroundColor: colors.uniBlue, marginVertical: 8, paddingVertical: 8, borderRadius: 8, alignItems: 'center', width: '40%' }} onPress={() => submitNewAddress(1)}>
                                                                <Text style={[styles.boldText, { color: 'white' }]}>Change to By Hand</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        {
                                                            addressFormShow &&
                                                            <View style={{ marginTop: 16 }}>
                                                                <Text style={{ fontSize: 16, color: '#1b1b1b' }}>Kindly Fill Address Form :</Text>
                                                                <View style={{ flexDirection: 'row', columnGap: 16 }}>
                                                                    <View style={{ width: '45%', marginTop: 8 }}>
                                                                        <Text style={{ color: '#1b1b1b' }}>Select Country:</Text>
                                                                        <View>
                                                                            <SelectList boxStyles={{ padding: 10, width: "100%", marginTop: 4 }}
                                                                                setSelected={(val) => stateBind(val)}
                                                                                fontFamily='time'
                                                                                data={country}
                                                                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'#1b1b1b'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                                                                search={false}
                                                                                defaultOption={{ key: '0', value: 'Select' }}
                                                                                inputStyles={{ color: '#1b1b1b' }}
                                                                                dropdownTextStyles={{ color: '#1b1b1b' }}
                                                                            />
                                                                        </View>

                                                                    </View>
                                                                    <View style={{ width: '45%', marginTop: 8 }}>
                                                                        <Text style={{ color: '#1b1b1b' }}>Select State/Province :</Text>
                                                                        <View>
                                                                            <SelectList boxStyles={{ padding: 10, width: "100%", marginTop: 4 }}
                                                                                setSelected={(val) => cityBind(val)}
                                                                                fontFamily='time'
                                                                                data={stateList}
                                                                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'#1b1b1b'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                                                                search={false}
                                                                                defaultOption={{ key: '0', value: 'Select' }}
                                                                                inputStyles={{ color: '#1b1b1b' }}
                                                                                dropdownTextStyles={{ color: '#1b1b1b' }}
                                                                            />
                                                                        </View>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', columnGap: 16 }}>
                                                                    <View style={{ width: '45%', marginTop: 8 }}>
                                                                        <Text style={{ color: '#1b1b1b' }}>Select City :</Text>
                                                                        <View>
                                                                            <SelectList boxStyles={{ padding: 10, width: "100%", marginTop: 4 }}
                                                                                setSelected={(val) => cityNameBind(val)}
                                                                                fontFamily='time'
                                                                                data={cityList}
                                                                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'#1b1b1b'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                                                                search={false}
                                                                                defaultOption={{ key: '0', value: 'Select' }}
                                                                                inputStyles={{ color: '#1b1b1b' }}
                                                                                dropdownTextStyles={{ color: '#1b1b1b' }}
                                                                            />
                                                                        </View>

                                                                    </View>
                                                                    <View style={{ width: '45%', marginTop: 8 }}>
                                                                        <Text style={{ color: '#1b1b1b' }}>Zip/Pin Code :</Text>
                                                                        <TextInput
                                                                            value={pin}
                                                                            style={styles.inputBox}
                                                                            onChangeText={(text) => { setPin(text) }}
                                                                            keyboardType='number-pad'
                                                                        />

                                                                    </View>
                                                                </View>
                                                                <Text style={{ color: '#1b1b1b' }}>Residence Address</Text>
                                                                <TextInput
                                                                    value={addressLine}
                                                                    style={styles.inputBox}
                                                                    onChangeText={
                                                                        (text) => { setAddressLine(text) }}
                                                                    placeholder='#123, abc road'
                                                                />
                                                                <TouchableOpacity style={{ backgroundColor: colors.uniBlue, marginVertical: 8, paddingVertical: 8, borderRadius: 8, alignItems: 'center', width: '40%' }} onPress={() => submitNewAddress(0)}>
                                                                    <Text style={[styles.boldText, { color: 'white' }]}>Confirm Address</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        }
                                                    </View>
                                                    :
                                                    <View>
                                                        <Text style={[styles.boldText]}>Opted for Document Receiving - By Hand</Text>
                                                        <TouchableOpacity style={{ backgroundColor: colors.uniBlue, marginVertical: 8, paddingVertical: 8, borderRadius: 8, alignItems: 'center', width: '50%' }} onPress={() => changeAddress()}>
                                                            <Text style={[styles.boldText, { color: 'white' }]}>Change to Home Delivery</Text>
                                                        </TouchableOpacity>
                                                        {
                                                            addressFormShow &&
                                                            <View style={{ marginTop: 16 }}>
                                                                <Text style={{ fontSize: 16, color: '#1b1b1b' }}>Kindly Fill Address Form :</Text>
                                                                <View style={{ flexDirection: 'row', columnGap: 16 }}>
                                                                    <View style={{ width: '45%', marginTop: 8 }}>
                                                                        <Text style={{ color: '#1b1b1b' }}>Select Country:</Text>
                                                                        <View>
                                                                            <SelectList boxStyles={{ padding: 10, width: "100%", marginTop: 4 }}
                                                                                setSelected={(val) => stateBind(val)}
                                                                                fontFamily='time'
                                                                                data={country}
                                                                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'#1b1b1b'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                                                                search={false}
                                                                                defaultOption={{ key: '0', value: 'Select' }}
                                                                                inputStyles={{ color: '#1b1b1b' }}
                                                                                dropdownTextStyles={{ color: '#1b1b1b' }}
                                                                            />
                                                                        </View>

                                                                    </View>
                                                                    <View style={{ width: '45%', marginTop: 8 }}>
                                                                        <Text style={{ color: '#1b1b1b' }}>Select State/Province :</Text>
                                                                        <View>
                                                                            <SelectList boxStyles={{ padding: 10, width: "100%", marginTop: 4 }}
                                                                                setSelected={(val) => cityBind(val)}
                                                                                fontFamily='time'
                                                                                data={stateList}
                                                                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'#1b1b1b'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                                                                search={false}
                                                                                defaultOption={{ key: '0', value: 'Select' }}
                                                                                inputStyles={{ color: '#1b1b1b' }}
                                                                                dropdownTextStyles={{ color: '#1b1b1b' }}
                                                                            />
                                                                        </View>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', columnGap: 16 }}>
                                                                    <View style={{ width: '45%', marginTop: 8 }}>
                                                                        <Text style={{ color: '#1b1b1b' }}>Select City :</Text>
                                                                        <View>
                                                                            <SelectList boxStyles={{ padding: 10, width: "100%", marginTop: 4 }}
                                                                                setSelected={(val) => cityNameBind(val)}
                                                                                fontFamily='time'
                                                                                data={cityList}
                                                                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'#1b1b1b'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                                                                search={false}
                                                                                defaultOption={{ key: '0', value: 'Select' }}
                                                                                inputStyles={{ color: '#1b1b1b' }}
                                                                                dropdownTextStyles={{ color: '#1b1b1b' }}
                                                                            />
                                                                        </View>

                                                                    </View>
                                                                    <View style={{ width: '45%', marginTop: 8 }}>
                                                                        <Text style={{ color: '#1b1b1b' }}>Zip/Pin Code :</Text>
                                                                        <TextInput
                                                                            value={pin}
                                                                            style={styles.inputBox}
                                                                            onChangeText={(text) => { setPin(text) }}
                                                                            keyboardType='number-pad'
                                                                        />

                                                                    </View>
                                                                </View>
                                                                <Text style={{ color: '#1b1b1b' }}>Residence Address</Text>
                                                                <TextInput
                                                                    value={addressLine}
                                                                    style={styles.inputBox}
                                                                    onChangeText={
                                                                        (text) => { setAddressLine(text) }}
                                                                    placeholder='#123, abc road'
                                                                />
                                                                <TouchableOpacity style={{ backgroundColor: colors.uniBlue, marginVertical: 8, paddingVertical: 8, borderRadius: 8, alignItems: 'center', width: '40%' }} onPress={() => submitNewAddress(2)}>
                                                                    <Text style={[styles.boldText, { color: 'white' }]}>Update Address</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        }
                                                    </View>

                                            }

                                        </View>
                                        <View style={{ marginTop: 16 }}>
                                            <Text style={[styles.boldText, { borderBottomWidth: 1, width: '40%' }]}>Charges Details :</Text>
                                            <View>
                                                <View style={{ marginHorizontal: 8, marginBottom: 2, flexDirection: 'row' }}>
                                                    <Text style={[styles.boldText]}>Document Charges : - </Text>
                                                    <Text style={[styles.normalText]}>{documentCharges} INR</Text>
                                                </View>
                                                <View style={{ marginHorizontal: 8, marginBottom: 2, flexDirection: 'row' }}>
                                                    <Text style={[styles.boldText]}>Postal Charges : - </Text>
                                                    <Text style={[styles.normalText]}>{postalCharges} INR</Text>
                                                </View>
                                                <View style={{ marginHorizontal: 8, marginBottom: 2, flexDirection: 'row' }}>
                                                    <Text style={[styles.boldText]}>Other Charges : - </Text>
                                                    <Text style={[styles.normalText]}>{otherCharges} INR</Text>
                                                </View>
                                                <View style={{ marginHorizontal: 8, marginBottom: 2, flexDirection: 'row' }}>
                                                    <Text style={[styles.boldText]}>Total Amount : - </Text>
                                                    <Text style={[styles.normalText]}>{totalCharges} INR</Text>
                                                </View>
                                            </View>

                                        </View>
                                        <View>
                                            <TouchableOpacity style={{ backgroundColor: colors.uniBlue, marginVertical: 8, paddingVertical: 8, borderRadius: 8, alignItems: 'center' }} onPress={() => finalSubmit()}>
                                                <Text style={[styles.boldText, { color: 'white' }]}>Confirm Details and Submit</Text>
                                            </TouchableOpacity>
                                            <Text style={{ color: 'gray', fontSize: 10, textAlign: 'center' }}>By confirming you are verifying that all the details above are correct.</Text>
                                        </View>

                                    </View>
                                    :
                                    <Text style={{ textAlign: 'center' }}>No Data Found</Text>
                            }
                            <Modal visible={previewVisible} onRequestClose={() => setPreviewVisible(false)}>
                                <View style={{ flex: 1, backgroundColor: '#000' }}>
                                    {previewType === 'image' && (
                                        <Image
                                            source={{ uri: previewUri }}
                                            style={{ flex: 1, resizeMode: 'contain' }}
                                        />
                                    )}
                                    <TouchableOpacity
                                        onPress={() => setPreviewVisible(false)}
                                        style={{ position: 'absolute', top: 40, right: 20 }}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 20 }}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>


                        </ScrollView>
                    </View>
            }
        </AlertNotificationRoot>
    )
}

export default TrackEachRequest

const styles = StyleSheet.create({
    normalText: {
        color: '#1b1b1b',
        fontSize: 14
    },
    boldText: {
        color: '#1b1b1b',
        fontSize: 14,
        fontWeight: '600'
    },
    inputBox: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginTop: 8,
        color: 'black',
        backgroundColor: '#fffafa',
        height:40
    }
})