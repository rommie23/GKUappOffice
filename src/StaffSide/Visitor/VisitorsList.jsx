// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import colors from '../../colors';

// const VisitorsList = () => {

//   const visitors = [
//     {
//       id: 1,
//       name: "Rahul Sharma",
//       mobile: "9876543210",
//       purpose: "Hostel Discussion",
//       visitDate: "15 Jun 2026",
//       status: "Pending",
//     },
//     {
//       id: 2,
//       name: "Priya Singh",
//       mobile: "9988776655",
//       purpose: "Scholarship Query",
//       visitDate: "15 Jun 2026",
//       status: "Pending",
//     },
//   ];
//   return (
//     <View>
//       {
//         visitors.map((item) => (
//           <View key={item.id} style={styles.cardOuter}>
//             <Text>{item.name}</Text>
//             <View>
//               <Text>Phone No.</Text>
//               <Text>{item.mobile}</Text>
//             </View>
//             <View>
//               <Text>Purpose</Text>
//               <Text>{item.purpose}</Text>
//             </View>
//             <View>
//               <Text>VisitDate</Text>
//               <Text>{item.visitDate}</Text>
//             </View>
//             {
//               item.status == 'Pending' ?
//                 <View style={styles.buttonSection}>
//                   <TouchableOpacity style={styles.button}>
//                     <Text style={styles.buttonText}>Approve</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity>
//                     <Text>Reject</Text>
//                   </TouchableOpacity>
//                 </View>
//                 :
//                 <View>
//                   <TouchableOpacity>
//                     <Text>Approved</Text>
//                   </TouchableOpacity>
//                 </View>
//             }
//           </View>
//         ))
//       }
//     </View>
//   )
// }

// export default VisitorsList

// const styles = StyleSheet.create({
//   cardOuter:{
//     padding:16,
//     backgroundColor:'#fff',
//     marginBottom:16
//   },
//   buttonSection:{
//     flexDirection:'row',
//     justifyContent:'space-around',
//     marginVertical:12
//   },
//   button:{
//     backgroundColor:colors.uniBlue,
//     paddingHorizontal:16,
//     paddingVertical:8
//   },
//   buttonText:{
//     color:'#fff',
//     fontWeight:'700'
//   }
// })

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React from 'react';
import colors from '../../colors';

const VisitorsList = () => {
  const visitors = [
    {
      id: 1,
      name: 'Rahul Sharma',
      mobile: '9876543210',
      purpose: 'Hostel Discussion',
      visitDate: '15 Jun 2026',
      status: 'Pending',
    },
    {
      id: 2,
      name: 'Priya Singh',
      mobile: '9988776655',
      purpose: 'Scholarship Query',
      visitDate: '15 Jun 2026',
      status: 'Approved',
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {visitors.map(item => (
        <View key={item.id} style={styles.card}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name.charAt(0)}
              </Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.mobile}>{item.mobile}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                item.status === 'Pending'
                  ? styles.pendingBadge
                  : styles.approvedBadge,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  item.status === 'Pending'
                    ? styles.pendingText
                    : styles.approvedText,
                ]}>
                {item.status}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Purpose</Text>
            <Text style={styles.value}>{item.purpose}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Visit Date</Text>
            <Text style={styles.value}>{item.visitDate}</Text>
          </View>

          {item.status === 'Pending' ? (
            <View style={styles.buttonSection}>
              <TouchableOpacity style={styles.approveBtn}>
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.rejectBtn}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.approvedContainer}>
              <Text style={styles.approvedLabel}>
                ✓ Request Approved
              </Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default VisitorsList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.uniBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  mobile: {
    color: '#666',
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },

  pendingBadge: {
    backgroundColor: '#FFF4D6',
  },

  approvedBadge: {
    backgroundColor: '#DDF7E5',
  },

  pendingText: {
    color: '#C98A00',
    fontWeight: '700',
  },

  approvedText: {
    color: '#188038',
    fontWeight: '700',
  },

  statusText: {
    fontSize: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 14,
  },

  infoRow: {
    marginBottom: 10,
  },

  label: {
    color: '#777',
    fontSize: 12,
    marginBottom: 2,
  },

  value: {
    color: '#222',
    fontSize: 14,
    fontWeight: '500',
  },

  buttonSection: {
    flexDirection: 'row',
    marginTop: 12,
  },

  approveBtn: {
    flex: 1,
    backgroundColor: colors.uniBlue,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },

  rejectBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
  },

  rejectText: {
    color: '#D32F2F',
    fontWeight: '700',
  },

  approvedContainer: {
    marginTop: 12,
    alignItems: 'center',
  },

  approvedLabel: {
    color: '#188038',
    fontWeight: '700',
  },
});