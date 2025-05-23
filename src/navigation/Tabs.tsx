import React from 'react';
import { GestureResponderEvent, Pressable } from 'react-native';
import BPSIcon from '@assets/svg/BPS.svg';
import MapPinIcon from '@assets/svg/map-pin.svg';
import ProfileIcon from '@assets/svg/user-fill.svg';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import ChargingScreen, { setCodeScanedRef } from '@src/screens/ChargingScreen';
import MapScreen from '@src/screens/MapScreen';
import { ProfileScreen } from '@src/screens/ProfileScreen';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box } from '@src/ui';

import { TabsParamList } from './types';

const Tab = createBottomTabNavigator<TabsParamList>();

export const Tabs = () => {
  const { t } = useLocalization();
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
          title: t('map'),
        }}
      />
      <Tab.Screen
        name="charging"
        component={ChargingScreen}
        options={{
          headerShown: false,
          tabBarButton: (props) => <ChargingTabButton {...props} />,
          tabBarIcon: () => null,
          title: t('charging-session'),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
          title: t('profile'),
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

  const handlePress = (event: GestureResponderEvent) => {
    event.preventDefault();
    
    setCodeScanedRef && setCodeScanedRef!(null)
    onPress(event)
  }

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
        bottom={10}
      >
        <Box
          w={52}
          h={52}
          backgroundColor={colors.main}
          justifyContent="center"
          borderRadius={50}
          alignItems="center"
        >
          <BPSIcon width={38} height={38} />
        </Box>
      </Box>
      {children}
    </Pressable>
  );
};
