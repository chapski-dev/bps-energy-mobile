import React, { useState } from 'react'
import { Point } from 'react-native-yamap';
import ShareIcon from '@assets/svg/arrow-square-out.svg';
import CCSIcon from '@assets/svg/connector/CCS.svg';
import XIcon from '@assets/svg/X.svg';
import { useNavigation } from '@react-navigation/native';

import { CopyToClipboard } from '@src/components/CopyToClipboard';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'
import { modal } from '@src/ui/Layouts/ModalLayout';
import { StatusBanner } from '@src/ui/StatusBanner';
import { getHighAccuracyPosition } from '@src/utils/get-current-geo-position';
import { handleCatchError } from '@src/utils/handleCatchError';
import { openYandexMaps } from '@src/utils/yandex-maps';


export const StationPreviewModal = ({ point }: { point: Point }) => {
  const { colors } = useAppTheme();
  const closeModal = () => modal()?.closeModal?.();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleMoreDetails = () => {
    closeModal();
    navigation.preload('charging-station')
    navigation.navigate('charging-station')
  }

  const openRoute = async () => {
    try {
      setLoading(true);
      const userPoint = await getHighAccuracyPosition()
      openYandexMaps(userPoint, point)

    } catch (error) {
      handleCatchError(error, 'StationPreviewModal')
    } finally {
      setLoading(false);
    }
  }


  return (
    <Box relative borderRadius={16} backgroundColor={colors.background} p={24} gap={16} >
      <Box top={12} right={12} absolute onPress={closeModal}>
        <XIcon color={colors.grey_400} />
      </Box>
      <Box>
        <Text fontWeight='700' fontSize={22} children="BPS Energy" mb={2} />
        <Box row gap={8} >
          <Text children="Аранская улица, 11" colorName='grey_400' />
          <CopyToClipboard value={'Аранская улица, 11, Минск'} message='Адрес скопирован!' />
        </Box>
      </Box>

      <StatusBanner
        status="error"
        title="Станция временно недоступна"
        description="Мы уже работаем над устранением неисправности."
      />

      <Box mb={12} >
        {[1, 2].map((el) => (
          <Chargers key={el} />
        ))}
      </Box>
      <Box row gap={8} w='full'>
        <Button
          wrapperStyle={{ flex: 1 }}
          type='outline'
          children="Подробнее"
          borderColor='grey_200'
          onPress={handleMoreDetails}
        />

        <Button
          wrapperStyle={{ flex: 1 }}
          onPress={openRoute}
          children="Маршрут"
          icon={<ShareIcon width={20} height={20} color={colors.white} />}
          loading={loading}
          disabled={loading}
        />

      </Box>
    </Box>
  )
}

const Chargers = () => {
  const { colors } = useAppTheme();

  return (
    <Box
      h={52}
      alignItems='center'
      row
      style={{ borderTopWidth: 1 }}
      borderColor={colors.grey_100}
      justifyContent='space-between'
    >
      <Box gap={4} row>
        {renderChargerIcon('CCS')}
        <Box row gap={4} alignItems='center'>
          <Text children="CCS" fontSize={17} fontWeight='800' />
          <Text children="· 50 кВт" />
        </Box>
      </Box>
      <Text children="Доступно 1/2" fontSize={16} fontWeight='600' colorName='green' />

    </Box>
  )
}

const renderChargerIcon = (type: 'CCS') => {
  switch (type) {
    case 'CCS':
      return (<CCSIcon width={28} height={28} />)

    default:
      return null
  }
}