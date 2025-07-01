import React, { forwardRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, TouchableOpacity } from 'react-native';
import VisaIcon from '@assets/svg/brand/visa.svg';
import CaretRightIcon from '@assets/svg/caret-right.svg';
import CreditCardIcon from '@assets/svg/credit-card-outline.svg';
import EmptyBoxIcon from '@assets/svg/empty-box.svg';
import PlusIcon from '@assets/svg/plus.svg';
import TrashIcon from '@assets/svg/trash.svg';
import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import { deleteCreditCard } from '@src/api';
import { useAuth } from '@src/providers/auth';
import { BaseColors } from '@src/theme/colors';
import { useAppTheme } from '@src/theme/theme';
import { BottomSlideModal, Box, Text } from '@src/ui';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';

export type CardModalMode = 'card-selection' | 'saved-cards';

type Card = {
  id: number;
  type: 'visa' | 'mastercard';
  mask: string;
};

type UserCardsModalProps = Omit<BottomSheetModalProps, 'children'> & {
  mode: CardModalMode;
  modalClose: () => void;
  onCardSelect?: (card: Card) => void;
  onAddCard?: () => void;
};

const UserCardsModal = forwardRef<BottomSheetModal, UserCardsModalProps>(
  (
    { mode, modalClose, onCardSelect, onAddCard, ...props },
    ref,
  ) => {
    const { colors, insets } = useAppTheme();
    const { user, getUserData } = useAuth();
    const { t } = useTranslation('widgets', { keyPrefix: 'user-cards-modal' });

    // Модальные тексты для разных режимов
    const getModalConfig = () => {
      switch (mode) {
        case 'card-selection':
          return {
            hasAddCard: true,
            otherMethodsReplenishment: true,
            title: t('title-card-selection'),
          };
        case 'saved-cards':
          return {
            hasAddCard: false,
            otherMethodsReplenishment: false,
            title: t('title-saved-cards'),
          };
        default:
          return {
            hasAddCard: false,
            otherMethodsReplenishment: false,
            title: '',
          };
      }
    };

    const config = getModalConfig();

    const handleCardPress = useCallback(
      (card: Card) => {
        switch (mode) {
          case 'card-selection':
            // В режиме выбора карты - выбираем и закрываем модалку
            if (onCardSelect) {
              onCardSelect(card);
            }
            modalClose();
            break;
          case 'saved-cards':
            // В режиме сохраненных карт - карты не выбираются
            break;
        }
      },
      [mode, onCardSelect, modalClose],
    );

    const handleDeleteCard = useCallback(async (cardId: number) => {
      try {
        modalClose()
        await deleteCreditCard({ card_id: cardId })
        await getUserData()
      } catch (error) {
        handleCatchError(error, 'handleDeleteCard')
      }
    }, [getUserData, modalClose]);
    
    const handleDeleteCardAlert = useCallback(
      (cardId: number) => {
        Alert.alert(
          t('delete-card-title'),
          t('delete-card-message'),
          [
            {
              onPress: () => null,
              text: t('to-cancel'),
            },
            {
              onPress: () => handleDeleteCard(cardId),
              style: 'destructive',
              text: t('to-delete'),
            },
          ],
        );
      },
      [handleDeleteCard, t],
    );

    const handleAddCard = useCallback(() => {
      if (onAddCard) {
        onAddCard();
      }
      modalClose();
    }, [onAddCard, modalClose]);

    const renderCardItem = ({ item: card }: { item: Card }) => {
      const showDelete = mode === 'saved-cards';
      const isSelectable = mode !== 'saved-cards';

      return (
        <Box
          borderColor={colors.grey_100}
          borderBottomWidth={1}
          py={24}
          onPress={() => isSelectable && handleCardPress(card)}
          disabled={!isSelectable}
        >
          <Box row alignItems="center" justifyContent="space-between">
            <Box gap={12} row alignItems="center">
              <Box
                alignItems="center"
                justifyContent="center"
                h={40}
                w={56}
                borderRadius={10}
                backgroundColor={BaseColors.grey_50}
              >
                {renderIcon(card.type)}
              </Box>
              <Text
                variant="p1-semibold"
                capitalize
                children={`${card.type} · ${card.mask}`}
              />
            </Box>

            {showDelete && (
              <TouchableOpacity onPress={() => handleDeleteCardAlert(card.id)}>
                <TrashIcon color={colors.grey_600} />
              </TouchableOpacity>
            )}

            {mode === 'card-selection' && (
              <CaretRightIcon color={colors.grey_600} />
            )}
          </Box>
        </Box>
      );
    };

    const renderAdditionalCardItem = () => (
      <Box
        borderColor={colors.grey_100}
        borderBottomWidth={1}
        py={24}
        onPress={handleAddCard}
      >
        <Box row alignItems="center">
          <Box
            alignItems="center"
            justifyContent="center"
            h={40}
            w={56}
            borderRadius={10}
            backgroundColor={colors.grey_50}
            mr={12}
          >
            <PlusIcon color={colors.grey_600} />
          </Box>
          <Text
            variant="p1-semibold"
            children={t('other-payment-methods')}
            color={colors.text}
          />
          <Box flex={1} />
          <CaretRightIcon color={colors.grey_600} />
        </Box>
      </Box>
    );

    const renderLestEmptyComponent = useCallback(() => (
      <Box justifyContent='center' alignItems='center' pt={8} pb={30}>
        <EmptyBoxIcon color={colors.grey_400} width={72} height={72} />
        <Text children={t('no-saved-cards')} colorName='grey_600' variant='p3' />
      </Box>
    ), [colors.grey_400, t])

    const listData = useMemo(() => {
      const cards = user?.cards ? [...user.cards] : [];

      switch (true) {
        case config.hasAddCard:
          cards.push({ id: 'add-card', isAddCard: true });
          break;
        case config.otherMethodsReplenishment:
          cards.push({ id: 'other-methods', isOtherMethods: true });
          break;
        default:
          break;
      }
      return cards;
    }, [config.hasAddCard, config.otherMethodsReplenishment, user?.cards]);

    return (
      <BottomSlideModal
        ref={ref}
        enableDynamicSizing
        {...props}
      >
        <BottomSheetView style={{ gap: 32, paddingBottom: insets.bottom + 15 }} >
          {/* Header */}
          <Box px={24}>
            <Text children={config.title} variant="p1-semibold" center />
          </Box>

          {/* Cards List */}
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 24 }}
            data={listData}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => {
              if (item.isAddCard || item.isOtherMethods) {
                return renderAdditionalCardItem(item.id);
              }
              return renderCardItem({ item });
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderLestEmptyComponent}
          />
        </BottomSheetView>
      </BottomSlideModal>
    );
  },
);

const renderIcon = (type: 'visa' | 'mastercard') => {
  switch (type) {
    case 'visa':
      return <VisaIcon />;
    case 'mastercard':
      return <CreditCardIcon />; // Замените на MastercardIcon если есть
    default:
      return <CreditCardIcon />;
  }
};

export default UserCardsModal;