import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { BASE_URL } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import colors from '../colors';

const { width, height } = Dimensions.get('window');
const BANNER_WIDTH = width - 30;
const BANNER_HEIGHT = BANNER_WIDTH / 2.7;

// =====================================================
// BANNER TYPE CONFIGURATION
// =====================================================

const bannerConfig = {
  FESTIVAL: {
    backgroundColor: '#6D3FB8',
    colors: ['#FFD700', '#FFFFFF', '#FF7EB6', '#6BE7FF', '#A8FF78', '#FFB347'],
    animation: 'festival',
  },

  EVENT: {
    backgroundColor: '#3B82F6',
    colors: ['#FFFFFF', '#BDE3FF', '#8BE9FD'],
    animation: 'float',
  },

  IMPORTANT: {
    backgroundColor: '#DC2626',
    animation: 'none',
  },

  NOTICE: {
    backgroundColor: '#64748B',
    animation: 'none',
  },

  GENERAL: {
    backgroundColor: '#6366F1',
    colors: ['#FFFFFF', '#C7D2FE', '#A5F3FC', '#DDD6FE',],
    animation: 'float',
  },
};


// =====================================================
// PARTICLE CONFIGURATION
// =====================================================

const particleData = [
  { left: '5%', top: '15%', size: 6, shape: 'star' },
  { left: '13%', top: '72%', size: 5, shape: 'circle', },
  { left: '23%', top: '25%', size: 6, shape: 'diamond', },
  { left: '32%', top: '80%', size: 4, shape: 'confetti', },
  { left: '41%', top: '12%', size: 7, shape: 'star', },
  { left: '51%', top: '73%', size: 5, shape: 'circle', },
  { left: '61%', top: '18%', size: 6, shape: 'diamond', },
  { left: '70%', top: '80%', size: 7, shape: 'star', },
  { left: '79%', top: '17%', size: 4, shape: 'confetti', },
  { left: '88%', top: '65%', size: 6, shape: 'circle', },
  { left: '95%', top: '30%', size: 5, shape: 'star', },
];


// =====================================================
// PARTICLE COMPONENT
// =====================================================

const Particle = ({
  particle,
  color,
  animationType,
  index,
}) => {

  const animation = useRef(
    new Animated.Value(0)
  ).current;


  useEffect(() => {
    const duration =
      animationType === 'festival' ? 1200 + Math.random() * 1000 : 2000 + Math.random() * 1000;

    const delay =
      index * 180 + Math.random() * 500;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animation, {
          toValue: 1,
          duration,
          easing: Easing.inOut(
            Easing.ease
          ),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration,
          easing: Easing.inOut(
            Easing.ease
          ),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
    };

  }, []);


  // OPACITY

  let opacity;

  if (animationType === 'festival') {

    opacity =
      animation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1,],
        outputRange: [0.1, 0.7, 1, 0.6, 0.1,]
      });

  } else {

    opacity =
      animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.2, 0.75,],
      });

  }


  // ===================================================
  // SCALE
  // ===================================================

  const scale =
    animationType === 'festival'

      ? animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.5, 1.4, 0.5,],
      })
      : animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1.1,],
      });


  // ===================================================
  // MOVEMENT
  // ===================================================

  const translateY =
    animation.interpolate({
      inputRange: [0, 1],
      outputRange: [5, -8],
    });


  // ===================================================
  // ROTATION
  // ===================================================

  const rotate =
    animationType === 'festival'
      ? animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      })
      : '0deg';


  // ===================================================
  // STAR
  // ===================================================

  if (particle.shape === 'star') {

    return (
      <Animated.Text
        style={[
          styles.star,
          {
            left: particle.left,
            top: particle.top,
            fontSize:
              particle.size * 2,
            color,
            opacity,
            transform: [
              { scale, },
              { translateY, },
              { rotate, },
            ],
          },
        ]}>
        ✦
      </Animated.Text>
    );

  }


  // ===================================================
  // DIAMOND
  // ===================================================

  if (particle.shape === 'diamond') {

    return (
      <Animated.View
        style={[
          styles.particle,

          {
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            opacity,
            transform: [
              { scale, },
              { translateY, },
              { rotate: '45deg', },
            ],
          },
        ]}
      />
    );

  }


  // ===================================================
  // CONFETTI
  // ===================================================

  if (particle.shape === 'confetti') {

    return (
      <Animated.View
        style={[
          styles.confetti,
          {
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size * 2.5,
            backgroundColor: color,
            opacity,
            transform: [
              { translateY, },
              { rotate, },
              { scale, },
            ],
          },
        ]}
      />
    );
  }


  // ===================================================
  // CIRCLE
  // ===================================================

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.left, top: particle.top, width: particle.size, height: particle.size, borderRadius: particle.size / 2,
          backgroundColor: color,
          opacity,
          transform: [
            { scale, },
            { translateY, },
          ],
        },
      ]}
    />
  );
};


