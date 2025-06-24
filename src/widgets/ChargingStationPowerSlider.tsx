/* eslint-disable sort-keys-fix/sort-keys-fix */
import React, { memo, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { FilterState } from '@src/store/useFilterOfStationsStore';
import { useAppTheme } from '@src/theme/theme';
import { Box, Text } from '@src/ui';
import { vibrate } from '@src/utils/vibrate';


const markWidth = 16;
const thumbWidth = markWidth + 8;


const CHARGING_POWER_HASH = {
  0: 0,
  1: 7,
  2: 20,
  3: 40,
  4: 60,
  5: 80,
  6: 120,
  7: 140,
  8: 160,
  20: 7,
  40: 20,
  60: 40,
  80: 60,
  100: 80,
  120: 120,
  140: 140,
  160: 160,
} as const;

const CHARGING_POWER_HASH_2 = {
  0: 0,
  7: 20,
  20: 40,
  40: 60,
  60: 80,
  80: 100,
  120: 120,
  140: 140,
  160: 160,
} as const;

const Mark = ({ slideOver, index }: { slideOver?: boolean, index?: number }) => {
  const { colors } = useAppTheme();

  return (
    <Box
      alignItems="center"
      backgroundColor={slideOver ? colors.grey_100 : colors.main}
      borderColor={slideOver ? colors.grey_100 : colors.border}
      borderRadius={50}
      height={slideOver ? markWidth + 2 : markWidth}
      left={slideOver ? -1 : 0}
      relative
      top={slideOver ? -1 : 0}
      w={slideOver ? markWidth + 2 : markWidth}
    >
      {index !== undefined ?
        <Text
          colorName='grey_600'
          center
          variant='p3'
          style={{
            position: 'absolute',
            textAlign: 'center',
            top: 25,
            width: CHARGING_POWER_HASH[index as keyof typeof CHARGING_POWER_HASH].toString().length === 3 ? 26 : 22
          }}
          children={CHARGING_POWER_HASH[index]} /> : null}
    </Box>
  );
};

const Thumb = () => {
  const { colors } = useAppTheme();
  return (
    <Box
      backgroundColor={colors.main}
      borderColor={colors.background}
      borderRadius={50}
      borderWidth={1}
      w={thumbWidth}
      h={thumbWidth}
      style={{
        ...shadowStyle
      }}
    />
  );
};

export const ChargingStationPowerSlider = memo(() => {
  const { colors } = useAppTheme();
  const { t } = useTranslation('widgets', { keyPrefix: 'charging-station-power-slider' })
  const { getValues, control, formState } = useFormContext<FilterState>();

  const min_power = getValues('min_power')

  const progress = useSharedValue(CHARGING_POWER_HASH_2[min_power] || 0);
  const min = useSharedValue(0);
  const max = useSharedValue(160);
  const thumbScaleValue = useSharedValue(1);

  const step = 8;

  const _renderMark = useCallback(
    ({ index }: { index: number }) => {
      return (
        <>
          <Mark key={index} index={index} />
          <MarkWithAnimatedView
            index={index}
            progress={progress}
            step={step}
          />
        </>
      );
    },
    [progress]
  )

  useAnimatedReaction(
    () => {
      return CHARGING_POWER_HASH_2[min_power];
    },
    (data) => {
      if (data !== undefined && !isNaN(data) && !formState.isDirty) {
        progress.value = data;
      }
    },
    [min_power]
  );

  const theme = {
    bubbleBackgroundColor: colors.grey_100,
    bubbleTextColor: colors.grey_600,
    maximumTrackTintColor: colors.main,
    minimumTrackTintColor: colors.grey_100
  }

  return (
    <Box gap={8}>
      <Controller
        control={control}
        name='min_power'
        render={({ field: { onChange, value } }) => {
          return (
            <>
              <Box row justifyContent='space-between' alignItems='center' >
                <Text fontWeight='600' fontSize={17} children={t('min-power')} />
                <Text children={`${value} ${t('kilowatt')}`} />
              </Box>
              <Slider
                steps={step}
                thumbWidth={thumbWidth}
                sliderHeight={8}
                disableTrackPress
                forceSnapToStep
                onSlidingStart={() => {
                  thumbScaleValue.value = 1.15;
                }}
                onSlidingComplete={() => {
                  thumbScaleValue.value = 1;
                }}
                bubble={(s) => `${CHARGING_POWER_HASH[s as keyof typeof CHARGING_POWER_HASH]}`}
                snapThreshold={20}
                snapThresholdMode="absolute"
                markWidth={markWidth}
                renderMark={_renderMark}
                theme={theme}
                renderThumb={() => <Thumb />}
                onHapticFeedback={() => vibrate(HapticFeedbackTypes.contextClick)}
                hapticMode='step'
                onValueChange={(v) => {
                  onChange(CHARGING_POWER_HASH[v as keyof typeof CHARGING_POWER_HASH])
                }}
                style={styles.slider}
                progress={progress}
                minimumValue={min}
                maximumValue={max}
                thumbScaleValue={thumbScaleValue}
              />
            </>
          )
        }}
      />
    </Box>

  );
});


const MarkWithAnimatedView = ({
  index,
  progress,
  step,
}: {
  index: number;
  progress: SharedValue<number>;
  step: number;
}) => {
  const style = useAnimatedStyle(() => {
    const progressStep = Math.floor((progress.value / 160) * step);
    return {
      opacity: index <= progressStep ? 1 : 0,
    };
  });
  return (
    <Animated.View style={[{ ...StyleSheet.absoluteFillObject }, style]}>
      <Mark slideOver />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  slider: {
    height: 68,
  },
});

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
