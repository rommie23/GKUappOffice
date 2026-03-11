import React, { useEffect, useRef, memo } from "react";
import { View, Animated, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

function BirthdaySparkle({ show }) {
  const pieces = Array.from({ length: 25 }).map(() => ({
    x: Math.random() * width,
    delay: Math.random() * 1000,
    anim: useRef(new Animated.Value(-20)).current,
    rotate: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    if (!show) return;

    pieces.forEach((p) => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(p.anim, {
            toValue: height + 40,
            duration: 3000 + Math.random() * 2000,
            delay: p.delay,
            useNativeDriver: true,
          }),
          Animated.timing(p.rotate, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [show]);

  if (!show) return null;

  return (
    <View style={{ position: "absolute", width, height }}>
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            transform: [
              { translateY: p.anim },
              {
                rotate: p.rotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: ["#FFD700", "#FF69B4", "#00BFFF", "#7CFC00"][
                i % 4
              ],
              borderRadius: 2,
            }}
          />
        </Animated.View>
      ))}
    </View>
  );
}


export default memo(BirthdaySparkle);