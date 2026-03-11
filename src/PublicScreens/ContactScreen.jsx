import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { images } from '../images';

const { width } = Dimensions.get('window');

const ContactScreen = () => {
  const googleMapURL =
    "https://www.google.com/maps/place/Guru+Kashi+University/@30.257141,75.079684,15z";

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Photo Slider */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageSlider}
      >
        <Image
          style={styles.sliderImage}
          source={{
            uri:
              "https://www.gku.ac.in/public/uploads/editors/gku-dv382gZJ.png",
          }}
        />
        <Image
          style={styles.sliderImage}
          source={{
            uri:
              "https://www.gku.ac.in/public/uploads/pages/9CnZSWY06hQIP1uacRQyHng0IGBnQz0OgoFmAiJq.webp",
          }}
        />
      </ScrollView>

      <Text style={styles.header}>Contact & Campus Location</Text>

      {/* Address Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Campus Address</Text>
        <Text style={styles.text}>
          Guru Kashi University{'\n'}
          Talwandi Sabo, Bathinda – 151302{'\n'}
          Punjab, India
        </Text>
      </View>

      {/* Contact Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Contact Details</Text>

        <Text style={styles.label}>Phone</Text>
        <TouchableOpacity onPress={() => Linking.openURL("tel:+91-9914283400")}>
          <Text style={styles.link}>+91-99142-83400</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Email</Text>
        <TouchableOpacity onPress={() => Linking.openURL("mailto:info@gku.ac.in")}>
          <Text style={styles.link}>info@gku.ac.in</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Office Hours</Text>
        <Text style={styles.text}>Monday – Friday{'\n'}9:00 AM – 5:00 PM</Text>
      </View>

      {/* Map Section */}
      <View style={styles.card}>
  <Text style={styles.title}>Campus Map</Text>

  <TouchableOpacity
    style={styles.mapImageWrapper}
    onPress={() => Linking.openURL("https://www.google.com/maps/place/Guru+Kashi+University/@29.9634288,75.1199127,15z/data=!4m7!3m6!1s0x391128c8d5055125:0xa0013bc90ab8d7df!4b1!8m2!3d29.9608428!4d75.1243141!16s%2Fm%2F0zrq9pn?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D")}
    activeOpacity={0.8}
  >
    {/* Static map image */}
    <Image
      style={styles.mapImage}
      source= {images.map}

    />

    {/* Overlay text */}
    <View style={styles.mapOverlay}>
      <Text style={styles.mapOverlayText}>View on Google Maps</Text>
    </View>
  </TouchableOpacity>

</View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },

  imageSlider: {
    width: width,
    height: 200,
    marginBottom: 20,
  },

  sliderImage: {
    width: width,
    height: 200,
    resizeMode: "cover",
  },

  header: {
    fontSize: 26,
    fontWeight: "800",
    color: "#223260",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#a62535",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#223260",
    marginBottom: 10,
  },

  text: {
    fontSize: 15,
    color: "#000",
    lineHeight: 22,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#223260",
    marginTop: 10,
  },

  link: {
    fontSize: 15,
    color: "#a62535",
    fontWeight: "500",
    marginBottom: 6,
  },

  mapWrapper: {
    height: 220,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
    marginTop: 10,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapButton: {
    marginTop: 15,
    backgroundColor: "#223260",
    paddingVertical: 12,
    borderRadius: 10,
  },

  mapButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  mapImageWrapper: {
  width: "100%",
  height: 200,
  borderRadius: 14,
  overflow: "hidden",
  marginTop: 10,
  backgroundColor: "#e0e0e0",
},

mapImage: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
},

mapOverlay: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  paddingVertical: 8,
  alignItems: "center",
},

mapOverlayText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 14,
},

});
