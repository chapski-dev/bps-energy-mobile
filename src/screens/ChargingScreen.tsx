import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner
} from 'react-native-vision-camera';

import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';

export let setCodeScanedRef: React.Dispatch<React.SetStateAction<Code | null>> | null = null;

export default function ChargingScreen() {
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [codeScaned, setCodeScaned] = useState<null | Code>(null);
  const device = useCameraDevice('back', {
    physicalDevices: ['wide-angle-camera'],
  });

  useEffect(() => {
    setCodeScanedRef = setCodeScaned
    return () => {
      setCodeScaned
    }
  }, [])

  const { hasPermission, requestPermission } = useCameraPermission()

  const handleCodeScaned = async (codes: Code[]) => {
    try {
      setLoading(true)
      await wait(3000)
      console.log(`Scanned ${codes.length} codes!`)
      setCodeScaned(codes[0])
    } catch (error) {
      handleCatchError(error)
    } finally {
      setLoading(false)
    }
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: handleCodeScaned,
  })

  const requestCamera = async () => {
    const isAgreed = await requestPermission();
    if (!isAgreed) {
      Alert.alert('Не предоставлен доступ к камере.');
    }
  }

  if (loading) return (
    <Box flex={1} justifyContent='center' alignItems='center' p={20} >
      <ActivityIndicator color={colors.main} />
    </Box>)

  if (codeScaned) return (
    <Box flex={1} justifyContent='center' alignItems='center' p={20} >
      <Text children="Код:" />
      <Text children={codeScaned.value} />
    </Box>)


  if (!hasPermission) return (
    <Box flex={1} justifyContent='center' alignItems='center' p={20} gap={30} >
      <Text center children="Предоставьте доступ к камере чтобы продолжить" />
      <Button children="Предоставить" onPress={requestCamera} />
    </Box>)

  if (device == null) return (
    <Box flex={1} justifyContent='center' alignItems='center' >
      <Text children="Камера не обнаружена" />
    </Box>)

  return (
    <Camera
      codeScanner={codeScanner}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}
