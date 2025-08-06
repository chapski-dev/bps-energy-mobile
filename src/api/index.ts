import { FilterState } from '@src/store/useFilterOfStationsStore';

import api from './config';
import {
  ChangeUserFieldsReq,
  FinishedSession,
  FinishedSessionExpanded,
  LocationDetailsRes,
  LocationsRes,
  NotificationSettings,
  Profile,
  RegistrationReq,
  RegistrationResponse,
  SessionsRes,
  SignInReq,
  SignInResponse,
  TransactionsRes,
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
 * Удаление токенов пользователя для выхода из системы
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%90%D1%83%D1%82%D0%B5%D0%BD%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B8%20%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F/post_mobile_logout
 */
export const postLogout = (body: { refresh_token: string }) =>
  api
    .post<RegistrationResponse>('/mobile/logout', body)
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
 * Удаляет карту пользователя по её идентификатору
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%20%D1%81%20%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D0%BE%D0%B9/post_mobile_delete_card
 */
export const deleteCreditCard = (body: { card_id: number }) =>
  api
    .delete<{ url: string }>('/mobile/card', { data: { body } })
    .then((res) => res.data);

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
* Возвращает список транзакций пользователя с фильтрацией по датам и пагинацией
* @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%20%D1%81%20%D0%BE%D0%BF%D0%BB%D0%B0%D1%82%D0%BE%D0%B9/get_mobile_transactions
*/
export const getTransactionsHistory = (params?: Partial<{
  date_begin: string,
  date_end: string,
  page: string,
  limit: string
}>) =>
  api.get<TransactionsRes>('/mobile/transactions', {
    params
  }).then((res) => res.data);

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
  api.patch<object>('/mobile/user', data).then((res) => res.data);


/**
 * Возвращает список текущих сессий пользователя
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A1%D0%B5%D1%81%D1%81%D0%B8%D0%B8/get_mobile_current_sessions
 */
export const getCurrentChargingSessions = () =>
  api.get<SessionsRes>('/mobile/current-sessions').then((res) => res.data);

/**
 * Возвращает список завершенных сессий пользователя
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A1%D0%B5%D1%81%D1%81%D0%B8%D0%B8/get_mobile_finished_sessions
 */
export const getFinishedChargingSessions = (params?:
  Partial<{
    date_begin: string,
    date_end: string,
    page: string,
    limit: string
  }>
) =>
  api.get<{ sessions: FinishedSession[] }>('/mobile/finished-sessions', {
    params
  }).then((res) => res.data);

/**
 * Возвращает конкретную завершенную сессию пользователя по ID
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A1%D0%B5%D1%81%D1%81%D0%B8%D0%B8/get_mobile_finished_sessions__session_id_
 */
export const getFinishedChargingSession = (session_id: string | number) =>
  api.get<{ session: FinishedSessionExpanded }>(`/mobile/finished-sessions/${session_id}`)
    .then((res) => res.data);

/**
 * Запускает новую сессию зарядки по идентификатору коннектора
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A1%D0%B5%D1%81%D1%81%D0%B8%D0%B8/post_mobile_start_session
 */
export const postStartChargingSession = (data: { connector_id: number }) =>
  api.post<object>('/mobile/start-session', data).then((res) => res.data);

/**
 * Останавливает активную сессию пользователя по идентификатору сессии
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%A1%D0%B5%D1%81%D1%81%D0%B8%D0%B8/post_mobile_stop_session
 */
export const postStopChargingSession = (data: { session_id: number }) =>
  api.post<object>('/mobile/stop-session', data).then((res) => res.data);


/**
 * Возвращает список локаций с агрегированной информацией по коннекторам
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%9B%D0%BE%D0%BA%D0%B0%D1%86%D0%B8%D0%B8/get_mobile_locations
 */
export const getLocations = (filters?: FilterState) =>
  api.get<LocationsRes>(`/mobile/locations?filter=${JSON.stringify(filters)}`)
    .then((res) => res.data);

/**
 * Возвращает подробную информацию о локации по её идентификатору
 * @link https://api.test-bpsenergy.net.by/swagger/index.html#/%D0%9B%D0%BE%D0%BA%D0%B0%D1%86%D0%B8%D0%B8/get_mobile_locations__id_
 */
export const getLocationDetails = (id: number) =>
  api.get<LocationDetailsRes>(`/mobile/locations/${id}`).then((res) => res.data);


/**
 * Retrieves the current notification settings for the authenticated user
 */
export const getNotificationSettings = () =>
  api
    .get<NotificationSettings['settings']>('/mobile/user-notifications')
    .then((res) => res.data);

/**
 * Updates the notification settings for the authenticated user
 * */
export const setNotificationSettings = (data: NotificationSettings['settings']) =>
  api
    .put<NotificationSettings>('/mobile/user-notifications', data)
    .then((res) => res.data);

//* Notification
/**
 * Registers a new Firebase Cloud Messaging token for push notifications
 */
export const registerFCMToken = (token: string) =>
  api.post('/mobile/fcm', { token }).then((res) => res.data);


