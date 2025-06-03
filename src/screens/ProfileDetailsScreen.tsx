import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  ScrollView,
} from 'react-native';

import { NotificationSettings } from '@src/api/types';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import messaging from '@src/service/messaging';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Text } from '@src/ui';
import { SectionListItemWithArrow } from '@src/ui/SectionListItemWithArrow';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';

export enum NotifictationOption {
  push_notifications = 'push_notifications',
}

export const ProfileDetailsScreen = ({
  navigation,
}: ScreenProps<'profile-details'>) => {
  const { t } = useLocalization();
  const { onLogout, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      settings: {
        [NotifictationOption.push_notifications]: messaging.isEnabled(),
      },
    },
  });
  const { setValue, getValues, watch } = form;

  const valuesWithPermission = (val: NotificationSettings['settings']) => {
    const push_notifications = messaging.isEnabled()
      ? val[NotifictationOption.push_notifications]
      : false;
    return {
      ...val,
      [NotifictationOption.push_notifications]: push_notifications,
    };
  };

  const togglePushNotification = async (
    val: NotificationSettings['settings'],
  ) => {
    const newValues = valuesWithPermission(val);
    await handleSubmitForm(newValues);
  };

  const handleSubmitForm = async (values: NotificationSettings['settings']) => {
    try {
      setLoading(true);
      await wait(1000);
      messaging.togglePushNotifications(values.push_notifications);
      // await setNotificationSettings({ settings: values });
      setValue('settings', values);
    } catch (e) {
      handleCatchError(e);
    } finally {
      setLoading(false);
    }
  };

  const openProfileData = () => navigation.navigate('profile-data');
  const openIdentityData = () => navigation.push('identity');

  const { colors, insets } = useAppTheme();

  const onLogoutPress = () =>
    Alert.alert(t('do-you-want-to-logout?'), undefined, [
      {
        onPress: () => null,
        text: t('cancel'),
      },
      {
        onPress: onLogout,
        style: 'destructive',
        text: t('exit'),
      },
    ]);

  const onDeleteAccountPress = () =>
    Alert.alert(t('do-you-want-to-delete-your-account?'), undefined, [
      {
        onPress: () => null,
        text: t('cancel'),
      },
      {
        onPress: onLogout,
        style: 'destructive',
        text: t('delete'),
      },
    ]);

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          gap: 56,
          paddingBottom: insets.bottom || 15,
          paddingHorizontal: 16,
          paddingTop: insets.top
        }}
      >
        <Box>
          <SectionListItemWithArrow
            onPress={openProfileData}
            borderBottom={false}
          >
            <Box gap={3}>
              <Text variant="p2" children={'alexander_p@gmail.com'} />
              <Text>
                <Text colorName="grey_600" children={'Email · '} />
                <Text colorName="red_500" children={'Не подтверждён'} />
              </Text>
            </Box>
          </SectionListItemWithArrow>
          <SectionListItemWithArrow
            title={'Изменить пароль'}
            onPress={() => null}
          />
          <SectionListItemWithArrow
            title={'Как к вам обращаться?'}
            onPress={openIdentityData}
          />
          <SectionListItemWithArrow
            title={'Добавить номер телефона'}
            onPress={() => null}
          />
          <Text mt={16} colorName='grey_600' children="Указанный номер телефона позволит нам быстрее помочь вам в случае обращения в службу поддержки" />
        </Box>

        <Box gap={48}>
          <Button
            backgroundColor="white"
            textColor="grey_600"
            children={'Выйти из аккаунта'}
            onPress={onLogoutPress}
          />
          <Button
            type="clear"
            textColor='red_500'
            children={t('delete-account')}
            onPress={onDeleteAccountPress}
          />
        </Box>
      </ScrollView>
    </>
  );
};
