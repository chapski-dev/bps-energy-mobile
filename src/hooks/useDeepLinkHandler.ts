import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { handleDeepLinkWithAuth,useAuth } from '@src/providers/auth';

export const useDeepLinkHandler = () => {
  const { authState } = useAuth();

  const handleChargingCompleteNotification = (sessionId: string) => {
    // Здесь можно добавить API вызов для получения деталей сессии
    const mockChargingDetails = {
      connector: {
        id: 1,
        power: 50,
        type: 'CCS' as const,
      },
      id: parseInt(sessionId),
      location: {
        address: 'Аранская улица, 11, Минск',
        image: 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80',
        name: 'BPS Energy',
      },
      session: {
        cost: 8.44,
        duration_minutes: 75,
        currency: 'BYN' as const,
        end_time: '2024-01-15T11:45:00Z',
        energy_received: 28.125,
        power_avg: 22.5,
        soc_end: 85,
        soc_increase: 65,
        soc_start: 20,
        start_time: '2024-01-15T10:30:00Z',
      },
    };

    handleDeepLinkWithAuth(
      authState,
      'charging-session-summary',
      {
        remainingSessions: 0,
        session: mockChargingDetails,
      }
    );
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // Здесь можно добавить логику для обработки диплинков при возвращении в приложение
      // Например, проверить, есть ли pending deep link
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  return {
    handleChargingCompleteNotification,
  };
}; 