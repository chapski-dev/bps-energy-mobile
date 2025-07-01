import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import BatteryChargingIcon from '@assets/svg/battery-charging.svg';
import CheckCircleIcon from '@assets/svg/check-circle.svg';
import ClockIcon from '@assets/svg/clock.svg';
import LightningIcon from '@assets/svg/lightning.svg';
import LogoIcon from '@assets/svg/logo.svg';
import QrCodeIcon from '@assets/svg/qr-code.svg';
import TelegramLogoIcon from '@assets/svg/telegram-logo.svg';

import { useTabNavigation } from '@src/hooks/useTabNavigation';
import { ScreenProps } from '@src/navigation/types';
import { useCameraModal } from '@src/providers/camera';
import { useChargingSessions } from '@src/service/charging';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { ActivityIndicator } from '@src/ui/ActivityIndicator';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { parseDate } from '@src/utils/parseDate';
import { openTelegram } from '@src/utils/support/openTelegram';


export default function ChargingSessionScreen({
  navigation
}: ScreenProps<'charging-session'>) {
  const { colors, insets } = useAppTheme();
  const { openCamera } = useCameraModal();
  const { t } = useTranslation('screens', { keyPrefix: 'charging-session-screen' });
  const { sessions, stopSession, loading } = useChargingSessions();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSession = sessions[activeIndex];

  const handleWriteToSupport = async () => {
    const username = 'Alex_Poleshchuk';
    const message = 'Привет! У меня проблемы со станцией. Помогите';
    openTelegram(username, message)
  };

  const nav = useTabNavigation();

  useEffect(() => {
    if (!sessions.length) {
      nav.navigateToTab('map')
    }
  }, [nav, sessions.length])

  const handleEndSession = () => {
    Alert.alert(
      t('end-session-confirm-title'),
      t('end-session-confirm-message'),
      [
        { style: 'cancel', text: t('cancel-button') },
        {
          onPress: async () => {
            try {
              await stopSession(activeSession.id);
              setActiveIndex(0);
              if (!sessions.length) {
                nav.navigateToTab('map')
              }
            } catch (error) {
              handleCatchError(error)
            }
          },
          style: 'destructive',
          text: t('confirm-button'),
        },
      ]
    );
  };

  const handleOpenCamera = () => {
    openCamera({
      onQrCodeScan: (code) => {
        // startSession(Math.random().toString())
      }
    })
  }

  const renderInProgressView = () => (
    <>
      {sessions.length < 3 &&
        <Box alignItems='flex-end' mb={44} onPress={handleOpenCamera}>
          <QrCodeIcon />
        </Box>}
      <Box alignItems="center" mb={64}>
        <LogoIcon color={colors.text} />
      </Box>
      {activeSession?.power === 0 ? (
        <Text
          variant="p3"
          center
          mb={32}
          mx={52}
          colorName='grey_600'
          children={t('session-starting')}
        />
      ) : (
        <Text
          variant="h4"
          center
          mb={32}
          children={t('charging-session-title', { count: sessions.length })}
        />
      )}
      <StationSelector activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <Box gap={12} mb={24}>
        <Box row gap={12}>
          <InfoCard
            title={t('power-label')}
            value={activeSession?.power}
            unit={t('kilowatt')}
            icon={<LightningIcon color={colors.green} />}
          />
          <InfoCard
            title={t('battery-label')}
            value={activeSession?.soc}
            unit="%"
            icon={<BatteryChargingIcon color={colors.green} />}
          />
        </Box>

        <Box row gap={12}>
          <InfoCard
            title={t('charged-label')}
            value={parseFloat(activeSession?.charged.toFixed(2))}
            unit={t('kilowatt-hour')}
            icon={<CheckCircleIcon color={colors.green} />}
          />
          <InfoCard
            title={t('time-label')}
            value={parseDate(new Date(), 'timeOnly', true)}
            unit=""
            icon={<ClockIcon color={colors.green} />}
          />
        </Box>
      </Box>

      <Box gap={12}>
        <Button
          onPress={handleWriteToSupport}
          children={t('write-to-support')}
          icon={<TelegramLogoIcon color={colors.text} />}
          type='outline'
        />
        <Button
          onPress={handleEndSession}
          backgroundColor={'success_500'}
          children={t('end-session')}
          disabled={loading}
        />
      </Box>
    </>
  );

  return (
    <ScrollView
      contentContainerStyle={{ ...styles.container, paddingTop: insets.top + 12 }}
      showsVerticalScrollIndicator={false}
    >
      {renderInProgressView()}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
});


const StationSelector = ({ setActiveIndex, activeIndex }) => {
  const { loading, sessions } = useChargingSessions();
  const { colors } = useAppTheme();
  if (sessions.length > 1) {
    return (
      <Box row gap={12} mb={24} p={4} borderRadius={8} backgroundColor={colors.grey_50}>
        {sessions.map((station, i) => (
          <Box
            key={station.id}
            flex={1}
            backgroundColor={activeIndex === i ? colors.white : undefined}
            px={10}
            py={7}
            alignItems='center'
            borderRadius={4}
            style={shadowStyle}
            disabled={loading}
            onPress={() => setActiveIndex(i)}
          >
            <Text
              variant={activeIndex === i ? 'p3-semibold' : 'p3'}
              children={`№ ${station.id}`}
              colorName={activeIndex === i ? 'black' : 'text'}
            />
          </Box>
        ))}
      </Box>
    )
  }
  return null;
};

const InfoCard = ({
  title,
  value,
  unit,
  icon,
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
}) => {
  const { colors } = useAppTheme();
  const { loading } = useChargingSessions();

  return (
    <Box
      backgroundColor={colors.grey_50}
      borderRadius={12}
      p={12}
      flex={1}
      gap={4}
    >
      <Box row alignItems="center" mb={8} justifyContent='space-between'>
        <Text variant="p3" colorName="grey_600" children={title} />
        {loading || Number(value) === 0 ? <Box><ActivityIndicator size={24} /></Box> : icon}
      </Box>
      {loading ?
        <Text variant="h4" colorName="grey_200" children="—" /> :
        <Text variant="h4" colorName="grey_800" children={`${value} ${unit}`} />}
    </Box>
  );
};

const shadowStyle = {
  elevation: 8,
  shadowColor: '#000',
  shadowOffset: {
    height: 4,
    width: 0,
  },
  shadowOpacity: 0.3,
  shadowRadius: 4.65,
};