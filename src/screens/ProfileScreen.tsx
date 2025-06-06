import React, { useRef, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { postRefreshToken } from '@src/api';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Text } from '@src/ui';
import { SectionListItemWithArrow } from '@src/ui/SectionListItemWithArrow';
import { handleCatchError } from '@src/utils/handleCatchError';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';
import SelectLanguageModal from '@src/widgets/modals/SelectLanguageModal';
import UserCardsModal from '@src/widgets/modals/UserCardsModal';
import UserBalance from '@src/widgets/UserBalance';

export enum NotifictationOption {
  push_notifications = 'push_notifications',
}

export const ProfileScreen = ({ navigation }: ScreenProps<'profile'>) => {
  const { t } = useLocalization();

  const openProfileData = () => navigation.navigate('profile-details');
  const [refreshing, setRefreshing] = useState(false);
  const { insets } = useAppTheme();
  const modal = useRef<BottomSheetModal>(null);
  const modalClose = () => modal?.current?.forceClose();
  const modalOpen = () => modal?.current?.present();

  const modalCards = useRef<BottomSheetModal>(null);
  const modalCardsClose = () => modalCards?.current?.forceClose();
  const modalCardsOpen = () => modalCards?.current?.present();

  const { user, balance, getUserBalance, } = useAuth();

  const onRefresh = async () => {
    try {
      setRefreshing(true)
      await getUserBalance()
    } catch (error) {
      handleCatchError(error)
    } finally {
      setRefreshing(false)
    }
  }

  const testRefreshToken = async () => {
    try {
      const refresh_token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN);
      const { access_token, refresh_token: new_refresh_token } = await postRefreshToken({ refresh_token });
  
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.ACCESS_TOKEN, access_token);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN, new_refresh_token);
    } catch (error) {
      handleCatchError(error)
    }
  }

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
          <UserBalance currency="BYN" value={balance.value_by} />
          <UserBalance currency="RUB" value={balance.value_ru} />
        </Box>

        <SectionListItemWithArrow
          title={'История зарядок'}
          onPress={() => null}
        />

        <SectionListItemWithArrow
          title={'История пополнений'}
          onPress={() => null}
        />

        <SectionListItemWithArrow
          title={'Сохранённые карты'}
          onPress={modalCardsOpen}
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
        <SectionListItemWithArrow title={'FAQ'} onPress={testRefreshToken} />
        <SectionListItemWithArrow
          title={t('apps_language')}
          onPress={modalOpen}
        />
      </ScrollView>
      <SelectLanguageModal ref={modal} modalClose={modalClose} />
      <UserCardsModal ref={modalCards} modalClose={modalCardsClose} />
    </>
  )
};
