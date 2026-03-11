import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";

export default function BirthdayCard({ name }) {
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
        },
      ]}
    >
      <Text style={styles.title}>🎂 Happy Birthday!</Text>
      <Text style={styles.message}>Wishing you a wonderful year ahead.</Text>
      <Text style={styles.name}>{name}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFE8A3",
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
  },
  name: {
    marginTop: 4,
    fontWeight: "600",
  },
});