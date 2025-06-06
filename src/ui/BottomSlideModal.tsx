import React, { forwardRef } from 'react'
import { useReducedMotion } from 'react-native-reanimated'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet'

import { useAppTheme } from '@src/theme/theme'

type TBottomSlideModalProps = BottomSheetModalProps

export const BottomSlideModal = forwardRef<BottomSheetModal, TBottomSlideModalProps>((props, ref) => {
  const { colors } = useAppTheme()
  const reducedMotion = useReducedMotion()

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['80%']}
      enablePanDownToClose
      animateOnMount={!reducedMotion}
      android_keyboardInputMode="adjustResize"
      keyboardBlurBehavior="restore"
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.grey_800 }}
      backdropComponent={(backdropProps) => <BottomSheetBackdrop {...backdropProps} disappearsOnIndex={-1} />}
      {...props}
    />
  )
})
