import React, { forwardRef } from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView
} from '@gorhom/bottom-sheet';

import { useAppTheme } from '@src/theme/theme';
import { LANGUAGE_LIST, saveLanguageAsyncStorage, useLocalization, AppLangEnum } from '@src/translations/i18n';
import { Box, Text } from '@src/ui';

type SelectLanguageModalProps = Omit<BottomSheetModalProps, 'children'> & {
  modalClose: () => void;
};


const SelectLanguageModal = forwardRef<BottomSheetModal, SelectLanguageModalProps>((
  { modalClose }
  , ref) => {
  const { colors, insets } = useAppTheme();
  const { t, i18n } = useLocalization();

  const handleChangeLanguage = (value: AppLangEnum) => async () => {
    await i18n.changeLanguage(value);
    await saveLanguageAsyncStorage(value);
    modalClose();
  };


  return (
    <BottomSheetModal
      ref={ref}
      animateOnMount
      snapPoints={[190]}
      enablePanDownToClose
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: colors.background }}
      backdropComponent={(backdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
        />
      )}>
      <BottomSheetView>
        <Box flex={1} px={24} pb={insets.bottom} >
          {LANGUAGE_LIST.map((el) => (
            <Box
              key={el.lang}
              row
              h={52}
              alignItems='center'
              gap={10}
              onPress={handleChangeLanguage(el.lang)}
            >
              <Text children={el.flag + ' ' + t(`profile_languages.${el.lang}`)} />
            </Box>
          ))}

        </Box>
      </BottomSheetView>
    </BottomSheetModal>
  )
})

export default SelectLanguageModal