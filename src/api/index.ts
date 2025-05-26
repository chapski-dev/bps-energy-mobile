import Config from 'react-native-config';
import axios from 'axios';

import api from './config';
import {
  NotificationSettings,
  Profile,
  SigInResponse,
  SignInReq
} from './types';

// Authentication API
/**
 * Аутентификация пользователя по email и паролю
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_sign_in
 */
export const postSignIn = (body: SignInReq) =>
  api.post<SigInResponse>('/mobile/sign-in', body).then((res) => res.data);

/**
 * Регистрация нового пользователя по email и паролю
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_sign_up
 */
export const postSignUp = (body: SignInReq) =>
  api.post<SigInResponse>('/mobile/sign-up', body).then((res) => res.data);

/**
 * Refreshes the JWT token using refresh_token
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_refresh_token
 */
export const postRefreshToken = (body: { access_token: string, refresh_token: string }) =>
  axios
    .post<SigInResponse>(Config.API_HOST + '/mobile/refresh-token', body)
    .then((res) => res.data);

/**
 * Подтверждение email пользователя по коду
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_confirm_email
 */
export const postConfirmEmail = (body: { email: string, verification_code: string }) =>
  axios
    .post<SigInResponse>('/mobile/confirm-email', body)
    .then((res) => res.data);


/**
 * Retrieves the current notification settings for the authenticated user
 */
export const getNotificationSettings = () =>
  api.get<NotificationSettings>('/notification/settings').then((res) => res.data);

/**
 * Updates the notification settings for the authenticated user
 * */
export const setNotificationSettings = (data: NotificationSettings) =>
  api.put<NotificationSettings>('/notification/settings', data).then((res) => res.data);

//* Notification
/**
 * Registers a new Firebase Cloud Messaging token for push notifications
 */
export const registerFCMToken = (token: string) =>
  api.post('/api/v1/notifications/register', { token }).then((res) => res.data);


/**
 * Получение информации о пользователе для мобильного клиента
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/get_mobile_user_data
 */
export const getProfileData = () => api.get<Profile>('/mobile/user-data').then((res) => res.data);

/**
 * Изменение одного из полей пользователя для мобильного клиента
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_change_field
 */
export const updateUserProfile = (data: Partial<Profile>) =>
  api.post<Profile>('/mobile/change-field', data).then((res) => res.data);
