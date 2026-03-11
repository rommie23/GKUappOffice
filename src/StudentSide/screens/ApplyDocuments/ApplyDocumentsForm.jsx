import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, TextInputComponent, Dimensions } from 'react-native'
import React, { useState, useCallback, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SelectList } from 'react-native-dropdown-select-list'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { BASE_URL, LIMS_URL } from '@env';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { pick, types, isCancel } from '@react-native-documents/picker'
import colors from '../../../colors'
import { StudentContext } from '../../../context/StudentContext'

const ApplyDocumentsForm = () => {
    const { data } = useContext(StudentContext)
    const [certificateType, setCertificateType] = useState('')
    const [eachCertificateData, setEachCertificateData] = useState([])
    const [documentRequestFor, setDocumentRequestFor] = useState('')
    const [showSem, setShowSem] = useState(false)
    const [showSemTab, setShowSemTab] = useState(false)
    const [semSelected, setSemSelected] = useState(0)
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [selectedSemesters, setSelectedSemesters] = useState([]);
    const [selected, setSelected] = useState('');
    const [countrySelect, setCountryselect] = useState('')
    const [selectCountryTab, setSelectCountryTab] = useState(false)
    const [counrtyAddress, setCounrtyAddress] = useState(false)
    const [internationalAddress, setInternationalAddress] = useState(false)
    const [country, setCountry] = useState('')
    const [countryName, setCountryName] = useState('')
    const [stateName, setStateName] = useState('')
    const [stateList, setStateList] = useState('')
    const [cityList, setCityList] = useState('')
    const [cityName, setCityName] = useState('')
    const [pin, setPin] = useState('')
    const [addressLine, setAddressLine] = useState('')

    const [charges, setCharges] = useState(0)

    const [selectFile, setSelectFile] = useState(false)
    const [isloading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(false)

    const { height, width } = Dimensions.get('window')

    const numberOfSemesters = [
        { "key": 1, "value": "One" },
        { "key": 2, "value": "Two" },
        { "key": 3, "value": "Three" },
        { "key": 4, "value": "Four" },
        { "key": 5, "value": "Five" },
        { "key": 6, "value": "Six" },
        { "key": 7, "value": "Seven" },
        { "key": 8, "value": "Eight" },
        { "key": 9, "value": "Nine" },
        { "key": 10, "value": "Ten" },
        { "key": 11, "value": "Eleven" },
        { "key": 12, "value": "Twelve" }
    ]

    const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8', 'Sem 9', 'Sem 10', 'Sem 11', 'Sem 12'];

    const navigation = useNavigation();

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

        // console.log("selectedCountry :: ", selectedCountry);

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
                console.log('meter data :: ', error);
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
        // console.log("selectedCountry :: ", selectedCountry);

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
                console.log('meter data :: ', error);
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
    const docsBind = async () => {

        setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const authorities = await fetch(BASE_URL + '/Student/allApplyDocuments', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                })
                const certificatesData = await authorities.json()
                // console.log(certificatesData['data']);
                setIsLoading(false)
                let certificates = certificatesData['data'].map((item) => {
                    return { key: item['ID'], value: item['DocumentName'] }
                })
                setCertificateType(certificates)
                setSemSelected(0)
            } catch (error) {
                console.log('Error fetching docsBind data:Login:', error);
                setIsLoading(false)
                errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something Went wrong.`)
            }
        }
    }
    useEffect(() => {
        docsBind();
    }, [])

    const selectDocRequired = async (val) => {
        setIsLoading(true)
        const session = await EncryptedStorage.getItem("user_session")
        if (session != null) {
            try {
                const authorities = await fetch(BASE_URL + '/Student/requiredDocs/' + val, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                })
                const certificateData = await authorities.json()
                setEachCertificateData(certificateData['data'])
                // console.log(certificateData['data']);
                certificateData['data'][0]['Type'] == 1 ? setShowSem(true) : setShowSem(false)
                certificateData['data'][0]['Type'] == 2 ? setShowSemTab(true) : setShowSemTab(false)
                setDocumentRequestFor(val)
                setSemSelected(0)
                setIsLoading(false)
            } catch (error) {
                console.log('Error fetching selectDocRequired data:Login:', error);
                setIsLoading(false)
                errorModel(ALERT_TYPE.DANGER, "Oops!!!", `Something Went wrong.`)
                // setShowModal(true)
            }
        }
    }

    const certificateRequiredUploads = async (sem) => {
        setSemSelected(sem)
    }

    ///////////////////////////////////////// pick the files  //////////////////////////////////////////

    // const pickDocumentForSemester = useCallback(async (key) => {
    //     try {
    //         const response = await pick({
    //             presentationStyle: 'fullScreen',
    //             type: [types.pdf, types.images],
    //         });
    //         const file = response[0]
    //         if (response[0].size <= 5 * 1024 * 1024) {
    //             setUploadedFiles((prev) => ({
    //                 ...prev,
    //                 [key]: response[0],
    //             }));
    //             setSelectFile(true);

    //         console.log("uploadedFiles::",uploadedFiles);

    //         } else {
    //             submitModel(ALERT_TYPE.DANGER, "Pdf file Size", "Pdf file size should be less than 5mb");
    //         }
    //     } catch (err) {
    //         if (!DocumentPicker.isCancel(err)) {
    //             console.log(err);
    //         }
    //     }
    // }, []);

    const pickDocumentForSemester = async (key) => {
        try {
            const response = await pick({
                presentationStyle: 'fullScreen',
                type: [types.pdf, types.images],
            });

            const file = response[0];

            if (file.size <= 5 * 1024 * 1024) {
                setUploadedFiles((prev) => {
                    const updated = { ...prev, [key]: file };
                    console.log('updatedFiles::', updated);
                    return updated;
                });

                setSelectFile(true);
            } else {
                submitModel(
                    ALERT_TYPE.DANGER,
                    "File Size",
                    "File size should be less than 5 MB"
                );
            }
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.log(err);
            }
        }
    };


    const bindCharges = async () => {
        const session = await EncryptedStorage.getItem("user_session")
        let receivingType = '';
        let addressType = '';
        if (selected == 'By Hand') {
            receivingType = 0
        } else if (selected == 'Home Delivery') {
            receivingType = 1
        } else {
            receivingType = null
        }
        if (countrySelect == 'Within India') {
            addressType = 0
        } else if (countrySelect == 'Outside') {
            addressType = 1
        } else {
            addressType = null;
        }
        // console.log(documentRequestFor, receivingType, addressType);

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
                        docId: documentRequestFor,
                        receivingType: receivingType,
                        addressType: addressType,
                    })
                })
                const response = await res.json();
                setCharges(response['data'][0])
                // console.log("response:::::", response);

                return response
            } catch (error) {
                console.log('submitNewAddress bind :: ', error);
            }
        }
    }

    useEffect(() => {
        if (documentRequestFor && selected) {
            bindCharges();
        }
    }, [selected, documentRequestFor, countrySelect])

    const validateUploads = () => {
        const semesterKeys = Array.from({ length: semSelected }, (_, i) => `sem${i + 1}`);
        const certificateKeys = eachCertificateData.map(doc => doc['DocumentName'].replace(/\s+/g, ''));

        const totalExpected = semesterKeys.length + certificateKeys.length;
        const totalUploaded = Object.keys(uploadedFiles).length;

        if (totalUploaded !== totalExpected) {
            // console.log(`Please upload all documents! Required: ${totalExpected}, Uploaded: ${totalUploaded}`);
            return false;
        }
        return true;
    };


    const submitDocuments = async () => {
        if (!validateUploads()) {
            submitModel(ALERT_TYPE.WARNING, "Incomplete", "Please upload documents for all semesters.");
            return;
        }

        const formData = new FormData();

        // Append uploaded files
        Object.entries(uploadedFiles).forEach(([semester, file]) => {
            formData.append('docs', {
                uri: file.uri,
                type: file.type,
                name: `${semester}_${file.name}`,
            });
        });

        // Append form fields
        formData.append('applyFor', documentRequestFor);
        formData.append('deliveryMode', selected);
        formData.append('full_address', addressLine);
        formData.append('district', cityName);
        formData.append('state', stateName);
        formData.append('country', countryName || 'India');
        formData.append('pin', pin);
        formData.append('postType', countrySelect);
        formData.append('amount', 0);
        formData.append('requestedDocuments', certificateType.map(c => c.value).join(','));


        // Append selected semesters as JSON
        formData.append('semArray', JSON.stringify(selectedSemesters));


        setIsLoading(true);
        try {
            const session = await EncryptedStorage.getItem("user_session");

            if (session == null) throw new Error("Session not found");
            // const url = `${BASE_URL}/Student/uploadRequiredDocs`;
            const url = BASE_URL + '/Student/uploadRequiredDocs'
            console.log(url);
            console.log("formData::::", formData);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${session}`
                },
                body: formData,
            })
            const res = await response.json()
            console.log(res["flag"]);
            if (res['flag'] == 2) {
                errorModel(ALERT_TYPE.WARNING, "Please Check", res['message']);
            }
            else if (res['flag'] == 1) {
                errorModel(ALERT_TYPE.SUCCESS, "Success", res['message']);
            } else {
                submitModel(ALERT_TYPE.DANGER, "Error", res.data.message || "Upload failed.");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            submitModel(ALERT_TYPE.DANGER, "Error", "Something went wrong.");
        }
    };


    const toggleSemester = (sem) => {
        setSelectedSemesters((prev) =>
            prev.includes(sem) ? prev.filter((s) => s !== sem) : [...prev, sem]
        );
    };

    const handleSelect = (option) => {
        setSelected(option);
        if (option == 'Home Delivery') {
            setSelectCountryTab(true)
        } else {
            setInternationalAddress(false);
            setCounrtyAddress(false)
        }
    };
    const handleCountryTab = (val) => {
        setCountryselect(val)
        if (val == 'Within India') {
            setCounrtyAddress(true)
            setInternationalAddress(false);
            // setCountry({ "key": 101, "value": "India" })
            stateBind(101)
        } else {
            bindCountries()
            setInternationalAddress(true);
            setCounrtyAddress(false)
        }
    }

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
            <View style={{ flex: 1 }}>
                <ScrollView keyboardShouldPersistTaps={'handled'}>
                    <View style={[styles.innerContainer, { height: '100%' }]}>
                        <View style={[styles.eachInput]}>
                            <Text style={styles.txtStyle}>Apply For <Text style={{ color: 'red' }}>*</Text></Text>
                            <SelectList boxStyles={{ padding: 10, width: "100%" }}
                                setSelected={(val) => selectDocRequired(val)}
                                fontFamily='time'
                                data={certificateType}
                                arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                search={false}
                                defaultOption={{ key: '0', value: 'Select' }}
                                inputStyles={{ color: 'black' }}
                                dropdownTextStyles={{ color: 'black' }}
                            />
                        </View>
                        {
                            showSem &&
                            <View style={[styles.eachInput]}>
                                <Text style={styles.txtStyle}>Select Number of Semesters <Text style={{ color: 'red' }}>*</Text></Text>
                                <SelectList boxStyles={{ padding: 10, width: "100%" }}
                                    setSelected={(val) => certificateRequiredUploads(val)}
                                    fontFamily='time'
                                    data={numberOfSemesters}
                                    arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                    search={false}
                                    defaultOption={{ key: '0', value: 'Select' }}
                                    inputStyles={{ color: 'black' }}
                                    dropdownTextStyles={{ color: 'black' }}
                                />
                            </View>
                        }
                        {semSelected > 0 && (
                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ marginBottom: 10, fontWeight: '600' }}>Upload Documents for each Semester</Text>
                                {Array.from({ length: semSelected }, (_, i) => i + 1).map((sem) => {
                                    const key = `sem${sem}`
                                    return (
                                        <TouchableOpacity
                                            key={key}
                                            style={{
                                                backgroundColor: uploadedFiles[key] ? 'green' : colors.uniRed,
                                                padding: 12,
                                                marginVertical: 5,
                                                borderRadius: 8,
                                                alignItems: 'center',
                                            }}
                                            onPress={() => pickDocumentForSemester(key)}
                                        >
                                            <Text style={{ color: '#fff' }}>
                                                {uploadedFiles[key] ? `Uploaded Semester ${sem} ✓` : `Upload DMC of Semester ${sem}`}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        )}
                        <View>
                            {
                                eachCertificateData.length > 0 &&
                                eachCertificateData.map((doc, i) => {
                                    const key = `${doc['DocumentName']}`
                                    return (
                                        <TouchableOpacity
                                            style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 8, backgroundColor: uploadedFiles[key] ? 'green' : colors.uniRed, borderRadius: 10, width: '100%' }}
                                            onPress={() => pickDocumentForSemester(key)} key={key}
                                        >
                                            <Text style={{ color: '#fff', padding: 10 }}>
                                                {uploadedFiles[key] ? `${doc['DocumentName']} Uploaded ✓` : `Upload ${doc['DocumentName']} Certificate`}
                                            </Text>
                                        </TouchableOpacity>

                                    )
                                })
                            }
                            <Text style={{ color: 'red', fontSize: 12 }}>Select files below 5mb only *</Text>
                        </View>
                        {
                            showSemTab &&
                            <View style={{ backgroundColor: 'white' }}>
                                <Text style={styles.title}>Select Semesters for DMC:</Text>
                                <View style={styles.tabs}>
                                    {semesters.map((sem) => (
                                        <TouchableOpacity
                                            key={sem}
                                            style={[styles.tab, selectedSemesters.includes(sem) && styles.activeTab]}
                                            onPress={() => toggleSemester(sem)}
                                        >
                                            <Text style={styles.tabText}>{sem}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                            </View>
                        }
                        <View style={{ marginTop: 16 }}>
                            <Text style={styles.title}> How would you like to receive your degree?</Text>
                            <View style={{ backgroundColor: 'white', flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={[styles.button, selected === 'By Hand' && styles.activeTab]}
                                    onPress={() => handleSelect('By Hand')}
                                >
                                    <Text style={styles.tabText}>Collect By Hand</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, selected === 'Home Delivery' && styles.activeTab]}
                                    onPress={() => handleSelect('Home Delivery')}
                                >
                                    <Text style={styles.tabText}>Home Delivery</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        {
                            selected == 'Home Delivery' ?
                                <View style={{ marginTop: 16 }}>
                                    {/* <Text style={styles.title}> How would you like to receive your degree?</Text> */}
                                    <View style={{ backgroundColor: 'white', flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={[styles.button, countrySelect === 'Within India' && styles.activeTab]}
                                            onPress={() => handleCountryTab('Within India')}
                                        >
                                            <Text style={styles.tabText}>Within India</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.button, countrySelect === 'Outside' && styles.activeTab]}
                                            onPress={() => handleCountryTab('Outside')}
                                        >
                                            <Text style={styles.tabText}>Outside India</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View> : null
                        }
                        {
                            counrtyAddress ?
                                <View style={{ marginTop: 16 }}>
                                    <Text style={{ fontSize: 16, color: '#1b1b1b' }}>Please Fill Address Form International:</Text>
                                    <View style={{ flexDirection: 'row', columnGap: 16 }}>
                                        <View style={{ width: '75%', marginTop: 8 }}>
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
                                </View> : null
                        }
                        {
                            internationalAddress ?
                                <View style={{ marginTop: 16 }}>
                                    <Text style={{ fontSize: 16, color: '#1b1b1b' }}>Please Fill Address Form International:</Text>
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
                                </View> : null
                        }
                        <View style={{ marginTop: 16 }}>
                            <Text style={[styles.boldText, { borderBottomWidth: 1, width: '40%' }]}>Charges Details :</Text>
                            <View>
                                <View style={{ margin: 8, marginBottom: 2, flexDirection: 'row' }}>
                                    <Text style={[styles.boldText]}>Document Charges : - </Text>
                                    <Text style={[styles.normalText]}>{charges['Fee']}</Text>
                                </View>
                                <View style={{ margin: 8, marginBottom: 2, flexDirection: 'row' }}>
                                    <Text style={[styles.boldText]}>Postal Charges : - </Text>
                                    <Text style={[styles.normalText]}>{charges['OtherCharges']}</Text>
                                </View>
                                <View style={{ margin: 8, marginBottom: 2, flexDirection: 'row' }}>
                                    <Text style={[styles.boldText]}>Document Charges : - </Text>
                                    <Text style={[styles.normalText]}>{charges['PostalCharges']}</Text>
                                </View>
                                <View style={{ margin: 8, marginBottom: 2, flexDirection: 'row' }}>
                                    <Text style={[styles.boldText]}>Total Charges : - </Text>
                                    <Text style={[styles.normalText]}>{charges['Fee'] + charges['OtherCharges'] + charges['PostalCharges'] || ''}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.eachInput]}>
                            {documentRequestFor != '' ?

                                <TouchableOpacity style={[styles.btn, { width: '100%' }]} onPress={() => submitDocuments()}>
                                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Apply Document</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity style={[styles.btn, { width: '100%', opacity: 0.7 }]} disabled>
                                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Apply Document</Text>
                                </TouchableOpacity>

                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
        </AlertNotificationRoot>
    )
}

export default ApplyDocumentsForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: '#f1f1f1',

    },
    innerContainer: {
        backgroundColor: 'white',
        marginTop: 24,
        elevation: 2,
        // borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 16
    },
    eachInput: {
        marginTop: 16,
        rowGap: 3
    },
    inputBox: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginTop: 4,
        height: 45,
        color: '#1b1b1b',
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
    title: {
        fontSize: 16,
        marginBottom: 10
    },
    tabs: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tab: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 24,
        margin: 5,
        borderColor: '#ccc',
        backgroundColor: 'grey'
    },
    button: {
        paddingVertical: 10,
        borderRadius: 12,
        margin: 5,
        borderColor: '#ccc',
        backgroundColor: 'grey',
        paddingHorizontal: 24
    },
    activeTab: {
        backgroundColor: 'green',
    },
    tabText: {
        fontSize: 14,
        color: 'white'
    },
    normalText: {
        color: '#1b1b1b',
        fontSize: 14
    },
    boldText: {
        color: '#1b1b1b',
        fontSize: 14,
        fontWeight: '600'
    }

})