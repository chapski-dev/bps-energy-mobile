import React, { forwardRef, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import OpenEyeIcon from '@assets/svg/eye.svg';
import ClosedEyeIcon from '@assets/svg/eye-closed.svg';

import { useAppTheme } from '@src/theme/theme';

import { Text } from './Text';

export interface InputProps extends TextInputProps {
  prompting?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: boolean;
  errorText?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  type?: 'default' | 'password';
  disabled?: boolean;
  color?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<InputProps, InputProps>(
  (
    {
      prompting,
      value,
      onChangeText,
      error,
      errorText,
      wrapperStyle,
      onFocus,
      onBlur,
      type,
      disabled,
      icon,
      ...props
    },
    ref,
  ) => {
    const localRef: React.Ref<TextInput> &
      React.Ref<React.PropsWithChildren<InputProps>> = useRef(null);

    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { colors } = useAppTheme();

    const _onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (!disabled) {
        setIsFocused(true);
        if (onFocus) {
          onFocus(e);
        }
      }
    };

    const _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (!disabled) {
        setIsFocused(false);
        if (onBlur) {
          onBlur(e);
        }
      }
    };

    const togglePasswordVisibility = () => {
      if (!disabled) {
        setIsPasswordVisible(!isPasswordVisible);
      }
    };

    return (
      <View style={[{ gap: 4 }, wrapperStyle]}>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.background,
              borderColor: colors.grey_200,
            },
            error && { borderColor: colors.red_500 },
            isFocused && { borderColor: colors.main },
            disabled && { borderColor: colors.grey_50 },
          ]}>
          {icon}
          <TextInput
            value={value}
            style={[
              styles.input,
              { color: disabled ? colors.grey_600 : colors.grey_800 },
            ]}
            textContentType={type === 'password' ? 'password' : undefined}
            onChangeText={onChangeText}
            onFocus={_onFocus}
            onBlur={_onBlur}
            placeholderTextColor={colors.border}
            cursorColor={colors.black}
            secureTextEntry={type === 'password' && !isPasswordVisible}
            editable={!disabled}
            //@ts-ignore
            ref={ref || localRef}
            {...props}
          />
          {type === 'password' && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              disabled={disabled}>
              {isPasswordVisible ? (
                <OpenEyeIcon color={colors.grey_400} width={24} height={24} />
              ) : (
                <ClosedEyeIcon color={colors.grey_400} width={24} height={24} />
              )}
            </TouchableOpacity>
          )}
        </View>
        {(error && errorText) && <Text colorName='red_500' variant='p4' children={errorText} />}
        {prompting && (
          <Text
            style={[styles.promting, { color: colors.grey_600 }]}
            children={prompting}
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    flexGrow: 1,
    fontSize: 18,
    minHeight: 56,
  },
  inputWrapper: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 16,
  },
  promting: {
    fontSize: 13,
  },
});
