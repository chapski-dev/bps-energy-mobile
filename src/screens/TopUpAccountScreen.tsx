import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import BepaidIcon from '@assets/svg/brand/bepaid.svg';
import BelarusIcon from '@assets/svg/flags/Belarus.svg';
import RussiaIcon from '@assets/svg/flags/Russia.svg';
import LogoIcon from '@assets/svg/logo.svg';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { postCreateTransaction, postTopUpBalance } from '@src/api';
import { Card } from '@src/api/types';
import { useLocalization } from '@src/hooks/useLocalization';
import { useThemedToasts } from '@src/hooks/useThemedToasts.';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Input, Text } from '@src/ui';
import { AnimatedBox } from '@src/ui/Box';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { vibrate } from '@src/utils/vibrate';
import UserCardsModal from '@src/widgets/modals/UserCardsModal';

const TopUpAccountScreen = ({
  navigation,
  route,
}: ScreenProps<'top-up-account'>) => {
  const { insets } = useAppTheme();
  const { user, getUserData } = useAuth();
  const { toastSuccess } = useThemedToasts();
  const { t } = useTranslation(['screens', 'actions']);

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const modalCards = useRef<BottomSheetModal>(null);
  const modalCardsClose = () => modalCards?.current?.forceClose();
  const modalCardsOpen = () => modalCards?.current?.present();

  const proceedTransaction = async () => {
    try {
      modalCardsClose();
      setLoading(true);
      const { url } = await postCreateTransaction({ amount: Number(amount) });
      navigation.navigate('adding-card-and-payment', { url });
    } catch (error) {
      handleCatchError(error, 'TopUpAccountScreen');
    } finally {
      setLoading(false);
    }
  };

  const submitPay = () => {
    Keyboard.dismiss()
    if (user?.cards.length) {
      modalCardsOpen();
    } else {
      proceedTransaction();
    }
  };

  const pressAddSum = (val: number) => {
    vibrate(HapticFeedbackTypes.clockTick);
    setAmount((s) => (Number(s) + val).toString());
  };

  const handleSkip = async () => {
    navigation.preload('tabs');
    await wait(100);
    navigation.navigate('tabs');
  };

  const handlePayViaExistCard = async (card: Card) => {
    try {
      setLoading(true);
      await postTopUpBalance({ amount: Number(amount), card_id: card.id });
      await getUserData()
      navigation.goBack();
      setAmount('');
      toastSuccess(t('top-up-account-screen.balance-topped-up'))
    } catch (error) {
      handleCatchError(error, 'TopUpAccountScreen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
          paddingBottom: insets.bottom + 35,
          paddingHorizontal: 16,
          paddingTop: 47,
        }}
        keyboardShouldPersistTaps="handled"

      >
        <Box gap={24} alignItems="center" flex={1}>
          <LogoIcon />
          <CurrencySwitcher initialCurr={route.params?.currency} />
          <Box flex={1} w="full" gap={24}>
            <Input
              value={amount}
              onChangeText={(val) => setAmount(val.replaceAll(',', ''))}
              placeholder={t('top-up-account-screen.amount-placeholder')}
              autoCorrect={false}
              inputMode="numeric"
              keyboardType="numeric"
              returnKeyType="done"
            />
            <Box row gap={9} mb={12}>
              <AddSumButton sum="5" onPress={() => pressAddSum(5)} />
              <AddSumButton sum="10" onPress={() => pressAddSum(10)} />
              <AddSumButton sum="20" onPress={() => pressAddSum(20)} />
              <AddSumButton sum="50" onPress={() => pressAddSum(50)} />
            </Box>

            <Button
              disabled={!Number(amount) || loading}
              loading={loading}
              children={t('actions:to-pay')}
              onPress={() => submitPay()}
            />
          </Box>
        </Box>
        <Box gap={24}>
          <Box maxHeight={38}>
            <BepaidIcon width="100%" height="100%" />
          </Box>
          {!route.params?.currency ? (
            <Button type="clear" children={t('actions:to-skip')} onPress={handleSkip} />
          ) : null}
        </Box>
      </KeyboardAwareScrollView>
      <UserCardsModal
        mode="card-selection"
        ref={modalCards}
        modalClose={modalCardsClose}
        onCardSelect={handlePayViaExistCard}
        onAddCard={proceedTransaction}
      />
    </>
  );
};

export default TopUpAccountScreen;

const CurrencySwitcher = ({ initialCurr }: { initialCurr?: 'BYN' | 'RUB' }) => {
  const { colors } = useAppTheme();
  const { t } = useLocalization('screens', { keyPrefix: 'top-up-account-screen' })
  const [selectedCurrency, setSelectedCurrency] = useState<'BY' | 'RU'>(
    initialCurr === 'RUB' ? 'RU' : 'BY',
  );
  const [containerWidth, setContainerWidth] = useState(0);

  const indicatorTranslateX = useSharedValue(0);

  useEffect(() => {
    const toValue = selectedCurrency === 'BY' ? 0 : containerWidth / 2;
    indicatorTranslateX.value = withTiming(toValue, { duration: 300 });
  }, [containerWidth, indicatorTranslateX, selectedCurrency]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorTranslateX.value }],
  }));

  const handleTapCurrency = (val: 'BY' | 'RU') => {
    vibrate(HapticFeedbackTypes.selection);
    setSelectedCurrency(val);
  };

  return (
    <Box
      backgroundColor={colors.grey_50}
      row
      height={40}
      p={4}
      borderRadius={8}
      onLayout={(event) =>
        setContainerWidth(event.nativeEvent.layout.width - 8)
      }
    >
      <AnimatedBox
        backgroundColor={colors.background}
        borderRadius={4}
        h="full"
        left={4}
        top={4}
        absolute
        w={containerWidth / 2}
        zIndex={1}
        style={[shadowStyle, animatedStyle]}
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
        effect="none"
      >
        <BelarusIcon />
        <Text
          children={t('by-wallet')}
          variant="p3"
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
        disabled
        effect="none"
        gap={6}
        justifyContent="center"
      >
        <RussiaIcon />
        <Text
          children={t('ru-wallet')}
          variant="p3"
          disabled
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

const AddSumButton = (props: {
  sum: '5' | '10' | '20' | '50';
  onPress: () => void;
}) => {
  const { colors } = useAppTheme();

  return (
    <Box
      h={46}
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      onPress={props.onPress}
      backgroundColor={colors.grey_50}
      borderRadius={8}
    >
      <Text children={'+' + props.sum} fontWeight="800" fontSize={18} />
    </Box>
  );
};
