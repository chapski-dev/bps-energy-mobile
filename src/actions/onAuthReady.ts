import { AppServiceStatus } from '@src/events'
import notifications from '@src/service/notifications'
import orders from '@src/service/orders'


let _isReady = false

export const onAuthReady = async (status: AppServiceStatus) => {
  if (status === AppServiceStatus.on && !_isReady) {
    _isReady = true
    notifications.refresh()
    orders.refresh('all')
  } else if (status === AppServiceStatus.off && _isReady) {
    _isReady = false
    notifications.deleteAll()
    orders.deleteAll('all')
  }
}
