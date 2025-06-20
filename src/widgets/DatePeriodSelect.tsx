import React, { useMemo, useRef, useState } from 'react';
import DatePicker from 'react-native-date-picker';
import CaretDownIcon from '@assets/svg/caret-down-bold.svg';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

import { useLocalization } from '@src/hooks/useLocalization';
import { useAppTheme } from '@src/theme/theme';
import { BottomSlideModal, Box, Button, Text } from '@src/ui';
import { dateFormat } from '@src/utils/date-format';

// Рассчитываем начальную дату как 31 день назад
const initialStartDate = new Date();
initialStartDate.setDate(initialStartDate.getDate() - 31);

const today = new Date();
const start = new Date(today);
start.setDate(today.getDate() - 31);

export const initialDates = { end: today, start };

interface IDatePeriodSelect {
  filterDates: typeof initialDates;
  onSubmit: React.Dispatch<React.SetStateAction<typeof initialDates>>
}

export const DatePeriodSelect = ({ filterDates, onSubmit }: IDatePeriodSelect) => {
  const { t, i18n } = useLocalization()
  const { colors, insets } = useAppTheme();
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [currentDateType, setCurrentDateType] = useState<'start' | 'end'>('start');
  const [open, setOpen] = useState(false);

  const modalRef = useRef<BottomSheetModal>(null);
  const modalRefClose = () => modalRef?.current?.forceClose();
  const modalRefOpen = () => modalRef?.current?.present();

  const handleDatePress = (type: 'start' | 'end') => {
    setCurrentDateType(type);
    setOpen(true);
  };

  const resetDates = () => {
    setStartDate(start);
    setEndDate(today);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU');
  };

  const isCustomPeriod = useMemo(() => {
    console.log('dateFormat(\'DD.MM.yyyy\', filterDates.start)', dateFormat('DD.MM.yyyy', filterDates.start));
    console.log('dateFormat(\'DD.MM.yyyy\', initialDates.start)', dateFormat('DD.MM.yyyy', initialDates.start));


    return (
      dateFormat('DD.MM.yyyy', filterDates.start) !== dateFormat('DD.MM.yyyy', initialDates.start) ||
      dateFormat('DD.MM.yyyy', filterDates.end) !== dateFormat('DD.MM.yyyy', initialDates.end)
    );
  }, [filterDates.start, filterDates.end]);

  const buttonText = isCustomPeriod
    ? `${dateFormat('DD.MM.yyyy', filterDates.start)} - ${dateFormat('DD.MM.yyyy', filterDates.end)}`
    : 'Выбрать период';

  const handleSumbmit = () => {
    modalRefClose()
    onSubmit({
      end: endDate,
      start: startDate,
    })
  }
  return (
    <>
      <Box alignItems='baseline' >
        <Button
          onPress={modalRefOpen}
          children={buttonText}
          icon={<CaretDownIcon
            color={isCustomPeriod ? colors.white : colors.grey_800}
            width={16}
            height={16} />}
          backgroundColor={isCustomPeriod ? 'main' : 'grey_50'}
          textColor={isCustomPeriod ? 'white' : 'grey_800'}
          buttonStyle={{ borderRadius: 20, height: 40, paddingHorizontal: 16 }}
          wrapperStyle={{ width: 'auto' }}
        />
      </Box>
      <BottomSlideModal
        ref={modalRef}
        enableDynamicSizing
        backgroundStyle={{ backgroundColor: colors.background }}
        maxDynamicContentSize={334}
        snapPoints={[334]}
      >
        <BottomSheetView style={{ maxHeight: 334, padding: 24, paddingBottom: insets.bottom + 15 }}>
          <Box row justifyContent='space-between' mb={24}>
            <Text children="Выберите период" variant='p1-semibold' />
            <Box onPress={resetDates}>
              <Text children={t('actions:to-reset')} variant='p2' colorName='grey_700' />
            </Box>
          </Box>

          <Box mb={32}>
            <Box
              h={53}
              justifyContent='space-between'
              alignItems='center'
              row
              borderBottomWidth={1}
              borderColor={colors.grey_100}
              onPress={() => handleDatePress('start')}
            >
              <Text children="Начало" />
              <Text children={formatDate(startDate)} variant='p2-semibold' />
            </Box>
            <Box
              h={53}
              row
              justifyContent='space-between'
              alignItems='center'
              onPress={() => handleDatePress('end')}
            >
              <Text children="Конец" />
              <Text children={formatDate(endDate)} variant='p2-semibold' />
            </Box>
          </Box>
          <Button children={t('actions:to-apply')} onPress={handleSumbmit} />
        </BottomSheetView>
      </BottomSlideModal>

      <DatePicker
        locale={i18n.language}
        modal
        confirmText={t('actions:to-confirm')}
        title={currentDateType === 'start' ? 'Начало' : 'Конец'}
        open={open}
        date={currentDateType === 'start' ? startDate : endDate}
        minimumDate={currentDateType === 'end' ? startDate : undefined}
        i18nIsDynamicList
        maximumDate={currentDateType === 'start' ? endDate : new Date()}
        mode='date'
        buttonColor={colors.main}
        onConfirm={(val) => {
          setOpen(false);
          if (currentDateType === 'start') {
            setStartDate(val);
            // onSubmit((state) => ({ ...state, start: val }))
          } else {
            // onSubmit((state) => ({ ...state, end: val }))
            setEndDate(val);
          }
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};