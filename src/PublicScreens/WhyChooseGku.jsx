import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

// Replace images with your own later
const whyGKU = [
  {
    title: "Strong Placement Support",
    image: "https://www.gku.ac.in/public/frontend/images/placement2.webp",
    points: [
      "Dedicated Training & Placement Cell",
      "Regular campus drives & career workshops",
      "Industry collaborations for internships"
    ]
  },
  {
    title: "Modern Infrastructure",
    image: "https://www.gku.ac.in/public/uploads/page_section_attributes/school-managment-691ea4db0d648-1763615963.jpeg",
    points: [
      "Advanced labs, smart classrooms & digital learning",
      "Wi-Fi Enabled Campus",
      "State-of-the-art research facilities"
    ]
  },
  {
    title: "Industry-Oriented Programs",
    image: "https://www.gku.ac.in/public/uploads/page_section_attributes/department-managment-68b67d6fdf6e7-1756790127.png",
    points: [
      "Curriculum aligned with modern industry trends",
      "Skill-based workshops & certifications",
      "Expert guest lectures & seminars"
    ]
  },
  {
    title: "International Exposure",
    image: "https://www.gku.ac.in/public/frontend/images/international-adm2.webp",
    points: [
      "Students from 28+ countries",
      "International collaborations & exchange programs",
      "Cultural diversity & global learning"
    ]
  },
  {
    title: "Scholarships & Financial Support",
    image: "https://www.gku.ac.in/public/frontend/images/scholar2.webp",
    points: [
      "Multiple merit & need-based scholarships",
      "Special category concessions",
      "Educational loan support"
    ]
  },
  {
    title: "Vibrant Campus Life",
    image: "https://www.gku.ac.in/public/frontend/images/cultural-life.webp",
    points: [
      "Sports, cultural events & student clubs",
      "Safe and secure residential facilities",
      "Healthy and engaging student environment"
    ]
  },
];

const WhyChooseGKU = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.header}>Why Choose GKU</Text>

      {whyGKU.map((item, index) => (
        <View key={index} style={styles.card}>

          <Image style={styles.cardImage} source={{uri : item.image}} />

          <Text style={styles.title}>{item.title}</Text>

          {item.points.map((point, i) => (
            <Text key={i} style={styles.point}>• {point}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default WhyChooseGKU;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },

  header: {
    fontSize: 26,
    fontWeight: "800",
    color: "#223260",
    textAlign: "center",
    marginVertical: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingBottom: 18,
    marginHorizontal: 16,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#a62535",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: "cover",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#223260",
    marginTop: 15,
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  point: {
    fontSize: 15,
    color: "#000",
    lineHeight: 22,
    marginBottom: 4,
    paddingHorizontal: 16,
    textAlign: 'justify',
    textAlignVertical: 'center',
  },
});
