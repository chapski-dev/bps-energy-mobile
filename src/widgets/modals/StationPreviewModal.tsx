import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import ShareIcon from '@assets/svg/arrow-square-out.svg';
import CCSIcon from '@assets/svg/connector/CCS.svg';
import GBTIcon from '@assets/svg/connector/GBT.svg';
import Type2Icon from '@assets/svg/connector/Type 2.svg';
import XIcon from '@assets/svg/X.svg';
import { useNavigation } from '@react-navigation/native';

import type { ConnectorGroup, ConnectorType, LocationSummary } from '@src/api/types';
import { CopyToClipboard } from '@src/components/CopyToClipboard';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'
import { modal } from '@src/ui/Layouts/ModalLayout';
import { StatusBanner } from '@src/ui/StatusBanner';
import { getHighAccuracyPosition } from '@src/utils/helpers/get-current-geo-position';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { openYandexMaps } from '@src/utils/helpers/yandex-maps';


export const StationPreviewModal = ({ location }: {
  location: LocationSummary
}) => {
  console.log('location.connector_group', location.connector_group);

  const { colors } = useAppTheme();
  const closeModal = () => modal()?.closeModal?.();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation('widgets', { keyPrefix: 'station-preview-modal' })

  const handleMoreDetails = () => {
    closeModal();
    navigation.preload('charging-station', { location })
    navigation.navigate('charging-station', { location })
  }

  const openRoute = async () => {
    try {
      setLoading(true);
      const userPoint = await getHighAccuracyPosition()
      openYandexMaps(userPoint, location.point)

    } catch (error) {
      handleCatchError(error, 'StationPreviewModal')
    } finally {
      setLoading(false);
    }
  }

  const fullAdress = `${location?.street}, ${location?.city}`

  return (
    <Box relative borderRadius={16} backgroundColor={colors.background} p={24} gap={16} >
      <Box top={12} right={12} absolute onPress={closeModal}>
        <XIcon color={colors.grey_400} />
      </Box>
      <Box>
        <Text fontWeight='700' fontSize={22} children={location.owner} mb={2} />
        <Box row gap={8} alignItems='center' >
          <Text children={fullAdress} colorName='grey_400' />
          <CopyToClipboard value={fullAdress} message={t('address-copied')} />
        </Box>
      </Box>
      <StatusBanner
        status="error"
        title={t('station-unavailable-title')}
        description={t('station-unavailable-description')}
      />

      <Box mb={12} >
        {location.connector_group.map((el, i) => (
          <Chargers key={i} data={el} />
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

const Chargers = ({ data }: { data: ConnectorGroup }) => {
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
        <Box w={29}>
          {renderChargerIcon(data.type)}
        </Box>
        <Box row gap={4} alignItems='center'>
          <Text children={data.type} fontSize={17} fontWeight='800' />
          <Text children={`· ${50} ${t('power-unit')}`} />
        </Box>
      </Box>
      <Text
        children={t('available', { available: data.available_count, from: data.total_count })}
        fontSize={16}
        fontWeight='600'
        colorName={data.available_count > 0 ? 'green' : 'red_500'}
      />
    </Box>
  )
}

const renderChargerIcon = (type: ConnectorType) => {
  switch (type) {
    case 'CCS':
      return (<CCSIcon width={28} height={28} />)
    case 'GBT':
      return (<GBTIcon width={28} height={28} />)
    case 'Type2':
      return (<Type2Icon width={28} height={28} />)
    default:
      return null
  }
}