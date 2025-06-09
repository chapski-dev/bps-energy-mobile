import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FlatList, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import {
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ArrowBackIcon from '@assets/svg/arrow-left.svg';

import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';
import { AnimatedBox } from '@src/ui/Box';
import { ImageProgress } from '@src/ui/ImageProgress';
import { windowHeight, windowWidth } from '@src/utils';
import { vibrate } from '@src/utils/vibrate';

interface GalleryProps {
  images: string[];
}

const triggerVibrate = () => {
  vibrate(HapticFeedbackTypes.clockTick);
};

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList | null>(null);

  const openFullScreenImage = (index: number): void => {
    setCurrentImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = (): void => setModalVisible(false);

  return (
    <>
      {images.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
          {images.map((image, index) => (
            <Box key={index} onPress={() => openFullScreenImage(index)}>
              <ImageProgress uri={image} style={styles.image} resizeMode="cover" />
            </Box>
          ))}
        </ScrollView>
      ) : (
        <Box onPress={() => openFullScreenImage(0)}>
          <ImageProgress uri={images[0]} style={{ ...styles.image, width: '100%' }} resizeMode="cover" />
        </Box>
      )}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={closeModal}>
        <FullScreenImageViewer
          images={images}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          closeModal={closeModal}
          flatListRef={flatListRef}
        />
      </Modal>
    </>
  );
};

interface FullScreenImageViewerProps {
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  closeModal: () => void;
  flatListRef: React.MutableRefObject<FlatList | null>;
}

const FullScreenImageViewer: React.FC<FullScreenImageViewerProps> = ({
  images,
  currentImageIndex,
  setCurrentImageIndex,
  closeModal,
  flatListRef,
}) => {
  const translateY = useSharedValue<number>(0);
  const fadeOpacity = useSharedValue<number>(1);
  const scaleRefs = useRef<SharedValue<number>[]>(images.map(() => useSharedValue(1)));
  const thumbnailFlatListRef = useRef<FlatList | null>(null);

  const THUMBNAIL_WIDTH = 60;
  const THUMBNAIL_MARGIN_HORIZONTAL = 5;
  const THUMBNAIL_STRIDE = THUMBNAIL_WIDTH + 2 * THUMBNAIL_MARGIN_HORIZONTAL;
  const IMAGE_MARGIN_HORIZONTAL = 5; // Половина от 10px зазора (5px с каждой стороны)

  useEffect(() => {
    if (thumbnailFlatListRef.current) {
      thumbnailFlatListRef.current.scrollToIndex({
        animated: true,
        index: currentImageIndex,
        viewPosition: 0.5,
      });
    }
  }, [currentImageIndex]);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translateY.value = event.translationY;
      const absY = Math.abs(translateY.value);
      fadeOpacity.value = interpolate(absY, [0, windowHeight * 0.2], [1, 0], 'clamp');
    })
    .onEnd(() => {
      if (Math.abs(translateY.value) > windowHeight * 0.2) {
        runOnJS(closeModal)();
      } else {
        translateY.value = withTiming(0, { duration: 200 });
        fadeOpacity.value = withTiming(1, { duration: 200 });
      }
    });

  const onScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const idx = Math.round(event.nativeEvent.contentOffset.x / (windowWidth + 2 * IMAGE_MARGIN_HORIZONTAL));
    runOnJS(setCurrentImageIndex)(idx);
    scaleRefs.current.forEach((scale, i) => {
      if (i !== idx) {
        scale.value = withTiming(1);
      }
    });
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const animatedFadeStyle = useAnimatedStyle(() => ({ opacity: fadeOpacity.value }));
  const { colors, insets } = useAppTheme();

  return (
    <AnimatedBox
      alignItems="center"
      backgroundColor={colors.grey_800}
      flex={1}
      justifyContent="center"
    >
      <GestureDetector gesture={panGesture}>
        <AnimatedBox
          h="screen"
          w="screen"
          zIndex={1}
          style={animatedContainerStyle}
        >
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            snapToInterval={windowWidth + 2 * IMAGE_MARGIN_HORIZONTAL}
            snapToAlignment="center"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            initialScrollIndex={currentImageIndex}
            getItemLayout={(_, index) => ({
              index,
              length: windowWidth + 2 * IMAGE_MARGIN_HORIZONTAL,
              offset: (windowWidth + 2 * IMAGE_MARGIN_HORIZONTAL) * index,
            })}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }: { item: string; index: number }) => (
              <ZoomableImage uri={item} scaleRef={scaleRefs.current[index]} fadeOpacity={fadeOpacity} />
            )}
          />
        </AnimatedBox>
      </GestureDetector>

      <AnimatedBox
        h={insets.bottom + 12 + 40}
        backgroundColor="rgba(0, 0, 0, 0.3)"
        bottom={0}
        absolute
        w="full"
        zIndex={1}
        style={animatedFadeStyle}
      >
        <FlatList
          ref={thumbnailFlatListRef}
          data={images}
          horizontal
          contentContainerStyle={{ marginTop: 12 }}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={currentImageIndex}
          getItemLayout={(_, index) => ({ index, length: THUMBNAIL_STRIDE, offset: THUMBNAIL_STRIDE * index })}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <ThumbnailItem
              uri={item}
              index={index}
              currentIndex={currentImageIndex}
              onPress={(idx: number) => {
                if (idx !== currentImageIndex) {
                  setCurrentImageIndex(idx);
                  flatListRef.current?.scrollToIndex({
                    animated: false,
                    index: idx,
                    viewOffset: 0,
                  });
                  triggerVibrate()
                }
              }}
            />
          )}
        />
      </AnimatedBox>

      <AnimatedBox
        alignItems="center"
        backgroundColor="rgba(0, 0, 0, 0.3)"
        row
        justifyContent="space-between"
        pt={insets.top}
        w="full"
        absolute
        left={0}
        top={0}
        zIndex={1}
        style={animatedFadeStyle}
      >
        <Box onPress={closeModal} p={10}>
          <ArrowBackIcon color={colors.white} />
        </Box>
        <Text children={`${currentImageIndex + 1} из ${images.length}`} colorName="white" />
        <Box w={44} h={44} />
      </AnimatedBox>
    </AnimatedBox>
  );
};

