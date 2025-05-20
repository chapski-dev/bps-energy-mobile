import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import ArrowIcon from '@assets/svg/caret-right.svg';
import NoAvatarIcon from '@assets/svg/user-fill.svg';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

// import { setNotificationSettings } from '@src/api';
import { NotificationSettings } from '@src/api/types';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import messaging from '@src/service/messaging';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Text } from '@src/ui';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';
import SelectLanguageModal from '@src/widgets/SelectLanguageModal';

export enum NotifictationOption {
  push_notifications = 'push_notifications',
}

export const ProfileDetailsScreen = ({ navigation }: ScreenProps<'profile'>) => {
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
  const modal = useRef<BottomSheetModal>(null);
  const modalClose = () => modal?.current?.forceClose();
  const modalOpen = () => modal?.current?.present();

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
          paddingBottom: insets.bottom || 15,
          paddingTop: 20,
        }}
      >
        <Box
          flex={1}
          alignItems="center"
          justifyContent="space-between"
          backgroundColor={colors.background}
          gap={15}
        >
          <Box
            onPress={openProfileData}
            w="full"
            h={50}
            px={15}
            row
            alignItems="center"
            justifyContent="space-between"
          >
            <Box row alignItems="center" gap={15}>
              {user?.iconUrl ? (
                <Image source={{ uri: user.iconUrl }} />
              ) : (
                <NoAvatarIcon />
              )}
              <Text
                type="body_500"
                fontSize={18}
                children={`${user?.firstName || ''} ${user?.middleName || ''} ${user?.lastName || ''}`}
              />
            </Box>
            <ArrowIcon />
          </Box>

          {/* <Box row w="full" gap={5} px={15}>
            <Box
              backgroundColor={colors.grey_100}
              borderRadius={9}
              justifyContent="center"
              alignItems="flex-start"
              gap={3}
              p={10}
              w={126}
              h={72}
            >
              <Box
                backgroundColor={colors.green}
                borderRadius={35}
                px={10}
                py={3}
                alignItems="center"
                justifyContent="center"
              >
                <Text color={colors.white} fontWeight={700} children="4.5" />
              </Box>
              <Text fontSize={10} fontWeight={400} children={t('my_rating')} />
            </Box>

            <Box
              backgroundColor={colors.grey_100}
              borderRadius={9}
              justifyContent="center"
              alignItems="flex-start"
              gap={3}
              p={10}
              w={126}
              h={72}
            >
              <Box
                backgroundColor={colors.grey_700}
                borderRadius={35}
                px={10}
                py={3}
                alignItems="center"
                justifyContent="center"
              >
                <Text color={colors.white} fontWeight={700} children="115" />
              </Box>
              <Text
                fontSize={10}
                fontWeight={400}
                children={t('transportations')}
              />
            </Box>

            <Box
              backgroundColor={colors.grey_100}
              borderRadius={9}
              justifyContent="center"
              alignItems="flex-start"
              gap={3}
              p={10}
              w={126}
              h={72}
            >
              <Box
                backgroundColor={colors.grey_700}
                borderRadius={35}
                px={10}
                py={3}
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  color={colors.white}
                  fontWeight={700}
                  children="351 тыс."
                />
              </Box>
              <Text
                fontSize={10}
                fontWeight={400}
                children={t('traveled_kilometers')}
              />
            </Box>
          </Box> */}
          <Box backgroundColor={colors.white}>
            <SectionListItemWithArrow
              title={t('reports')}
              onPress={() => null}
              disabled
            />
          </Box>

          <Box backgroundColor={colors.white}>
            <SectionListItemWithArrow
              title={t('identity')}
              onPress={openIdentityData}
              disabled
            />
            <SectionListItemWithArrow
              title={t('drivers_licence')}
              onPress={() => null}
              disabled
            />
          </Box>

          <Box backgroundColor={colors.white}>
            <SectionListItemWithArrow
              title={t('apps_language')}
              onPress={modalOpen}
            />
            <Box
              w="full"
              h={50}
              px={15}
              row
              alignItems="center"
              justifyContent="space-between"
            >
              <Text type="body_500" children={t('push_notifications')} />
              {loading ? (
                <Box mr={20}>
                  <ActivityIndicator />
                </Box>
              ) : (
                <Switch
                  trackColor={{ false: colors.grey_100, true: colors.main }}
                  thumbColor={colors.white}
                  onValueChange={(val) =>
                    togglePushNotification({
                      ...getValues().settings,
                      [NotifictationOption.push_notifications]: val,
                    })
                  }
                  value={watch('settings.push_notifications')}
                />
              )}
            </Box>
          </Box>

          <Button
            backgroundColor="white"
            textColor="red"
            children={t('exit')}
            onPress={onLogoutPress}
          />

          <Button
            type="clear"
            textColor="grey_600"
            children={t('delete-account')}
            onPress={onDeleteAccountPress}
          />
        </Box>
      </ScrollView>
      <SelectLanguageModal ref={modal} modalClose={modalClose} />
    </>
  );
};

type SectionListItemWithArrowProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};
const SectionListItemWithArrow = ({
  title,
  onPress,
  disabled,
}: SectionListItemWithArrowProps) => {
  const { colors } = useAppTheme();

  return (
    <Box
      w="full"
      h={50}
      px={16}
      row
      alignItems="center"
      justifyContent="space-between"
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        color={disabled ? colors.grey_100 : undefined}
        type="body_500"
        children={title}
      />
      <ArrowIcon color={disabled ? colors.grey_100 : undefined} />
    </Box>
  );
};
