import { Linking } from 'react-native';

type Params = {
  variant: 'telegram' | 'whats-app',
  message?: string;
}
export const openSupportMessager = async ({
  variant,
  message
}: Params) => {
  const SUPPORT_NUMBER = '+375445592988';
  const encodedText = encodeURIComponent(message || '');
  let fallback = `https://t.me/${SUPPORT_NUMBER}?text=${encodedText}`;

  switch (variant) {
    case 'telegram':
      fallback = `https://t.me/${SUPPORT_NUMBER}?text=${encodedText}`;
      break;
    case 'whats-app':
      fallback = `https://wa.me/${SUPPORT_NUMBER}?text=${encodedText}`;
    default:
      break;
  }

  try {
    await Linking.openURL(fallback);
  } catch (err) {
    console.error('Ошибка при открытии Telegram', err);
  }
};
