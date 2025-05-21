import React, { FC, useMemo } from 'react';
import { StyleSheet, Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { useAppTheme } from '@src/theme/theme';
import { removeUndefinedOnes } from '@src/utils';

type TextType = keyof typeof styles;
type Spacing = number;

export type colorKeys = keyof ReturnType<typeof useAppTheme>['colors'];

type ThemeProps = {
  lightColorName?: colorKeys;
  darkColorName?: colorKeys;
  colorName?: colorKeys;
};

type TextProps = RNTextProps &
  ThemeProps & {
    type?: TextType;
    color?: string;
    fontWeight?: TextStyle['fontWeight'];
    fontSize?: number;
    center?: boolean;
    left?: boolean;
    right?: boolean;
    uppercase?: boolean;
    lowercase?: boolean;
    capitalize?: boolean;
    m?: Spacing;
    mx?: Spacing;
    my?: Spacing;
    mt?: Spacing;
    mr?: Spacing;
    mb?: Spacing;
    ml?: Spacing;
    p?: Spacing;
    px?: Spacing;
    py?: Spacing;
    pt?: Spacing;
    pr?: Spacing;
    pb?: Spacing;
    pl?: Spacing;
  };

const Text: FC<TextProps> = ({
  type,
  style,
  color,
  colorName,
  // lightColorName,
  // darkColorName,
  fontWeight,
  fontSize,
  left,
  right,
  center,
  uppercase,
  lowercase,
  capitalize,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  ...rest
}) => {
  const theme = useAppTheme();
  // const key = colorName || (theme.dark ? darkColorName : lightColorName) || 'grey_800';
  const key = colorName || 'grey_800';


  const computedStyle = useMemo(() => {
    const textAlign = left ? 'left' : right ? 'right' : center ? 'center' : undefined;
    const textTransform = uppercase
      ? 'uppercase'
      : lowercase
        ? 'lowercase'
        : capitalize
          ? 'capitalize'
          : undefined;

    return [
      styles[type ? type : 'body'],
      {
        color: theme.colors[key],
        ...removeUndefinedOnes({
          color,
          fontSize,
          fontWeight,
          margin: m,
          marginBottom: mb,
          marginHorizontal: mx,
          marginLeft: ml,
          marginRight: mr,
          marginTop: mt,
          marginVertical: my,
          padding: p,
          paddingBottom: pb,
          paddingHorizontal: px,
          paddingLeft: pl,
          paddingRight: pr,
          paddingTop: pt,
          paddingVertical: py,
          textAlign,
          textTransform
        })
      },
      style
    ].flat();
  }, [
    capitalize,
    center,
    color,
    fontSize,
    fontWeight,
    key,
    left,
    lowercase,
    m,
    mb,
    ml,
    mr,
    mt,
    mx,
    my,
    p,
    pb,
    pl,
    pr,
    pt,
    px,
    py,
    right,
    style,
    theme.colors,
    type,
    uppercase
  ]);

  return <RNText {...rest} style={computedStyle} />;
};

const styles = StyleSheet.create({
  body: {
    fontSize: 15
  },
  body_500: {
    color: '#000',
    fontSize: 15,
    fontWeight: '500'
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  h3: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  label: {
    color: '#798391',
    fontSize: 13,
    lineHeight: 16
  }
});

export { Text };
