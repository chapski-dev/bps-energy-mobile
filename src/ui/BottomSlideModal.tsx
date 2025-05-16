import React, { forwardRef } from 'react';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet';

import { useAppTheme } from '@src/theme/theme';

type TBottomSlideModalProps = BottomSheetModalProps;

export const BottomSlideModal = forwardRef<BottomSheetModal, TBottomSlideModalProps>((
  props
  , ref) => {
  const { colors } = useAppTheme();

  return (
    <BottomSheetModal
      ref={ref}
      animateOnMount
      snapPoints={['90%']}
      enablePanDownToClose
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: colors.background }}
      backdropComponent={(backdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
        />
      )}
      {...props}
    />
  );
});
