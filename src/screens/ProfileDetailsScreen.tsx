import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { Card } from '@src/api/types';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { SectionListItemWithArrow } from '@src/ui/SectionListItemWithArrow';
import UserCardsModal from '@src/widgets/modals/UserCardsModal';

export enum NotifictationOption {
  push_notifications = 'push_notifications',
}

export const ProfileDetailsScreen = ({
  navigation,
}: ScreenProps<'profile-details'>) => {
  const { t } = useTranslation();
  const { onLogout, user } = useAuth();
  const { insets } = useAppTheme();

  const openChangeUserFilelds = (filed: 'phone' | 'name') =>
    navigation.push('change-user-fields', { filed });

  const onLogoutPress = () =>
    Alert.alert(t('do-you-want-to-logout?'), undefined, [
      {
        onPress: () => null,
        text: t('to-cancel'),
      },
      {
        onPress: onLogout,
        style: 'destructive',
        text: t('to-log-out'),
      },
    ]);

  const onDeleteAccountPress = () =>
    Alert.alert(t('do-you-want-to-delete-your-account?'), undefined, [
      {
        onPress: () => null,
        text: t('to-cancel'),
      },
      {
        onPress: modalCardsOpen,
        style: 'destructive',
        text: t('to-delete'),
      },
    ]);


  const modalCards = useRef<BottomSheetModal>(null);
  const modalCardsClose = () => modalCards?.current?.forceClose();
  const modalCardsOpen = () => modalCards?.current?.present();

  const [cardId, setCardId] = useState<number>()
  const onCardSelect = (val: Card) => {
    setCardId(val.id)
  }
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
          <SectionListItemWithArrow disabled onPress={() => null}>
            <Box gap={3}>
              <Text variant="p3-semibold" children={user?.email} />
              <Text colorName="grey_600" children={'E-mail'} />
            </Box>
          </SectionListItemWithArrow>

          <SectionListItemWithArrow
            title={'Изменить пароль'}
            onPress={() => navigation.navigate('change-password')}
          />
          <SectionListItemWithArrow
            children={
              user?.name ? (
                <Box>
                  <Text variant="p2-semibold" children={user?.name} />
                  <Text variant="p3" colorName="grey_600" children="Имя" />
                </Box>
              ) : null
            }
            title="Как к вам обращаться?"
            onPress={() => openChangeUserFilelds('name')}
          />
          <SectionListItemWithArrow
            onPress={() => openChangeUserFilelds('phone')}
            title="Добавить номер телефона"
            children={
              user?.phone ? (
                <Box>
                  <Text variant="p2-semibold" children={user?.phone} />
                  <Text
                    variant="p3"
                    colorName="grey_600"
                    children="Номер телефона"
                  />
                </Box>
              ) : null
            }
          />

          <Text
            mt={16}
            variant="p3"
            colorName="grey_600"
            children="Указанный номер телефона позволит нам быстрее помочь вам в случае обращения в службу поддержки"
          />
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
            textColor="red_500"
            children={t('to-delete-account')}
            onPress={onDeleteAccountPress}
          />
        </Box>
      </ScrollView>
      <UserCardsModal
        mode="account-deletion"
        ref={modalCards}
        modalClose={modalCardsClose}
        onCardSelect={onCardSelect}
        selectedCardId={cardId}
      />
    </>
  );
};
