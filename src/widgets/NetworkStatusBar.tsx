import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, StyleSheet } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

import { useAppTheme } from '../theme/theme';
import { Box, Text } from '../ui';

const AnimatedBox = Animated.createAnimatedComponent(Box);

interface NetworkStatusBarProps {
  message?: string;
}

export const NetworkStatusBar: React.FC<NetworkStatusBarProps> = () => {
  const { colors, insets } = useAppTheme();
  const { t } = useTranslation();
  const netInfo = useNetInfo();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const [isVisible, setIsVisible] = useState(false);

  const isOffline = netInfo.isConnected === false;

  useEffect(() => {
    if (isOffline && !isVisible) {
      setIsVisible(true);
      Animated.spring(slideAnim, {
        friction: 8,
        tension: 100,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else if (!isOffline && isVisible) {
      Animated.timing(slideAnim, {
        duration: 300,
        toValue: -100,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [isOffline, isVisible, slideAnim]);

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatedBox
      backgroundColor={colors.error_500}
      alignItems="center"
      justifyContent="center"
      pt={insets.top + 8}
      pb={8}
      px={16}
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text
        colorName="white"
        variant="p3-semibold"
        center
        children={t('no-internet-connection')}
      />
    </AnimatedBox>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 5,
    left: 0,
    position: 'absolute',
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    top: 0,
    zIndex: 1000,
  },
});