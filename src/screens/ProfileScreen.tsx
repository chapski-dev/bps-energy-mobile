import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';
import { SectionListItemWithArrow } from '@src/ui/SectionListItemWithArrow';
import { handleCatchError } from '@src/utils/handleCatchError';
import ChangeLanguageModal from '@src/widgets/modals/ChangeLanguageModal';
import UserCardsModal from '@src/widgets/modals/UserCardsModal';
import UserBalance from '@src/widgets/UserBalance';

export enum NotifictationOption {
  push_notifications = 'push_notifications',
}

export const ProfileScreen = ({ navigation }: ScreenProps<'profile'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'profile-screen' })
  const openProfileData = () => navigation.navigate('profile-details');
  const [refreshing, setRefreshing] = useState(false);
  const { insets } = useAppTheme();
  const modal = useRef<BottomSheetModal>(null);
  const modalClose = () => modal?.current?.forceClose();
  const modalOpen = () => modal?.current?.present();

  const modalCards = useRef<BottomSheetModal>(null);
  const modalCardsClose = () => modalCards?.current?.forceClose();
  const modalCardsOpen = () => modalCards?.current?.present();

  const { user, getUserData } = useAuth();

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getUserData();
    } catch (error) {
      handleCatchError(error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingBottom: insets.bottom || 15,
          paddingHorizontal: 16,
          paddingTop: insets.top + 40,
        }}
      >
        <SectionListItemWithArrow
          onPress={openProfileData}
          borderBottom={false}
        >
          <Box gap={3}>
            <Text variant="p2" children={t('profile')} />
            <Text colorName="grey_600" children={user?.email} />
          </Box>
        </SectionListItemWithArrow>

        <Box gap={8}>
          {user?.wallets.map((el) => (
            <UserBalance
              key={el.currency}
              currency={el.currency}
              value={el.value}
              disabled={el.currency === 'RUB'}
            />
          ))}
        </Box>

        <SectionListItemWithArrow
          title={t('charging-history')}
          onPress={() => navigation.navigate('charging-history')}
        />

        <SectionListItemWithArrow
          title={t('recharge-history')}
          onPress={() => navigation.navigate('recharge-history')}
        />

        <SectionListItemWithArrow
          title={t('saved-cards')}
          onPress={modalCardsOpen}
        />

        <SectionListItemWithArrow
          title={t('notifications')}
          onPress={() => navigation.navigate('notifications-settings')}
        />
        <SectionListItemWithArrow
          title={t('support-service')}
          onPress={() => navigation.navigate('support-service')}
        />
        <SectionListItemWithArrow
          title={t('charging-rules')}
          onPress={() => null}
        />
        <SectionListItemWithArrow title={'FAQ'} onPress={() => null} />
        <SectionListItemWithArrow
          title={t('app-language')}
          onPress={modalOpen}
        />
        <Text
          variant='p4'
          colorName='grey_400'
          my={24}
          children={t('app-version', { version: '1.74.0' })}
        />
      </ScrollView>
      <ChangeLanguageModal ref={modal} modalClose={modalClose} />
      <UserCardsModal
        mode="saved-cards"
        ref={modalCards}
        modalClose={modalCardsClose}
      />
    </>
  );
};
