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
import { useImmerReducer } from 'use-immer';

import { vibrate } from '@src/actions/vibrate';
import { getProfileData, postSignIn, updateUserProfile } from '@src/api';
import { Profile } from '@src/api/types';
import { AppServiceStatus } from '@src/events';
import {
  AuthAction,
  AuthActionType,
  authReducer,
} from '@src/providers/reducers/authReducer';
import app from '@src/service/app';
import { handleCatchError } from '@src/utils/handleCatchError';
import { ASYNC_STORAGE_KEYS } from '@src/utils/vars/async_storage_keys';

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
  user: null | Profile;
  onSignin: (data: { phone: string; otp: string }) => Promise<void>;
  onLogout: () => void;
  updateUser: (data: Partial<Profile>) => Promise<void>;
}

export const AuthContext = createContext<IAuthProvider>({
  authState: AuthState.checking,
  onLogout: () => null,
  onSignin: () => Promise.resolve(),
  updateUser: () => Promise.resolve(),
  user: null,
});

export let dispatchAuth: Dispatch<ReducerAction<typeof authReducer>> | null =
  null;
export let dispatchLogout: (() => void) | null = null;

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [authState, authDispatch] = useImmerReducer<AuthState, AuthAction>(
    authReducer,
    AuthState.checking,
  );

  const [user, setUser] = useState<Profile | null>(null);

  const checkAuthState = useCallback(async () => {
    try {
      const accessToken = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.ACCESS_TOKEN,
      );

      if (!accessToken) {
        authDispatch({ type: AuthActionType.setEmpty });
        return;
      }

      const userData = await getProfileData();
      setUser(userData);
      authDispatch({ type: AuthActionType.setReady });
      app.isFirebaseAuthorized = AppServiceStatus.on;
    } catch (error) {
      await AsyncStorage.clear();
      authDispatch({ type: AuthActionType.setEmpty });
      handleCatchError(error, 'checkAuthState');
    }
  }, [authDispatch]);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const onSignin = useCallback(async (data: { phone: string; otp: string }) => {
    try {
      authDispatch({ type: AuthActionType.setConnecting });

      const { access_token, refresh_token } = await postSignIn(data);
      authDispatch({ type: AuthActionType.setReady });
      await AsyncStorage.multiSet([
        [ASYNC_STORAGE_KEYS.ACCESS_TOKEN, access_token],
        [ASYNC_STORAGE_KEYS.REFRESH_TOKEN, refresh_token],
        [ASYNC_STORAGE_KEYS.AUTH_STATE, AuthActionType.setReady],
      ]);
      const userData = await getProfileData();
      setUser(userData);
      app.isFirebaseAuthorized = AppServiceStatus.on;
    } catch (error) {
      authDispatch({ type: AuthActionType.setEmpty });
      throw error;
    }
  },[authDispatch]);

  const onLogout = useCallback(() => {
    vibrate(HapticFeedbackTypes.notificationSuccess);
    app.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updatedData: Partial<Profile>) => {
    try {
      await updateUserProfile(updatedData); // Обновляем данные на сервере
      setUser((prevUser) =>
        prevUser ? { ...prevUser, ...updatedData } : null,
      ); // Обновляем локально
    } catch (error) {
      console.error('Ошибка обновления данных пользователя:', error);
      throw error;
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
      value={{ authState, onLogout, onSignin, updateUser, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
