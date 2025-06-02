import React, { useMemo, useState } from 'react'
import { ActivityIndicator, Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import BrokenImageIcon from '@assets/svg/broken-image.svg'

import { useAppTheme } from '@src/theme/theme';
import { View } from '@src/theme/themed';

interface ImageProgressProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  animated?: boolean; // Для поддержки Animated.Image
}

export const ImageProgress: React.FC<ImageProgressProps> = ({ uri,
  style,
  resizeMode = 'cover',
  animated = false }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { colors } = useAppTheme();
  
  const ImageComponent = animated ? Animated.Image : Image;
  const ViewComponent = animated ? Animated.View : View;


  const loaderIssueStyle = useMemo(() => (!animated && (loading || error)) ?
    ({ borderColor: colors.border, borderWidth: 1 })
    : null, 
    [loading, error, colors.border, animated]);

  return (
    <ViewComponent style={[style, styles.loadingImageContainer, loaderIssueStyle]}>
      <View style={styles.loaderOverlay}>
        {loading && <ActivityIndicator size="large" />}
        {error && <BrokenImageIcon style={{ alignSelf: 'center' }} />}
      </View>
      {!error && (
        <ImageComponent
          source={{ uri }}
          style={style}
          resizeMode={resizeMode}
          onLoad={() => setLoading(false)}
          onError={(er) => {
            console.log('error', er);
            setLoading(false);
            setError(true);
          }}
        />
      )}
    </ViewComponent>
  );
}

const styles = StyleSheet.create({
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingImageContainer: { position: 'relative' },
})