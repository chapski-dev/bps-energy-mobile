import { Draft } from 'immer';

import { AuthState } from '../auth';

export enum AuthActionType {
  setCheking = 'SET_IS_CHECKING',
  setEmpty = 'SET_IS_EMPTY',
  setFilled = 'SET_IS_FILLED',
  setConnecting = 'SET_IS_CONNECTING',
  setReady = 'SET_IS_ACCOUNT_READY',
}

export type AuthAction = { type: AuthActionType };

export function authReducer(draft: Draft<AuthState>, action: AuthAction) {

  const authState = {
    [AuthActionType.setReady]: AuthState.ready,
    [AuthActionType.setConnecting]: AuthState.connecting,
    [AuthActionType.setEmpty]: AuthState.empty,
    [AuthActionType.setFilled]: AuthState.filled,
    [AuthActionType.setCheking]: AuthState.checking,
  }
  return authState[action.type];
}