declare module 'react-native-config' {
  export interface NativeConfig {
    API_HOST: string
    YA_MAP_API_KEY: string
    GEOCODER_API_KEY: string
    SENTRY_DNS: string
  }

  export const Config: NativeConfig
  export default Config
}
