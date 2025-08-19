import { AppServiceStatus } from '@src/events'
import charging from '@src/service/charging'


let _isReady = false

export const onAuthReady = async (status: AppServiceStatus) => {
  if (status === AppServiceStatus.on && !_isReady) {
    _isReady = true
    charging.fetchSessions()

  } else if (status === AppServiceStatus.off && _isReady) {
    _isReady = false
    charging.clearSessions()
  }
}
