import { LinkingOptions } from '@react-navigation/native';

import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  config: {
    screens: {
      'charging-session-summary': {
        path: 'charging-complete/:sessionId',
        // sessionId будет использоваться для загрузки деталей сессии
      },
      // ... другие экраны
    },
  },
  prefixes: ['bpsenergy://', 'https://bpsenergy.com'],
}; 