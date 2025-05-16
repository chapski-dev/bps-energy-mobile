import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ProfileScreen } from '@src/screens/ProfileScreen';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';

import OrderIcon from '../../assets/svg/orders.svg';
import ProfileIcon from '../../assets/svg/profile-outline.svg';

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
        tabBarInactiveTintColor: colors.textDefault,
        tabBarLabelStyle: { color: 'black' },
      }}
    >
      <Tab.Screen
        name="map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => <OrderIcon color={color} />,
          title: t('my-orders'),
        }}
      />
      <Tab.Screen
        name="charging"
        component={ChargingScreen}
        options={{
          tabBarIcon: ({ color }) => <OrderIcon color={color} />,
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
