import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next';
import CheckboxFillIcon from '@assets/svg/check-circle-fill.svg';
import ChinaFlagIcon from '@assets/svg/flags/China.svg';
import RussiaFlagIcon from '@assets/svg/flags/Russia.svg';
import UKFlagIcon from '@assets/svg/flags/UK.svg';
import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView
} from '@gorhom/bottom-sheet';

import {
  AppLangEnum,
  LANGUAGE_LIST,
  saveLanguageAsyncStorage,
} from '@src/i18n/config';
import { useAppTheme } from '@src/theme/theme';
import { BottomSlideModal, Box, Text } from '@src/ui';
import { handleCatchError } from '@src/utils/handleCatchError';

type ChangeLanguageModalProps = Omit<BottomSheetModalProps, 'children'> & {
  modalClose: () => void;
};


const renderFlag = (type: AppLangEnum) => {
  switch (type) {
    case AppLangEnum.EN:
      return <UKFlagIcon width={24} height={24} />
    case AppLangEnum.RU:
      return <RussiaFlagIcon width={24} height={24} />
    case AppLangEnum.ZH:
      return <ChinaFlagIcon width={24} height={24} />
    default:
      return null
  }
}

const ChangeLanguageModal = forwardRef<BottomSheetModal, ChangeLanguageModalProps>((
  { modalClose }
  , ref) => {
  const { colors, insets } = useAppTheme();
  const { t, i18n } = useTranslation('widgets', { keyPrefix: 'change-language-modal' });

  const handleChangeLanguage = (value: AppLangEnum) => async () => {
    try {
      await i18n.changeLanguage(value);
      await saveLanguageAsyncStorage(value);
    } catch (error) {
      handleCatchError(error)
    }
  };


  return (
    <BottomSlideModal
      ref={ref}
      snapPoints={[260]}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: colors.background }}
      >
      <BottomSheetView style={{ paddingBottom: insets.bottom, paddingHorizontal: 24 }}>
        <Text children={t('title')} center variant='p1-semibold' mb={15} />
        {LANGUAGE_LIST.map((el, i, arr) => (
          <Box
            key={el.lang}
            row
            h={52}
            alignItems='center'
            borderBottomWidth={i === arr.length - 1 ? 0 : 1}
            borderColor={colors.border}
            onPress={handleChangeLanguage(el.lang)}
            justifyContent='space-between'
            effect='none'
          >
            <Box row gap={10} alignItems='center'>
              {renderFlag(el.lang)}
              <Text children={t(`lang.${el.title}`)} capitalize />
            </Box>
            {el.lang === i18n.language && <CheckboxFillIcon color={colors.main} />}
          </Box>
        ))}
      </BottomSheetView>
    </BottomSlideModal>
  )
})

export default ChangeLanguageModal