import React, { useRef } from 'react';
import {
  ScrollView,
} from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { ScreenProps } from '@src/navigation/types';
import { AuthState, useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Text } from '@src/ui';
import { SectionListItemWithArrow } from '@src/ui/SectionListItemWithArrow';
import SelectLanguageModal from '@src/widgets/modals/SelectLanguageModal';
import UserBalance from '@src/widgets/UserBalance';

export enum NotifictationOption {
  push_notifications = 'push_notifications',
}

export const ProfileScreen = ({ navigation }: ScreenProps<'profile'>) => {
  const { t } = useLocalization();

  const openProfileData = () => navigation.navigate('profile-details');

  const { insets } = useAppTheme();
  const modal = useRef<BottomSheetModal>(null);
  const modalClose = () => modal?.current?.forceClose();
  const modalOpen = () => modal?.current?.present();

  const { authState } = useAuth();

  return authState === AuthState.ready ? (
    <>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom || 15,
          paddingHorizontal: 16,
          paddingTop: insets.top + 40,
        }}>
        <SectionListItemWithArrow
          onPress={openProfileData}
          borderBottom={false}>
          <Box gap={3}>
            <Text variant="p2" children={t('profile')} />
            <Text colorName="grey_600" children={'alexander_p@gmail.com'} />
          </Box>
        </SectionListItemWithArrow>

        <Box gap={8}>
          <UserBalance currency="BYN" />
          <UserBalance currency="RUB" />
        </Box>

        <SectionListItemWithArrow
          title={'История зарядок'}
          onPress={() => null}
        />

        <SectionListItemWithArrow
          title={'История пополнений'}
          onPress={() => null}
        />
        <SectionListItemWithArrow title={'Уведомления'} onPress={() => null} />
        <SectionListItemWithArrow
          title={'Служба поддержки'}
          onPress={() => null}
        />
        <SectionListItemWithArrow
          title={'Правила зарядки'}
          onPress={() => null}
        />
        <SectionListItemWithArrow title={'FAQ'} onPress={() => null} />
        <SectionListItemWithArrow
          title={t('apps_language')}
          onPress={modalOpen}
        />
      </ScrollView>
      <SelectLanguageModal ref={modal} modalClose={modalClose} />
    </>
  ) : (
    <Box gap={25} px={16} flex={1} justifyContent="center" alignItems="center">
      <Text children="Вы не авторизованы" />
      <Button children="Войти" onPress={() => navigation.navigate('login')} />
    </Box>
  );
};
