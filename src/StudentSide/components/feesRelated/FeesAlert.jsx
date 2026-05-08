import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
const FeesAlert = ({ feeMessage = 'Your fees is due. Please pay soon.' }) => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      
      {/* Icon */}
      <Text style={styles.icon}>⚠️</Text>

      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Fees Pending</Text>
        <Text style={styles.subtitle}>
          {feeMessage}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={()=> navigation.navigate('FeePayment')}>
          <Text style={styles.payText}>Pay Now</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default FeesAlert

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
    // top: 0,
    width: "92%",
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FEF3C7", // soft yellow
    padding: 12,

    borderBottomWidth: 1,
    borderColor: "#FCD34D",
    alignSelf: 'center',
    borderRadius:16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  icon: {
    fontSize: 20,
    marginRight: 10,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
  },

  subtitle: {
    fontSize: 12,
    color: "#92400E",
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  payText: {
    color: "#B45309",
    fontWeight: "600",
    marginRight: 10,
  },

  close: {
    fontSize: 16,
    color: "#92400E",
  },
});