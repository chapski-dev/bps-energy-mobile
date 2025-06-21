import React, { useCallback,useEffect, useState } from 'react';
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
import chargingService, { ChargingEvents, SessionData } from '@src/service/charging';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';

export default function ChargingSessionScreen({ navigation }: ScreenProps<'charging-session'>) {
  const { colors, insets } = useAppTheme();
  const { openCamera } = useCameraModal();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  // Подписываемся на обновления сессий
  useEffect(() => {
    // Обновление статуса
    const unsubscribeUpdate = chargingService.subscribe('',(session) => {
      setSessions((prev) => 
        prev.map((s) => (s.sessionId === session.sessionId ? session : s))
      );
      setLoadingIds((ids) => {
        const newSet = new Set(ids);
        newSet.delete(session.sessionId);
        return newSet;
      });
    });

    // Событие нового подключения
    const onStarted = (session: SessionData) => {
      setSessions((prev) => [session, ...prev].slice(0, 3));
      setLoadingIds((ids) => new Set(ids).add(session.sessionId));
    };
    chargingService.s(ChargingEvents.sessionStarted, onStarted);

    // Завершение сессии
    const onCompleted = (session: SessionData) => {
      Alert.alert('Зарядка завершена', `Сессия ${session.sessionId} завершена`);
      setSessions((prev) => prev.filter((s) => s.sessionId !== session.sessionId));
    };
    chargingService.on(ChargingEvents.sessionCompleted, onCompleted);

    return () => {
      unsubscribeUpdate();
      chargingService.off(ChargingEvents.sessionStarted, onStarted);
      chargingService.off(ChargingEvents.sessionCompleted, onCompleted);
    };
  }, []);

  // Начать зарядку по QR
  const handleOpenCamera = () => {
    openCamera({
      onQrCodeScan: async (code) => {
        try {
          const session = await chargingService.startSession('', '', code.value);
          console.log('Зарядка начата', session);
        } catch (e) {
          Alert.alert('Ошибка', 'Не удалось начать сессию');
        }
      }
    });
  };

  // Начать зарядку по выбору станции
  const handleStartSession = async (stationId: string, connectorId: string) => {
    try {
      const session = await chargingService.startSession(stationId, connectorId);
      console.log('Зарядка начата', session);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось начать сессию');
    }
  };

  const renderSession = (session: SessionData) => {
    const loading = loadingIds.has(session.sessionId);
    const battery = session.batteryLevel.toString();
    const received = session.receivedKwh.toFixed(2);
    const timeMin = Math.floor(session.elapsedSec / 60).toString();
    const power = session.power.toFixed(2);

    return (
      <Box key={session.sessionId} mb={32}>
        <Text variant="h5" mb={12} children={`Сессия ${session.stationId}-${session.connectorId}`} />
        <Box row gap={12} mb={24}>
          <InfoCard
            title="Мощность"
            value={power}
            unit="кВт"
            icon={<LightningIcon color={colors.green} />}
            loading={loading}
          />
          <InfoCard
            title="Батарея"
            value={battery}
            unit="%"
            icon={<BatteryChargingIcon color={colors.green} />}
            loading={loading}
          />
        </Box>
        <Box row gap={12} mb={24}>
          <InfoCard
            title="Получено"
            value={received}
            unit="кВт·ч"
            icon={<CheckCircleIcon color={colors.green} />}
            loading={loading}
          />
          <InfoCard
            title="Время"
            value={timeMin}
            unit="мин"
            icon={<ClockIcon color={colors.green} />}
            loading={loading}
          />
        </Box>
        {session.status !== 'completed' && (
          <Button
            backgroundColor="green"
            children="Завершить сессию"
            onPress={() => chargingService.publish(ChargingEvents.sessionCompleted, session)}
          />
        )}
      </Box>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{ ...styles.container, paddingTop: insets.top + 12 }}
      showsVerticalScrollIndicator={false}
    >
      <Box alignItems='flex-end' mb={24} onPress={handleOpenCamera}>
        <QrCodeIcon />
      </Box>

      <Text variant="h4" center mb={32} children="Мои сессии зарядки" />

      {/* Кнопки станций для примера (можно вынести в отдельный компонент) */}
      <Box row gap={12} mb={24}>
        {sessions.map((station) => (
          <Button
            key={station.stationId}
            onPress={() => handleStartSession(station.stationId, 'A')}
            children={`№ ${station}`}
            type='outline'
          />
        ))}
      </Box>

      {sessions.length === 0 && (
        <Text center colorName="grey_600" children="Нет активных сессий" />
      )}

      {sessions.map(renderSession)}
    </ScrollView>
  );
}

const InfoCard = ({ title, value, unit, icon, loading }: {
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
});
