import { StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native'

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const CheckMovements = () => {

    const navigation = useNavigation()
    const [employeeId, setEmployeeId] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

    const getDate = (date) => {
        if (!date) return '';
        let tempDate = date.toString().split(' ');
        return `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`;
        
      };

    const startdatehandleConfirm = (date) => {
        setStartDate(date);
        setStartDatePickerVisibility(false);
      };
    
      const enddatehandleConfirm = (date) => {
        setEndDate(date);
        setEndDatePickerVisibility(false);
      };
    
      const showDatePicker = () => {
        setStartDatePickerVisibility(true);
      };
    
      const showEndDatePicker = () => {
        setEndDatePickerVisibility(true);
      };

    return (
        <View style={{ flex: 1 }}>
            <View style={[styles.container]}>
                <View style={[styles.innerContainer]}>
                    {/* Date time pickers */}

                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <View style={{ backgroundColor: 'white' }}>
                            <Text style={styles.smallTxt}>Start Date</Text>
                            <View style={styles.rowSpacer} />
                            <TouchableOpacity onPress={()=> showDatePicker()}>
                                <TextInput
                                    style={[styles.inputBox, {width: screenWidth/2.8}]}
                                    value={getDate(startDate)}
                                    placeholder="Date..."
                                    editable={false}
                                    inputStyles={{ color: 'black' }}
                                    placeholderTextColor="#000"
                                />
                            </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                            isVisible={isStartDatePickerVisible}
                            mode="date"
                            onConfirm={startdatehandleConfirm}
                            onCancel={() => setStartDatePickerVisibility(false)}
                        />
                        <View style={styles.rowSpacer} />
                        <View style={{ backgroundColor: 'white' }}>
                            <Text style={styles.smallTxt}>End Date</Text>
                            <View style={styles.rowSpacer} />
                            <TouchableOpacity onPress={showEndDatePicker}>
                                <TextInput
                                    style={[styles.inputBox, {width: screenWidth/2.8}]}
                                    value={getDate(endDate)}
                                    placeholder="Date..."
                                    editable={false}
                                    placeholderTextColor="#000"
                                />
                            </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                            isVisible={isEndDatePickerVisible}
                            mode="date"
                            onConfirm={enddatehandleConfirm}
                            onCancel={() => setEndDatePickerVisibility(false)}
                        />
                    </View>
                    <View style={styles.eachInput}>
                        <Text style={styles.txtStyle}>Enter Employee Id</Text>
                        <TextInput
                            value={employeeId}
                            style={[styles.inputBox]}
                            onChangeText={setEmployeeId}
                        />
                    </View>
                    <View style={styles.eachInput}>
                        <TouchableOpacity style={styles.btn} onPress={() => {
                            navigation.pop();
                            navigation.navigate('MovementPending');
                        }
                        }>
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default CheckMovements

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
        borderRadius: 24,
        paddingHorizontal: 40,
        paddingVertical: 16
    },
    eachInput: {
        marginTop: 16,
        rowGap: 4
    },
    inputBox: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginTop: 8,
        color: 'black',
        backgroundColor: '#fffafa'
    },
    dateBox:{
        
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
    smallTxt: {
        color: 'black',
        fontSize: 12,
    },
})