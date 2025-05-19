import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  type: 'primary' | 'outline' | 'text';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type,
  disabled,
}) => {
  const [scale] = useState(new Animated.Value(1));
  const [overlayOpacity] = useState(new Animated.Value(0));
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: type === 'primary' ? 0.25 : 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          disabled
            ? styles[`${type}Disabled`]
            : isPressed
              ? styles[`${type}Tap`]
              : styles[type],
        ]}
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={disabled}
      >
        <Text
          style={[
            styles.text,
            disabled ? styles[`${type}DisabledText`] : styles[`${type}Text`],
          ]}
        >
          {title}
        </Text>
        {type === 'primary' && !disabled && (
          <Animated.View
            style={[styles.overlay, { opacity: overlayOpacity }]}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17.5,
    borderRadius: 8,
    justifyContent: 'center',
    position: 'relative',
  },

  primary: { backgroundColor: '#008C92' },
  primaryTap: { backgroundColor: '#008C92' },
  primaryDisabled: { backgroundColor: '#E6EAED' },

  primaryText: { color: '#fff', fontSize: 18 },
  primaryDisabledText: { color: '#8A8F93', fontSize: 18 },

  outline: { borderWidth: 1, borderColor: '#D7DCE0' },
  outlineTap: { backgroundColor: '#D7DCE0', borderWidth: 0 },
  outlineDisabled: {
    borderWidth: 1,
    borderColor: '#E6EAED',
    backgroundColor: 'transparent',
  },

  outlineText: { color: '#000A0A', fontSize: 18 },
  outlineDisabledText: { color: '#A7ADB2', fontSize: 18 },

  text: { backgroundColor: 'transparent' },
  textTap: { backgroundColor: '#D7DCE0' },
  textDisabled: { backgroundColor: 'transparent' },

  textText: { color: '#000A0A', fontSize: 18 },
  textDisabledText: { color: '#A7ADB2', fontSize: 18 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 8,
  },
});
