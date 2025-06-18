import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import BatteryChargingIcon from '@assets/svg/battery-charging.svg';
import CheckCircleIcon from '@assets/svg/check-circle.svg';
import ClockIcon from '@assets/svg/clock.svg';
import LightningIcon from '@assets/svg/lightning.svg';
import LogoIcon from '@assets/svg/logo.svg';
import QrCodeIcon from '@assets/svg/qr-code.svg';
import TelegramLogoIcon from '@assets/svg/telegram-logo.svg';
import WalletIcon from '@assets/svg/wallet.svg';

import { ScreenProps } from '@src/navigation/types';
import { useCameraModal } from '@src/providers/camera';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';

export default function ChargingSessionScreen({
  navigation
}: ScreenProps<'charging-session'>) {
  const { colors, insets } = useAppTheme();
  const { openCamera } = useCameraModal();
  const [loading, setLoading] = useState(false);
  const [chargingStatus, setChargingStatus] = useState<'in-progress' | 'completed'>('in-progress');
  const [sessionData, setSessionData] = useState({
    availableStations: ['0041', '0045', '0061'],
    battery: '51',
    batteryFrom: '14',
    chargingTime: '00:07:18',
    power: '49.95',
    received: '1.85',
    selectedStation: '0041',
    time: '2',
    totalCost: '3.28'
  });

  const [timeCounter, setTimeCounter] = useState(2);

  // Эмуляция обновления данных сессии
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeCounter(prev => prev + 1);
      setSessionData(prev => ({
        ...prev,
        battery: Math.min(100, parseInt(prev.battery) + 1).toString(),
        received: (parseFloat(prev.received) + 0.15).toFixed(2),
        time: (timeCounter + 1).toString()
      }));

      // Симуляция завершения зарядки при достижении 100%
      if (parseInt(sessionData.battery) >= 100) {
        setChargingStatus('completed');
        clearInterval(interval);
      }
    }, 60000); // Обновление каждую минуту

    return () => clearInterval(interval);
  }, [timeCounter, sessionData.battery]);

  const handleWriteToSupport = async () => {
    console.log('Написать в поддержку');
  };

  const handleEndSession = async () => {
    console.log('Завершить сессию');
    setChargingStatus('completed');
  };

  const handleDone = () => {
    setChargingStatus('in-progress')
    // navigation.navigate('map'); // или 'home'
  };

  const handleViewHistory = () => {
    navigation.navigate('charging-history');
  };
  const handleOpenCamera = () => {
    openCamera({
      onQrCodeScan: (code) => {
        Alert.alert('QR код:' + code.value, 'Сканирование завершено');
      }
    })
  }

  const StationSelector = () => (
    <Box row gap={12} mb={24} p={4} borderRadius={8} backgroundColor={colors.grey_50}>
      {sessionData.availableStations.map((station) => (
        <Box
          key={station}
          flex={1}
          backgroundColor={station === sessionData.selectedStation ? colors.white : undefined}
          px={10}
          py={7}
          alignItems='center'
          borderRadius={4}
          style={shadowStyle}
          onPress={() => setSessionData(prev => ({ ...prev, selectedStation: station }))}
        >
          <Text
            variant={station === sessionData.selectedStation ? 'p3-semibold' : 'p3'}
            children={`№ ${station}`}
          />
        </Box>
      ))}
    </Box>
  );

  // Экран процесса зарядки
  const renderInProgressView = () => (
    <>
      <Box alignItems='flex-end' mb={44} onPress={handleOpenCamera}>
        <QrCodeIcon />
      </Box>
      <Box alignItems="center" mb={64}>
        <LogoIcon />
      </Box>

      <Text
        variant="h4"
        center
        mb={32}
        children="Сессии зарядки"
      />

      <StationSelector />

      <Box gap={12} mb={24}>
        <Box row gap={12}>
          <InfoCard
            title="Мощность"
            value={sessionData.power}
            unit="кВт"
            icon={<LightningIcon color={colors.green} />}
            loading={loading}
          />
          <InfoCard
            title="Батарея"
            value={sessionData.battery}
            unit="%"
            icon={<BatteryChargingIcon color={colors.green} />}
            loading={loading}
          />
        </Box>

        <Box row gap={12}>
          <InfoCard
            title="Получено"
            value={sessionData.received}
            unit="кВт·ч"
            icon={<CheckCircleIcon color={colors.green} />}
            loading={loading}
          />
          <InfoCard
            title="Время"
            value={sessionData.time}
            unit="мин"
            icon={<ClockIcon color={colors.green} />}
            loading={loading}
          />
        </Box>
      </Box>

      <Box gap={12}>
        <Button
          onPress={handleWriteToSupport}
          children="Написать в поддержку"
          icon={<TelegramLogoIcon />}
          type='outline'
        />

        <Button
          onPress={handleEndSession}
          backgroundColor='green'
          children="Завершить сессию"
        />
      </Box>
    </>
  );

  // Экран завершенной зарядки
  const renderCompletedView = () => (
    <>
      <Box alignItems="center" mt={24+44} mb={48}>
        <LogoIcon />
      </Box>

      <Text
        variant="h3"
        center
        mb={8}
        children="Зарядка завершена!"
      />
      <Text
        variant="p2"
        center
        colorName="grey_600"
        mb={32}
        children="Спасибо что выбираете BPS Energy"
      />

      <Box gap={8} mb={24}>
        <SummaryCard
          title="Получено"
          value={`${sessionData.received} кВт·ч`}
          icon={<CheckCircleIcon color={colors.green} />}
        />

        <SummaryCard
          title="Батарея"
          value={`${sessionData.battery}%`}
          icon={<BatteryChargingIcon color={colors.green} />}
          from={`${sessionData.batteryFrom}% → `}
        />

        <SummaryCard
          title="Время зарядки"
          value={sessionData.chargingTime}
          icon={<ClockIcon color={colors.green} />}
        />

        <SummaryCard
          title="Потрачено"
          value={`${sessionData.totalCost} BYN`}
          icon={<WalletIcon color={colors.green} />}
        />
      </Box>

      <Box gap={12}>
        <Button
          onPress={handleDone}
          backgroundColor="green"
          children="Готово"
        />

        <Button
          onPress={handleViewHistory}
          type="outline"
          children="Посмотреть историю"
        />
      </Box>
    </>
  );

  return (
    <ScrollView
      contentContainerStyle={{ ...styles.container, paddingTop: insets.top + 12 }}
      showsVerticalScrollIndicator={false}
    >
      {chargingStatus === 'in-progress' ? renderInProgressView() : renderCompletedView()}
    </ScrollView>
  );
}

const InfoCard = ({
  title,
  value,
  unit,
  icon,
  loading,
}: {
  title: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  loading: boolean;
}) => {
  const { colors } = useAppTheme();
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
        {loading ? <ActivityIndicator /> : icon}
      </Box>
      <Text variant="h4" colorName="grey_800" children={`${value} ${unit}`} />
    </Box>
  );
};

const SummaryCard = ({
  title,
  value,
  icon,
  from,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  from?: string
}) => {
  const { colors } = useAppTheme();

  return (
    <Box
      backgroundColor={colors.grey_50}
      borderRadius={8}
      px={12}
      py={16}
      row
      alignItems="center"
      justifyContent="space-between"
    >
      <Box row alignItems="center" gap={8}>
        {icon}
        <Text variant="p2" colorName="grey_700" children={title} />
      </Box>
      <Text>
        <Text variant="p2-semibold" colorName="grey_600" children={from} />
        <Text variant="p2-semibold" colorName="grey_800" children={value} />
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
});

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