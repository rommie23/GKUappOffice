/////////////////////////// REFFER TSSK SCREEN //////////////////////////////////

import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BASE_URL, LIMS_URL } from '@env';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import colors from '../../colors';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import axios from 'axios';
import {convertUTCToIST} from '../../services/dateUTCToIST'
import { useNavigation } from '@react-navigation/native';
import useConfirm from '../../customhooks/useConfirm';
import { SelectList } from 'react-native-dropdown-select-list';
import { StudentContext } from '../../context/StudentContext';


const screenWidth = Dimensions.get("window").width

const RejectTaskScreen = ({ route }) => {
    const { StaffIDNo } = useContext(StudentContext);
    const [loading, setLoading] = useState(false);
    const [complainData, setComplainData] = useState([])
    const [categoriesList, setCategoriesList] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [remarks, setRemarks] = useState('')

    const { taskId } = route.params;

    const navigation = useNavigation()
    const { confirmAction } = useConfirm()

    const complains = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/eachTask`, { taskId })
            const complainsData = response.data;
            setComplainData(complainsData)
            if (complainsData.length > 0) {
                const refferList = await axios.post(`${LIMS_URL}/complain/refferCategories`, { categoryId: complainsData[0]['CategoryOfWorkId'] })
                console.log(refferList.data);
                setCategoriesList(refferList.data.map((item) => {
                    return { key: item['ID'], value: item['CategoryName'] }
                }))
            }
            // console.log("RefferTaskEach allcomplains::", complainsData);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        complains();
    }, [])

    const refferTask = async () => {
        console.log(taskId, remarks)
        setLoading(true)
        try {
            const response = await axios.post(`${LIMS_URL}/complain/referTask`, { taskId, refferedCategoryId : selectedCategory, StaffIDNo})
            const assignData = response.data;
            console.log(assignData);
            if (assignData.affectedRows > 0) {
                newModel(ALERT_TYPE.SUCCESS, "Task Reffered", "Task Rejected Successfully.")
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

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
            <View style={{ flex: 1 }}>
                <ScrollView>
                    {loading ? <ActivityIndicator /> :
                        complainData.length > 0 ?

                            <View style={styles.card}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={styles.bottomCardTop}>
                                        <FontAwesome5 name='walking' size={24} color={colors.uniBlue} />
                                        <Text style={styles.textStyle}>Complaint No. {complainData[0]['id']}</Text>
                                    </View>
                                </View>
                                <View style={styles.transaction}>
                                    <View style={{ width: '50%' }}>
                                        <Text style={[styles.textSmall]}>Complaint Date/Time</Text>
                                        <Text style={[styles.textStyle, styles.rowMiddle]}>{convertUTCToIST(complainData[0]['created_at'])}</Text>
                                    </View>
                                    <View style={{ width: '30%' }}>
                                        <Text style={[styles.textSmall]}>Category</Text>
                                        <Text style={styles.textStyle}>{complainData[0]['CategoryName']}</Text>
                                    </View>
                                </View>
                                <View style={styles.transaction}>
                                    <View style={{ width: '100%' }}>
                                        <Text style={styles.textSmall}>Location</Text>
                                        <Text style={[styles.textStyle]}>{`Block ${complainData[0]['BlockName']} Floor ${complainData[0]['Floor']}, Room No. ${complainData[0]['RoomNo']}`}</Text>
                                    </View>
                                </View>
                                <View style={[styles.transaction]}>
                                    <View style={{ width: '100%' }}>
                                        <View style={{ alignSelf: 'flex-start' }}>
                                            <Text style={{ color: '#1b1b1b', marginTop: 10 }}>Reffer To Category<Text style={{ color: 'red' }}>*</Text></Text>
                                                <SelectList
                                                    boxStyles={{ padding: 10, width: 255 }}
                                                    data={categoriesList}
                                                    setSelected={(val) => setSelectedCategory(val)}
                                                    fontFamily='time'
                                                    search={false}
                                                    defaultOption={{ key: '0', value: 'Select Category' }}
                                                    inputStyles={{ color: 'black' }}
                                                    dropdownTextStyles={{ color: 'black' }}
                                                />
                                            <Text style={{ color: 'red', fontSize: 12, paddingLeft: 8 }}>* Select Category First *</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.transaction]}>
                                    <TouchableOpacity
                                        style={[{ backgroundColor: colors.uniRed, paddingVertical: 8, borderRadius: 8, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }]}>
                                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }} onPress={() => refferTask()}>Reffer Task</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <Text style={{ color: '#aaaaaa', alignSelf: 'center' }}>No Record Found</Text>
                    }
                </ScrollView>
            </View>
        </AlertNotificationRoot>
    )
}

export default RejectTaskScreen

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 5,
        paddingHorizontal: 15,
        borderRadius: 10,
        color: '#000',
        height: 38,
        backgroundColor: 'white'
    },
    // Common CSS for every card 
    card: {
        backgroundColor: 'white',
        width: screenWidth - 24,
        marginVertical: 12,
        borderRadius: 16,
        alignSelf: 'center',
        padding: 16,
        elevation: 2
    },

    // CSS for images inside the cards
    topCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems:'center',
        paddingVertical: 12
    },
    textStyle: {
        color: '#1b1b1b',
        fontSize: 12,
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4
    },
    bottomCardTop: {
        flexDirection: 'row',
        columnGap: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textSmall: {
        color: '#4C4E52',
        fontSize: 10
    },
    inputBox: {
        height: 84,
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