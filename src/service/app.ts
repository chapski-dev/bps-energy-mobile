import AsyncStorage from '@react-native-async-storage/async-storage'
import { addEventListener as addNetworkEventListener } from '@react-native-community/netinfo'
import Emittery from 'emittery'

import { onAuthReady } from '@src/actions/onAuthReady';
import { onFirebaseAuthorize } from '@src/actions/onFirebaseAuthorize';
import { onNavigationReady } from '@src/actions/onNavigationReady'
import { postLogout } from '@src/api';
import { AppServiceStatus, Events, EventsParams } from '@src/events'
import { dispatchAuth } from '@src/providers/auth'
import { AuthActionType } from '@src/providers/reducers/authReducer'
import { CrashHandler } from '@src/utils/helpers/errors/CrashHandler';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';

const logger = (type: string, debugName: string, eventName?: string | symbol, eventData?: any) => {
  const delimiter = ', '
  let eventDataStr = ''
  if (eventData) {
    eventDataStr += delimiter
    eventDataStr += JSON.stringify(eventData)
  }

  const eventNameStr = eventName && typeof eventName === 'symbol' ? eventName.toString() : eventName
  console.log(`${debugName}->[${type}]: ${eventNameStr}${eventDataStr}`)
}

class App extends Emittery<EventsParams> {
  private _isNetworkProblems: boolean | null = null
  private _isFirebaseAuthorized = AppServiceStatus.off
  private _isNavigationReady = AppServiceStatus.off
  private _isAuthReady = AppServiceStatus.off

  constructor() {
    super()

    this.debug = {
      enabled: true,
      logger,
      name: 'app',
    }
    // events-actions subs
    // order:
    // fires before all, indicate is user was logged in
    this.on(Events.onNavigationReady, onNavigationReady)
    // second, prepare transactions, let user see authorized stack screens and etc
    this.on(Events.onAuthReady, onAuthReady)
    // the last one, authorize, fetch some user data and more
    this.on(Events.onFirebaseAuthorize, onFirebaseAuthorize)

    addNetworkEventListener((state) => {
      this._isNetworkProblems = !state.isConnected && !state.isInternetReachable
      // networkLayoutState.setIsVisible(this._isNetworkProblems)
    })
  }

  set isNavigationReady(value: AppServiceStatus) {
    this._isNavigationReady = value
    this.emit(Events.onNavigationReady, value)
  }

  set isFirebaseAuthorized(value: AppServiceStatus) {
    this._isFirebaseAuthorized = value
    this.emit(Events.onFirebaseAuthorize, value)
  }

  set isAuthReady(value: AppServiceStatus) {
    this._isAuthReady = value
    this.emit(Events.onAuthReady, value)
  }

  get isFirebaseAuthorized() {
    return this._isFirebaseAuthorized
  }

  get isNetworkProblems() {
    return this._isNetworkProblems
  }

  get isAuthReady() {
    return this._isAuthReady
  }

  logout = async () => {
    const refresh_token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN);
    postLogout({ refresh_token })
    AsyncStorage.clear().catch((e) => console.log('async storage clear error: ', e))
    this.isFirebaseAuthorized = AppServiceStatus.off
    this.isAuthReady = AppServiceStatus.off
    this.isNavigationReady = AppServiceStatus.off
    CrashHandler.clearErrorContext()
    dispatchAuth?.({ type: AuthActionType.setEmpty })
  }
}

export default new App()
