import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Point } from 'react-native-yamap';
import ShareIcon from '@assets/svg/arrow-square-out.svg';
import CCSIcon from '@assets/svg/connector/CCS.svg';
import XIcon from '@assets/svg/X.svg';
import { useNavigation } from '@react-navigation/native';

import type { Location, Station } from '@src/api/types';
import { CopyToClipboard } from '@src/components/CopyToClipboard';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'
import { modal } from '@src/ui/Layouts/ModalLayout';
import { StatusBanner } from '@src/ui/StatusBanner';
import { getHighAccuracyPosition } from '@src/utils/helpers/get-current-geo-position';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { openYandexMaps } from '@src/utils/helpers/yandex-maps';


export const StationPreviewModal = ({ station }: {
  station: {
    point: Point;
    data: Location;
  }
}) => {
  const { colors } = useAppTheme();
  const closeModal = () => modal()?.closeModal?.();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation('widgets', { keyPrefix: 'station-preview-modal' })

  const handleMoreDetails = () => {
    closeModal();
    navigation.preload('charging-station')
    navigation.navigate('charging-station')
  }

  const openRoute = async () => {
    try {
      setLoading(true);
      const userPoint = await getHighAccuracyPosition()
      openYandexMaps(userPoint, station.point)

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
          <Text children={station?.data?.street} colorName='grey_400' />
          <CopyToClipboard value={station?.data?.street} message={t('address-copied')} />
        </Box>
      </Box>

      {station.data.stations.find((el) => el.state !== 'active') &&
        <StatusBanner
          status="error"
          title={t('station-unavailable-title')}
          description={t('station-unavailable-description')}
        />}

      <Box mb={12} >
        {station.data.stations.map((el) => (
          <Chargers key={el.id} data={el} />
        ))}
      </Box>
      <Box row gap={8} w='full'>
        <Button
          wrapperStyle={{ flex: 1 }}
          type='outline'
          children={t('more-details')}
          borderColor='grey_200'
          onPress={handleMoreDetails}
        />

        <Button
          wrapperStyle={{ flex: 1 }}
          onPress={openRoute}
          children={t('route')}
          icon={<ShareIcon width={20} height={20} color={colors.white} />}
          loading={loading}
          disabled={loading}
        />

      </Box>
    </Box>
  )
}

const Chargers = ({ data }: { data: Station }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation('widgets', { keyPrefix: 'station-preview-modal' })

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
          <Text children={data.charge_box_model} fontSize={17} fontWeight='800' />
          <Text children={`· ${50} ${t('power-unit')}`} />
        </Box>
      </Box>
      <Text
        children={t('available', { available: 1, from: 2 })}
        fontSize={16}
        fontWeight='600'
        colorName={data.state === 'active' ? 'green' : 'red_500'}
      />
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