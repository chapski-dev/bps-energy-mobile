import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import FlashlightIcon from '@assets/svg/flashlight.svg';
import XIcon from '@assets/svg/X.svg';

import { useAppTheme } from '@src/theme/theme';
import { Box, Button, Text } from '@src/ui';
import Overlay from '@src/ui/Layouts/Overlay';
import { vibrate } from '@src/utils/vibrate';

type Props = {
  visible: boolean;
  onClose: () => void;
  onScan: (code: Code) => void;
};

const edgeStyles = {
  bottomLeft: {
    borderBottomLeftRadius: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    bottom: -7.5,
    left: -7.5,
  },
  bottomRight: {
    borderBottomRightRadius: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    bottom: -7.5,
    right: -7.5,
  },
  topLeft: {
    borderLeftWidth: 3,
    borderTopLeftRadius: 10,
    borderTopWidth: 3,
    left: -7.5,
    top: -7.5,
  },
  topRight: {
    borderRightWidth: 3,
    borderTopRightRadius: 10,
    borderTopWidth: 3,
    right: -7.5,
    top: -7.5,
  },
};



const QrCodeScannerModal = ({ visible, onClose, onScan }: Props) => {
  const cameraRef = useRef<Camera>(null);
  const [torch, setTorch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const { colors, insets } = useAppTheme();
  const { t } = useTranslation('widgets', { keyPrefix: 'camera-modal' })
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back', {
    physicalDevices: ['wide-angle-camera'],
  });

  useEffect(() => {
    if (visible && !hasPermission) {
      requestPermission().then(granted => {
        if (!granted) {
          Alert.alert(
            t('error.camera-access'),
            t('error.camera-permission'),
            [
              {
                onPress: onClose,
                style: 'cancel',
                text: t('controls.cancel')
              },
              {
                onPress: () => Linking.openSettings(),
                text: t('permission.open-settings')
              }
            ]);
          onClose();
        }
      });
    }
  }, [visible, t, hasPermission, requestPermission, onClose]);

  // Активация камеры при открытии/закрытии
  useEffect(() => {
    setIsActive(visible && hasPermission && !!device);
    return () => setIsActive(false);
  }, [visible, hasPermission, device]);

  // Обработчик сканирования QR
  const handleCodeScanned = useCallback(
    (codes: Code[]) => {
      if (codes.length > 0 && !loading) {
        setLoading(true);
        onScan(codes[0]);

        // Сброс состояния через 2 секунды для нового сканирования
        setTimeout(() => setLoading(false), 2000);
      }
    },
    [onScan, loading]
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: handleCodeScanned,
  });

  const renderEdge = useCallback((position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => (
    <Box
      w={25}
      h={25}
      absolute
      borderColor={colors.white}
      style={edgeStyles[position]}
    />
  ), [colors.white])

  const _handleTorch = () => {
    vibrate(HapticFeedbackTypes.impactMedium)
    setTorch(!torch);
  }
  const _handleClose = () => {
    vibrate(HapticFeedbackTypes.impactMedium)
    onClose()
  }

  const requestCamera = async () => {
    vibrate(HapticFeedbackTypes.impactMedium)
    const isAgreed = await requestPermission();
    if (!isAgreed) {
      Alert.alert(t('permission.denied-message'));
    }
  }

  if (!visible) return null;

  // Проверка разрешений и устройства
  if (!hasPermission) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <Box
          flex={1}
          justifyContent='center'
          alignItems='center'
          p={20}
          gap={30}
          backgroundColor={colors.black}
        >
          <Text colorName='white' center children={t('permission.request-message')} />
          <Button
            children={t('permission.request-button')}
            onPress={requestCamera}
            backgroundColor='white'
            textColor='text'
          />
        </Box>
      </Modal>
    );
  }

  if (!device) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <Box
          flex={1}
          justifyContent='center'
          alignItems='center'
          backgroundColor={colors.grey_800}
          gap={24}>
          <Text children={t('error.camera-access')} colorName='white' variant='h4' />
          <Button
            children={t('controls.close')}
            onPress={_handleClose}
            type='clear'
            width='auto'
          />
        </Box>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <StatusBar hidden />
      <Box flex={1} backgroundColor={colors.black} style={StyleSheet.absoluteFillObject} >
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          torch={torch ? 'on' : 'off'}
          onError={(error) => Alert.alert(error.message)}
        />

        <Box flex={1}>
          <Overlay>
            <Box justifyContent="flex-end" row pt={insets.top + 16} pr={insets.right + 16} />
            <Box justifyContent="center" flex={1} w={179} alignSelf='center' >
              <Text
                center
                colorName='white'
                children={t('instructions.scan-message')}
              />
            </Box>
          </Overlay>
          <Box row>
            <Overlay />
            <Box
              w={266}
              h={266}
              alignItems="center"
              justifyContent="center"
              borderWidth={8}
              borderColor={'#0000004c'}
            >
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
                <Button
                  children={torch ? t('controls.torch-off') : t('controls.torch-on')}
                  icon={<FlashlightIcon
                    width={20}
                    height={20}
                    color={torch ? colors.white : colors.black}
                  />}
                  onPress={_handleTorch}
                  textColor={torch ? 'white' : 'black'}
                  backgroundColor={torch ? 'black' : 'white'}
                  width='auto'
                  wrapperStyle={{ bottom: 150, position: 'absolute' }}
                />
                <Box
                  alignItems="center"
                  alignSelf="center"
                  justifyContent="center"
                  borderRadius={100}
                  h={52}
                  w={52}
                  bottom={54}
                  borderWidth={2}
                  borderColor={colors.white}
                  absolute
                  onPress={_handleClose}
                >
                  <XIcon color={colors.white} width={32} height={32} />
                </Box>
              </>
            )}
          </Overlay>
        </Box>

        {/* Индикатор загрузки */}
        {loading && (
          <Box style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

const styles = StyleSheet.create({
  edge: {
    height: 25,
    position: 'absolute',
    width: 25,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
  },
});

export default QrCodeScannerModal;