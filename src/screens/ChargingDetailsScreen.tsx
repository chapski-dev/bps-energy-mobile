import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import YaMap from 'react-native-yamap';

import { getFinishedChargingSession } from '@src/api';
import { FinishedSession, FinishedSessionExpanded } from '@src/api/types';
import { CopyToClipboard } from '@src/components/CopyToClipboard';
import { useAppColorTheme } from '@src/hooks/useAppColorTheme';
import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import { ImageProgress } from '@src/ui/ImageProgress';
import { getHighAccuracyPosition } from '@src/utils/helpers/get-current-geo-position';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { openYandexMaps } from '@src/utils/helpers/yandex-maps';

export default function ChargingDetailsScreen({ route }: ScreenProps<'charging-details'>) {
  const { insets } = useAppTheme();
  const { t } = useTranslation('screens');
  const { isDarkTheme } = useAppColorTheme()
  const [sessionExpanded, setSessionExpanded] = useState<Partial<FinishedSessionExpanded> | null>(null);
  const [loading, setLoading] = useState(false);

  const session: FinishedSession = route.params.session;

  // Получить значение поля из sessionExpanded, иначе из session
  const getField = (field: keyof (FinishedSessionExpanded & FinishedSession)): unknown => {
    if (sessionExpanded && field in sessionExpanded && sessionExpanded[field] !== undefined) {
      return sessionExpanded[field as keyof FinishedSessionExpanded];
    }
    return session[field as keyof FinishedSession];
  };

  // Форматирование времени зарядки
  const getDuration = () => {
    const begin = getField('begin') as string | undefined;
    const end = getField('end') as string | undefined;
    if (!begin || !end) return '';
    const start = new Date(begin);
    const finish = new Date(end);
    const diff = Math.max(0, (finish.getTime() - start.getTime()) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = Math.floor(diff % 60);
    return [h, m, s].map(x => String(x).padStart(2, '0')).join(':');
  };

  useEffect(() => {
    let mounted = true;
    getFinishedChargingSession(session.id)
      .then(res => {
        if (mounted && res.session) setSessionExpanded(res.session);
      })
      .catch(handleCatchError);
    return () => { mounted = false; };
  }, [session.id]);

  const fullAdress = `${getField('location_street') as string || ''}, ${getField('location_city') as string || ''}`;

  const openRoute = async () => {
    try {
      setLoading(true);
      const userPoint = await getHighAccuracyPosition()
      openYandexMaps(userPoint, { lat: 53.902284, lon: 27.561831 })

    } catch (error) {
      handleCatchError(error, 'StationPreviewModal')
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Box px={24} pt={12}>
        <Box row alignItems="center" gap={12} mb={16}>
          <ImageProgress
            uri={String(getField('location_photo_url') ?? '')}
            style={styles.image}
            resizeMode="cover"
          />
          <Box flex={1}>
            <Text variant="h3" mb={2} children={String(getField('owner') || 'BPS Energy')} />
            <Box row gap={8} alignItems='center' flexShrink={1} >
              <Text children={fullAdress} flexShrink={1} variant="p2" colorName='grey_700' />
              <CopyToClipboard value={String(fullAdress)} message={t('charging-details-screen.address-copied')} />
            </Box>
          </Box>
        </Box>
        <Box gap={8}>
          <DetailRow
            label={t('charging-details-screen.received')}
            value={`${getField('charged_energy') as number ?? ''} ${t('charging-history-screen.kilowatt-hour')}`} />
          <DetailRow
            label={t('charging-details-screen.battery')}
            value={`${getField('soc_begin') as number ?? ''}% → ${getField('soc_end') as number ?? ''}%`} />
          <DetailRow
            label={t('charging-details-screen.charging-time')}
            value={getDuration()} />
          <DetailRow
            label={t('charging-details-screen.spent')}
            value={`${getField('total_price') as number ?? ''} BYN`} />
          <DetailRow
            label={t('charging-details-screen.tariff')}
            value={`${getField('price_per_kwh') as number ?? ''} р. / ${t('charging-history-screen.kilowatt-hour')}`} />
          <DetailRow
            label={t('charging-details-screen.connector')}
            value={`${getField('connector_type') as string ?? ''}, № ${((getField('connector_id') as number | string) ?? '').toString().padStart(4, '0')}`} />
          <DetailRow
            label={t('charging-details-screen.session-id')}
            value={((getField('id') as number | string) ?? '').toString()} copy />
        </Box>
      </Box>
      <Box flex={1}>
        <YaMap
          nightMode={isDarkTheme}
          style={{ flex: 1, }}
          scrollGesturesEnabled={false}
          fastTapEnabled={false}
          zoomGesturesEnabled={false}
          tiltGesturesEnabled={false}
          rotateGesturesEnabled={false}
          initialRegion={{ lat: 53.902284, lon: 27.561831 }}
        />
        <Box row gap={8} absolute bottom={insets.bottom || 24} px={16}>
          {/* <Button
            type="outline"
            wrapperStyle={{ flex: 1 }}
            children={t('charging-details-screen.details')}
          /> */}
          <Button
            wrapperStyle={{ flex: 1 }}
            children={t('charging-details-screen.route')}
            onPress={openRoute}
            loading={loading}
            disabled={loading}
          />
        </Box>
      </Box>
    </ScrollView>
  );
}

const DetailRow = ({ label, value, copy = false }: { label: string; value: string; copy?: boolean }) => {
  const { colors } = useAppTheme();
  return (
    <Box
      row
      justifyContent="space-between"
      alignItems="center"
      py={10}
      borderBottomWidth={1}
      borderColor={colors.grey_100}
    >
      <Text variant="p2" colorName="grey_700">{label}</Text>
      <Box row alignItems="center" gap={6}>
        <Text variant="p2-semibold">{value}</Text>
        {copy ? <CopyToClipboard value={value} message="Copied!" /> : null}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 4,
    height: 64,
    width: 64,
  },
});
