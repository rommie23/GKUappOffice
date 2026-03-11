import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

// 🔥 Replace these with your images (local or online)
const academicAreas = [
  {
    title: "Engineering & Technology",
    image: "https://www.gku.ac.in/public/uploads/page_section_attributes/school-managment-691d432a0f580-1763525418.jpeg",
    points: [
      "Industry-focused practical learning",
      "Modern labs & experiential training",
      "Multiple specialisation options"
    ]
  },
  {
    title: "Management & Commerce",
    image: "https://www.gku.ac.in/public/uploads/page_section_attributes/school-managment-691e9a4cc1168-1763613260.jpeg",
    points: [
      "Business & accounting fundamentals",
      "Corporate-oriented training",
      "Career-driven skill development"
    ]
  },
  {
    title: "Computer Applications & IT",
    image: "https://www.gku.ac.in/public/uploads/page_section_attributes/school-managment-691e9ba49933c-1763613604.jpeg",
    points: [
      "Programming, AI & modern tech skills",
      "Hands-on software development training",
      "Career-oriented curriculum"
    ]
  },
  {
    title: "Agriculture & Allied Sciences",
    image: "https://www.gku.ac.in/public/uploads/page_section_attributes/school-managment-691d66b46db03-1763534516.jpeg",
    points: [
      "Practical farm training & research",
      "Modern techniques & field exposure",
      "Industry-relevant skill building"
    ]
  },
  {
    title: "Humanities & Social Sciences",
    image: "https://www.gku.ac.in/public/uploads/page_section_attributes/school-managment-691e93551eb38-1763611477.jpeg",
    points: [
      "Holistic development approach",
      "Strong foundation in soft skills",
      "Focus on real-world applications"
    ]
  },
  {
    title: "Basic & Applied Sciences",
    image: "https://www.gku.ac.in/public/uploads/page_section_attributes/school-managment-691d67023f80c-1763534594.jpeg",
    points: [
      "Lab-oriented scientific learning",
      "Foundation for research & higher studies",
      "Strong theoretical + practical balance"
    ]
  },
];

const DepartmentsScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.header}>Academic Streams</Text>

      {academicAreas.map((item, index) => (
        <View key={index} style={styles.card}>

          {/* Card Image */}
          <Image
            style={styles.cardImage}
            source={{uri : item.image}}
          />

          {/* Title */}
          <Text style={styles.title}>{item.title}</Text>

          {/* Bullet Points */}
          {item.points.map((point, i) => (
            <Text key={i} style={styles.point}>• {point}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default DepartmentsScreen;

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
    height: 200,
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
  },
});
