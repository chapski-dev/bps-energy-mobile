import React, { forwardRef, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

import { useAppTheme } from '@src/theme/theme';

import { Text } from './Text';
import ClosedEyeIcon from '../../assets/svg/closed-eye.svg';
import OpenEyeIcon from '../../assets/svg/open-eye.svg';

interface InputProps extends TextInputProps {
  label?: string;
  prompting?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: boolean;
  errorText?: string;
  required?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  type?: 'universal' | 'password';
  disabled?: boolean;
  color?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<InputProps, InputProps>(
  (
    {
      label,
      prompting,
      value,
      onChangeText,
      error,
      errorText,
      required,
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
      <View style={[{ flexGrow: 1, gap: 4 }, wrapperStyle]}>
        {label && (
          <Text style={styles.label}>
            <Text children={label} />
            {required ? <Text children=" *" color={colors.red} /> : null}
          </Text>
        )}
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: colors.border,
              backgroundColor: disabled ? '#F2F5F7' : 'white',
            },
            isFocused &&
              !disabled && { borderColor: colors.black, borderWidth: 2 },
            error && styles.inputError,
          ]}
        >
          {icon && <View>{icon}</View>}
          <TextInput
            value={value}
            style={[
              styles.input,
              { color: disabled ? '#A7ADB2' : colors.textDefault },
            ]}
            onChangeText={disabled ? undefined : onChangeText}
            onFocus={_onFocus}
            onBlur={_onBlur}
            placeholderTextColor={colors.border}
            cursorColor={disabled ? '#A7ADB2' : 'black'}
            secureTextEntry={type === 'password' && !isPasswordVisible}
            editable={!disabled}
            //@ts-ignore
            ref={ref || localRef}
            {...props}
          />
          {type === 'password' && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              disabled={disabled}
            >
              {isPasswordVisible ? (
                <OpenEyeIcon width={24} height={24} />
              ) : (
                <ClosedEyeIcon width={24} height={24} />
              )}
            </TouchableOpacity>
          )}
        </View>
        {error && <Text style={styles.errorText} children={errorText} />}
        {prompting && (
          <Text
            style={[styles.label, { color: colors.label }]}
            children={prompting}
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
  },
  input: {
    flexGrow: 1,
    fontSize: 18,
    minHeight: 56,
  },
  inputError: {
    borderColor: 'red',
  },
  inputWrapper: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flexGrow: 1,
    gap: 9,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 13,
  },
});
