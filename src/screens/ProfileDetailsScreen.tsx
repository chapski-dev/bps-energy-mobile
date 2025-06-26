import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView } from 'react-native';
import EnvelopeIcon from '@assets/svg/envelope.svg'
import LockIcon from '@assets/svg/lock.svg'
import PhoneIcon from '@assets/svg/phone.svg'
import UserIcon from '@assets/svg/user.svg'

import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { SectionListItemWithArrow } from '@src/ui/SectionListItemWithArrow';
import { DeleteAccountButton } from '@src/widgets/modals/DeleteAccountModal';

export enum NotifictationOption {
  push_notifications = 'push_notifications',
}

export const ProfileDetailsScreen = ({
  navigation,
}: ScreenProps<'profile-details'>) => {
  const { t } = useTranslation(['screens', 'actions', 'shared']);
  const { onLogout, user } = useAuth();
  const { insets, colors } = useAppTheme();

  const openChangeUserFilelds = (filed: 'phone' | 'name') =>
    navigation.push('change-user-fields', { filed });

  const onLogoutPress = () =>
    Alert.alert(t('shared:do-you-want-to-logout?'), undefined, [
      {
        onPress: () => null,
        text: t('actions:to-cancel'),
      },
      {
        onPress: onLogout,
        style: 'destructive',
        text: t('actions:to-log-out'),
      },
    ]);

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          gap: 56,
          paddingBottom: insets.bottom || 15,
          paddingHorizontal: 16,
          paddingTop: insets.top,
        }}
      >
        <Box>
          <SectionListItemWithArrow disabled
            icon={<EnvelopeIcon color={colors.text} />}
          >
            <Box gap={3}>
              <Text variant="p3-semibold" children={user?.email} />
              <Text colorName="grey_600" children={t('profile-details-screen.email-label')} />
            </Box>
          </SectionListItemWithArrow>

          <SectionListItemWithArrow
            icon={<LockIcon color={colors.text} />}
            title={t('profile-details-screen.change-password')}
            onPress={() => navigation.navigate('change-password')}
          />
          <SectionListItemWithArrow
            children={
              user?.name ? (
                <Box>
                  <Text variant="p2-semibold" children={user?.name} />
                  <Text
                    variant="p3"
                    colorName="grey_600"
                    children={t('profile-details-screen.name-label')}
                  />
                </Box>
              ) : null
            }
            icon={<UserIcon color={colors.text} />}
            title={t('profile-details-screen.how-to-address-you')}
            onPress={() => openChangeUserFilelds('name')}
          />
          <SectionListItemWithArrow
            onPress={() => openChangeUserFilelds('phone')}
            icon={<PhoneIcon color={colors.text} />}
            title={t('profile-details-screen.add-phone-number')}
            children={
              user?.phone ? (
                <Box>
                  <Text variant="p2-semibold" children={user?.phone} />
                  <Text
                    variant="p3"
                    colorName="grey_600"
                    children={t('profile-details-screen.phone-number')}
                  />
                </Box>
              ) : null
            }
          />

          <Text
            mt={16}
            variant="p3"
            colorName="grey_600"
            children={t('shared:phone-number-support-promting')}
          />
        </Box>

        <Box gap={48}>
          <Button
            type='clear'
            textColor='grey_600'
            children={t('profile-details-screen.logout-button')}
            onPress={onLogoutPress}
          />
          <DeleteAccountButton />
        </Box>
      </ScrollView>
    </>
  );
};
