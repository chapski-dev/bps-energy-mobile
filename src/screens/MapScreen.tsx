import React, { useRef, useState } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import {
  ClusteredYamap,
  Marker,
  Point,
} from 'react-native-yamap';
import FiltersIcon from '@assets/svg/faders-horizontal.svg';
import NavigationArrowIcon from '@assets/svg/navigation-arrow.svg';
import PlusCircleFillIcon from '@assets/svg/plus-circle-fill.svg';

import { AuthState, useAuth } from '@src/providers/auth';
import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';
import { getHighAccuracyPosition } from '@src/utils/get-current-geo-position';

export default function MapScreen() {
  const { authState } = useAuth();

  const mapRef = useRef<ClusteredYamap>(null);
  const [markers, setMarkers] = useState<Point[]>([]);

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

  async function getCurrentPosition() {
    const point = await getHighAccuracyPosition()

    mapRef.current?.fitMarkers([point]);
  }

  return (
    <Box flex={1}>
      <ClusteredYamap
        clusterColor={'black'}
        clusteredMarkers={markers.map((marker) => ({
          data: {

          },
          point: marker,
        }))}
        onMapPress={onMapPress}
        style={{ flex: 1 }}
        ref={mapRef}
        renderMarker={(info, index) => (
          <Marker
            key={index}
            point={info.point}
            source={require('@assets/png/dot-default.png')}
            scale={2}
          />
        )}
      />
      {authState === AuthState.ready && (
        <>
          <UserBalance />
          <Filters />
        </>
      )}
      <UserLocation onPress={getCurrentPosition} />
    </Box>
  );
}

const UserBalance = () => {
  const { insets, colors } = useAppTheme();

  return (
    <Box
      absolute
      top={insets.top + 8}
      left={12}
      borderRadius={8}
      backgroundColor={colors.white_transparent}
      px={12}
      py={8}
      gap={2}
      style={shadowStyle}
      onPress={() => null}
    >
      <Text children="Текущий баланс" fontSize={13} colorName="grey_600" />
      <Box row gap={4} alignItems="center" justifyContent="center">
        <Text children="17,30 BYN" fontWeight="600" fontSize={20} />
        <PlusCircleFillIcon color={colors.main} width={20} height={20} />
      </Box>
    </Box>
  );
};

const Filters = () => {
  const { colors } = useAppTheme();
  return (
    <Box
      absolute
      bottom={12}
      left={12}
      borderRadius={8}
      backgroundColor={colors.white_transparent}
      px={12}
      py={8}
      w={48}
      h={48}
      style={shadowStyle}
      onPress={() => null}
    >
      <Box
        absolute
        w={6}
        h={6}
        right={5}
        top={5}
        backgroundColor={colors.main}
        borderRadius={50}
      />
      <Box flex={1} justifyContent="center" alignItems="center">
        <FiltersIcon />
      </Box>
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
      backgroundColor={colors.white_transparent}
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
