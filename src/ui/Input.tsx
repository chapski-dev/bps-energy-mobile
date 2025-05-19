import React, { FC, useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Box } from './Box';
import ClosedEyeIcon from '../../assets/svg/closed-eye.svg';
import OpenEyeIcon from '../../assets/svg/open-eye.svg';

interface InputProps extends TextInputProps {
  prompting?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: React.ReactNode;
  isPassword?: boolean;
  validate?: (text: string) => string | null;
}

export const Input: FC<InputProps> = ({
  value,
  onChangeText,
  prompting,
  icon,
  isPassword = false,
  validate,
  ...restProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (validate) {
      setErrorMessage(validate(value));
    }
  };

  const borderColor = errorMessage
    ? '#E73030'
    : isFocused
      ? '#000A0A'
      : '#D1D4DA';

  const borderWidth = isFocused ? 2 : 1;

  return (
    <>
      <Box
        row
        alignItems="center"
        borderWidth={borderWidth}
        borderRadius={12}
        borderColor={borderColor}
        p={16}
        gap={12}
      >
        {icon && <Box>{icon}</Box>}
        <TextInput
          value={value}
          style={{ flex: 1, fontSize: 18 }}
          onChangeText={(text) => {
            onChangeText(text);
            setErrorMessage(null);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...restProps}
        />
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <OpenEyeIcon width={24} height={24} />
            ) : (
              <ClosedEyeIcon width={24} height={24} />
            )}
          </TouchableOpacity>
        )}
      </Box>
      <Text
        style={{
          fontSize: 13,
          paddingTop: 8,
          lineHeight: 18,
          color: errorMessage ? '#E73030' : '#8A8F93',
        }}
      >
        {errorMessage || prompting}
      </Text>
    </>
  );
};
