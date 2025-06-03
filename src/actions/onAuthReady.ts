import { AppServiceStatus } from '@src/events'
import notifications from '@src/service/notifications'


let _isReady = false

export const onAuthReady = async (status: AppServiceStatus) => {
  if (status === AppServiceStatus.on && !_isReady) {
    _isReady = true
    notifications.refresh()
  } else if (status === AppServiceStatus.off && _isReady) {
    _isReady = false
    notifications.deleteAll()
  }
}
