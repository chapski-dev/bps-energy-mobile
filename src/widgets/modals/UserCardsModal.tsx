import React, { forwardRef, useCallback } from 'react';
import { Alert, FlatList, TouchableOpacity } from 'react-native';
import VisaIcon from '@assets/svg/brand/visa.svg';
import CaretRightIcon from '@assets/svg/caret-right.svg';
import CheckIcon from '@assets/svg/check-circle-fill.svg';
import CreditCardIcon from '@assets/svg/credit-card-outline.svg';
import PlusIcon from '@assets/svg/plus.svg';
import TrashIcon from '@assets/svg/trash.svg';
import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { BottomSlideModal, Box, Button, Text } from '@src/ui';
import { modal } from '@src/ui/Layouts/ModalLayout';

import { DeleteAccountModal } from './DeleteAccountModal';

export type CardModalMode = 'account-deletion' | 'card-selection' | 'saved-cards';

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
  selectedCardId?: number;
};

const UserCardsModal = forwardRef<BottomSheetModal, UserCardsModalProps>(
  ({
    mode,
    modalClose,
    onCardSelect,
    onAddCard,
    selectedCardId,
    ...props
  }, ref) => {
    const { colors, insets } = useAppTheme();
    const { cards, balance } = useAuth();
    const { t } = useLocalization();
    
    // Модальные тексты для разных режимов
    const getModalConfig = () => {
      switch (mode) {
        case 'account-deletion':
          return {
            continueButtonText: 'Продолжить',
            hasAddCard: false,
            showContinueButton: true,
            subtitle: `На какую карту выполнить возврат ${balance.value_by} BYN с текущего баланса?`,
            title: 'Удаление аккаунта'
          };
        case 'card-selection':
          return {
            continueButtonText: null,
            hasAddCard: true,
            showContinueButton: false,
            subtitle: null,
            title: 'Выберите карту'
          };
        case 'saved-cards':
          return {
            continueButtonText: null,
            hasAddCard: false,
            showContinueButton: false,
            subtitle: null,
            title: 'Сохранённые карты'
          };
        default:
          return {
            continueButtonText: null,
            hasAddCard: false,
            showContinueButton: false,
            subtitle: null,
            title: ''
          };
      }
    };

    const config = getModalConfig();

    const handleCardPress = useCallback((card: Card) => {
      switch (mode) {
        case 'account-deletion':
          // В режиме удаления аккаунта - просто выделяем карту
          if (onCardSelect) {
            onCardSelect(card);
          }
          break;
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
    }, [mode, onCardSelect, modalClose]);

    const handleDeleteCard = useCallback((cardId: number) => {
      Alert.alert(
        'Вы точно хотите удалить карту?',
        'Карта будет удалена из вашего аккаунта. Это действие нельзя отменить.',
        [
          {
            onPress: () => null,
            text: t('cancel'),
          },
          {
            // TODO: добавить колбек на удаление карты
            onPress: () => null, // будут добавлены запросы на удаление карты и на получение данных юзера с целью обновить стейт.
            style: 'destructive',
            text: t('delete'),
          },
        ],
      );
    }, [t]);

    const handleAddCard = useCallback(() => {
      if (onAddCard) {
        onAddCard();
      }
      modalClose();
    }, [onAddCard, modalClose]);

    const onFinalyDeleteAccountPress = useCallback(() => {
      modal().setupModal?.({
        element: <DeleteAccountModal />,
        justifyContent: 'center',
        marginHorizontal: 48,
      });
    }, []);

    const handleContinue = useCallback(() => {
      // Логика продолжения для удаления аккаунта
      if (mode === 'account-deletion') {
        modalClose();
        onFinalyDeleteAccountPress()
      }
    }, [mode, modalClose, onFinalyDeleteAccountPress]);

    const renderCardItem = ({ item: card }: { item: Card }) => {
      
      const isSelected = selectedCardId === card.id;
      const showSelection = mode === 'account-deletion';
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
                backgroundColor={colors.grey_50}
              >
                {renderIcon(card.type)}
              </Box>
              <Text
                variant="p1-semibold"
                capitalize
                children={`${card.type} · ${card.mask}`}
              />
            </Box>

            {showSelection && isSelected && (
              <CheckIcon color={colors.main} />
            )}

            {showDelete && (
              <TouchableOpacity onPress={() => handleDeleteCard(card.id)}>
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

    const renderAddCardItem = () => (
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
            children="Добавить карту"
            color={colors.text}
          />
          <Box flex={1} />
          <CaretRightIcon color={colors.grey_600} />
        </Box>
      </Box>
    );

    const listData = config.hasAddCard ? [...cards, { id: 'add-card', isAddCard: true }] : cards;

    return (
      <BottomSlideModal
        ref={ref}
        animateOnMount
        maxDynamicContentSize={350}
        snapPoints={[350]}
        backgroundStyle={{ backgroundColor: colors.background }}
        {...props}
      >
        <BottomSheetView
          style={{
            flex: 1,
            gap: 32,
            maxHeight: 350,
            paddingBottom: insets.bottom + 15
          }}
        >
          {/* Header */}
          <Box px={24}>
            <Text children={config.title} variant="p1-semibold" center />
            {config.subtitle && (
              <Text
                children={config.subtitle}
                variant="p2"
                center
                px={30}
                color={colors.grey_600}
                mt={8}
              />
            )}
          </Box>

          {/* Cards List */}
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 24 }}
            data={listData}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => {
              if (item.isAddCard) {
                return renderAddCardItem();
              }
              return renderCardItem({ item });
            }}
            showsVerticalScrollIndicator={false}
          />

          {/* Continue Button for Account Deletion */}
          {config.showContinueButton && (
            <Box px={24}>
              <Button
                children={config.continueButtonText}
                onPress={handleContinue}
                disabled={mode === 'account-deletion' && !selectedCardId}
              />
            </Box>
          )}
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