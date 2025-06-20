import React, { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { ActivityIndicator, ScrollView, StyleSheet, Switch } from 'react-native';

import { NotificationSettings } from '@src/api/types';
import { useAppStateChangeWithCallbacks } from '@src/hooks/useAppStateChangeWithCallbacks';
import { useLocalization } from '@src/hooks/useLocalization';
import { ScreenProps } from '@src/navigation/types';
import messaging from '@src/service/messaging';
import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';


export enum NotifictationOption {
  start_and_end_of_charging = 'start_and_end_of_charging',
  balance_replenished = 'balance_replenished',
  balance_less_than_3_byn = 'balance_less_than_3_byn',
  push_notifications = 'push_notifications',
  special_offers = 'special_offers'
}

export default function NotificationsSettingsScreen({
  navigation
}: ScreenProps<'notifications-settings'>) {
  const { colors, insets } = useAppTheme();
  const { t } = useLocalization('screens', { keyPrefix: 'notifications-settings-screen'});
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      settings: {
        [NotifictationOption.start_and_end_of_charging]: false,
        [NotifictationOption.push_notifications]: messaging.isEnabled(),
        [NotifictationOption.balance_replenished]: false,
        [NotifictationOption.balance_less_than_3_byn]: false,
        [NotifictationOption.special_offers]: false,
      },
    },
  })
  const { setValue, getValues } = form


  const handleSave = async (values: NotificationSettings['settings']) => {
    try {
      setLoading(true)
      await wait(4500)
      // Здесь будет логика сохранения настроек
      setValue('settings', values)
    } catch (error) {
      handleCatchError(error)
    } finally {
      setLoading(false)
    }
  };

  const handleChangeSettings = async (val: NotificationSettings['settings']) => {
    const newValues = valuesWithPermission(val)
    await handleSave(newValues)
  }

  const valuesWithPermission = (val: NotificationSettings['settings']) => {
    const push_notifications_enabled = messaging.isEnabled() ?
      val[NotifictationOption.push_notifications] : false
    return { ...val, [NotifictationOption.push_notifications]: push_notifications_enabled }
  }

  useAppStateChangeWithCallbacks(undefined, async () => {
    // when apps goes foreground there is a chance that permissions will be disabled
    try {
      const newValues = valuesWithPermission(getValues().settings)
      if (JSON.stringify(newValues) !== JSON.stringify(getValues().settings)) {
        // TODO: api method to save settings
        // await setNotificationSettings({ settings: newValues }) 
      }
      setValue('settings', newValues)
    } catch (e) {
      handleCatchError(e)
    }
  })


  return (
    <FormProvider {...form}>
      <Box flex={1} pb={insets.bottom || 15} px={16}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
        >
          <Box
            mt={16}
            borderColor={colors.grey_100}
          >
            <SettingRow
              title={t('options.start_and_end_of_charging')}
              onToggle={handleChangeSettings}
              name={NotifictationOption.start_and_end_of_charging}
              disabled={loading}
            />

            <SettingRow
              title={t('options.balance_replenished')}
              onToggle={handleChangeSettings}
              name={NotifictationOption.balance_replenished}
              disabled={loading}
            />

            <SettingRow
              title={t('options.balance_less_than_3_byn')}
              onToggle={handleChangeSettings}
              name={NotifictationOption.balance_less_than_3_byn}
              disabled={loading}
            />

            <SettingRow
              title={t('options.special_offers')}
              onToggle={handleChangeSettings}
              name={NotifictationOption.special_offers}
              disabled={loading}
            />
          </Box>
        </ScrollView>
      </Box>
    </FormProvider>
  );
}

const SettingRow = ({
  title,
  onToggle,
  name,
  disabled,
}: {
  title: string;
  onToggle: (val: NotificationSettings['settings']) => Promise<void>;
  name: NotifictationOption;
  disabled: boolean;
}) => {
  const { colors } = useAppTheme()
  const { watch, getValues } = useFormContext<{ settings: NotificationSettings['settings'] }>()
  const [loading, setLoading] = useState(false);

  const handleToggle = async (val: boolean) => {
    setLoading(true)
    await onToggle({ ...getValues().settings, [name]: val })
    setLoading(false)
  }

  return (
    <Box
      row
      justifyContent="space-between"
      alignItems="center"
      py={12}
      borderBottomWidth={1}
      borderColor={colors.grey_100}
    >
      <Text variant="p1" flex={1} children={title} />
      {loading ? <ActivityIndicator size={31} /> : (
        <Switch
          disabled={disabled}
          onValueChange={(val) => handleToggle(val)}
          value={watch('settings')[name]}
          trackColor={{
            false: colors.grey_200,
            true: colors.main
          }}
        />
      )}
    </Box>
  )
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});