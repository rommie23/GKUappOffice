import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'

const { width } = Dimensions.get('window');

const AdmissionsScreen = () => {
  return (
    <View style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        <Text style={styles.header}>Admissions</Text>

        {/* Section 1 */}
        <View style={styles.card}>
          <Text style={styles.title}>Admission Overview</Text>
          <Text style={styles.text}>
            Guru Kashi University offers admissions across multiple disciplines including
            engineering, management, agriculture, computer applications, humanities, and more.
            Students can apply online or visit the campus for offline admission support.
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.card}>
          <Text style={styles.title}>How to Apply</Text>
          <Text style={styles.text}>
            • Visit the official university website{'\n'}
            • Fill out the online application form{'\n'}
            • Upload required documents{'\n'}
            • Pay the application fee{'\n'}
            • Wait for confirmation from the admissions department
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.card}>
          <Text style={styles.title}>Required Documents</Text>
          <Text style={styles.text}>
            • 10th & 12th Marksheet{'\n'}
            • ID Proof (Aadhar / Passport / Driving License){'\n'}
            • Passport-sized photographs{'\n'}
            • Category certificate (if applicable){'\n'}
            • Previous academic certificates (for PG courses){'\n'}
            • Documents as per Course Selection
          </Text>
        </View>

        {/* Section 4 */}
        <View style={styles.card}>
          <Text style={styles.title}>Important Highlights</Text>
          <Text style={styles.text}>
            • Scholarships available based on merit{'\n'}
            • Counseling support for course selection{'\n'}
            • Hostel accommodation available for boys & girls{'\n'}
            • Transport facility available across major routes
          </Text>
        </View>

        {/* Section 5 */}
        <View style={[styles.card, styles.lastCard]}>
          <Text style={styles.title}>Admission Support</Text>
          <Text style={styles.text}>
            For any queries regarding admissions, you can contact the university admission office
            or visit the campus during working hours.
          </Text>
          <Text style={styles.contact}>📞 +91-99142-83400</Text>
          <Text style={styles.contact}>📧 info@gku.ac.in</Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
},

container: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  header: {
    fontSize: 26,
    fontWeight: '800',
    color: '#223260',
    textAlign: 'center',
    marginVertical: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#a62535',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#223260',
    marginBottom: 10,
  },

  text: {
    fontSize: 15,
    color: '#000',
    lineHeight: 22,
    textAlign: 'justify',
    textAlignVertical: 'center',
  },

  contact: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '600',
    color: '#223260',
  },

  lastCard: {
    marginBottom: 50,
  },
});

export default AdmissionsScreen;
