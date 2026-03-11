import React from 'react';
import { RefreshControl, Dimensions, ScrollView, StyleSheet, Text, View, Image, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '@env'
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { StudentContext } from '../../context/StudentContext';
import colors from '../../../colors';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const ViewCorrectionRequest = () => {
    const navigation = useNavigation()
    const [refreshing, setRefreshing] = React.useState(false);
    const [getScheduleTime, setScheduleTime] = React.useState(false);
    const [getLeaveID, setLeaveID] = React.useState(null);
    const [getSingleAppealdata, setSingleAppealData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [getLeaveDurationCount, setLeaveDurationCount] = React.useState(false);
    const [getStatusTextColor, setStatusTextColor] = React.useState(null);
    const route = useRoute();
    const ID = route.params.ID;
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getLeaveDataInPage();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);
    React.useEffect(() => {
        getLeaveDataInPage();
    }, [])
    const getLeaveDataInPage = async () => {
        const session = await EncryptedStorage.getItem("user_session");
        try {
            setIsLoading(true);
            const singleAppealForModal = await fetch(`${BASE_URL}/Student/correctionone/${ID}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: ID
                }),
            });
            const singleApealrModalDetails = await singleAppealForModal.json();
            setSingleAppealData(singleApealrModalDetails.data);
            console.log(singleApealrModalDetails);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching data for leave ID', ':', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    return (
        <View style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
            {isLoading && <Spinner visible={isLoading} />}
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                {getSingleAppealdata && (
                    <>
                        <ScrollView>

                            <View style={styles.sectionBody}>
                                {/* <View style={styles.profile}>
                                    <View style={{ width: screenWidth / 5 }}>
                                        <Image alt="" source={{ uri: ImageUrl + StaffIDNo + ImageExtensions, }} style={styles.profileAvatar} /></View>
                                    <View style={{ width: screenWidth / 1 }}>
                                        <Text style={styles.profileName}>{getSingleAppealdata[0]['StudentName']}</Text>
                                        <Text style={styles.profileEmail}>Employee ID: {getSingleAppealdata[0]['FatherName']}</Text>
                                        <Text style={styles.profileEmail}>{getSingleAppealdata[0]['MotherName']}</Text>
                                        <Text style={styles.profileEmail}>{getSingleAppealdata[0]['MotherName']}</Text>
                                    </View>
                                   
                                </View> */}
                                <View style={styles.rowSpacer} />
                                <View style={styles.rowWrapper}>

                                    <Pressable
                                        style={styles.row}>
                                        <View
                                            style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                            <MaterialCommunityIcons
                                                color="#fff"
                                                name="chevron-double-right"
                                                size={10} />
                                        </View>

                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Name:</Text>  {getSingleAppealdata[0]['StudentName']} </Text>
                                        <View style={styles.rowSpacer} />
                                    </Pressable>
                                </View>
                                <View style={styles.rowWrapper}>
                                    <Pressable
                                        style={styles.row}>
                                        <View
                                            style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                            <MaterialCommunityIcons
                                                color="#fff"
                                                name="chevron-double-right"
                                                size={10} />
                                        </View>
                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Father Name:</Text> {getSingleAppealdata[0]['FatherName']} </Text>
                                        <View style={styles.rowSpacer} />
                                    </Pressable>
                                </View>
                                <View style={styles.rowWrapper}>
                                    <Pressable
                                        style={styles.row}>
                                        <View
                                            style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                            <MaterialCommunityIcons
                                                color="#fff"
                                                name="chevron-double-right"
                                                size={10} />
                                        </View>
                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Mother Name:</Text> {getSingleAppealdata[0]['MotherName']} </Text>
                                        <View style={styles.rowSpacer} />
                                    </Pressable>
                                </View>
                                <View style={styles.rowWrapper}>
                                    <Pressable
                                        style={styles.row}>
                                        <View
                                            style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                            <MaterialCommunityIcons
                                                color="#fff"
                                                name="chevron-double-right"
                                                size={10} />
                                        </View>
                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Gender:</Text> {getSingleAppealdata[0]['Gender']} </Text>
                                        <View style={styles.rowSpacer} />
                                    </Pressable>
                                </View>
                                <View style={styles.rowWrapper}>
                                    <Pressable
                                        style={styles.row}>
                                        <View
                                            style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                            <MaterialCommunityIcons
                                                color="#fff"
                                                name="chevron-double-right"
                                                size={10} />
                                        </View>
                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Email ID:</Text> {getSingleAppealdata[0]['EmailID']} </Text>
                                        <View style={styles.rowSpacer} />
                                    </Pressable>
                                </View>
                                <View style={styles.rowWrapper}>
                                    <Pressable
                                        style={styles.row}>
                                        <View
                                            style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                            <MaterialCommunityIcons
                                                color="#fff"
                                                name="chevron-double-right"
                                                size={10} />
                                        </View>
                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Mobile No:</Text> {getSingleAppealdata[0]['MobileNo']} </Text>
                                        <View style={styles.rowSpacer} />
                                    </Pressable>
                                </View>
                                <View style={styles.rowWrapper}>
                                    <Pressable
                                        style={styles.row}>
                                        <View
                                            style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                            <MaterialCommunityIcons
                                                color="#fff"
                                                name="chevron-double-right"
                                                size={10} />
                                        </View>
                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Address:</Text> {getSingleAppealdata[0]['Address']} </Text>
                                        <View style={styles.rowSpacer} />
                                    </Pressable>
                                </View>

                                <View style={styles.rowWrapper}>
                                    <View style={styles.row}>
                                        <View
                                            style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                            <MaterialCommunityIcons
                                                color="#fff"
                                                name="chevron-double-right"
                                                size={10} />
                                        </View>
                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Submit Date:</Text>  {formatDate(getSingleAppealdata[0]['SubmitDate'])} </Text>
                                    </View>
                                </View>

                                <View style={styles.rowWrapper}>
                                    <Pressable
                                        style={styles.row}>
                                        <View
                                            style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                            <MaterialCommunityIcons
                                                color="#fff"
                                                name="chevron-double-right"
                                                size={10} />
                                        </View>
                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Reason:</Text> {getSingleAppealdata[0]['StudentRemarks']} </Text>
                                        <View style={styles.rowSpacer} />
                                    </Pressable>
                                </View>

                                <View style={styles.rowWrapper}>
                                    <View
                                        style={styles.row}>
                                        <View
                                        style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                        <MaterialCommunityIcons
                                            color="#fff"
                                            name="chevron-double-right"
                                            size={10} />
                                        </View>
                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Status  : </Text><Text style={{color: getSingleAppealdata[0]['Status'] == '0' ? 'blue' : getSingleAppealdata[0]['Status'] == '1' ? 'green' : getSingleAppealdata[0]['Status'] == '2'?'red':''}}>{getSingleAppealdata[0]['Status'] == '0' ? 'Pending' : getSingleAppealdata[0]['Status'] == '1' ? 'Completed' : getSingleAppealdata[0]['Status'] == '2'?'Rejected':'In process'}</Text> </Text>
                                        <View style={styles.rowSpacer} />
                                    </View>
                                </View>
                                <View style={styles.rowWrapper}>
                                    <Pressable style={styles.row} onPress={()=> navigation.navigate("CorrectionRequestFileView", {fileName: getSingleAppealdata[0]['FilePath']})}>
                                        <View
                                            style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                                            <MaterialCommunityIcons
                                                color="#fff"
                                                name="chevron-double-right"
                                                size={10} />
                                        </View>
                                        <Text style={styles.textLabel}><Text style={styles.textLabelInder}>View Submitted File : </Text></Text>
                                        <MaterialCommunityIcons
                                                color={colors.uniBlue}
                                                name="eye"
                                                size={20} 
                                                style={{marginLeft:36}} />
                                    </Pressable>
                                </View>
                            </View>

                        </ScrollView>
                    </>
                )}
            </ScrollView>
        </View>
    );
};
export default ViewCorrectionRequest

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    mainTable: {
        backgroundColor: 'white',
        width: screenWidth
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    profile: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    profileAvatar: {
        width: 80,
        height: 100,
        borderRadius: 10,
    },
    profileName: {
        marginLeft: 12,
        fontSize: 20,
        fontWeight: '600',
        color: '#090909',
        flex: 1,
    },
    profileEmail: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: '400',
        color: '#848484',
        marginLeft: 12,
    },
    /** Section */
    sectionBody: {
        paddingLeft: 24,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#fff',
    },
    /** Row */
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 16,
        height: 50,
    },
    rowWrapper: {
        borderTopWidth: 1,
        borderColor: '#e3e3e3',
    },

    rowIcon: {
        width: 15,
        height: 15,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    btnCloseLeaveMOdal: {
        marginVertical: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#ff6961',
        borderRadius: 8,

    },
    textLabel: {
        color: 'black'
    }
    ,
    textLabelInder: {
        fontWeight: '600',
        color: '#223260'
    },
    bottomBtn: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderRadius: 10
    },
    btnTxt: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15

    },
    btn: {

        width: 100,
        backgroundColor: '#223260',
        alignItems: 'center',
        borderRadius: 8,
        marginLeft: 100
    },
});
