import {useContext, useState, useCallback, useEffect} from 'react';
import { RefreshControl, Dimensions, ScrollView, StyleSheet, Text, View, Image, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL, IMAGE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { StudentContext } from '../../context/StudentContext';

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const ImageUrl = IMAGE_URL;

const ViewLeave = () => {
  const navigation = useNavigation()
  const { staffImage } = useContext(StudentContext);
  const [refreshing, setRefreshing] = useState(false);
  const [getScheduleTime, setScheduleTime] = useState(false);
  const [getLeaveID, setLeaveID] = useState(null);
  const [getLeaveDataModal, setLeaveDataInModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [getLeaveDurationCount, setLeaveDurationCount] = useState(false);
  const [getStatusTextColor, setStatusTextColor] = useState(null);
  const route = useRoute();
  const leaveID = route.params.leaveID;
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getLeaveDataInPage();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  useEffect(() => {
    getLeaveDataInPage();
  }, [])
  const getLeaveDataInPage = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    try {
      setIsLoading(true);
      const PendingDetailsForModal = await fetch(`${BASE_URL}/staff/leaves/${leaveID}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leaveid: leaveID
        }),
      });
      const staffPendingForModalDetails = await PendingDetailsForModal.json();
      console.log(staffPendingForModalDetails['data1'][0]['FilePath']);
      
      setLeaveDataInModal(staffPendingForModalDetails.data1);
      if(staffPendingForModalDetails['data1'][0]['DurationTime']!=0)
        {
          setLeaveDurationCount(staffPendingForModalDetails['data1'][0]['DurationTime']);
        }
        else{
          setLeaveDurationCount(staffPendingForModalDetails['data1'][0]['Duration']);
        }
        if(staffPendingForModalDetails['data1'][0]['LeaveSchoduleTime']=='1')
          {

            setScheduleTime('(First Half)')
          }
          else if(staffPendingForModalDetails['data1'][0]['LeaveSchoduleTime']=='2'){
            setScheduleTime('(Second Half)')

          }else{
            setScheduleTime('')
          }
          
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error('Error fetching data for leave ID', ':', error);
        }
      };
      console.log("IMAGE:::::::::::",IMAGE_URL+staffImage);

// console.log(getLeaveDataModal[0]['Status'])
  
// if(getLeaveDataModal[0]['Status']=='Pending to Sanction' && )
//   {
//     setStatusTextColor('yellow')
//   }
//   else if(getLeaveDataModal[0]['Status']=='Reject')
//     {
//       setStatusTextColor('red')
//     }
//     else if(getLeaveDataModal[0]['Status']=='Approved')
//     {
//       setStatusTextColor('green')
//     }
//     else{
      
//       setStatusTextColor('black')
//     }
// )





  // const getEmployeeDetails = async (empid) => {
  //   const session = await EncryptedStorage.getItem("user_session");
  //   try {
  //     setIsLoading(true);
  //     const getEmployeeDetailsResponse = await fetch(`${BASE_URL}/staff/leaves/${empid}`, {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${session}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         eid: empid
  //       }),
  //     });
  //     const employeeDetails = await getEmployeeDetailsResponse.json();
  //     // console.log()
  //     // setStaffName(employeeDetails);
  //     setIsLoading(false);
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.error('Error fetching data for leave ID', ':', error);
  //   }
  // };

// return getEmployeeDetails('131053');

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
        {getLeaveDataModal && (
          <>
            <ScrollView>
    
              <View style={styles.sectionBody}>
              <View style={styles.profile}>
                      <View style={{width:screenWidth/5}}>
                        <Image alt="" source={{ uri: `${ImageUrl}Images/Staff/${staffImage}` }} style={styles.profileAvatar} /></View>
                      <View style={{width:screenWidth/1}}>
                      <Text style={styles.profileName}>{getLeaveDataModal[0]['StaffName'].trim()}</Text>
                      <Text style={styles.profileEmail}>Employee ID: {getLeaveDataModal[0]['IDNo']}</Text>
                      <Text style={styles.profileEmail}>{getLeaveDataModal[0]['Designation']}</Text>
                      <Text style={styles.profileEmail}>{getLeaveDataModal[0]['Department']}</Text>
                      </View>
                    </View>
                <View style={styles.rowSpacer} />
                <View style={styles.rowWrapper}>
                  {/* <TouchableOpacity> */}
                    
                  {/* </TouchableOpacity> */}
                  <Pressable
                    style={styles.row}>
                    <View
                      style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                      <MaterialCommunityIcons
                        color="#fff"
                        name="chevron-double-right"
                        size={10} />
                    </View>
                    {/* <Text style={styles.modalText}>Leave ID: {getLeaveID}</Text> */}
                    <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Leave Type:</Text>  {getLeaveDataModal[0]['LeaveTypeName']} </Text>
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
                    <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Start Date:</Text> {getLeaveDataModal[0]['StartDate'].split("T")[0].split("-").reverse().join("/")} </Text>
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
                    <Text style={styles.textLabel}><Text style={styles.textLabelInder}>End Date:</Text> {getLeaveDataModal[0]['EndDate'].split("T")[0].split("-").reverse().join("/")} </Text>
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
                    <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Submit Date:</Text>  {getLeaveDataModal[0]['SubmitDate'].split("T")[0].split("-").reverse().join("/")} </Text>
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
                    <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Duration:</Text>  {getLeaveDurationCount+getScheduleTime} </Text>
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
                    {/* <Text style={styles.textLabel}> */}
                      <Text style={styles.textLabelInder} >Adjustment File:</Text>
                      <View style={styles.bottomBtn}>
              <Pressable style={styles.btn} onPress={() => {
                          navigation.navigate('ViewLeaveFile', { FilePAth: getLeaveDataModal[0]['FilePath'] })
                        }}>
                <Text style={styles.btnTxt}>View File</Text>
              </Pressable>
            
            </View>
                      {/* <Pressable style={[ { backgroundColor: '#223260',marginLeft:100,width:100 }]} onPress={() => {
                          navigation.navigate('ViewLeaveFile', { FilePAth: getLeaveDataModal[0]['FilePath'] })
                        }}>
                          <Text>View</Text> */}
                        {/* <MaterialCommunityIcons
                          color="#fff"
                          name="eye"
                          size={10} /> */}
                      {/* </Pressable> */}
                    {/* </Text> */}
                    <View style={styles.rowSpacer} />
                  </Pressable>
                </View>


                <View style={[styles.rowWrapper, {paddingRight:16}]}>
                  <Pressable
                    style={styles.row}>
                    <View
                      style={[styles.rowIcon, { backgroundColor: '#223260' }]}>
                      <MaterialCommunityIcons
                        color="#fff"
                        name="chevron-double-right"
                        size={10} />
                    </View>
                    <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Reason: </Text>  {getLeaveDataModal[0]['LeaveReason']} </Text>
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
                    <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Recommended Authority : </Text>  {getLeaveDataModal[0]['LeaveRecommendingAuthority']} </Text>
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
                    <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Sanction Authority  :</Text>   {getLeaveDataModal[0]['LeaveSanctionAuthority']} </Text>
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
                    <Text style={styles.textLabel}><Text style={styles.textLabelInder}>Status  : </Text><Text style={{color: getLeaveDataModal[0]['Status'] === 'Pending To Senction' ? 'red' : 'green', fontWeight: '800'}}>  {getLeaveDataModal[0]['Status']}</Text> </Text>
                    <View style={styles.rowSpacer} />
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
export default ViewLeave

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
    flexDirection:'row',
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
    marginLeft:12,
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
    marginLeft:12,
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
    borderRadius:10
  },
  btnTxt: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15

  },
  btn: {

    width:100,
    backgroundColor: '#223260',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft:100
  },
});
