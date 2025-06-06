import React, { forwardRef } from 'react';
import { Alert, FlatList } from 'react-native';
import TrashIcon from '@assets/svg/trash.svg';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import { useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Text } from '@src/ui';

type UserCardsModalProps = Omit<BottomSheetModalProps, 'children'> & {
  modalClose: () => void;
};

const UserCardsModal = forwardRef<BottomSheetModal, UserCardsModalProps>(
  ({ modalClose }, ref) => {
    const { colors, insets } = useAppTheme();
    const { cards } = useAuth();
    const { t } = useLocalization();

    const onDeleteCard = () =>
      Alert.alert(
        'Вы точно хотите удалить карту?',
        'Карта будет удалена из вашего списка карт.',
        [
          {
            onPress: () => null,
            text: t('cancel'),
          },
          {
            onPress: confirmDeleteCard,
            style: 'destructive',
            text: t('delete'),
          },
        ],
      );

    const confirmDeleteCard = () => modalClose();

    return (
      <BottomSheetModal
        ref={ref}
        animateOnMount
        maxDynamicContentSize={450}
        snapPoints={[450]}
        backgroundStyle={{ backgroundColor: colors.background }}
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop {...backdropProps} disappearsOnIndex={-1} />
        )}
      >
        <BottomSheetView
          style={{ gap: 32, maxHeight: 450, paddingBottom: insets.bottom + 15 }}
        >
          <Text children="Сохранённые карты" variant="p1-semibold" center />
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 24 }}
            data={[
              ...cards,
              ...cards,
              ...cards,
              ...cards,
              ...cards,
              ...cards,
              ...cards,
            ]}
            keyExtractor={(i) => i.toString()}
            renderItem={({ item }) => {
              const card = item.split(' ');
              return (
                <Box
                  borderColor={colors.grey_100}
                  borderBottomWidth={1}
                  py={24}
                >
                  <Box
                    row
                    h={40}
                    alignItems="center"
                    gap={10}
                    justifyContent="space-between"
                  >
                    <Text
                      variant="p1-semibold"
                      capitalize
                      children={card[0] + ' · ' + card[1]}
                    />
                    <Box onPress={onDeleteCard}>
                      <TrashIcon color={colors.grey_600} />
                    </Box>
                  </Box>
                </Box>
              );
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default UserCardsModal;
