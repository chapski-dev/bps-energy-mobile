import React from 'react';
import WebView from 'react-native-webview';

import { useThemedToasts } from '@src/hooks/useThemedToasts.';
import { ScreenProps } from '@src/navigation/types';
import { useAuth } from '@src/providers/auth';

function AddingCardAndPaymentScreen({
  navigation,
  route,
}: ScreenProps<'adding-card-and-payment'>) {
  const { getUserBalance, } = useAuth();
  const { toastError, toastSuccess } = useThemedToasts();

  const handleNavigationChange = async (navState: any) => {
    const { url } = navState;
    if (url.startsWith('https://api.test-bpsenergy.net.by/bepaid/success')) {
      await getUserBalance()
      toastSuccess('Баланс пополнен!')
      navigation.popToTop();
    } else if (url.startsWith('https://api.test-bpsenergy.net.by/bepaid/failed')) {
      toastError('При произведении оплаты возникли неполадки. Попробуйте снова.')
      navigation.goBack();
    }
  };

  return (
    <WebView
      originWhitelist={['https://checkout.bepaid.by', 'https://api.test-bpsenergy.net.by']}
      source={{ uri: route.params.url }}
      style={{ flex: 1 }}
      onNavigationStateChange={handleNavigationChange}
    />
  )
}


// function AddingCardAndPaymentScreen({
//   navigation,
//   route,
// }: ScreenProps<'adding-card-and-payment'>) {
//   const { insets, colors } = useAppTheme();
//   const { t } = useLocalization();
//   const { toastSuccess } = useThemedToasts();
//   const [loading, setLoading] = useState(false);
//   const form = useForm({
//     defaultValues: {
//       cvc: '',
//       expiry: '',
//       number: '',
//     },
//     mode: 'all',
//   });
//   const { handleSubmit, control, formState } = form;

//   const cardExpMaskedInputProps = useMaskedInputProps({
//     mask: inputMasks.expired_card_date,
//     onChangeText: (val) => form.setValue('expiry', val, { shouldValidate: true }),
//   });

//   const submitCardData = async () => {
//     try {
//       setLoading(true);
//       await wait(500);
//       toastSuccess('Карта успешно добавлена!');
//     } catch (error) {
//       handleCatchError(error, 'CreditCardInputDataScreen');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       px={24}
//       flex={1}
//       pt={22}
//       onPress={Keyboard.dismiss}
//       effect="none"
//       accessible={false}
//     >
//       <Box gap={12} flex={1}>
//         <Controller
//           control={control}
//           name="number"
//           rules={{
//             minLength: inputMasks.credit_card.length,
//             required: true,
//             validate: (val) => {
//               console.log('val =>', val);
//               console.log('validator.credit_card(val)', validator.credit_card(val));

//               return validator.credit_card(val)
//             },
//           }}
//           render={({
//             field: { onChange, onBlur, value },
//             fieldState: { invalid, error, isTouched },
//           }) => (
//             <Input
//               onChangeText={onChange}
//               value={
//                 formatWithMask({ mask: inputMasks.credit_card, text: value })
//                   .masked
//               }
//               placeholder="0000 0000 0000 0000"
//               keyboardType="number-pad"
//               returnKeyType="done"
//               maxLength={inputMasks.credit_card.length}
//               autoFocus
//               onBlur={onBlur}
//               error={invalid}
//               errorText={error?.message}
//               icon={
//                 <CreditIcon
//                   color={
//                     value.length !== inputMasks.credit_card.length && !isTouched
//                       ? colors.grey_400
//                       : invalid
//                         ? colors.red_500
//                         : colors.main
//                   }
//                 />
//               }
//             />
//           )}
//         />
//         <Box row gap={12} w="full">
//           <Controller
//             control={control}
//             name="expiry"
//             rules={{ required: true, }}
//             render={({ field: { onBlur, value }, fieldState }) => (
//               <Input
//                 {...cardExpMaskedInputProps}
//                 value={value}
//                 placeholder="мм/гг"
//                 keyboardType="decimal-pad"
//                 textContentType="creditCardExpiration"
//                 returnKeyType="done"
//                 wrapperStyle={{ flex: 1 }}
//                 onBlur={onBlur}
//                 error={fieldState.invalid}
//               />
//             )}
//           />
//           <Controller
//             control={control}
//             name="cvc"
//             rules={{ minLength: 3, required: true }}
//             render={({ field: { value, onBlur, onChange }, fieldState }) => (
//               <Input
//                 placeholder="cvc"
//                 keyboardType="decimal-pad"
//                 textContentType="creditCardSecurityCode"
//                 returnKeyType="done"
//                 wrapperStyle={{ flex: 1 }}
//                 maxLength={3}
//                 value={value}
//                 onChangeText={onChange}
//                 onBlur={onBlur}
//                 error={fieldState.invalid}
//               />
//             )}
//           />
//         </Box>
//       </Box>
//       <Box gap={12}>
//         <Button
//           children={`Добавить и оплатить ${route.params.sum} BYN`}
//           disabled={!formState.isValid || loading}
//           loading={loading}
//           onPress={handleSubmit(submitCardData)}
//         />
//         <Text
//           children="Ваши данные для оплаты всегда зашифрованы"
//           variant="p4"
//           colorName="grey_600"
//           center
//         />
//       </Box>
//       <FakeView additionalOffset={-insets.bottom / 2} />
//       <Gap y={insets.bottom || 16} />
//     </Box>
//   );
// }

export default AddingCardAndPaymentScreen;
