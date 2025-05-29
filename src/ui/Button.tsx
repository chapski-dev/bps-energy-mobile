import React, { FC, ReactNode, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleProp,
  StyleSheet, Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewProps,
  ViewStyle
} from 'react-native';
import { merge } from 'lodash';

import { AppLightTheme, useAppTheme } from '@src/theme/theme';


type ButtonType = keyof typeof typeStyle;

type ThemeColors = keyof typeof AppLightTheme.colors;

interface PropsType extends ViewProps {
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  wrapperStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonDisabledStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  type?: ButtonType;
  backgroundColor?: ThemeColors;
  textColor?: ThemeColors;
  borderColor?: ThemeColors;
  icon?: ReactNode;
}

const commonStytle = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  wrapper: {
    alignItems: 'center',
    width: '100%',
  },
});

const clearStyle = StyleSheet.create({
});

const filledStyle = StyleSheet.create({
});

const outlineStyle = StyleSheet.create({
  button: {
    borderWidth: 1,
  },
});

const typeStyle = {
  clear: merge({}, commonStytle, clearStyle),
  filled: merge({}, commonStytle, filledStyle),
  outline: merge({}, commonStytle, outlineStyle),
};

export const Button: FC<PropsType> = ({
  disabled,
  loading,
  onPress,
  wrapperStyle,
  buttonStyle,
  buttonDisabledStyle,
  textStyle,
  children,
  type = 'filled',
  backgroundColor,
  textColor,
  borderColor,
  icon,
}) => {
  const { colors } = useAppTheme();
  const scaleValue = useRef(new Animated.Value(1)).current; // Для анимации масштаба
  const overlayOpacity = useRef(new Animated.Value(0)).current; // Для оверлея

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, { toValue: 0.99, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { duration: 10, toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { duration: 10, toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  const styles = useMemo(() => typeStyle[type], [type]);

  const _bgColor = useMemo(() => {
    switch (true) {
      case type === 'filled' && disabled:
        return colors.grey_100;
      case !!backgroundColor:
        return colors[backgroundColor];
      case type === 'filled':
        return colors.main;
      default:
        return colors.background;
    }

  }, [backgroundColor, colors, disabled, type]);

  // Цвет текста
  const _textColor = useMemo(() => {
    switch (true) {
      case type === 'filled' && disabled:
        return colors.grey_600;
      case disabled:
        return colors.grey_400;
      case !!textColor:
        return colors[textColor];
      case type === 'filled':
        return colors.white;
      default:
        return colors.grey_800;
    }
  }, [colors, disabled, textColor, type]);

  const _borderColor = useMemo(() => {
    switch (true) {
      case type === 'outline' && disabled:
        return colors.grey_100;
      case !!borderColor:
        return colors[borderColor];
      default:
        return colors.grey_200;
    }
  }, [borderColor, colors, disabled, type]);

  // Стили кнопки
  const buttonStyles = useMemo(() => ([
    styles.button,
    buttonStyle,
    disabled ? buttonDisabledStyle : undefined,
    { backgroundColor: _bgColor },
    { borderColor: _borderColor },
  ]),
    [_bgColor, _borderColor, buttonDisabledStyle, buttonStyle, disabled, styles.button],
  );

  // Общий контент кнопки
  const buttonContent = (
    loading ? (
      <ActivityIndicator color="white" />
    ) : (
      <>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
          <Text style={[{ color: _textColor, fontWeight: '600' }, textStyle]} children={children} />
          {icon}
        </View>
        {type === 'filled' && !disabled && !loading && (
          <Animated.View
            style={{
              backgroundColor: '#00000040',
              bottom: 0,
              left: 0,
              opacity: overlayOpacity,
              position: 'absolute',
              right: 0,
              top: 0,
            }}
          />
        )}
      </>
    )
  );

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <Animated.View style={{ transform: [{ scale: scaleValue }], width: '100%' }}>
        {type === 'filled' ? (
          <Pressable
            style={buttonStyles}
            disabled={disabled || loading}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            {buttonContent}
          </Pressable>
        ) : (
          <TouchableHighlight
            activeOpacity={1}
            underlayColor={colors.grey_50}
            style={buttonStyles}
            disabled={disabled || loading}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            {buttonContent}
          </TouchableHighlight>
        )}
      </Animated.View>

    </View>
  );
};