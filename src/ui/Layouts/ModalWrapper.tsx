import React, { FC, ReactElement, useEffect } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, ViewStyle, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS
} from 'react-native-reanimated';

import { useAppTheme } from '@src/theme/theme';
import { Box } from '../Box';

interface IModalWrapperProps {
  visible: boolean
  children: ReactElement | null
  justifyContent: ViewStyle['justifyContent']
  closeModal: () => void
  marginHorizontal?: number
  marginVertical?: number
  animationOrigin?: { x: number; y: number }
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export const ModalWrapper: FC<IModalWrapperProps> = ({
  closeModal,
  visible,
  children,
  justifyContent,
  marginHorizontal,
  marginVertical,
  animationOrigin,
}) => {
  const { colors } = useAppTheme();
  
  // Анимированное значение от 0 до 1
  const progress = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      progress.value = withSpring(1, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      progress.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  // Анимация для оверлея (затемнение)
  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        progress.value,
        [0, 1],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  // Анимация для модального окна
  const modalContentStyle = useAnimatedStyle(() => {
    const originX = animationOrigin?.x || SCREEN_WIDTH / 2;
    const originY = animationOrigin?.y || SCREEN_HEIGHT / 2;
    
    // Вычисляем финальную позицию модалки
    const finalY = marginVertical || 0;
    
    // Анимация масштаба от 0 до 1
    const scale = interpolate(
      progress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    
    // Анимация позиции Y от точки касания до финальной позиции
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [originY - finalY - SCREEN_HEIGHT / 2, 0],
      Extrapolation.CLAMP
    );
    
    // Анимация позиции X от точки касания к центру
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [originX - SCREEN_WIDTH / 2, 0],
      Extrapolation.CLAMP
    );
    
    // Анимация прозрачности
    const opacity = interpolate(
      progress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
      opacity,
    };
  });

  return (
    <Modal
      animationType="none"
      supportedOrientations={['portrait']}
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <Box flex justifyContent={justifyContent}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <Animated.View style={[styles.modalOverlay, overlayStyle]} />
        </TouchableWithoutFeedback>
        
        <Animated.View
          style={[
            {
              marginTop: marginVertical || 0,
              marginBottom: marginVertical || 0,
              marginRight: marginHorizontal || 0,
              marginLeft: marginHorizontal || 0,
              borderRadius: 25,
              backgroundColor: colors.grey_800,
              overflow: 'hidden',
            },
            modalContentStyle,
          ]}
        >
          {children}
        </Animated.View>
      </Box>
    </Modal>
  );
};