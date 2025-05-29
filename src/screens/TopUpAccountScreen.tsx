import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CreditIcon from '@assets/svg/credit-card.svg';
import BelarusIcon from '@assets/svg/flags/Belarus.svg';
import RussiaIcon from '@assets/svg/flags/Russia.svg';
import LogoIcon from '@assets/svg/logo.svg';

import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Input, Text } from '@src/ui';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';
import { vibrate } from '@src/utils/vibrate';


const TopUpAccountScreen = ({ navigation }: ScreenProps<'top-up-account'>) => {
  const { insets, colors } = useAppTheme();

  const { t } = useLocalization()
  const [sum, setSum] = useState('')
  const [loading, setLoading] = useState(false);

  const submitPay = async () => {
    try {
      setLoading(true)
      await wait(300)
      navigation.navigate('adding-card-and-payment', { sum })
    } catch (error) {
      handleCatchError(error, 'TopUpAccountScreen')
    } finally {
      setLoading(false)
    }
  }

  const pressAddSum = (val: number) => {
    vibrate(HapticFeedbackTypes.clockTick)
    setSum((s) => (Number(s) + val).toString())
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <Box
        px={16}
        pt={47}
        gap={24}
        pb={insets.bottom + 35}
        alignItems='center'
        flex={1} >
        <LogoIcon />
        <CurrencySwitcher />
        <Box flex={1} w='full' gap={24}>
          <Input
            required
            value={sum}
            onChangeText={setSum}
            placeholder='Сумма'
            autoCorrect={false}
            inputMode='numeric'
            keyboardType='numeric'
            returnKeyType='done'
          />
          <Box row gap={9}>
            <AddSumButton sum='5' onPress={() => pressAddSum(5)} />
            <AddSumButton sum='10' onPress={() => pressAddSum(10)} />
            <AddSumButton sum='20' onPress={() => pressAddSum(20)} />
            <AddSumButton sum='50' onPress={() => pressAddSum(50)} />
          </Box>

          <Button
            disabled={!Number(sum) || loading}
            loading={loading}
            children={t('pay-by-card')}
            onPress={submitPay}
            icon={<CreditIcon color={colors.background} />}
          />

        </Box>
      </Box>
    </KeyboardAwareScrollView>
  );
};

export default TopUpAccountScreen;

const CurrencySwitcher = () => {
  const { colors } = useAppTheme();

  const [selectedCurrency, setSelectedCurrency] = useState('BY');
  const handleTapCurrency = (val: 'BY' | 'RU') => {
    vibrate(HapticFeedbackTypes.selection);
    setSelectedCurrency(val);
  };

  const [containerWidth, setContainerWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const toValue = selectedCurrency === 'BY' ? 0 : 1;
    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver: true,
    }).start();
  }, [selectedCurrency]);

  const indicatorTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth / 2],
  });

  return (
    <Box
      backgroundColor={colors.grey_50}
      row
      height={40}
      p={4}
      borderRadius={8}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width - 8)}
    >
      <Animated.View
        style={{
          backgroundColor: 'white',
          borderRadius: 4,
          height: '100%',
          left: 4,
          position: 'absolute',
          top: 4,
          transform: [{ translateX: indicatorTranslateX }],
          width: containerWidth / 2,
          zIndex: 1,
          ...shadowStyle,
        }}
      />
      <Box
        alignItems="center"
        flex={1}
        row
        zIndex={2}
        borderRadius={4}
        justifyContent="center"
        gap={6}
        onPress={() => handleTapCurrency('BY')}
      >
        <BelarusIcon />
        <Text
          children="BY Кошелёк"
          fontWeight={selectedCurrency === 'BY' ? '600' : 'normal'}
        />
      </Box>
      <Box
        alignItems="center"
        flex={1}
        row
        zIndex={2}
        borderRadius={4}
        onPress={() => handleTapCurrency('RU')}
        gap={6}
        justifyContent="center"
      >
        <RussiaIcon />
        <Text
          children="RU Кошелёк"
          fontWeight={selectedCurrency === 'RU' ? '600' : 'normal'}
        />
      </Box>
    </Box>
  );
};

const shadowStyle = {
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: {
    height: 2,
    width: 0,
  },
  shadowOpacity: 0.1,
  shadowRadius: 1,
};

const AddSumButton = (props: { sum: '5' | '10' | '20' | '50', onPress: () => void }) => {
  const { colors } = useAppTheme();

  return (
    <Box
      h={46}
      justifyContent='center'
      alignItems='center'
      flexGrow={1}
      onPress={props.onPress}
      backgroundColor={colors.grey_50}
      borderRadius={8}>
      <Text children={'+' + props.sum} fontWeight='800' fontSize={18} />
    </Box>
  )
}