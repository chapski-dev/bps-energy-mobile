import React from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Pressable } from 'react-native';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import BPSIcon from '@assets/svg/BPS.svg';
import MapPinIcon from '@assets/svg/map-pin.svg';
import ProfileIcon from '@assets/svg/user-fill.svg';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { AuthState, useAuth } from '@src/providers/auth';
import { useCameraModal } from '@src/providers/camera';
import ChargingSessionScreen from '@src/screens/ChargingSessionScreen';
import MapScreen from '@src/screens/MapScreen';
import { ProfileScreen } from '@src/screens/ProfileScreen';
import { useChargingSessions } from '@src/service/charging';
import { useAppTheme } from '@src/theme/theme';
import { Box } from '@src/ui';
import { ActivityIndicator } from '@src/ui/ActivityIndicator';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { vibrate } from '@src/utils/vibrate';

import { withProtectedScreen } from './guards/withProtectedScreen';
import { navigationRef } from './navigationRef';
import { TabsParamList } from './types';


const Tab = createBottomTabNavigator<TabsParamList>();

export const Tabs = () => {
  const { t } = useTranslation('screens');
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.grey_800,
      }}
    >
      <Tab.Screen
        name="map"
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <MapPinIcon color={color} />,
          title: t('map-screen.title'),
        }}
      />
      <Tab.Screen
        name="charging-session"
        component={withProtectedScreen(ChargingSessionScreen)}
        options={{
          headerShown: false,
          tabBarButton: props => <ChargingTabButton {...props} />,
          tabBarIcon: () => null,
          title: t('charging-session-screen.title'),
        }}
      />
      <Tab.Screen
        name="profile"
        component={withProtectedScreen(ProfileScreen)}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
          title: t('profile-screen.title'),
        }}
      />
    </Tab.Navigator>
  );
};

const ChargingTabButton = ({
  onPress,
  style,
  children,
}: BottomTabBarButtonProps) => {
  const { colors } = useAppTheme();
  const { openCamera } = useCameraModal();
  const { authState } = useAuth();
  const { loading, sessions, startSession } = useChargingSessions();

  const handlePress = (event: GestureResponderEvent) => {
    event.preventDefault();

    if (authState !== AuthState.ready) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'login' }]
      })
      return;
    }
    if (sessions.length) {
      onPress && onPress(event);
    } else if (!loading) {
      vibrate(HapticFeedbackTypes.impactLight)
      openCamera({
        onQrCodeScan: async (code) => {
          try {
            startSession(Math.random().toString())
            navigationRef.preload('charging-session')
            navigationRef.navigate('charging-session')
          } catch (error) {
            handleCatchError(error)
          }
        },
      });
    }
  };


  return (
    <Pressable onPress={handlePress} style={[style, { position: 'relative' }]}>
      <Box
        w={72}
        h={72}
        backgroundColor={colors.background}
        justifyContent="center"
        borderRadius={50}
        alignItems="center"
        absolute
        bottom={10}>
        <Box
          w={52}
          h={52}
          backgroundColor={(sessions.length || loading) ? colors.green : colors.main}
          justifyContent="center"
          borderRadius={50}
          alignItems="center">
          {loading ?
            <ActivityIndicator color={colors.white} /> :
            <BPSIcon width={38} height={38} />}
        </Box>
      </Box>
      {children}
    </Pressable>
  );
};