// =====================================================
// ANIMATED PARTICLES
// =====================================================

const AnimatedParticles = ({
  config,
}) => {

  return (
    <View
      pointerEvents="none"
      style={styles.particleContainer}>
      {particleData.map(
        (particle, index) => {
          const color =
            config.colors[
            index %
            config.colors.length
            ];

          return (
            <Particle
              key={index}
              particle={particle}
              color={color}
              animationType={
                config.animation
              }
              index={index}
            />
          );

        }
      )}
    </View>
  );
};


// =====================================================
// EVENT BANNER
// =====================================================

const EventBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const ref = useRef(null);
  const progress = useSharedValue(0);

  // ===================================================
  // GET BANNERS
  // ===================================================

  const getBanners = async () => {
    try {
      const session = await EncryptedStorage.getItem('user_session');

      const response = await fetch(`${BASE_URL}/student/banners`,
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${session}`,
          },
        }
      );
      console.log({ response });


      const result = await response.json();

      // console.log('EventBanner:: ', result);

      if (
        result.success &&
        Array.isArray(result.data)
      ) {
        setBanners(result.data);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.log(
        'EventBanner Error:',
        error
      );
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  // NO ACTIVE BANNERS

  if (
    loading || banners.length === 0
  ) {
    return null;
  }

  // RENDER BANNER

  const renderBanner = ({ item }) => {

    const hasImageUrl =
      item.Image &&
      typeof item.Image === 'string' &&
      item.Image.trim() !== '';

    const imageFailed = imageErrors[item.ID];

    const showImage =
      hasImageUrl && !imageFailed;

    const config =
      bannerConfig[item.BannerType] ||
      bannerConfig.GENERAL;

    return (
      <View
        style={[
          styles.banner,
          {
            backgroundColor:
              config.backgroundColor,
          },
        ]}
      >

        {showImage ? (

          <Image
            source={{
              uri: item.Image,
            }}
            style={styles.bannerImage}
            resizeMode="cover"

            onError={() => {
              console.log(
                `EventBanner image failed: ${item.Image}`
              );

              setImageErrors(prev => ({
                ...prev,
                [item.ID]: true,
              }));
            }}
          />

        ) : (

          <View style={styles.textBanner}>

            {config.animation !== 'none' && (
              <AnimatedParticles
                config={config}
              />
            )}

            <View style={styles.textContent}>

              <Text
                style={styles.title}
                numberOfLines={2}
              >
                {item.Title}
              </Text>

              {item.Message ? (
                <Text
                  style={styles.message}
                  numberOfLines={3}
                >
                  {item.Message}
                </Text>
              ) : null}

            </View>

          </View>

        )}

      </View>
    );
  };

  // ===================================================
  // RETURN
  // ===================================================
  return (

    <View style={styles.container}>

      <Carousel
        ref={ref}
        width={BANNER_WIDTH}
        height={BANNER_HEIGHT}
        data={banners}
        loop={banners.length > 1}
        autoPlay={banners.length > 1}
        autoPlayInterval={4000}
        scrollAnimationDuration={800}
        onProgressChange={progress}
        renderItem={renderBanner}
      />
      {banners.length > 1 && (
        <Pagination.Basic
          progress={progress}
          data={banners}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#CBD5E1',
          }}
          activeDotStyle={{
            width: 18,
            height: 7,
            borderRadius: 4,
            backgroundColor: colors.uniBlue,
          }}
          containerStyle={{
            gap: 8,
            marginTop: 10,
          }}
          onPress={(index) => {
            ref.current?.scrollTo({
              count: index - progress.value,
              animated: true,
            });
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },

  banner: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,

    borderRadius: 15,

    overflow: 'hidden',

    elevation: 4,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.18,

    shadowRadius: 5,
  },

  bannerImage: {
    width: '100%',
    height: '100%',
  },

  textBanner: {
    flex: 1,

    justifyContent: 'center',

    paddingHorizontal: 20,
    paddingVertical: 12,

    overflow: 'hidden',
  },

  textContent: {
    zIndex: 10,

    paddingRight: 15,
  },

  title: {
    fontSize: 19,

    fontWeight: '800',

    color: '#FFFFFF',

    marginBottom: 6,

    textShadowColor:
      'rgba(0,0,0,0.2)',

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 2,
  },

  message: {
    fontSize: 14,

    fontWeight: '500',

    color: '#FFFFFF',

    lineHeight: 19,

    textShadowColor:
      'rgba(0,0,0,0.15)',

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 2,
  },

  particleContainer: {
    ...StyleSheet.absoluteFillObject,

    zIndex: 1,
  },

  particle: {
    position: 'absolute',
  },

  confetti: {
    position: 'absolute',

    borderRadius: 2,
  },

  star: {
    position: 'absolute',

    fontWeight: '700',

    includeFontPadding: false,
  },

});
export default EventBanner;