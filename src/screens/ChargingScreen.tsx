import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner
} from 'react-native-vision-camera';
import FlashlightIcon from '@assets/svg/flashlight.svg';
import { useAppState } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';

import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui'
import Overlay from '@src/ui/Layouts/Overlay';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';

export let setCodeScanedRef: React.Dispatch<React.SetStateAction<Code | null>> | null = null;

const EDGE_STYLES = {
  bottomLeft: {
    borderBottomLeftRadius: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    borderBottomRightRadius: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    bottom: 0,
    right: 0,
  },
  topLeft: {
    borderLeftWidth: 3,
    borderTopLeftRadius: 10,
    borderTopWidth: 3,
    left: 0,
    top: 0,
  },
  topRight: {
    borderRightWidth: 3,
    borderTopRightRadius: 10,
    borderTopWidth: 3,
    right: 0,
    top: 0,
  },
}

const EDGE_SIZE = 20

export default function ChargingScreen() {
  const { colors, insets } = useAppTheme();
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
  const [torch, setTorch] = useState(false);

  const isFocused = useIsFocused()
  const appState = useAppState()

  const isActive = isFocused && appState === 'active'


  const handleTorch = () => setTorch(!torch);

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

  const renderEdge = useCallback((position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => (
    <Box w={EDGE_SIZE} h={EDGE_SIZE} borderColor={colors.white} absolute style={EDGE_STYLES[position]} />
  ), [colors.white])

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
    <Box style={StyleSheet.absoluteFillObject}>
      {!device ? null : (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          torch={torch ? 'on' : 'off'}
          onError={(error) => Alert.alert(error.message)}
        />
      )}

      <Box flex={1}>
        <Overlay>
          <Box justifyContent="flex-end" row pt={insets.top + 16} pr={insets.right + 16} />
          <Box justifyContent="center" flex={1} w={179} alignSelf='center' >
            <Text
              center
              colorName='white'
              children={'Отсканируй QR код что-бы начать зарядку'}
            />
          </Box>
        </Overlay>
        <Box row>
          <Overlay />
          <Box
            w={220}
            h={220}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            backgroundColor={'#0000004c'}
          >
            <Box
              absolute
              borderRadius={4}
              zIndex={0}
              backgroundColor={colors.card}
              h={200}
              w={200}
              m={2}
              style={styles.centerScanner}
            />
            {renderEdge('topLeft')}
            {renderEdge('topRight')}
            {renderEdge('bottomLeft')}
            {renderEdge('bottomRight')}
          </Box>
          <Overlay />
        </Box>

        <Overlay>
          {(!device?.hasFlash || device?.hasTorch) && (
            <>
              <Box
                alignItems="center"
                alignSelf="center"
                justifyContent="center"
                borderRadius={100}
                h={65}
                w={65}
                backgroundColor={torch ? colors.main : colors.white}
                bottom={50}
                absolute
                onPress={handleTorch}
              >
                <FlashlightIcon />
              </Box>
            </>
          )}
        </Overlay>
      </Box>
    </Box>
  )
}


const styles = StyleSheet.create({
  centerScanner: {
    elevation: 4,
    opacity: 0.09,
  },
})
