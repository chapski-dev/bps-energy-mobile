import { useCallback, useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import { AppStateStatus } from 'react-native/Libraries/AppState/AppState'

export const useAppStateChangeWithCallbacks = (
  foregroundCallback?: () => void,
  activeCallback?: () => void
) => {
  const appState = useRef(AppState.currentState)

  const handleAppStateChange = useCallback((state: AppStateStatus) => {
    if (state.match(/inactive|background/)) {
      foregroundCallback?.()
    }

    if (appState.current.match(/inactive|background/) && state === 'active') {
      activeCallback?.()
    }

    appState.current = state
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [])
}
