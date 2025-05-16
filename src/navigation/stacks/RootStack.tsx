import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';

import { Tabs } from '../Tabs';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const { t } = useLocalization();
  const { colors } = useAppTheme();
  return (
    <Stack.Navigator
      initialRouteName="tabs"
      screenOptions={{
        headerTintColor: colors.main,
        headerTitleStyle: { color: colors.textDefault },
        title: '',
      }}
    >
      <Stack.Screen
        name="tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
};
