import React, {FC, ReactNode, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {merge} from 'lodash';

import {AppLightTheme, useAppTheme} from '@src/theme/theme';
import {StyleSheet} from 'react-native';

const typeStyle = {
  default: StyleSheet.create({
    button: {
      alignItems: 'center',
      borderRadius: 8,
      height: 48,
      justifyContent: 'center',
      width: '100%',
      borderWidth: 1,
    },
    text: {fontSize: 18, fontWeight: '500'},
    wrapper: {alignItems: 'center', width: '100%'},
    buttonTap: {transform: [{scale: 0.95}]},
  }),
};

interface PropsType extends ViewProps {
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  wrapperStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  type?: 'filled' | 'clear' | 'outline';
  backgroundColor?: keyof typeof AppLightTheme.colors;
  textColor?: keyof typeof AppLightTheme.colors;
  borderColor?: keyof typeof AppLightTheme.colors;
  icon?: ReactNode;
}

export const Button: FC<PropsType> = ({
  disabled,
  loading,
  onPress,
  wrapperStyle,
  buttonStyle,
  textStyle,
  children,
  type = 'filled',
  backgroundColor,
  textColor,
  borderColor,
  icon,
}) => {
  const {colors} = useAppTheme();
  const [pressed, setPressed] = useState(false);

  const styles = useMemo(() => merge({}, typeStyle.default, type), [type]);

  const _bgColor = useMemo(() => {
    if (disabled) {
      switch (type) {
        case 'filled':
          return colors.grey_100;
        case 'clear':
          return 'transparent';
        case 'outline':
          return 'transparent';
      }
    }
    if (pressed) {
      switch (type) {
        case 'filled':
          return colors.main_dark;
        case 'clear':
          return colors.grey_50;
        case 'outline':
          return colors.grey_50;
      }
    }
    if (!backgroundColor) {
      switch (type) {
        case 'filled':
          return colors.main;
        case 'clear':
          return 'transparent';
        case 'outline':
          return 'transparent';
        default:
          return colors.main;
      }
    }

    return backgroundColor || (type === 'filled' ? colors.main : 'transparent');
  }, [backgroundColor, colors, type, disabled, pressed]);

  const _textColor = useMemo(() => {
    if (disabled) {
      switch (type) {
        case 'filled':
          return colors.grey_600;
        case 'clear':
          return colors.grey_400;
        case 'outline':
          return colors.grey_400;
      }
    }
    if (!textColor) {
      switch (type) {
        case 'filled':
          return colors.white;
        case 'clear':
          return colors.grey_800;
        case 'outline':
          return colors.grey_800;
        default:
          return colors.white;
      }
    }
    return textColor || (type === 'filled' ? colors.grey_800 : 'transparent');
  }, [colors, textColor, type]);

  const _borderColor = useMemo(() => {
    if (disabled) {
      switch (type) {
        case 'outline':
          return colors.grey_100;
      }
    }
    if (!borderColor) {
      switch (type) {
        case 'outline':
          return colors.grey_200;
        case 'clear':
          return colors.white_transparent;
        case 'filled':
          return colors.white_transparent;
      }
    }
    return borderColor || (type === 'filled' ? colors.border : 'transparent');
  }, [borderColor, type, colors]);

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[
          styles.button,
          buttonStyle,
          {backgroundColor: _bgColor},
          pressed ? styles.buttonTap : {},
          {borderColor: _borderColor},
        ]}
        disabled={disabled}
        onPress={onPress}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <View style={{alignItems: 'center', flexDirection: 'row', gap: 10}}>
            <Text
              style={[styles.text, {color: _textColor}, textStyle]}
              children={children}
            />
            {icon}
          </View>
        )}
      </Pressable>
    </View>
  );
};
