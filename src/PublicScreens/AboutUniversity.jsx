import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');

const AboutUniversity = () => {
  return (
      <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      >

        {/* Banner Image */}
        <Image
          source={{ uri: 'https://www.gku.ac.in/public/uploads/pages/9CnZSWY06hQIP1uacRQyHng0IGBnQz0OgoFmAiJq.webp' }}
          style={styles.banner}
        />

        {/* Floating Card */}
        <View style={styles.cardContainer}>
          
          {/* Title */}
          <Text style={styles.title}>About Guru Kashi University</Text>

          {/* Photo Grid */}
          <View style={styles.photoRow}>
            {/* <Image source={{ uri: 'https://www.gku.ac.in/public/frontend/images/campus-top-view.webp' }} style={styles.smallPhoto} /> */}
            <Image source={{ uri: 'https://www.gku.ac.in/public/uploads/editors/gku-dv382gZJ.png' }} style={styles.smallPhoto} />
          </View>

          {/* Section */}
          <Text style={styles.text}>
            The Guru Kashi University has been founded by Balaji Education Trust, Talwandi Sabo which was established in 1997 and became the foundation stone for education in this region. The first college, Guru Gobind Singh Polytechnic was established in 1998 and later Graduate and Post graduate programmes were added.
          </Text>

          {/* Section */}
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.text}>
            • To provide holistic education through multi-disciplinary and skill-oriented curriculum, innovative pedagogy, ground breaking research withcreation of knowledge in diverse environment.
          </Text>
          <Text style={styles.text}>
            • To develop community-oriented professionals and entrepreneurs with creative talent to address local and global concernsthrough technology and value systems.
          </Text>
          
          {/* Section */}
          <Text style={styles.sectionTitle}>Our Vission</Text>
          <Text style={styles.text}>
            • Empowering students through unparalleled educational journey for professional accomplishments, innovative potential and global well-being.
          </Text>

          {/* Section */}
          <Text style={styles.sectionTitle}>Why Choose Us?</Text>
          <Text style={styles.text}>
            • Experienced faculty{'\n'}
            • Modern infrastructure{'\n'}
            • Industry-driven curriculum{'\n'}
            • Strong placement network{'\n'}
            • Student-centered environment
          </Text>

        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  banner: {
    width: '100%',
    height: width * 0.55,
    resizeMode: 'cover',
  },

  cardContainer: {
  backgroundColor: '#fff',
  marginTop: -40,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  padding: 20,
  paddingBottom: 40,   // 🔥 NEW
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 20,
  elevation: 6,
  flexGrow: 1,
},


  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#223260',
    marginBottom: 15,
    textAlign: 'center',
  },

  photoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },

  smallPhoto: {
    width: width-40,
    alignSelf:'center',
    height: 130,
    borderRadius: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#a62535',
    marginTop: 20,
    marginBottom: 8,
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#000',
    textAlign: 'justify',
    textAlignVertical: 'center',
  },
});

export default AboutUniversity;
