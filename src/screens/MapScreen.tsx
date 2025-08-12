import React, {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import { ClusteredYamap, Marker } from 'react-native-yamap';
import FiltersIcon from '@assets/svg/faders-horizontal.svg';
import NavigationArrowIcon from '@assets/svg/navigation-arrow.svg';
import PlusCircleFillIcon from '@assets/svg/plus-circle-fill.svg';
import BpsLogoLabelDefault from '@assets/svg/stations-map/bps-logo-label-default.svg';
import DotDefault from '@assets/svg/stations-map/dot-default.svg';
import { useNavigation } from '@react-navigation/native';
import lodash from 'lodash';

import { getLocations } from '@src/api';
import { LocationSummary } from '@src/api/types';
import { useAppColorTheme } from '@src/hooks/useAppColorTheme';
import { ScreenProps } from '@src/navigation/types';
import { AuthState, useAuth } from '@src/providers/auth';
import {
  defaultState,
  useFilterStore,
} from '@src/store/useFilterOfStationsStore';
import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';
import { modal } from '@src/ui/Layouts/ModalLayout';
import { getHighAccuracyPosition } from '@src/utils/helpers/get-current-geo-position';
import {
  handleCatchError,
  toastError,
} from '@src/utils/helpers/handleCatchError';
import { vibrate } from '@src/utils/vibrate';
import { StationPreviewModal } from '@src/widgets/modals/StationPreviewModal';
import { useChargingSessions } from '@src/service/charging';
import { windowWidth } from '@src/utils';

const HIDING_MARGIN = 20;

export default function MapScreen({ navigation }: ScreenProps<'map'>) {
  const mapRef = useRef<ClusteredYamap>(null);
  const { t } = useTranslation('errors');
  const { isDarkTheme } = useAppColorTheme();
  const [markers, setMarkers] = useState<LocationSummary[]>([]);
  const { insets } = useAppTheme();
  const { persisted } = useFilterStore();

  const onStationPress = (location: LocationSummary) => {
    vibrate(HapticFeedbackTypes.impactMedium);
    const Element = <StationPreviewModal location={location} />;

    modal().setupModal?.({
      element: Element,
      justifyContent: 'flex-start',
      marginHorizontal: 12,
      marginVertical: insets.top + 20,
    });
  };

  const getCurrentPosition = useCallback(async () => {
    try {
      const point = await getHighAccuracyPosition();
      mapRef.current?.setCenter(point, 16.5, undefined, undefined, 0.5, 0);
    } catch (error) {
      toastError(t('location-not-determined-check-settings'), {
        onPress: () => Linking.openSettings(),
      });
      console.error(
        t('location-not-determined-check-settings'),
        'MapScreen - getCurrentPosition',
      );
    }
  }, [t]);

  useLayoutEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  useEffect(() => {
    getLocations(persisted)
      .then((r) => {
        setMarkers(r.locations || []);
      })
      .catch(handleCatchError);
  }, [persisted]);

  return (
    <Box flex={1} mb={-HIDING_MARGIN}>
      <ClusteredYamap
        clusterColor={'black'}
        nightMode={isDarkTheme}
        showUserPosition
        followUser={false}
        rotateGesturesEnabled={false}
        clusteredMarkers={markers.map((location) => ({
          data: location,
          point: location.point,
        }))}
        initialRegion={{ lat: 53.902284, lon: 27.561831 }}
        style={{ flex: 1 }}
        ref={mapRef}
        renderMarker={(info, index) => (
          <Marker
            onPress={() => onStationPress(info.data)}
            key={index}
            point={info.point}
            handled={false}
            children={
              info.data.owner === 'BPS Energy' ? (
                <BpsLogoLabelDefault />
              ) : (
                <DotDefault />
              )
            }
          />
        )}
      />
      <UserBalance />
      <ChargingStatus />
      <Filters />
      <UserLocation onPress={getCurrentPosition} />
    </Box>
  );
}

const UserBalance = () => {
  const { insets, colors } = useAppTheme();
  const { authState, user } = useAuth();
  const navigation = useNavigation();
  const { t } = useTranslation('widgets');

  return authState === AuthState.ready ? (
    <Box
      absolute
      top={insets.top + 8}
      left={12}
      borderRadius={8}
      backgroundColor={colors.card}
      px={12}
      py={8}
      gap={2}
      style={shadowStyle}
      onPress={() => {
        vibrate(HapticFeedbackTypes.impactLight);
        navigation.navigate('top-up-account', { currency: 'BYN' });
      }}
    >
      <>
        <Text
          children={t('user-balance.current-balance')}
          fontSize={13}
          colorName="grey_600"
        />
        <Box row gap={4} alignItems="center" justifyContent="flex-start">
          <Text
            children={`${user?.wallets[0].value} BYN`}
            fontWeight="600"
            fontSize={20}
          />
          <PlusCircleFillIcon color={colors.primary} width={20} height={20} />
        </Box>
      </>
    </Box>
  ) : null;
};

const Filters = () => {
  const { colors } = useAppTheme();
  const nav = useNavigation();
  const { persisted } = useFilterStore();

  const isEqual = useMemo(
    () => lodash.isEqual(defaultState, persisted),
    [persisted],
  );

  return (
    <Box
      absolute
      bottom={12 + HIDING_MARGIN}
      left={12}
      borderRadius={8}
      backgroundColor={colors.card}
      px={12}
      py={8}
      w={48}
      h={48}
      style={shadowStyle}
      onPress={() => {
        vibrate(HapticFeedbackTypes.impactLight);
        nav.navigate('filters-of-stations');
      }}
    >
      <>
        {!isEqual && (
          <Box
            absolute
            w={6}
            h={6}
            right={5}
            top={5}
            backgroundColor={colors.primary}
            borderRadius={50}
          />
        )}
        <Box flex={1} justifyContent="center" alignItems="center">
          <FiltersIcon color={colors.text} />
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
      bottom={12 + HIDING_MARGIN}
      right={12}
      borderRadius={8}
      backgroundColor={colors.card}
      px={12}
      py={8}
      w={48}
      h={48}
      justifyContent="center"
      alignItems="center"
      onPress={() => {
        vibrate(HapticFeedbackTypes.impactLight);
        onPress();
      }}
      style={shadowStyle}
    >
      <NavigationArrowIcon color={colors.grey_700} />
    </Box>
  );
};

const ChargingStatus = () => {
  const { colors, insets } = useAppTheme();
  const navigation = useNavigation();
  const { sessions } = useChargingSessions();
  const { t } = useTranslation('widgets');

  if (!sessions.length) return null;

  const renderSessions = () => {
    if (sessions.length === 1) {
      return sessions.map((el, i) => (
        <Fragment key={i}>
          <Text>
            <Text
              variant="p4"
              children={t('map-charging-widget.battery', {
                count: sessions.length,
              })}
              colorName="white"
            />
            <Text variant="p4" children=" / " colorName="white_90" />
            <Text
              variant="p4"
              children={t('map-charging-widget.recived')}
              colorName="white"
            />
          </Text>
          <Text
            variant="h4"
            children={`${el?.soc}% / ${parseFloat(el?.charged.toFixed(2))} ${t('map-charging-widget.kilowatt-hour')}`}
            colorName="white"
          />
        </Fragment>
      ));
    }
    if (sessions.length > 1) {
      return (
        <>
          <Text
            variant="p4"
            children={t('map-charging-widget.battery', {
              count: sessions.length,
            })}
            colorName="white"
          />
          <Text>
            {sessions.map((el, i) => (
              <Fragment key={i}>
                <Text variant="h4" children={`${el?.soc}%`} colorName="white" />
                {i !== sessions.length - 1 && (
                  <Text variant="h4" children=" / " colorName="white_90" />
                )}
              </Fragment>
            ))}
          </Text>
        </>
      );
    }
  };
  return (
    <Box
      absolute
      top={insets.top + 8}
      right={12}
      borderRadius={8}
      px={12}
      py={8}
      maxWidth={windowWidth * 0.6}
      backgroundColor={colors.success_500}
      style={shadowStyle}
      effect="scale"
      underlayColor={colors.success_500}
      onPress={() => {
        vibrate(HapticFeedbackTypes.impactLight);
        navigation.navigate('charging-session');
      }}
    >
      {renderSessions()}
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
