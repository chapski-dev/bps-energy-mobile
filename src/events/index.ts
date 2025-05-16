export enum Events {
  onFirebaseAuthorize = 'onFirebaseAuthorize',
  onAuthReady = 'onAuthReady',
  onNavigationReady = 'onNavigationReady',
}

export enum AppServiceStatus {
  on = 'on',
  off = 'off',
}

export type EventsParams = {
  [Events.onFirebaseAuthorize]: AppServiceStatus
  [Events.onAuthReady]: AppServiceStatus
  [Events.onNavigationReady]: AppServiceStatus
}

export enum EventBusEvents {
  getNotificationSections = 'getNotificationSections',
  setNotificationLoading = 'setNotificationLoading',
  setOrderLoading = 'setOrderLoading',
  getOrders = 'getOrders',
  getComplitedOrders = 'getComplitedOrders'
}
