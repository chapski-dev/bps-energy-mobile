import React, { forwardRef, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle
} from 'react-native';
import SearchIcon from '@assets/svg/search.svg';

import { useAppTheme } from '@src/theme/theme';

import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  prompting?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: boolean;
  errorText?: string;
  required?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  type?: 'search' | 'classic';
  color?: string;
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
      ...props
    },
    ref
  ) => {
    const localRef: React.Ref<TextInput> & React.Ref<React.PropsWithChildren<InputProps>> =
      useRef(null);

    const [isFocused, setIsFocused] = useState(false);
    const { colors } = useAppTheme();

    const _onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      if (onFocus) {
        onFocus(e);
      }
    };

    const _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <View style={[{ gap: 4 }, wrapperStyle]}>
        {label && (
          <Text style={styles.label}>
            <Text children={label} />
            {required ? <Text children=" *" color={colors.red_500} /> : null}
          </Text>
        )}
        <View
          style={[
            { ...styles.inputWrapper, borderColor: colors.grey_200 },
            isFocused && { borderColor: colors.main },
            error && styles.inputError
          ]}
        >
          {type === 'search' && <SearchIcon />}
          <TextInput
            value={value}
            style={[styles.input, { color: colors.grey_800 }]}
            onChangeText={onChangeText}
            onFocus={_onFocus}
            onBlur={_onBlur}
            placeholderTextColor={colors.grey_200}
            //@ts-ignore
            ref={ref || localRef}
            {...props}
          />
        </View>
        {(error && errorText) && <Text style={styles.errorText} children={errorText} />}
        {prompting && (
          <Text style={{ ...styles.label, color: colors.grey_600 }} children={prompting} />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
  },
  input: {
    flexGrow: 1,
    fontSize: 15,
    minHeight: 50,
  },
  inputError: {
    borderColor: 'red',
  },
  inputWrapper: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 13,
  },
});
