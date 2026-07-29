import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors';


const HostelWarden = ({ navigation }) => {
  const cards = [
    {
      title: 'Accept Movement',
      subtitle: 'Approve student movement requests',
      icon: 'walk',
      screen: 'StudentMovementRequests',
    },
    {
      title: 'Accept Leave',
      subtitle: 'Approve hostel leave applications',
      icon: 'clipboard-check-outline',
      screen: 'StudentLeaveRequests',
    },
    {
      title: 'Check Room',
      subtitle: 'View room & student details',
      icon: 'home-search-outline',
      screen: 'HostelRoomCheck',
    },
  ];

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Hostel Warden</Text> */}

      <View style={styles.grid}>
        {cards.map((item) => (
          <TouchableOpacity
            key={item.title}
            activeOpacity={0.85}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={item.icon}
                size={32}
                color={colors.uniBlue}
              />
            </View>

            <Text style={styles.cardTitle}>
              {item.title}
            </Text>

            <Text style={styles.cardSubtitle}>
              {item.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default HostelWarden;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    padding: 18,
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.uniBlue,
    marginVertical: 12,
    alignSelf: 'center',
  },

  subHeading: {
    marginTop: 6,
    marginBottom: 24,
    fontSize: 15,
    color: '#666',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#EEF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  cardTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  cardSubtitle: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
  },
});