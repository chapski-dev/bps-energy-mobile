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
import WalletIcon from '@assets/svg/wallet.svg';

import { useTabNavigation } from '@src/hooks/useTabNavigation';
import { ScreenProps } from '@src/navigation/types';
import { useCameraModal } from '@src/providers/camera';
import { useChargingSessions } from '@src/service/charging';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { ActivityIndicator } from '@src/ui/ActivityIndicator';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { openSupportMessager } from '@src/utils/support/openSupportMessager';
import { deepLinkingService } from '@src/service/deepLinking';
import moment from 'moment';

export default function ChargingSessionScreen({
  navigation,
}: ScreenProps<'charging-session'>) {
  const { colors, insets } = useAppTheme();
  const { openCamera } = useCameraModal();
  const { t } = useTranslation('screens', {
    keyPrefix: 'charging-session-screen',
  });
  const { sessions, stopSession, loading } = useChargingSessions();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSession = sessions[activeIndex];

  const handleWriteToSupport = async () => {
    const message = 'Привет! У меня проблемы со станцией. Помогите';
    openSupportMessager({ message, variant: 'telegram' });
  };

  const nav = useTabNavigation();

  useEffect(() => {
    if (!sessions.length) {
      nav.navigateToTab('map');
    }
    if (sessions.length - 1 < activeIndex) {
      setActiveIndex(0);
    }
  }, [nav, sessions]);

  // Подписываемся на глубокие ссылки
  useEffect(() => {
    const unsubscribe = deepLinkingService.addListener((data) => {
      if (data.type === 'start-session') {
        console.log(`сессия ${data.sessionId} началась`);
        // Здесь можно добавить дополнительную логику для обработки сессии
      }
    });

    return unsubscribe;
  }, []);

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
                nav.navigateToTab('map');
              }
            } catch (error) {
              handleCatchError(error);
            }
          },
          style: 'destructive',
          text: t('confirm-button'),
        },
      ],
    );
  };

  const handleOpenCamera = () => {
    openCamera({
      onQrCodeScan: (code) => {
        // Проверяем, является ли QR-код глубокой ссылкой
        if (code.value && code.value.startsWith('https://bps-energy.by/qr/start-session/')) {
          deepLinkingService.handleDeepLink(code.value);
        }
        // startSession(Math.random().toString())
      },
    });
  };

  const formatTime = (totalSeconds: number) => {
    return moment.utc(totalSeconds * 1000).format('HH:mm:ss');
  };

  const renderBeginsView = () => (
    <>
      <Text
        variant="p3"
        center
        mb={32}
        mx={52}
        colorName="grey_600"
        children={t('session-starting')}
      />
      <StationSelector
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
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
            value={formatTime(activeSession?.duration)}
            unit=""
            icon={<ClockIcon color={colors.green} />}
          />
        </Box>
      </Box>
    </>
  );

  const renderChargingView = () => (
    <>
      <Text
        variant="h4"
        center
        mb={32}
        children={t('charging-session-title', { count: sessions.length })}
      />
      <StationSelector
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
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
            value={formatTime(activeSession?.duration)}
            unit=""
            icon={<ClockIcon color={colors.green} />}
          />
        </Box>
      </Box>
    </>
  );

  const renderFinishingView = () => (
    <>
      {sessions.length > 1 && <Text
        variant="h4"
        center
        mb={32}
        children={t('charging-session-title', { count: sessions.length })}
      />}
      <StationSelector
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <Text children={t('session-complited-title')} variant='p2-semibold' center mb={8} />
      <Text children={t('session-complited-description')} variant='p4' colorName='grey_600' center mb={16} />
      <Box gap={12} mb={24}>
        <InfoCardFinished
          title={t('charged-label')}
          value={parseFloat(activeSession?.charged.toFixed(2))}
          unit={t('kilowatt-hour')}
          icon={<CheckCircleIcon color={colors.green} />}
        />
        <InfoCardFinished
          title={t('battery-label')}
          soc_begin={activeSession?.soc_begin}
          soc_end={activeSession?.soc_end}
          unit="%"
          icon={<BatteryChargingIcon color={colors.green} />}
        />
        <InfoCardFinished
          title={t('time-label')}
          value={formatTime(activeSession?.duration)}
          unit=""
          icon={<ClockIcon color={colors.green} />}
        />
        <InfoCardFinished
          title={t('money-spent')}
          value={activeSession?.spent}
          unit="BYN"
          icon={<WalletIcon color={colors.green} />}
        />
      </Box>
    </>
  );

  const renderContent = () => {
    if (!activeSession) return null;

    switch (activeSession.state) {
      case 'begins':
        return renderBeginsView();
      case 'charging':
        return renderChargingView();
      case 'finishing':
        return renderFinishingView();
      default:
        return renderChargingView();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        ...styles.container,
        paddingTop: insets.top + sessions.length < 3 ? 0 : 90,
      }}
      showsVerticalScrollIndicator={false}
    >
      {sessions.length < 3 && (
        <Box alignItems="flex-end" mb={44} onPress={handleOpenCamera}>
          <QrCodeIcon />
        </Box>
      )}
      <Box alignItems="center" mb={48}>
        <LogoIcon color={colors.text} />
      </Box>
      {renderContent()}
      <Box gap={12}>
        <Button
          onPress={handleWriteToSupport}
          children={t('write-to-support')}
          icon={<TelegramLogoIcon color={colors.text} />}
          type="outline"
        />
        {activeSession?.state !== 'finishing' ? (
          <Button
            onPress={handleEndSession}
            backgroundColor={'success_500'}
            children={t('end-session')}
            disabled={loading}
          />
        ) : (
          <Button
            onPress={() => navigation.navigate('tabs', { screen: 'map' })}
            backgroundColor="success_500"
            children={t('done')}
            disabled={loading}
          />
        )}
      </Box>
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

