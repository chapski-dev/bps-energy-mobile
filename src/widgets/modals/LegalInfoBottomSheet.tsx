import React, { forwardRef } from 'react'

import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
  BottomSheetView
} from '@gorhom/bottom-sheet';

import { useAppTheme } from '@src/theme/theme';
import { BottomSlideModal, Text } from '@src/ui';
import WebView from 'react-native-webview';
import { Linking } from 'react-native';

type LegalInfoBottomSheetProps = Omit<BottomSheetModalProps, 'children'> & {
  modalClose: () => void;
};

const LegalInfoBottomSheet = forwardRef<BottomSheetModal, LegalInfoBottomSheetProps>((
  { modalClose }
  , ref) => {
  const { insets } = useAppTheme();

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://bps-energy.by');
  };

  return (
    <BottomSlideModal
      ref={ref}
      enablePanDownToClose
    >
      <BottomSheetScrollView contentContainerStyle={{ paddingBottom: insets.bottom }} style={{ paddingHorizontal: 24, flex: 1 }}>
        {/* <WebView
          source={require('../../../assets/html/legal-info.html')}
          style={{ flex: 1 }}
        /> */}
        <Text variant="h4" center mb={20}>
          BPS-energy – Производство зарядных станций для электромобилей в Минске.
        </Text>

        <Text variant="h4" mb={10}>
          Общество с ограниченной ответственностью «БПС-Энерго»
        </Text>

        <Text variant="p1" mb={8}>
          Юридический адрес: 220037, г. Минск, ул. Долгобродская 18/1-5, комн. 14
        </Text>

        <Text variant="p1" fontWeight="bold" mb={16}>
          УНП 192738364
        </Text>

        <Text variant="p1" mb={8}>
          Номер счета бенефициара:
        </Text>

        <Text variant="p1" fontWeight="bold" mb={16}>
          BY56 MTBK 3012 0001 0933 0007 4044
        </Text>

        <Text variant="p1" mb={8}>
          Банк-получатель:
        </Text>

        <Text variant="p1" mb={8}>
          ЗАО «МТБанк», г.Минск, ул.Толстого, 10
        </Text>

        <Text variant="p1" mb={16}>
          БИК: <Text variant="p1" fontWeight="bold">MTBKBY22</Text>
        </Text>

        <Text variant="p1" fontWeight="bold" mb={16}>
          BY52PJCB30120855581000000933
        </Text>

        <Text variant="p1" mb={8}>
          Банк-получатель:
        </Text>

        <Text variant="p1" mb={8}>
          ЦБУ 115 «Приорбанк» ОАО, г.Минск, ул. Кропоткина, 91
        </Text>

        <Text variant="p1" mb={16}>
          БИК: <Text variant="p1" fontWeight="bold">PICBBY2X</Text>
        </Text>

        <Text variant="p1" mb={8}>
          Офис: 220037, г. Минск, ул. Долгобродская, 18/1-5, комн. 14.
        </Text>

        <Text variant="p1" mb={8}>
          Тел. +375 29 3530530
        </Text>

        <Text variant="p1" mb={4}>
          E-mail:
        </Text>

        <Text
          variant="p1"
          colorName="primary" // или другой цвет для ссылок из твоей темы
          mb={4}
          onPress={() => handleEmailPress('lme15@mail.ru')}
        >
          lme15@mail.ru
        </Text>

        <Text
          variant="p1"
          colorName="primary"
          mb={16}
          onPress={() => handleEmailPress('alexbpsenergy@gmail.com')}
        >
          alexbpsenergy@gmail.com
        </Text>

        <Text
          variant="p1"
          colorName="primary"
          mb={16}
          onPress={handleWebsitePress}
        >
          https://bps-energy.by
        </Text>

        <Text variant="p1" mb={8}>
          Адрес производства: 220024 г. Минск, ул. Бабушкина 32а
        </Text>

        <Text variant="p1" fontWeight="bold" mb={4}>
          +375445592988 Александр
        </Text>

        <Text variant="p1" mb={8}>
          – Начальник производства
        </Text>

        <Text variant="p1" mb={4}>
          E-mail:
        </Text>

        <Text
          variant="p1"
          colorName="primary"
          mb={16}
          onPress={() => handleEmailPress('alexbpsenergy@gmail.com')}
        >
          alexbpsenergy@gmail.com
        </Text>

        <Text variant="p1" fontWeight="bold" uppercase mt={20}>
          Директор: Лаврухин Михаил Евгеньевич, действует на основании Устава
        </Text>
      </BottomSheetScrollView>
    </BottomSlideModal>
  )
})

export default LegalInfoBottomSheet