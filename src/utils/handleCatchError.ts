import { toast, ToastPosition } from '@backpackapp-io/react-native-toast';
import { AxiosError } from 'axios';

export const handleCatchError = (e: AxiosError | unknown | Error | string, where: string = '') => {
  const serverError =
  // @ts-ignore
    e?.response?.data?.message?.kk || e?.response?.data?.message?.ru || e?.response?.data?.error;

  let errorText;
  switch (true) {
    case typeof serverError === 'string':
      errorText = serverError;
      break;
    case !!e?.message:
      errorText = e?.message;
      break;
    case typeof e === 'string':
      errorText = e;
      break;
  }
  if (!errorText.includes('Network')) {
    errorText && toast.error(errorText, { position: ToastPosition.TOP });
  }
  if (errorText.includes('Network')) {
    toast.error('Неполадки сети интернет. Попробуйте пожалуйста позже.', {
      position: ToastPosition.TOP
    });
  }
  console.error(`${where} - ${e}`);
  console.error(errorText);
  return errorText;
};