interface ZoomableImageProps {
  uri: string;
  scaleRef: SharedValue<number>;
  fadeOpacity: SharedValue<number>;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ uri, scaleRef, fadeOpacity }) => {
  const scale = scaleRef;
  const savedScale = useSharedValue<number>(1);
  const lastUpdateTime = useSharedValue<number>(0); // Для debounce
  const isPinching = useSharedValue<boolean>(false);
  
  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .maxDelay(200)
    .onEnd((_event, success) => {
      if (success && !isPinching.value) {
        fadeOpacity.value = withTiming(fadeOpacity.value === 1 ? 0 : 1, { duration: 200 });
      }
    });

    const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success && !isPinching.value) {
        if (scaleRef.value > 1) {
          scaleRef.value = withTiming(1, { duration: 400 });
          savedScale.value = 1;
        } else {
          scaleRef.value = withTiming(2, { duration: 400 });
          savedScale.value = 2;
        }
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      // При старте жеста pinch нужно «зафиксировать» текущее значение scaleRef
      // в savedScale, чтобы event.scale был отсчитан от правильной «точки отсчёта».
      isPinching.value = true;
      savedScale.value = scaleRef.value;
    })
    .onUpdate((event) => {
      const currentTime = Date.now();
      // Debounce: обновляем масштаб только если прошло >= 16ms (примерно 60fps)
      if (currentTime - lastUpdateTime.value >= 16) {
        const newScale = savedScale.value * event.scale;
        scaleRef.value = Math.max(0.9, Math.min(newScale, 3.7));
        lastUpdateTime.value = currentTime;
      }
    })
    .onEnd(() => {
      if (scaleRef.value < 1) {
        scaleRef.value = withTiming(1, { duration: 400 });
        savedScale.value = 1;
        runOnJS(triggerVibrate)()
      } else if (scaleRef.value > 3) {
        scaleRef.value = withTiming(3, { duration: 400 });
        runOnJS(triggerVibrate)()
        savedScale.value = 3;
      } else {
        savedScale.value = scaleRef.value;
      }
      isPinching.value = false;
    });

  const tapExclusive = Gesture.Simultaneous(doubleTapGesture, singleTapGesture);
  const composedGesture = Gesture.Exclusive(pinchGesture, tapExclusive);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedBox
      alignItems="center"
      justifyContent="center"
      h="screen"
      w={windowWidth}
      mx={5}
      overflow='hidden'
    >
      <GestureDetector gesture={composedGesture}>
        <ImageProgress
          uri={uri}
          style={[styles.fullScreenImage, animatedStyle]}
          resizeMode="contain"
          animated
        />
      </GestureDetector>
    </AnimatedBox>
  );
};

interface ThumbnailItemProps {
  uri: string;
  index: number;
  currentIndex: number;
  onPress: (index: number) => void;
}

const ThumbnailItem: React.FC<ThumbnailItemProps> = ({ uri, index, currentIndex, onPress }) => {
  const opacityVal = useSharedValue<number>(0.6);

  useAnimatedReaction(
    () => index === currentIndex,
    (isActive) => {
      opacityVal.value = withTiming(isActive ? 1 : 0.6, { duration: 500 });
    }
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityVal.value,
  }));

  return (
    <Box onPress={() => onPress(index)}>
      <ImageProgress uri={uri} style={[styles.thumbnail, animatedStyle]} animated />
    </Box>
  );
};

const styles = StyleSheet.create({
  fullScreenImage: { height: '100%', width: '100%' },
  image: { borderRadius: 10, height: 130, marginRight: 10, width: 170 },
  imageGallery: { marginBottom: 20 },
  thumbnail: { borderRadius: 5, height: 40, marginHorizontal: 5, width: 60 },
  thumbnailContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    bottom: 0,
    position: 'absolute',
    width: '100%',
    zIndex: 1
  },
});