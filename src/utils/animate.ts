import { LayoutAnimation } from 'react-native'
import { LayoutAnimationConfig } from 'react-native/Libraries/LayoutAnimation/LayoutAnimation'

let isAnimating = false
export const animate = (config: LayoutAnimationConfig) => {
  if (isAnimating) {
    return
  }
  isAnimating = true
  LayoutAnimation.configureNext(config, stopAnimate, stopAnimate)
}

const stopAnimate = () => {
  isAnimating = false
}
