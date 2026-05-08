import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";


// type
// 1 = Birthday
// 2 = WorkAniversary
export default function BirthdayCard({ name, type, years }) {
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(-40)).current;
  const scale = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fade,
          transform: [{ translateY: translate }, { scale }],
          backgroundColor: type == 1 ? "#FFE8A3" : type == 2 ? "#a3ffd1" : "#FFE8A3"
        },
      ]}
    >
      <Text style={styles.title}>{type == 1 ? '🎂 Happy Birthday!' : type == 2 ? '💐 Happy Work Anniversarry 💐' : ""}</Text>
      <Text style={styles.message}>{type == 1 ? `Wishing you a wonderful year ahead.` : type == 2 ? `Cheers to ${years} years of amazing work and dedication!`: ""}</Text>
      {/* <Text style={styles.name}>{name}</Text> */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 15,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  message: {
    marginTop: 5,
    fontSize: 14,
    textAlign:'center'
  },
  name: {
    marginTop: 4,
    fontWeight: "600",
  },
});