import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Example dataset matching your structure
const sections = [
  {
    header: "Academic Life",
    image: "https://www.gku.ac.in/public/frontend/images/classrooms-img.webp",
    items: [
      {
        title: "Diverse Courses",
        desc: "Over 100+ programs across disciplines like Engineering, Law, Agriculture, Pharmacy, Management, Humanities, etc.",
      },
      {
        title: "Modern Classrooms & Labs",
        desc: "Smart classrooms, well-equipped laboratories, and industry-relevant curriculum.",
      },
      {
        title: "Learning Approach",
        desc: "Choice Based Credit System and Learning Outcome-based curriculum encourage flexibility and critical thinking.",
      },
    ],
  },
  {
    header: "Campus Living",
    image: "https://www.gku.ac.in/public/frontend/images/camps-living.webp",
    items: [
      {
        title: "Hostels",
        desc: "Separate hostels for boys and girls with Wi-Fi, mess, recreation rooms, and 24/7 security.",
      },
      {
        title: "Canteens & Cafeterias",
        desc: "Hygienic and affordable food options available across campus.",
      },
      {
        title: "Green Campus",
        desc: "Eco-friendly surroundings with herbal gardens, orchards, and well-maintained parks.",
      },
    ],
  },
  {
    header: "Clubs & Cultural Life",
    image: "https://www.gku.ac.in/public/frontend/images/cultural-life.webp",
    items: [
      {
        title: "Student Clubs",
        desc: "Dance, music, drama, coding, literary clubs, entrepreneurship cell, and more.",
      },
      {
        title: "Events & Fests",
        desc: "Cultural fests, tech events, fresher’s party, and traditional celebrations (like Baisakhi, Lohri, etc.).",
      },
      {
        title: "Social Engagement",
        desc: "NSS, blood donation camps, and awareness drives.",
      },
    ],
  },
  {
    header: "International Exposure",
    image: "https://www.gku.ac.in/public/frontend/images/international-exposure.webp",
    items: [
      {
        title: "Global Community",
        desc: "Students from over 28 countries, adding rich cultural diversity.",
      },
      {
        title: "Language Support",
        desc: "ESL programs and language labs for non-native English speakers.",
      },
      {
        title: "Exchange Programs",
        desc: "MoUs with international universities for student and faculty exchange.",
      },
    ],
  },

  {
    header: "Library & Resources",
    image: "https://www.gku.ac.in/public/frontend/images/central-library.webp",
    items: [
      {
        title: "Central Library",
        desc: "Thousands of books, journals, e-resources, and digital learning content.",
      },
      {
        title: "Wi-Fi Enabled Campus",
        desc: "Seamless internet access for academic research and online learning.",
      },
      {
        title: "E-Learning",
        desc: "Learning Management System (LMS) for blended and online classes.",
      },
    ],
  },
];

const LifeAtGKU = () => {
  return (
      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.mainHeader}>Life @ GKU</Text>

        {sections.map((sec, index) => (
          <View key={index} style={styles.sectionCard}>

            {/* Image */}
            <Image source={{ uri: sec.image }} style={styles.bannerImg} />

            {/* Main Title */}
            <Text style={styles.sectionHeader}>{sec.header}</Text>

            {/* Sub items */}
            {sec.items.map((item, idx) => (
              <View key={idx} style={styles.subItem}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
              </View>
            ))}

          </View>
        ))}

      </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  mainHeader: {
    fontSize: 26,
    fontWeight: "800",
    color: "#223260",
    textAlign: "center",
    marginVertical: 18,
  },

  sectionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  bannerImg: {
    width: "100%",
    height: width * 0.5,
    resizeMode: "cover",
  },

  sectionHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: "#a62535",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  subItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  itemTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#223260",
  },

  itemDesc: {
    fontSize: 14.5,
    color: "#000",
    lineHeight: 20,
    marginTop: 4,
    textAlign: 'justify',
    textAlignVertical: 'center',
  },
});

export default LifeAtGKU;
