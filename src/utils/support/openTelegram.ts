import { Linking } from 'react-native';

export const openTelegram = async (username: string, text: string) => {
  const encodedText = encodeURIComponent(text);
  const fallback = `https://t.me/${username}?text=${encodedText}`;

  try {
    await Linking.openURL(fallback);
  } catch (err) {
    console.error('Ошибка при открытии Telegram', err);
  }
};
