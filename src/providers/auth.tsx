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

import * as api from '@src/api';
import { ChangeUserFieldsReq, Profile, SignInReq, UserBalance } from '@src/api/types';
import { AppServiceStatus } from '@src/events';
import { navigationRef } from '@src/navigation/navigationRef';
import {
  AuthAction,
  AuthActionType,
  authReducer,
} from '@src/providers/reducers/authReducer';
import app from '@src/service/app';
import { handleCatchError } from '@src/utils/handleCatchError';
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
  user: null | Profile;
  balance: UserBalance;
  cards: string[];
  onSignIn: (data: { email: string; password: string }) => Promise<void>;
  onLogout: () => void;
  updateUser: (data: ChangeUserFieldsReq) => Promise<void>;
  getUserBalance: () => Promise<void>;
}

export const AuthContext = createContext<IAuthProvider>({
  authState: AuthState.checking,
  balance: { value_by: 0, value_ru: 0 },
  cards: [],
  getUserBalance: () => Promise.resolve(),
  onLogout: () => null,
  onSignIn: () => Promise.resolve(),
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
  const [cards, setCards] = useState<string[]>([]);
  const [balance, setBalance] = useState<UserBalance>({
    value_by: 0,
    value_ru: 0,
  });

  const getUserBalance = useCallback(async () => {
    const balance_res = await api.getUserBalance();
    setBalance(balance_res);
  }, []);

  const getUserData = useCallback(async () => {
    const userData = await api.getProfileData();
    setUser(userData);
  }, []);

  const getUserCards = useCallback(async () => {
    const res = await api.getUserCards();
    setCards(res.cards);
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
      await getUserBalance();
      await getUserCards();

      authDispatch({ type: AuthActionType.setReady });
      app.isFirebaseAuthorized = AppServiceStatus.on;
    } catch (error) {
      app.logout()
      handleCatchError(error, 'checkAuthState');
    }
  }, [authDispatch, getUserBalance, getUserCards, getUserData]);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const onSignIn = useCallback(
    async (data: SignInReq) => {
      try {
        authDispatch({ type: AuthActionType.setConnecting });
        const { access_token, refresh_token } = await api.postSignIn(data);
        await AsyncStorage.multiSet([
          [ASYNC_STORAGE_KEYS.ACCESS_TOKEN, access_token],
          [ASYNC_STORAGE_KEYS.REFRESH_TOKEN, refresh_token],
          [ASYNC_STORAGE_KEYS.AUTH_STATE, AuthActionType.setReady],
        ]);
        await getUserData();
        await getUserBalance();
        await getUserCards();
        
        authDispatch({ type: AuthActionType.setReady });
        app.isFirebaseAuthorized = AppServiceStatus.on;
      } catch (error) {
        app.logout()
        throw error;
      }
    },
    [authDispatch, getUserBalance, getUserCards, getUserData],
  );

  const onLogout = useCallback(() => {
    app.logout();
    setUser(null);
    setBalance({ value_by: 0, value_ru: 0 })
    setCards([]);
    if (navigationRef.getCurrentRoute()?.name !== 'login') {
      vibrate(HapticFeedbackTypes.notificationSuccess);
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'login' }],
      });
    }
  }, []);

  const updateUser = useCallback(async (updatedData: ChangeUserFieldsReq) => {
    try {
      await api.updateUserProfile(updatedData);
      await getUserData()
    } catch (error) {
      console.error('Ошибка обновления данных пользователя:', error);
      throw error;
    }
  }, [getUserData]);

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
        balance,
        cards,
        getUserBalance,
        onLogout,
        onSignIn,
        updateUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
