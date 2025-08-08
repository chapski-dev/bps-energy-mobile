import React, {
  ReactNode,
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
import { CameraPosition, ClusteredYamap, Marker } from 'react-native-yamap';
import FiltersIcon from '@assets/svg/faders-horizontal.svg';
import NavigationArrowIcon from '@assets/svg/navigation-arrow.svg';
import PlusCircleFillIcon from '@assets/svg/plus-circle-fill.svg';
import PlusIcon from '@assets/svg/plus.svg';
import MinusIcon from '@assets/svg/minus.svg';

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
import { handleCatchError, toastError } from '@src/utils/helpers/handleCatchError';
import { vibrate } from '@src/utils/vibrate';
import { StationPreviewModal } from '@src/widgets/modals/StationPreviewModal';

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
      toastError(
        t('location-not-determined-check-settings'), {
        onPress: () => Linking.openSettings()
      })
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
              info.data.owner === 'BPS Energy' ?
                <BpsLogoLabelDefault /> :
                <DotDefault />
            }
          />
        )}
      />
      <UserBalance />
      <Filters />
      <ZoomButtons mapRef={mapRef} />
      <UserLocation onPress={getCurrentPosition} />
    </Box>
  );
}

const UserBalance = () => {
  const { insets, colors } = useAppTheme();
  const { authState, user } = useAuth();
  const navigation = useNavigation();
  const { t } = useTranslation('widgets');

  if (authState !== AuthState.ready) return null;

  return (
    <FloatingCard
      position={{ top: insets.top + 8, left: 12 }}
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
    </FloatingCard>
  );
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
    <FloatingCard
      position={{ bottom: 12 + HIDING_MARGIN, left: 12 }}
      size={{ width: 48, height: 48 }}
      onPress={() => {
        vibrate(HapticFeedbackTypes.impactLight);
        nav.navigate('filters-of-stations');
      }}
      alignItems="center"
      justifyContent="center"
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
        <FiltersIcon color={colors.text} />
      </>
    </FloatingCard>
  );
};


const UserLocation = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useAppTheme();

  return (
    <FloatingCard
      position={{ bottom: 12 + HIDING_MARGIN, right: 12 }}
      size={{ width: 48, height: 48 }}
      onPress={() => {
        vibrate(HapticFeedbackTypes.impactLight);
        onPress();
      }}
      alignItems="center"
      justifyContent="center"
    >
      <NavigationArrowIcon color={colors.grey_700} />
    </FloatingCard>
  );
};

type ZoomButtonsProps = {
  mapRef: React.RefObject<ClusteredYamap>;
}
const ZoomButtons = ({
  mapRef,
}: ZoomButtonsProps) => {
  const { colors } = useAppTheme();

  const getCameraPosition = () => {
    return new Promise<CameraPosition>((resolve) => {
      if (mapRef.current) {
        mapRef.current.getCameraPosition((position) => {
          resolve(position);
        });
      }
    });
  }
  const zoomUp = async () => {
    const position = await getCameraPosition()
    if (mapRef.current) {
      mapRef.current.setZoom(position.zoom * 1.1, 0.2);
    }
  };

  const zoomDown = async () => {
    const position = await getCameraPosition();
    if (mapRef.current) {
      mapRef.current.setZoom(position.zoom * 0.9, 0.2);
    }
  };

  return (
    <Box absolute gap={15} right={12} top={'50%'} bottom={'50%'}>
      <FloatingCard
        absolute={false}
        alignItems="center"
        justifyContent="center"
        size={{ width: 48, height: 48 }}
        onPress={zoomUp}
      >
        <PlusIcon color={colors.grey_700} />
      </FloatingCard>
      <FloatingCard
        absolute={false}
        alignItems="center"
        justifyContent="center"
        size={{ width: 48, height: 48 }}
        onPress={zoomDown}
      >
        <MinusIcon color={colors.grey_700} />
      </FloatingCard>
    </Box>
  )
}

type FloatingCardProps = {
  children: ReactNode;
  position?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  size?: {
    width?: number | string;
    height?: number | string;
  };
  onPress?: () => void;
  padding?: {
    horizontal?: number;
    vertical?: number;
  };
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  absolute?: boolean;
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

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  position = {},
  size = {},
  onPress,
  padding = { horizontal: 12, vertical: 8 },
  alignItems = 'flex-start',
  justifyContent = 'flex-start',
  absolute = true
}) => {
  const { colors } = useAppTheme();

  return (
    <Box
      absolute={absolute}
      top={position.top}
      bottom={position.bottom}
      left={position.left}
      right={position.right}
      borderRadius={8}
      backgroundColor={colors.card}
      px={padding.horizontal}
      py={padding.vertical}
      w={size.width}
      h={size.height}
      justifyContent={justifyContent}
      alignItems={alignItems}
      onPress={onPress}
      style={{ ...shadowStyle, opacity: 0.9 }}
      effect={onPress ? 'highlight' : undefined}
      underlayColor={colors.grey_100}
    >
      {children}
    </Box>
  );
};