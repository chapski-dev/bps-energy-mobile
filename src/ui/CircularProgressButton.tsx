import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import SwitchOnIcon from '@assets/svg/switch-on.svg';

import { useAppTheme } from '@src/theme/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const size = 177,
  strokeWidth = 10,
  pressDuration = 5000;

export const CircularProgressButton = ({
  onPressFinished,
}: {
  onPressFinished: () => void;
}) => {
  const { colors } = useAppTheme();
  const fillColor = colors.green,
    backgroundColor = colors.green;
  // Анимированное значение для прогресс-бара (от 0 до 100)
  const animatedValue = useRef(new Animated.Value(0)).current;
  // Анимация для кнопки (масштаб) и тени (opacity)
  const buttonScale = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(0)).current;

  // Состояние для отображения обратного отсчёта (в секундах)
  const [countdown, setCountdown] = useState(Math.ceil(pressDuration / 1000));
  // Флаг для определения, какая анимация сейчас активна (заполнение или сброс)
  const isPressingRef = useRef(false);
  // Фиксируем время нажатия
  const pressStartTimeRef = useRef(0);
  // Длительность обратной анимации (динамическая, рассчитывается при отпускании)
  const dynamicReleaseDurationRef = useRef(0);

  // Вычисляем радиус и длину окружности
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Интерполяция для анимированного dashoffset:
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const animateTo = (
    toValue: number,
    duration: number,
    onComplete?: () => void,
  ) => {
    Animated.timing(animatedValue, {
      duration,
      easing: Easing.linear,
      toValue,
      useNativeDriver: false, // Свойства SVG не поддерживают native driver
    }).start(({ finished }) => {
      if (finished && onComplete) onComplete();
    });
  };

  // При нажатии – запускаем анимацию заполнения и фиксируем время нажатия
  const handlePressIn = () => {
    isPressingRef.current = true;
    pressStartTimeRef.current = Date.now();
    animateTo(100, pressDuration, onPressFinished);
    Animated.parallel([
      Animated.timing(buttonScale, {
        duration: 100,
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        duration: 100,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // При отпускании – вычисляем, сколько длилась анимация заполнения,
  // и устанавливаем обратную анимацию длительностью = (время нажатия / 2)
  const handlePressOut = () => {
    isPressingRef.current = false;
    const elapsed = Date.now() - pressStartTimeRef.current; // мс
    const dynamicReleaseDuration = elapsed / 2; // длительность обратной анимации
    dynamicReleaseDurationRef.current = dynamicReleaseDuration;
    animateTo(0, dynamicReleaseDuration);
    Animated.parallel([
      Animated.timing(buttonScale, {
        duration: 100,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        duration: 100,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Обновляем состояние обратного отсчёта, подписавшись на изменения animatedValue
  useEffect(() => {
    const id = animatedValue.addListener(({ value }) => {
      let remaining;
      if (isPressingRef.current) {
        // При заполнении: отсчёт от pressDuration до 0
        remaining = (pressDuration / 1000) * ((100 - value) / 100);
      } else {
        // При сбросе: отсчёт от динамической длительности до 0
        remaining = (dynamicReleaseDurationRef.current / 1000) * (value / 100);
      }
      setCountdown(Math.ceil(remaining));
    });
    return () => {
      animatedValue.removeListener(id);
    };
  }, [pressDuration, animatedValue]);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Фоновый круг с поворотом на -90°, чтобы начало было сверху */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={1}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Анимированный прогресс */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius - 4}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="square"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Внутренняя кнопка с эффектом уменьшения и теневым эффектом */}
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.innerButton,
            {
              borderRadius: (size * 0.8) / 2,
              height: size * 0.8,
              transform: [{ scale: buttonScale }],
              width: size * 0.8,
            },
          ]}
        >
          {/* Счётчик обратного отсчёта, если он не равен 0, иначе иконка */}
          {countdown ? (
            <Text style={styles.countdownText}>{countdown}</Text>
          ) : (
            <SwitchOnIcon />
          )}
          {/* Внутренний теневой оверлей для эффекта "ямки" с улучшенным градиентом */}
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: shadowOpacity }]}
          >
            <Svg width={size * 0.8} height={size * 0.8}>
              <Defs>
                <RadialGradient id="grad">
                  <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
                  <Stop offset="90%" stopColor="black" stopOpacity="0.05" />
                  <Stop offset="100%" stopColor="black" stopOpacity="0.15" />
                </RadialGradient>
              </Defs>
              <Circle
                cx={(size * 0.8) / 2}
                cy={(size * 0.8) / 2}
                r={(size * 0.8) / 2}
                fill="url(#grad)"
              />
            </Svg>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  innerButton: {
    alignItems: 'center',
    backgroundColor: '#81CC20',
    justifyContent: 'center',
    position: 'absolute',
  },
});
