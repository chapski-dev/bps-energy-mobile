import api from './config';
import {
  ChangeUserFieldsReq,
  NotificationSettings,
  Profile,
  RegistrationReq,
  RegistrationResponse,
  SignInReq,
  SignInResponse,
} from './types';

// Authentication API
/**
 * Аутентификация пользователя по email и паролю
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_sign_in
 */
export const postSignIn = (body: SignInReq) =>
  api.post<SignInResponse>('/mobile/sign-in', body).then((res) => res.data);

/**
 * Регистрация нового пользователя по email и паролю. При вызове метода отправляется OTP на почту.
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_sign_up
 */
export const postSignUp = (body: RegistrationReq) =>
  api
    .post<RegistrationResponse>('/mobile/sign-up', body)
    .then((res) => res.data);

/**
 * Refreshes the JWT token using refresh_token
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_refresh_token
 */
export const postRefreshToken = (body: { refresh_token: string }) =>
  api
    .post<SignInResponse>('/mobile/refresh-token', body)
    .then((res) => res.data);

/**
 * Подтверждение email пользователя по коду
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_confirm_email
 */
export const postConfirmEmail = (body: {
  email: string;
  verification_code: string;
}) => api.post<object>('/mobile/confirm-email', body).then((res) => res.data);

/**
 * Отправляет код подтверждения на email пользователя для восстановления пароля
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A1%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BF%D0%B0%D1%80%D0%BE%D0%BB%D1%8F/post_mobile_forgot_password
 */
export const postForgotPassword = (body: { email: string }) =>
  api
    .post<{ verification_code: string }>('/mobile/forgot-password', body)
    .then((res) => res.data);

/**
 * Смена пароля пользователя по email, коду подтверждения и новому паролю
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A1%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BF%D0%B0%D1%80%D0%BE%D0%BB%D1%8F/post_mobile_change_password_via_otp
 */
export const postChangePasswordViaOtp = (body: {
  email: string;
  verification_code: string;
  new_password: string;
}) =>
  api
    .post<object>('/mobile/change-password-via-otp', body)
    .then((res) => res.data);

export const postChangePassword = (body: {
  new_password: string;
  old_password: string;
}) => api.post<object>('/mobile/change-password', body).then((res) => res.data);

/**
 * Создание транзакции для пополнения баланса
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%20%D1%81%20%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81%D0%BE%D0%BC/post_mobile_create_transaction
 */
export const postCreateTransaction = (body: { amount: number }) =>
  api
    .post<{ url: string }>('/mobile/create-transaction', body)
    .then((res) => res.data);

/**
 * Проведение платежа с карты пользователя
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%20%D1%81%20%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81%D0%BE%D0%BC/post_mobile_make_payment
 */
export const postTopUpBalance = (body: { amount: number; card_id: number }) =>
  api
    .post<{ url: string }>('/mobile/make-payment', body)
    .then((res) => res.data);

/**
 * Повторная отправка кода верификации на email
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_resend_otp
 */
export const postResendOtp = (body: { email: string }) =>
  api.post<{ url: string }>('/mobile/resend-otp', body).then((res) => res.data);

/**
 * Получение информации о пользователе для мобильного клиента
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/get_mobile_user_data
 */
export const getProfileData = () =>
  api.get<Profile>('/mobile/user').then((res) => res.data);

/**
 * Изменение одного из полей пользователя для мобильного клиента
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/mobile/post_mobile_change_field
 */
export const updateUserProfile = (data: ChangeUserFieldsReq) =>
  api.patch<object>('/mobile/change-field', data).then((res) => res.data);

/**
 * Retrieves the current notification settings for the authenticated user
 */
export const getNotificationSettings = () =>
  api
    .get<NotificationSettings>('/notification/settings')
    .then((res) => res.data);

/**
 * Updates the notification settings for the authenticated user
 * */
export const setNotificationSettings = (data: NotificationSettings) =>
  api
    .put<NotificationSettings>('/notification/settings', data)
    .then((res) => res.data);

//* Notification
/**
 * Registers a new Firebase Cloud Messaging token for push notifications
 */
export const registerFCMToken = (token: string) =>
  api.post('/api/v1/notifications/register', { token }).then((res) => res.data);
