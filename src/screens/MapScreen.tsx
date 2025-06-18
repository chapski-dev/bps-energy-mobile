import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeSyntheticEvent } from 'react-native';
import {
  ClusteredYamap,
  Marker,
  Point,
} from 'react-native-yamap';
import FiltersIcon from '@assets/svg/faders-horizontal.svg';
import NavigationArrowIcon from '@assets/svg/navigation-arrow.svg';
import PlusCircleFillIcon from '@assets/svg/plus-circle-fill.svg';
import { useNavigation } from '@react-navigation/native';
import lodash from 'lodash';

import { ScreenProps } from '@src/navigation/types';
import { AuthState, useAuth } from '@src/providers/auth';
import { defaultState, useFilterStore } from '@src/store/useFilterOfStationsStore';
import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';
import { modal } from '@src/ui/Layouts/ModalLayout';
import { getHighAccuracyPosition } from '@src/utils/get-current-geo-position';
import { handleCatchError } from '@src/utils/handleCatchError';
import { StationPreviewModal } from '@src/widgets/modals/StationPreviewModal';

export default function MapScreen({ navigation }: ScreenProps<'map'>) {
  const mapRef = useRef<ClusteredYamap>(null);
  const { t } = useTranslation();
  const [markers, setMarkers] = useState<Point[]>([]);
  const { insets } = useAppTheme();

  const onMapPress = (event: NativeSyntheticEvent<Point>) => {
    const { lat, lon } = event.nativeEvent;
    const newPolyline = [
      ...markers,
      {
        lat,
        lon,
      },
    ];
    setMarkers(newPolyline);
  };

  const onStationPress = (point: Point) => {
    const Element = (
      <StationPreviewModal point={point} />
    );

    modal().setupModal?.({
      element: Element,
      justifyContent: 'flex-start',
      marginHorizontal: 12,
      marginVertical: insets.top + 20,
    });

  }
  const getCurrentPosition = useCallback(async () => {
    try {
      const point = await getHighAccuracyPosition()

      mapRef.current?.setCenter(point, 16.5, undefined, undefined, 0.5, 0);

    } catch (error) {
      handleCatchError(
        t('errors.your-location-could-not-be-determined-make-sure-you-have-enabled-access-in-your-device-settings'),
        'MapScreen - getCurrentPosition')
    }
  }, [t])


  useLayoutEffect(() => {
    getCurrentPosition()
  }, [getCurrentPosition])



  return (
    <Box flex={1}>
      <ClusteredYamap
        clusterColor={'black'}
        showUserPosition
        rotateGesturesEnabled={false}
        clusteredMarkers={markers.map((marker) => ({
          data: {
            foo: 'Hello'
          },
          point: marker,
        }))}
        initialRegion={{ lat: 53.902284, lon: 27.561831 }}
        onMapPress={onMapPress}
        style={{ flex: 1 }}
        ref={mapRef}
        renderMarker={(info, index) => (
          <Marker
            onPress={() => onStationPress(info.point)}
            key={index}
            point={info.point}
            source={require('@assets/png/bps-logo-label-default.png')}
            scale={0.5}
          />
        )}
      />
      <UserBalance />
      <Filters />
      <UserLocation onPress={getCurrentPosition} />
    </Box>
  );
}

const UserBalance = () => {
  const { insets, colors } = useAppTheme();
  const { authState, user } = useAuth();
  const navigation = useNavigation()
  const { t } = useTranslation();

  return authState === AuthState.ready ? (
    <Box
      absolute
      top={insets.top + 8}
      left={12}
      borderRadius={8}
      backgroundColor={colors.white_90}
      px={12}
      py={8}
      gap={2}
      style={shadowStyle}
      effect="highlight"
      underlayColor={colors.grey_100}
      onPress={() => navigation.navigate('top-up-account', { currency: 'BYN' })}
    >
      <>
        <Text children={t('shared.current-balance')} fontSize={13} colorName="grey_600" />
        <Box row gap={4} alignItems="center" justifyContent='flex-start'>
          <Text children={`${user?.wallets[0].value} BYN`} fontWeight="600" fontSize={20} />
          <PlusCircleFillIcon color={colors.main} width={20} height={20} />
        </Box>
      </>
    </Box>
  ) : null;
};

const Filters = () => {
  const { colors } = useAppTheme();
  const nav = useNavigation();
  const { persisted } = useFilterStore();

  const isEqual = useMemo(() => lodash.isEqual(defaultState, persisted), [persisted])

  return (
    <Box
      absolute
      bottom={12}
      left={12}
      borderRadius={8}
      backgroundColor={colors.white_90}
      px={12}
      py={8}
      w={48}
      h={48}
      style={shadowStyle}
      effect="highlight"
      underlayColor={colors.grey_100}
      onPress={() => nav.navigate('filters-of-stations')}
    >
      <>
        {!isEqual && <Box
          absolute
          w={6}
          h={6}
          right={5}
          top={5}
          backgroundColor={colors.main}
          borderRadius={50}
        />}
        <Box flex={1} justifyContent="center" alignItems="center">
          <FiltersIcon />
        </Box>
      </>
    </Box>
  );
};

const UserLocation = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useAppTheme();
  return (
    <Box
      absolute
      bottom={12}
      right={12}
      borderRadius={8}
      backgroundColor={colors.white_90}
      px={12}
      py={8}
      w={48}
      h={48}
      justifyContent="center"
      alignItems="center"
      onPress={onPress}
      style={shadowStyle}
    >
      <NavigationArrowIcon color={colors.grey_700} />
    </Box>
  );
};

const shadowStyle = {
  elevation: 8,
  shadowColor: '#000',
  shadowOffset: {
    height: 4,
    width: 0,
  },
  shadowOpacity: 0.3,

  shadowRadius: 4.65,
};
