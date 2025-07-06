import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import CodePush from '@bravemobile/react-native-code-push';

import { Box, Text } from '@src/ui';

export const AppVersionInfo = () => {
  const [cpMeta, setCpMeta] = useState<any>(null);
  const binaryVersion = DeviceInfo.getVersion();
  const { t } = useTranslation('screens', { keyPrefix: 'profile-screen' })

  useEffect(() => {
    CodePush.getUpdateMetadata().then(setCpMeta);
  }, []);

  // Определяем, отличается ли JS-бандл от binary-version
  const isHotfix = cpMeta && cpMeta.appVersion && cpMeta.label && cpMeta.appVersion === binaryVersion;

  return (
    <Box style={styles.container}>
      <Text
        variant='p4'
        colorName='promting'
        my={24}
        children={t('app-version', { version: binaryVersion })}
      />
      {isHotfix && cpMeta.label ? <Text style={styles.versionText}>
        {cpMeta.label}
      </Text> : null}
      {/* Можно добавить подробности для отладки */}
      <Text style={styles.metaText}>CodePush: {JSON.stringify(cpMeta, null, 2)}</Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  metaText: {
    color: '#aaa',
    fontSize: 10,
    marginTop: 4,
  },
  versionText: {
    color: '#888',
    fontSize: 14,
  },
});