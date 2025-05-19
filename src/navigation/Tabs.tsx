import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ProfileScreen } from '@src/screens/ProfileScreen';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';

import MapPinIcon from '@assets/svg/map-pin.svg';
import BPSIcon from '@assets/svg/BPS.svg';
import ProfileIcon from '@assets/svg/user.svg';

import { TabsParamList } from './types';
import MapScreen from '@src/screens/MapScreen';
import ChargingScreen from '@src/screens/ChargingScreen';

const Tab = createBottomTabNavigator<TabsParamList>();

export const Tabs = () => {
  const { t } = useLocalization()
  const { colors } = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.main,
        tabBarInactiveTintColor: colors.grey_800,
        tabBarLabelStyle: { color: 'black' },
      }}
    >
      <Tab.Screen
        name="map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => <MapPinIcon color={color} />,
          title: t('my-orders'),
        }}
      />
      <Tab.Screen
        name="charging"
        component={ChargingScreen}
        options={{
          tabBarIcon: ({ color }) => <BPSIcon color={color} />,
          title: t('my-orders'),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
          title: t('profile'),
        }}
      />
    </Tab.Navigator>
  );
};
