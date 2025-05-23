import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Vibration } from 'react-native';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { OtpInput, OtpInputProps, OtpInputRef } from 'react-native-otp-entry';

import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Text } from '@src/ui';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';
import { isIOS } from '@src/utils/vars/platform';
import { vibrate } from '@src/utils/vibrate';

const OTP_PASSWORD_LENGTH = 4;

const OtpVerifyScreen = ({ navigation, route }: ScreenProps<'otp-verify'>) => {
  const { colors } = useAppTheme();
  const { t } = useLocalization();

  const action = route.params.action;

  const otpInput = useRef<OtpInputRef>(null);

  const [notMatch, setNotMatch] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { onSignin } = useAuth();

  const handleInputChanges = async (text: string) => {
    try {
      if (text.length === OTP_PASSWORD_LENGTH) {
        setDisabled(true);
        await wait(300);
        setLoading(true);
        if (action === 'login' && route.params.phone) {
          await onSignin({
            otp: text,
            phone: route.params.phone.replaceAll(' ', '')
          });
          vibrate(HapticFeedbackTypes.notificationSuccess);
          return;
        } else if (action === 'phone-verify') {
          navigation.replace('settings-profile');
          return;
        } else {
          navigation.replace('registration', { step: 'residency' });
          return;
        }
      }
    } catch (e) {
      handleCatchError(e)
      Vibration.vibrate();
      setNotMatch(true);
      setDisabled(false);
      otpInput.current?.setValue('');
      isIOS && otpInput.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const theme: OtpInputProps['theme'] = useMemo(
    () => ({
      containerStyle: { gap: 12, width: 'auto' },
      filledPinCodeContainerStyle: notMatch
        ? { borderColor: colors.red, borderRadius: 16, borderWidth: 1 }
        : { borderColor: colors.main, borderRadius: 16, borderWidth: 1 },
      focusedPinCodeContainerStyle: {
        borderColor: notMatch ? colors.red : colors.grey_200,
        borderRadius: 15,
        borderWidth: 1
      },
      pinCodeContainerStyle: {
        borderColor: notMatch ? colors.red : colors.grey_200,
        borderRadius: 15,
        borderWidth: 1,
        width: 47
      },
      pinCodeTextStyle: { color: colors.grey_800, fontSize: 24 }
    }),
    [colors, notMatch]
  );

  return (
    <>
      <Box p={16} pt={54} gap={54} alignItems="center">
        {action !== 'invite' ? (
          <>
            <Text type="h2" children={t('confirm_the_number')} />
            <Box row flexWrap="wrap" justifyContent="center">
              <Text children={t('we_sent_it_to_a_number')} />
              <Text children={route.params?.phone} />
              <Text children={t('confirmation_code_enter_it_below')} />
            </Box>
          </>
        ) : (
          <Text type="h2" children={t('enter_the_invitation_code')} />
        )}
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
          />
        )}
        {action === 'phone-verify' && (
          <Button children={t('sms-code-failed-to-arrive')} type="clear" onPress={() => null} />
        )}
      </Box>
    </>
  );
};

export default OtpVerifyScreen;
