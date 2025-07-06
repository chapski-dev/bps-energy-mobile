declare module 'react-native-config' {
  export interface NativeConfig {
    API_HOST: string
    YA_MAP_API_KEY: string
    GEOCODER_API_KEY: string
    SENTRY_DNS: string
    SUPABASE_SERVICE_ROLE_KEY: string
    SUPABASE_STORAGE_URL: string
    LOGTAIL_URL: string
    LOGTAIL_TOKEN: string
  }

  export const Config: NativeConfig
  export default Config
}
