import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import Spinner from 'react-native-loading-spinner-overlay';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentDate = new Date();
  const d = new Date();
  const CurrentMonth = d.getMonth() +1;
// console.log(CurrentMonth)
  const CurrentYear = d.getFullYear();
const Calendar = () => {
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  useEffect(() => {
    getCalenderPunch();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getCalenderPunch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getCalenderPunch = async () => {
    const session = await EncryptedStorage.getItem("user_session");
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/staff/calendar/${CurrentMonth}/${CurrentYear}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Month: CurrentMonth,
          Year: CurrentYear
        }),
      });
      const result = await response.json();
      // console.log("daily data ",result.dailydata);
      const attendanceData = transformAttendanceData(result.dailydata);
      setAttendance(attendanceData);
      // console.log("attendance :: ",attendanceData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching data for leave ID', ':', error);
    }
  };

const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const transformAttendanceData = (data) => {
    const transformedData = {};
    data.forEach(item => {
      const [year, month, day] = item.start.split('-');
      transformedData[`${year}-${month}-${day}`] = {
        inTime: item.myin,
        outTime: item.myout,
        holiday: item.holiday,
        leave: item.leaveName,
      };
    });
    return transformedData;
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<View key={`empty-${i}`} style={styles.day} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = CurrentYear+`${CurrentMonth > 9 ? '-' : '-0'}`+CurrentMonth+`-${String(day).padStart(2, '0')}`;
      // console.log(typeof(CurrentMonth));
      
      const dayAttendance = attendance[dateKey] || {};
      calendarDays.push(
        <TouchableOpacity key={day} style={styles.day}>
        <Text style={styles.dayText}>{day}</Text>
        {(dayAttendance.inTime!='---' || dayAttendance.outTime!='---') ? (
          <>
            {dayAttendance.inTime && (
              <Text style={{ fontSize: 12, color: dayAttendance.inTime === '---' ? 'red' : 'green', fontWeight: '800' }}>
                {dayAttendance.inTime}
              </Text>
            )}
            {dayAttendance.outTime && (
              <Text style={{ fontSize: 12, color: dayAttendance.outTime === '---' ? 'red' : 'green', fontWeight: '800' }}>
                {dayAttendance.outTime}
              </Text>
            )}
          </>
        ) : null}
        {dayAttendance.leave && (
          <Text style={{ fontSize: 10, color: dayAttendance.leave === '' ? 'red' : '#007bff', fontWeight: '800' }}>
            {dayAttendance.leave}
          </Text>
        )}
        {dayAttendance.holiday && (
          <Text style={{ fontSize: 10, color: dayAttendance.holiday === 'Week Off' ? '#525358' : '#ffc107', fontWeight: '800' }}>
            {dayAttendance.holiday}
          </Text>
        )}
      </TouchableOpacity>
      
      );
    }

    return <View style={styles.days}>{calendarDays}</View>;
  };

  const renderHeader = () => {
    return (
      <ScrollView>
        {isLoading && 
         <Spinner
         visible={isLoading}
         // textContent='loading...'
         />
         }
       
        <Text style={{alignSelf:'center',fontSize:20,fontWeight:'800',padding:10,color:'#a62535'}}>{monthName+' '+currentDate.getFullYear()}</Text>
      <View style={styles.header}>
        
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.headerText}>
            {day}
          </Text>
        ))}
      </View>
      </ScrollView>
    );
  };


  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <View style={styles.container}>
        {renderHeader()}
        {renderDays()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,backgroundColor:'#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#223260'
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.2857%', 
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dayText: {
    fontSize: 16,
    color: 'black',
    fontWeight:'700'
  },
  timeText: {
    fontSize: 10,
    color: 'black',
    fontWeight:'700'
  },
});

export default Calendar;
