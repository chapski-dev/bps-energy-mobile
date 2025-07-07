import React, {
  createContext,
  Dispatch,
  ReactNode,
  ReducerAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NavigationContainerRef } from '@react-navigation/native';
import { useImmerReducer } from 'use-immer';

import * as api from '@src/api';
import { Profile, SignInReq } from '@src/api/types';
import { AppServiceStatus } from '@src/events';
import { navigationRef } from '@src/navigation/navigationRef';
import type { RootStackParamList } from '@src/navigation/types';
import {
  AuthAction,
  AuthActionType,
  authReducer,
} from '@src/providers/reducers/authReducer';
import app from '@src/service/app';
import { CrashHandler } from '@src/utils/helpers/errors/CrashHandler';
import { handleCatchError } from '@src/utils/helpers/handleCatchError';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';
import { vibrate } from '@src/utils/vibrate';

export enum AuthState {
  /**
   * app transmission
   * default app state, starts seeking previous data if user has something to restore
   */
  checking = 'checking',
  /**
   * user not logged in, or just logged out, displaying intro screeen after what user
   * can create account or be logged in through onboarding
   */
  empty = 'empty',
  /** user has login before & data to restore with lock screen using keychain and encryption,
   displaying recover screen with availability to register or recover accounts */
  filled = 'filled',
  connecting = 'connecting',
  /**  authorized and successfully logged in user */
  ready = 'ready',
}

export interface IAuthProvider {
  authState: AuthState;
  user: Profile;
  onSignIn: (data: { email: string; password: string }) => Promise<void>;
  onLogout: () => void;
  getUserData: () => Promise<void>;
}

const initialUser: Profile = {
  cards: [],
  email: '',
  id: 0,
  name: '',
  phone: '',
  registration_date: '',
  wallets: [{ currency: 'BYN', value: 0 }],
};

export const AuthContext = createContext<IAuthProvider>({
  authState: AuthState.checking,
  getUserData: () => Promise.resolve(),
  onLogout: () => null,
  onSignIn: () => Promise.resolve(),
  user: initialUser,
});

export let dispatchAuth: Dispatch<ReducerAction<typeof authReducer>> | null =
  null;
export let dispatchLogout: (() => void) | null = null;

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [authState, authDispatch] = useImmerReducer<AuthState, AuthAction>(
    authReducer,
    AuthState.checking,
  );

  const [user, setUser] = useState<Profile>(initialUser);

  const getUserData = useCallback(async () => {
    const userData = await api.getProfileData();
    setUser(userData);
    CrashHandler.setUser(userData.id, userData.email, userData.name)
  }, []);

  const checkAuthState = useCallback(async () => {
    try {
      const accessToken = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.ACCESS_TOKEN,
      );

      if (!accessToken) {
        authDispatch({ type: AuthActionType.setEmpty });
        return;
      }
      await getUserData();

      authDispatch({ type: AuthActionType.setReady });
      app.isFirebaseAuthorized = AppServiceStatus.on;
    } catch (error) {
      app.logout()
      handleCatchError(error, 'checkAuthState');
    }
  }, [authDispatch, getUserData]);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const onSignIn = useCallback(
    async (data: SignInReq) => {
      authDispatch({ type: AuthActionType.setConnecting });
      const { access_token, refresh_token } = await api.postSignIn(data);
      await AsyncStorage.multiSet([
        [ASYNC_STORAGE_KEYS.ACCESS_TOKEN, access_token],
        [ASYNC_STORAGE_KEYS.REFRESH_TOKEN, refresh_token],
        [ASYNC_STORAGE_KEYS.AUTH_STATE, AuthActionType.setReady],
      ]);
      await getUserData();

      authDispatch({ type: AuthActionType.setReady });
      app.isFirebaseAuthorized = AppServiceStatus.on;
    },
    [authDispatch, getUserData],
  );

  const onLogout = useCallback(() => {
    app.logout();
    setUser(initialUser);
    if (navigationRef.getCurrentRoute()?.name !== 'login') {
      vibrate(HapticFeedbackTypes.notificationSuccess);
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'login' }],
      });
    }
  }, []);

  useEffect(() => {
    if (authState === AuthState.ready) {
      app.isAuthReady = AppServiceStatus.on;
      app.isFirebaseAuthorized = AppServiceStatus.on;
    } else {
      app.isAuthReady = AppServiceStatus.off;
      app.isFirebaseAuthorized = AppServiceStatus.off;
    }
  }, [authState]);

  useEffect(() => {
    dispatchAuth = authDispatch;
    dispatchLogout = onLogout;

    return () => {
      dispatchAuth = null;
      dispatchLogout = null;
    };
  }, [authDispatch, onLogout]);

  return (
    <AuthContext.Provider
      value={{
        authState,
        getUserData,
        onLogout,
        onSignIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const checkAuthOrRedirect = (authState: AuthState, navigation?: NavigationContainerRef<RootStackParamList>) => {
  if (authState !== AuthState.ready) {
    if (navigation && typeof navigation.reset === 'function') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'login' }],
      });
    } else if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'login' }],
      });
    }
    return false;
  }
  return true;
};