const StationSelector = ({
  setActiveIndex,
  activeIndex,
}: {
  setActiveIndex: (index: number) => void;
  activeIndex: number;
}) => {
  const { loading, sessions } = useChargingSessions();
  const { colors } = useAppTheme();
  if (sessions.length > 1) {
    return (
      <Box
        row
        gap={12}
        mb={24}
        p={4}
        borderRadius={8}
        backgroundColor={colors.grey_50}
      >
        {sessions.map((station, i) => (
          <Box
            key={station.id}
            flex={1}
            backgroundColor={activeIndex === i ? colors.white : undefined}
            px={10}
            py={7}
            alignItems="center"
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
    );
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
      <Box row alignItems="center" mb={8} justifyContent="space-between">
        <Text variant="p3" colorName="grey_600" children={title} />
        {loading || Number(value) === 0 ? (
          <Box>
            <ActivityIndicator size={24} />
          </Box>
        ) : (
          icon
        )}
      </Box>
      {loading ? (
        <Text variant="h4" colorName="grey_600" children="—" />
      ) : (
        <Text variant="h4" colorName="grey_800" children={`${value} ${unit}`} />
      )}
    </Box>
  );
};

const InfoCardFinished = ({
  title,
  value,
  unit,
  icon,
  soc_begin,
  soc_end,
}: {
  title: string;
  value?: string | number;
  unit?: string;
  icon: React.ReactNode;
  soc_begin?: number;
  soc_end?: number;
}) => {
  const { colors } = useAppTheme();
  const { loading } = useChargingSessions();

  const renderValueText = () => {
    if (loading) {
      return <Text variant="h4" colorName="grey_200" children="—" />;
    }
    if (soc_begin) {
      return (
        <Text>
          <Text
            variant="p2-semibold"
            colorName="grey_600"
            children={`${soc_begin}% → `}
          />
          <Text
            variant="p2-semibold"
            colorName="grey_800"
            children={`${soc_end}%`}
          />
        </Text>
      );
    }
    return (
      <Text
        variant="p2-semibold"
        colorName="grey_800"
        children={`${value} ${unit}`}
      />
    );
  };

  return (
    <Box
      backgroundColor={colors.grey_50}
      borderRadius={12}
      justifyContent="space-between"
      alignItems="center"
      px={12}
      py={16}
      flex={1}
      gap={4}
      row
    >
      <Box row alignItems="center" justifyContent="center" gap={8}>
        {loading || Number(value) === 0 ? (
          <Box>
            <ActivityIndicator size={24} />
          </Box>
        ) : (
          icon
        )}
        <Text variant="p2" colorName="grey_600" children={title} />
      </Box>
      {renderValueText()}
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
