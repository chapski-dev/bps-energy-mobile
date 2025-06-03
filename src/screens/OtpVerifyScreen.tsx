import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, AppState, AppStateStatus, Keyboard, Vibration } from 'react-native';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { OtpInput, OtpInputProps, OtpInputRef } from 'react-native-otp-entry';

import { postConfirmEmail } from '@src/api';
import { useThemedToasts } from '@src/hooks/useThemedToasts.';
import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Text } from '@src/ui';
import { FakeView } from '@src/ui/Layouts/FakeView';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';
import { vibrate } from '@src/utils/vibrate';

const OTP_PASSWORD_LENGTH = 4;
const COUNTDOWN_SECONDS = 60;

const OtpVerifyScreen = ({ navigation, route }: ScreenProps<'otp-verify'>) => {
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const { toastSuccess } = useThemedToasts();

  const otpInput = useRef<OtpInputRef>(null);

  const [notMatch, setNotMatch] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  const countdownStartedAt = useRef<number>(Date.now());
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const updateCountdown = useCallback(() => {
    const elapsed = Math.floor((Date.now() - countdownStartedAt.current) / 1000);
    const remaining = COUNTDOWN_SECONDS - elapsed;
    setSeconds(Math.max(remaining, 0));
  }, []);

  useEffect(() => {
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        updateCountdown();
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [updateCountdown]);

  const retrySend = useCallback(async () => {
    try {
      setRetryLoading(true);
      await wait(300);
      toastSuccess('Мы повторно выслали код. Проверьте почту!');
      countdownStartedAt.current = Date.now();
      updateCountdown();
    } catch (error) {
      handleCatchError(error, 'retrySend');
    } finally {
      setRetryLoading(false);
    }
  }, [toastSuccess, updateCountdown]);

  const handleInputChanges = useCallback(async (code: string) => {
    if (code.length !== OTP_PASSWORD_LENGTH) return;
    try {
      setDisabled(true);
      setLoading(true);
      if (route.params.verify === 'reset-password') {
        setDisabled(false);
        navigation.navigate('set-new-password', { email: route.params?.email, otp: code })
      }
      if (route.params.verify === 'registration') {
        await postConfirmEmail({
          email: route.params?.email,
          verification_code: code
        })
        navigation.navigate('top-up-account')
        vibrate(HapticFeedbackTypes.notificationSuccess);
      }
      return;
    } catch (e) {
      handleCatchError(e);
      Vibration.vibrate();
      setNotMatch(true);
      setDisabled(false);
      otpInput.current?.setValue('');
    } finally {
      setLoading(false);
    }
  }, [navigation, route.params?.email, route.params.verify]);

  const theme: OtpInputProps['theme'] = useMemo(
    () => ({
      containerStyle: {
        flexShrink: 1,
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
        width: '100%'
      },
      filledPinCodeContainerStyle: {
        borderColor: notMatch ? colors.red_500 : colors.main,
        borderRadius: 8,
        borderWidth: 1
      },
      focusedPinCodeContainerStyle: {
        borderColor: notMatch ? colors.red_500 : colors.grey_200,
        borderRadius: 8,
        borderWidth: 1
      },
      pinCodeContainerStyle: {
        borderColor: notMatch ? colors.red_500 : colors.grey_200,
        borderRadius: 8,
        borderWidth: 1,
        flex: 1,
        height: 74,
        maxWidth: 59,
        minWidth: 39,
      },
      pinCodeTextStyle: { color: colors.grey_800, fontSize: 28, fontWeight: '800' }
    }),
    [colors, notMatch]
  );

  return (
    <Box
      p={16}
      pt={54}
      alignItems="center"
      accessible={false}
      onPress={Keyboard.dismiss}
      effect="none"
      flex={1}
    >
      <Box flex={1}
        gap={56}
      >
        <Box gap={8} alignItems="center">
          <Text variant="h4" children={t('confirm_the_email')} />
          <Box row flexWrap="wrap" justifyContent="center">
            <Text variant="p2" children={t('we_sent_it_to_a_number')} colorName='grey_600' />
            <Text variant="p2" children={route.params?.email} />
            <Text variant="p2" children={t('confirmation_code_enter_it_below')} colorName='grey_600' />
          </Box>
        </Box>
        {loading ? (
          <ActivityIndicator color={colors.main} />
        ) : (
          <OtpInput
            autoFocus
            ref={otpInput}
            disabled={disabled}
            theme={theme}
            numberOfDigits={OTP_PASSWORD_LENGTH}
            onTextChange={handleInputChanges}
            focusColor={colors.main}
            onFocus={() => setNotMatch(false)}
          />
        )}
      </Box>
      <Button
        loading={retryLoading}
        disabled={retryLoading || seconds !== 0}
        type="clear"
        onPress={retrySend}
      >
        Выслать код повторно {seconds !== 0 ? `(0:${seconds})` : ''}
      </Button>
      <FakeView />
    </Box>
  );
};

export default OtpVerifyScreen;