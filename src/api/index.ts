import Config from 'react-native-config';
import { Point } from 'react-native-yamap';
import axios from 'axios';

import api from './config';
import {
  ComplitedOrderDetails,
  DriverOrderAcceptOrDecline,
  DriverOrderRequest,
  DriverOrderResponse,
  NotificationSettings,
  OrderDetails,
  Profile,
  SigInResponse
} from './types';

// Authentication API

/**
 * Authenticates the user and returns a JWT token
 * @link https://stage-platform.coube.kz/api/swagger-ui/index.html#/Authentication/getToken
 */
export const postSignIn = (body: { phone: string; otp: string }) =>
  api.post<SigInResponse>('/api/v1/auth/sign-in', body).then((res) => res.data);

/**
 * Sends OTP to the user's phone number
 * @link https://stage-platform.coube.kz/api/swagger-ui/index.html#/Authentication/send
 */
export const postOtp = (body: { phone: string }) =>
  api.post<{ message: string }>('/api/v1/auth/otp', body).then((res) => res.data);

/**
 * Refreshes the JWT token using refresh_token
 * @link http://https://stage-platform.coube.kz/api/swagger-ui/index.html#/Authentication/refreshToken
 */
export const postRefreshToken = (body: { refreshToken: string }) =>
  axios
    .post<SigInResponse>(Config.API_HOST + '/api/v1/auth/refresh-token', body)
    .then((res) => res.data);

export const getNotificationsByUserId = async (params: { cursor?: string; limit: number }) =>
  api
    .get<{
      has_more: boolean;
      next_cursor?: string;
      data: [];
    }>('/notifications', { params })
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

//* Driver api's
export const getDriverOrders = (data?: DriverOrderRequest) =>
  api.get<DriverOrderResponse<OrderDetails>>('/api/v1/driver/orders').then((res) => res.data);

export const getDriverOrdersFinished = (data?: DriverOrderRequest) =>
  api
    .get<DriverOrderResponse<ComplitedOrderDetails>>('/api/v1/driver/orders/finished')
    .then((res) => res.data);
/**
 * Get transportation details by transportation id.
 * @link https://stage-platform.coube.kz/api/swagger-ui/index.html#/driver-controller/getById_1
 */
export const getOrderDetailById = async (transportationId: number | string) =>
  api.get<OrderDetails>(`/api/v1/driver/location/${transportationId}`).then((res) => res.data);

export const acceptDriverOrder = (transportationId: number) =>
  api.put<OrderDetails>(`/api/v1/driver/orders/${transportationId}/accept`).then((res) => res.data);

export const rejectDriverOrder = (transportationId: number) =>
  api
    .put<DriverOrderAcceptOrDecline>(`/api/v1/driver/orders/${transportationId}/reject`)
    .then((res) => res.data);

export const startDriverOrder = (transportationId: number) =>
  api.put<OrderDetails>(`/api/v1/driver/orders/${transportationId}/start`).then((res) => res.data);

//* Location
export const sendLocation = (data: {
  point: Point;
  timestamp: string; // '2025-03-19T11:56:51.714Z'
  speed: number;
  heading: number;
  accuracy: number;
}) => api.post<{ message: string }>('/api/v1/driver/location', data).then((res) => res.data);

/**
 * завершил
 * @link https://stage-platform.coube.kz/api/swagger-ui/index.html#/driver-controller/processDeparture
 */
export const departureDriverOrder = (data: {
  transportationId: number;
  cargoLoadingId: number;
  point: Point;
}) =>
  api
    .put<OrderDetails>(`/api/v1/driver/orders/${data.transportationId}/departure`, data)
    .then((res) => res.data);

/**
 * прибыл
 * @link https://stage-platform.coube.kz/api/swagger-ui/index.html#/driver-controller/processArrival
 */
export const arrivalDriverOrder = (data: {
  transportationId: number;
  cargoLoadingId: number;
  point: Point;
}) =>
  api
    .put<OrderDetails>(`/api/v1/driver/orders/${data.transportationId}/arrival`, data)
    .then((res) => res.data);

/**
 * Profile
 * @link https://stage-platform.coube.kz/api/swagger-ui/index.html#/employee-profile-controller/getProfile
 */
export const getProfileData = () => api.get<Profile>('/api/v1/profiles').then((res) => res.data);

/**
 * Profile
 * @link https://stage-platform.coube.kz/api/swagger-ui/index.html#/employee-profile-controller/updateProfile
 */
export const updateUserProfile = (data: Partial<Profile>) =>
  api.put<Profile>('/api/v1/profiles', data).then((res) => res.data);
