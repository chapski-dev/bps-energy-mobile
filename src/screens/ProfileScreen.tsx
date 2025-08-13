import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, RefreshControl, ScrollView } from 'react-native';
import BatteryChargingIcon from '@assets/svg/battery-charging.svg'
import BellIcon from '@assets/svg/bell.svg'
import ChatIcon from '@assets/svg/chat-text.svg'
import CreditCardIcon from '@assets/svg/credit-card-outline.svg'
import InfoIcon from '@assets/svg/info.svg'
import MoonIcon from '@assets/svg/moon.svg'
import QuestionMarkCircledIcon from '@assets/svg/question-mark-circled.svg'
import SunIcon from '@assets/svg/sun.svg'
import TranslateIcon from '@assets/svg/translate.svg'
import UserIcon from '@assets/svg/user.svg'
import WalletIcon from '@assets/svg/wallet.svg'
import XIcon from '@assets/svg/X.svg'
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { useAppColorTheme } from '@src/hooks/useAppColorTheme';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';
import { SectionListItemWithArrow } from '@src/ui/SectionListItemWithArrow';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import ChangeLanguageModal from '@src/widgets/modals/ChangeLanguageModal';
import UserCardsModal from '@src/widgets/modals/UserCardsModal';
import UserBalance from '@src/widgets/UserBalance';
import DeviceInfo from 'react-native-device-info';
import { FAQ_LINK, OFFERS, RULES } from '@src/misc/documents';

export enum NotifictationOption {
  push_notifications = 'push_notifications',
}

export const ProfileScreen = ({ navigation }: ScreenProps<'profile'>) => {
  const { colors } = useAppTheme();
  const { onChangeTheme, isDarkTheme } = useAppColorTheme();

  const { t, i18n } = useTranslation('screens', { keyPrefix: 'profile-screen' })
  const openProfileData = () => navigation.navigate('profile-details');
  const [refreshing, setRefreshing] = useState(false);
  const { insets } = useAppTheme();
  const modalLanguage = useRef<BottomSheetModal>(null);
  const modalLanguageClose = () => modalLanguage?.current?.forceClose();
  const modalLanguageOpen = () => modalLanguage?.current?.present();

  const modalCards = useRef<BottomSheetModal>(null);
  const modalCardsClose = () => modalCards?.current?.forceClose();
  const modalCardsOpen = () => modalCards?.current?.present();

  const { user, getUserData } = useAuth();

  const handleOpenLink = (url: string) => Linking.openURL(url);

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom || 15,
          // paddingHorizontal: 16,
          paddingTop: insets.top + 40,
        }}
      >
        <Box px={16}>
          <Box onPress={onChangeTheme} alignItems='flex-end'>
            {isDarkTheme ?
              <SunIcon color={colors.text} width={24} height={24} /> :
              <MoonIcon color={colors.text} width={24} height={24} />}
          </Box>
          <SectionListItemWithArrow
            onPress={openProfileData}
            borderBottom={false}
          >
            <Box row gap={8}>
              <UserIcon color={colors.text} width={22} height={22} />
              <Box gap={3}>
                <Text variant="p2" children={t('profile')} />
                <Text colorName="grey_600" children={user?.email} />
              </Box>
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
            alignItems='center'
            title={t('charging-history')}
            icon={<BatteryChargingIcon color={colors.text} />}
            onPress={() => navigation.navigate('charging-history')}
          />
          <SectionListItemWithArrow
            alignItems="center"
            title={t('recharge-history')}
            icon={<WalletIcon color={colors.text} />}
            onPress={() => navigation.navigate('recharge-history')}
          />
          <SectionListItemWithArrow
            alignItems="center"
            title={t('saved-cards')}
            icon={<CreditCardIcon color={colors.text} />}
            onPress={modalCardsOpen}
            borderBottom={false}
          />
        </Box>

        <Box h={15} backgroundColor={colors.grey_50} />

        <Box px={16}>
          <SectionListItemWithArrow
            alignItems="center"
            title={t('notifications')}
            icon={<BellIcon color={colors.text} />}
            onPress={() => navigation.navigate('notifications-settings')}
          />
          <SectionListItemWithArrow
            title={t('app-language')}
            icon={<TranslateIcon color={colors.text} />}
            onPress={modalLanguageOpen}
            rightText={i18n.t(`widgets:change-language-modal.lang.${i18n.language}`)}
            borderBottom={false}
            alignItems='center'
          />
        </Box>

        <Box h={15} backgroundColor={colors.grey_50} />

        <Box px={16}>
          <SectionListItemWithArrow
            title={t('support-service')}
            icon={<ChatIcon color={colors.text} />}
            onPress={() => navigation.navigate('support-service')}
            alignItems="center"
          />
          <SectionListItemWithArrow
            title={t('charging-rules')}
            icon={<InfoIcon color={colors.text} />}
            onPress={() => handleOpenLink(RULES[i18n.language as keyof typeof RULES])}

            alignItems="center"
            />
          <SectionListItemWithArrow
            title={'FAQ'}
            icon={<QuestionMarkCircledIcon color={colors.text} />}
            onPress={() => handleOpenLink(FAQ_LINK[i18n.language as keyof typeof OFFERS])}
            alignItems="center"
          />
          {__DEV__ && (
            <SectionListItemWithArrow
              alignItems='center'
              icon={<XIcon color={colors.error_500} />}
              title={'Error tests'}
              onPress={() => navigation.navigate('error-tests')}
            />
          )}

          <Text
            variant='p4'
            colorName='promting'
            my={24}
            children={t('app-version', { version: DeviceInfo.getVersion() })}
          />
        </Box>
      </ScrollView>
      <ChangeLanguageModal ref={modalLanguage} modalClose={modalLanguageClose} />
      <UserCardsModal
        mode="saved-cards"
        ref={modalCards}
        modalClose={modalCardsClose}
      />
    </>
  );
};
