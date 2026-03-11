import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Dimensions, Alert, TextInput } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import colors from '../../colors';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { BASE_URL, LIMS_URL } from '@env';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import axios from 'axios';
import { StudentContext } from '../../context/StudentContext';

const screenWidth = Dimensions.get('window').width

const LaunchCompaint = () => {
    const { StaffIDNo } = useContext(StudentContext);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [categoriesList, setCategoriesList] = useState([])
    const [buildingList, setBuildingList] = useState([])
    const [floorsList, setFloorsList] = useState([])
    const [roomNoList, setRoomNoList] = useState([])
    const [roomTypeList, setRoomTypeList] = useState([])
    const [selectedBuilding, setSelectedBuilding] = useState('')

    const [selectedCategoryValue, setSelectedCategoryValue] = useState('')
    const [selectedBuildingValue, setSelectedBuildingValue] = useState('')
    const [selectedFloorValue, setSelectedFloorValue] = useState('')
    const [selectedRoomNoValue, setSelectedRoomNoValue] = useState('')
    const [selectedRoomNameValue, setSelectedRoomNameValue] = useState('')
    const [locationId, setLocationId] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')


    const [isloading, setIsLoading] = useState(false)
    const [isloadingNew, setIsLoadingNew] = useState(false)
    const [refreshing, setRefreshing] = useState(false);


    const navigation = useNavigation()
    const dummy = [
        { key: '1', value: 'one' },
        { key: '2', value: 'two' },
        { key: '3', value: 'three' }
    ]

    const bindCategories = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/categories`)
            const categoriesData = response.data;
            setCategoriesList(categoriesData.map((item) => (
                { key: item.ID, value: item.CategoryName }
            )))
            // console.log(categoriesData);
            // console.log("bindCategories");
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }
    const bindBuilding = async (val) => {
        const category = categoriesList.find(item => item.key === val);
        setSelectedCategoryValue(category.value)
        console.log("category:", category);

        setSelectedCategory(category.key)

        try {
            const response = await axios.post(`${LIMS_URL}/complain/buildings`)
            const buildingsData = response.data;
            setBuildingList(buildingsData.map((item) => (
                { key: item.ID, value: item["Name"] }
            )))
            // console.log(buildingsData);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        bindCategories()
        bindBuilding()
    }, [])


    const bindFloor = async (val) => {
        const building = buildingList.find(item => item.key === val);
        setSelectedBuildingValue(building.value)
        setSelectedBuilding(building.key)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/floors/${val}`)
            const floorsData = response.data;
            console.log("floorsData::", floorsData);


            const floorLabels = {
                "-2": "Basement (-2)",
                "-1": "Basement (-1)",
                "0": "Ground (0)",
                "1": "First (1)",
                "2": "Second (2)",
                "3": "Third (3)",
                "4": "Fourth (4)",
                "5": "Fifth (5)",
                "6": "Sixth (6)",
            };
            setFloorsList(floorsData.map((item) => {
                const floor = String(item["Floor"]); // ensure it's a string
                return {
                    key: floor,
                    value: floorLabels[floor] || `Floor ${floor}`, // fallback
                };
            }))
        } catch (error) {
            console.log("bindFloor::", error);
        }
    }

    const bindRoomNo = async (val) => {
        const floor = floorsList.find(item => item.key === val);
        setSelectedFloorValue(floor.value)
        // console.log("floor.value",floor.value);

        try {
            console.log(`${LIMS_URL}/complain/allrooms/${selectedBuilding}/${val}`);

            const response = await axios.post(`${LIMS_URL}/complain/allrooms/${selectedBuilding}/${val}`)
            const roomsData = response.data;
            setRoomNoList(roomsData.map((item) => (
                { key: item["RoomNo"], value: item["RoomNo"] }
            )))
            // setRoomTypeList(roomsData.map((item)=>(
            //     {key:item.ID, value:item["RoomType"]}
            // )))
            console.log(roomsData);
        } catch (error) {
            console.log("bindFloor::", error);
        }
    }

    const bindRoomType = async (val) => {
        const roomNo = roomNoList.find(item => item.key === val);
        setSelectedRoomNoValue(roomNo.value)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/roomType/${selectedBuilding}/${val}`)
            const roomsData = response.data;
            setRoomTypeList(roomsData.map((item) => (
                { key: item.ID, value: item["RoomType"] }
            )))
            console.log(roomsData);
        } catch (error) {
            console.log("bindFloor::", error);
        }
    }

    const selectedRoomName = async (val) => {
        const roomName = roomTypeList.find(item => item.key === val)
        setSelectedRoomNameValue(roomName.value)
        setLocationId(roomName.key)
    }

    const submitButton = async () => {
        // setIsLoading(true)
        console.log(
            "title :", title,
            "description :", description,
            "selectedBuildingValue :", selectedBuildingValue,
            "selectedCategoryValue :", selectedCategoryValue,
            "selectedFloorValue :", selectedFloorValue,
            "selectedRoomNoValue :", selectedRoomNoValue,
            "selectedRoomNameValue :", selectedRoomNameValue
        );

        try {
            const response = await axios.post(`${LIMS_URL}/complain/launchComplain`, {
                title, description, selectedCategory, locationId, StaffIDNo
            })
            const insertData = response.data;
            console.log(insertData);
            if (insertData.affectedRows > 0) {
                newModel(ALERT_TYPE.SUCCESS, "Success", `Complaint Registered Successfully.`)
            }
            setIsLoading(false)
        } catch (error) {
            newModel(ALERT_TYPE.DANGER, "Oops !!!", `Something went wrong`)
            console.log("submitButton::", error);
            setIsLoading(false)
        }
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const newModel = (type, title, message) => {
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
            <ScrollView
            >
                {
                    isloading ? <ActivityIndicator /> :
                        <View style={styles.formContainer}>
                            <View style={styles.formSelectors}>
                                {/* Inputs */}
                                <View style={{ alignSelf: 'flex-start' }}>
                                    <Text style={{ color: '#1b1b1b', marginTop: 10 }}>Title<Text style={{ color: 'red' }}>*</Text></Text>
                                    <View style={styles.loginInput}>
                                        <TextInput
                                            style={styles.inputBox}
                                            placeholder='Enter Title of Complaint'
                                            onChange={e => setTitle(e.nativeEvent.text)}
                                            placeholderTextColor={'#666666'}
                                        />
                                    </View>
                                </View>
                                <View style={{ alignSelf: 'flex-start' }}>
                                    <Text style={{ color: '#1b1b1b', marginTop: 10 }}>Description<Text style={{ color: 'red' }}>*</Text></Text>
                                    <View style={styles.loginInput}>
                                        <TextInput
                                            style={[styles.inputBox, { textAlignVertical: 'top', height: 80 }]}
                                            placeholder='Enter Description'
                                            onChange={e => setDescription(e.nativeEvent.text)}
                                            placeholderTextColor={'#666666'}
                                            multiline={true}
                                        />
                                    </View>
                                </View>

                                {/* lists */}
                                <View style={{ alignSelf: 'flex-start' }}>
                                    <Text style={styles.label}>Select Category</Text>
                                    <SelectList boxStyles={{ padding: -5, width: '100%' }}
                                        setSelected={(val) => bindBuilding(val)}
                                        fontFamily='time'
                                        data={categoriesList}
                                        arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                        search={false}
                                        defaultOption={{ key: '0', value: 'Select' }}
                                        inputStyles={{ color: 'black' }}
                                        dropdownTextStyles={{ color: 'black' }}
                                    />
                                </View>
                                <View style={{ alignSelf: 'flex-start' }}>
                                    <Text style={[styles.label]}>Select Building</Text>
                                    <SelectList boxStyles={{ padding: -5, width: '100%' }}
                                        setSelected={(val) => bindFloor(val)}
                                        fontFamily='time'
                                        data={buildingList}
                                        arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                        search={false}
                                        defaultOption={{ key: '0', value: 'Select' }}
                                        inputStyles={{ color: 'black' }}
                                        dropdownTextStyles={{ color: 'black' }}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ alignSelf: 'flex-start', width: '50%' }}>
                                        <Text style={[styles.label]}>Select Floor</Text>
                                        <SelectList boxStyles={{ padding: -5, width: '90%' }}
                                            setSelected={(val) => bindRoomNo(val)}
                                            fontFamily='time'
                                            data={floorsList}
                                            arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                            search={false}
                                            defaultOption={{ key: '-99', value: 'Select' }}
                                            inputStyles={{ color: 'black' }}
                                            dropdownTextStyles={{ color: 'black' }}
                                        />
                                    </View>
                                    <View style={{ alignSelf: 'flex-start', width: '50%' }}>
                                        <Text style={[styles.label]}>Select Room No.</Text>
                                        <SelectList boxStyles={{ padding: -5, width: '100%' }}
                                            setSelected={(val) => bindRoomType(val)}
                                            fontFamily='time'
                                            data={roomNoList}
                                            arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                            search={false}
                                            defaultOption={{ key: '0', value: 'Select' }}
                                            inputStyles={{ color: 'black' }}
                                            dropdownTextStyles={{ color: 'black' }}
                                        />
                                    </View>
                                </View>
                                <View style={{ alignSelf: 'flex-start' }}>
                                    <Text style={[styles.label]}>Select Room type</Text>
                                    <SelectList boxStyles={{ padding: -5, width: '100%' }}
                                        setSelected={(val) => selectedRoomName(val)}
                                        fontFamily='time'
                                        data={roomTypeList}
                                        arrowicon={<FontAwesome5Icon name="chevron-down" size={12} color={'black'} style={{ marginTop: 4, marginLeft: 16 }} />}
                                        search={false}
                                        defaultOption={{ key: '0', value: 'Select' }}
                                        inputStyles={{ color: 'black' }}
                                        dropdownTextStyles={{ color: 'black' }}
                                    />
                                </View>
                                {title != '' && description != '' && selectedCategory != 0 && selectedBuilding != 0 && selectedRoomNameValue != '' ?
                                    <TouchableOpacity
                                        style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16, width: '50%' }]}
                                        onPress={() => submitButton()}>
                                        <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Submit</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={[{ backgroundColor: colors.uniBlue, paddingVertical: 8, borderRadius: 8, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 16, width: '50%', opacity: .7 }]}>
                                        <View style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>Submit</Text>
                                        </View>
                                    </TouchableOpacity>
                                }

                            </View>
                        </View>
                }
            </ScrollView>
        </AlertNotificationRoot>
    )
}

export default LaunchCompaint

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        padding: 16,
        width: '100%',
        elevation: 2,
    },
    formSelectors: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
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