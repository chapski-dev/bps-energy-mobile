import React, { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet } from 'react-native';
import AwsGallery, { GalleryRef } from 'react-native-awesome-gallery';
import { FlatList } from 'react-native-gesture-handler';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types';
import {
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
import { vibrate } from '@src/utils/vibrate';

interface GalleryProps {
  images: string[];
}

const THUMBNAIL_WIDTH = 60;
const THUMBNAIL_MARGIN_HORIZONTAL = 5;
const THUMBNAIL_STRIDE = THUMBNAIL_WIDTH + 2 * THUMBNAIL_MARGIN_HORIZONTAL;

const triggerVibrate = () => vibrate(HapticFeedbackTypes.clockTick);

const ThumbnailItem: React.FC<{
  uri: string;
  index: number;
  currentIndex: number;
  onPress: (index: number) => void;
}> = ({ uri, index, currentIndex, onPress }) => {
  const opacityVal = useSharedValue<number>(0.6);

  useAnimatedReaction(
    () => index === currentIndex,
    (isActive) => {
      opacityVal.value = withTiming(isActive ? 1 : 0.6, { duration: 500 });
    },
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityVal.value,
  }));

  return (
    <Box onPress={() => onPress(index)}>
      <ImageProgress
        uri={uri}
        style={[styles.thumbnail, animatedStyle]}
        animated
      />
    </Box>
  );
};

const GalleryHeader: React.FC<{
  tapAnimatedFadeStyle: {
    opacity: number;
  };
  closeModal: () => void;
  currentImageIndex: number;
  imagesLength: number;
}> = ({ tapAnimatedFadeStyle, closeModal, currentImageIndex, imagesLength }) => {
  const { insets, colors } = useAppTheme();

  return (
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
      style={tapAnimatedFadeStyle}
    >
      <Box onPress={closeModal} p={10}>
        <ArrowBackIcon color={colors.white} />
      </Box>
      <Text children={`${currentImageIndex + 1} из ${imagesLength}`} colorName="white" />
      <Box w={44} h={44} />
    </AnimatedBox>
  )
};

const GalleryFooter: React.FC<{
  tapAnimatedFadeStyle: {
    opacity: number;
  };
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  galleryRef: React.RefObject<GalleryRef>;
  flatListRef: React.RefObject<FlatList>;
}> = ({
  tapAnimatedFadeStyle,
  images,
  currentImageIndex,
  setCurrentImageIndex,
  galleryRef,
  flatListRef,
}) => {
    const { insets } = useAppTheme();

    const thumbnailFlatListRef = useRef<FlatList>(null);

    useEffect(() => {
      thumbnailFlatListRef.current?.scrollToIndex({
        animated: true,
        index: currentImageIndex,
        viewPosition: 0.5,
      });
    }, [currentImageIndex]);

    const handleThumbnailPress = (index: number) => {
      if (index !== currentImageIndex) {
        setCurrentImageIndex(index);
        galleryRef.current?.setIndex(index);
        flatListRef.current?.scrollToIndex({ animated: false, index });
        triggerVibrate();
      }
    };

    return (
      <AnimatedBox
        h={insets.bottom + 12 + 40}
        backgroundColor="#0000004c"
        bottom={0}
        absolute
        w="full"
        zIndex={1}
        style={tapAnimatedFadeStyle}
      >
        <FlatList
          ref={thumbnailFlatListRef}
          data={images}
          horizontal
          contentContainerStyle={{ marginTop: 12 }}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={currentImageIndex}
          getItemLayout={(_, index) => ({
            index,
            length: THUMBNAIL_STRIDE,
            offset: THUMBNAIL_STRIDE * index,
          })}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <ThumbnailItem
              uri={item}
              index={index}
              currentIndex={currentImageIndex}
              onPress={handleThumbnailPress}
            />
          )}
        />
      </AnimatedBox>
    );
  };

const FullScreenImageViewer: React.FC<{
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  closeModal: () => void;
  flatListRef: React.RefObject<FlatList>;
}> = ({ images, currentImageIndex, setCurrentImageIndex, closeModal, flatListRef }) => {
  const { colors } = useAppTheme();
  const tapFadeOpacity = useSharedValue<number>(1);
  const galleryRef = useRef<GalleryRef>(null);

  const tapAnimatedFadeStyle = useAnimatedStyle(() => ({
    opacity: tapFadeOpacity.value,
  }));

  const onTap = () =>
  (tapFadeOpacity.value = withTiming(tapFadeOpacity.value === 1 ? 0 : 1, {
    duration: 200,
  }));

  return (
    <AnimatedBox backgroundColor={colors.grey_800} flex={1}>
      <GalleryHeader
        tapAnimatedFadeStyle={tapAnimatedFadeStyle}
        closeModal={closeModal}
        currentImageIndex={currentImageIndex}
        imagesLength={images.length}
      />

      <AwsGallery
        initialIndex={currentImageIndex}
        onSwipeToClose={closeModal}
        onTap={onTap}
        data={images}
        onIndexChange={setCurrentImageIndex}
        onScaleEnd={triggerVibrate}
        style={{ backgroundColor: colors.black }}
        ref={galleryRef}
      />

      <GalleryFooter
        tapAnimatedFadeStyle={tapAnimatedFadeStyle}
        images={images}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        galleryRef={galleryRef}
        flatListRef={flatListRef}
      />
    </AnimatedBox>
  );
};

const ImageGallery: React.FC<{ images: string[]; onPress: (index: number) => void }> = ({
  images,
  onPress,
}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
    {images.map((image, index) => (
      <Box key={index} onPress={() => onPress(index)}>
        <ImageProgress uri={image} style={styles.image} resizeMode="cover" />
      </Box>
    ))}
  </ScrollView>
);

const SingleImage: React.FC<{ uri: string; onPress: () => void }> = ({ uri, onPress }) => (
  <Box onPress={onPress}>
    <ImageProgress uri={uri} style={{ ...styles.image, width: '100%' }} resizeMode="cover" />
  </Box>
);

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const openFullScreenImage = (index: number) => {
    setCurrentImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  return (
    <>
      {images.length > 1 ? (
        <ImageGallery images={images} onPress={openFullScreenImage} />
      ) : (
        <SingleImage uri={images[0]} onPress={() => openFullScreenImage(0)} />
      )}

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
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
    zIndex: 1,
  },
});