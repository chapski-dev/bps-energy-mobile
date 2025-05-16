import { EventBus } from '@trutoo/event-bus'
import dayjs from 'dayjs'

import { getNotificationsByUserId } from '@src/api'
import { NotificationDetails } from '@src/api/types'
import { EventBusEvents } from '@src/events'
import { createdAtFormat, groupBy } from '@src/utils'

export interface SectionData {
  title: string
  data: NotificationDetails[]
}
const defaultNotifications = Array.from({ length: 5 }, (_) => ({
  amount: '0',
  created_at: dayjs().unix(),
  from: '',
  loading: true,
  status: '',
  to: '',
  tx: {},
  tx_hash: '',
}))

export const getTxSections = (notifications: NotificationDetails[]): SectionData[] => {
  if (!notifications.length) {
    return []
  }
  const grouped = groupBy(notifications, (notification) =>
    dayjs(typeof notification.created_at === 'number' ?
       dayjs.unix(notification.created_at) :
        notification.created_at)
      .startOf('day')
      .toISOString(),
  )

  return Object.keys(grouped).map((key) => ({
    data: grouped[key],
    title: createdAtFormat(key),
  }))
}

class Notifications extends EventBus {
  notifications: NotificationDetails[] = defaultNotifications
  notificationSections: SectionData[] = getTxSections(defaultNotifications)
  loading = false
  loading_more = false
  has_more = false
  next_cursor?: string = undefined
  limit = 10

  constructor() {
    super()
    this.register(EventBusEvents.getNotificationSections, { type: 'array' })
    this.register(EventBusEvents.setNotificationLoading, { type: 'boolean' })
  }

  refresh = async () => {
    try {
      this.limit = 10
      this.next_cursor = undefined
      this.loading = true
      this.publish(EventBusEvents.setNotificationLoading, this.loading)
      this.deleteAll()
      await this.fetch()
    } catch (e) {
      this.notifications = []
    } finally {
      this.loading = false
      this.publish(EventBusEvents.setNotificationLoading, this.loading)
      this.update()
    }
  }

  fetch = async () => {
    const res = await getNotificationsByUserId({ cursor: this.next_cursor, limit: this.limit })
    this.has_more = res.has_more
    this.notifications = this.next_cursor ? [...this.notifications, ...res.data] : res.data || []
    this.next_cursor = res.next_cursor
  }

  loadMore = async () => {
    if (!this.has_more) {
      return
    }
    if (this.loading_more) {
      return
    }
    try {
      this.loading_more = true
      await this.fetch()
      this.update()
    } catch (error) {
      console.error('notifications loadMore error: ', error)
    } finally {
      this.loading_more = false
    }
  }
  update = () => {
    this.notificationSections = getTxSections(this.notifications)
    this.publish(EventBusEvents.getNotificationSections, this.notificationSections)
  }

  deleteAll = () => {
    this.notifications = defaultNotifications
    this.notificationSections = getTxSections(defaultNotifications)
    this.publish(EventBusEvents.getNotificationSections, this.notificationSections)
  }
}

export default new Notifications()
