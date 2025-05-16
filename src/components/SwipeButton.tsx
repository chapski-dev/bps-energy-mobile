import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleProp, StyleSheet, TextStyle } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import Animated, {
  AnimatedStyle,
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { vibrate } from '@src/actions/vibrate';

const BUTTON_WIDTH = Dimensions.get('screen').width - 32;
const BUTTON_HEIGHT = 50;
const BUTTON_PADDING = 0;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

type SwipeButtonProps = {
  onSwipe: (val: boolean) => void;
  loading: boolean;
  activeBtnColor?: string;
  backgroundColor?: string;
  placeholder?: string;
  text?: string;
  btnTextStyle?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>
};
const SwipeButton = ({
  onSwipe,
  loading,
  activeBtnColor = 'red',
  text = 'SOS',
  placeholder = 'Отправить сигнал SOS →',
  backgroundColor = '#EDEDED',
  btnTextStyle
}: SwipeButtonProps) => {
  // Animated value for X translation
  const X = useSharedValue(0);
  // Toggled State
  const [toggled, setToggled] = useState(false);

  // Fires when animation ends
  const handleComplete = (isToggled: boolean) => {
    if (isToggled !== toggled) {
      vibrate(HapticFeedbackTypes.notificationSuccess);
      setToggled(isToggled);
      onSwipe(isToggled);
    }
  };

  // Reset button position when loading is finished
  useEffect(() => {
    if (!loading) {
      X.value = withSpring(0);
      setToggled(false);
    }
  }, [loading]);

  // Gesture Handler Events
  const animatedGestureHandler = useAnimatedGestureHandler({
    onActive: (e, ctx) => {
      let newValue;
      if (ctx.completed) {
        newValue = H_SWIPE_RANGE + e.translationX;
      } else {
        newValue = e.translationX;
      }

      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
    onStart: (_, ctx) => {
      ctx.completed = toggled;
    },
  });

  const InterpolateXInput = [0, H_SWIPE_RANGE];
  const AnimatedStyles = {
    colorWave: useAnimatedStyle(() => {
      return {
        opacity: interpolate(X.value, InterpolateXInput, [0, 1]),

        width: H_WAVE_RANGE + X.value,
      };
    }),
    swipeCont: useAnimatedStyle(() => {
      return {};
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          InterpolateXInput,
          [0.7, 0],
          Extrapolate.CLAMP,
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS],
              Extrapolate.CLAMP,
            ),
          },
        ],
      };
    }),
    swipeable: useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          X.value,
          [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
          [activeBtnColor, activeBtnColor],
        ),
        transform: [{ translateX: X.value }],
      };
    }),
  };

  return (
    <PanGestureHandler
      enabled={!loading}
      onGestureEvent={animatedGestureHandler}
    >
      <Animated.View
        style={[
          styles.swipeCont,
          AnimatedStyles.swipeCont,
          { backgroundColor: backgroundColor },
        ]}
      >
        <Animated.View
          style={[
            AnimatedStyles.colorWave,
            styles.colorWave,
            { backgroundColor: activeBtnColor },
          ]}
        />
        <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Animated.Text children={text} style={btnTextStyle}/>
          )}
        </Animated.View>
        <Animated.Text
          style={[styles.swipeText, AnimatedStyles.swipeText]}
          children={placeholder}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  colorWave: {
    borderRadius: 12,
    height: BUTTON_HEIGHT,
    left: 0,
    position: 'absolute',
  },
  swipeCont: {
    alignItems: 'center',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    padding: BUTTON_PADDING,
    width: BUTTON_WIDTH,
  },
  swipeText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    zIndex: 2,
  },
  swipeable: {
    alignItems: 'center',
    borderRadius: 12,
    elevation: 5,
    height: SWIPEABLE_DIMENSIONS,
    justifyContent: 'center',
    left: BUTTON_PADDING,
    position: 'absolute',
    shadowOffset: { height: 4, width: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: SWIPEABLE_DIMENSIONS,
    zIndex: 3,
  },
});

export default SwipeButton;
