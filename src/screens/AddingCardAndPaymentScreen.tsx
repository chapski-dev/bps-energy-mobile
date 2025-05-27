import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { useMaskedInputProps } from 'react-native-mask-input';

import { useThemedToasts } from '@src/hooks/useThemedToasts.';
import { ScreenProps } from '@src/navigation/types';
import { useAppTheme } from '@src/theme/theme';
import { useLocalization } from '@src/translations/i18n';
import { Box, Button, Input, Text } from '@src/ui'
import { FakeView } from '@src/ui/Layouts/FakeView';
import { Gap } from '@src/ui/Layouts/Gap';
import { wait } from '@src/utils';
import { handleCatchError } from '@src/utils/handleCatchError';
import { inputMasks } from '@src/utils/inputMasks';

function AddingCardAndPaymentScreen({ navigation }: ScreenProps<'adding-card-and-payment'>) {
  const { insets } = useAppTheme();
  const { t } = useLocalization();
  const { toastSuccess } = useThemedToasts();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      cvc: '',
      expiry: '',
      number: '',
    },
    mode: 'all',
  });
  const { handleSubmit, control, formState } = form;

  const cardMaskedInputProps = useMaskedInputProps({
    mask: inputMasks.credit_card,
    onChangeText: (val) => form.setValue('number', val),
    value: form.watch().number,
  });

  const cardExpMaskedInputProps = useMaskedInputProps({
    mask: inputMasks.expired_card_date,
    onChangeText: (val) => form.setValue('expiry', val),
    value: form.watch().expiry,
  });

  const submitCardData = async () => {
    try {
      setLoading(true)
      await wait(500)
      toastSuccess('Карта успешно добавлена!')
      
    } catch (error) {
      handleCatchError(error, 'CreditCardInputDataScreen')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Box px={24} flex={1} pt={22} onPress={Keyboard.dismiss} effect="none" accessible={false}>
      <Box gap={12} flex={1}>
        <Controller
          control={control}
          name='number'
          rules={{ minLength: inputMasks.credit_card.length, required: true}}
          render={({ field: { onBlur }, fieldState }) => (
            <Input
              {...cardMaskedInputProps}
              placeholder="0000 0000 0000 0000"
              keyboardType='number-pad'
              returnKeyType='done'
              autoFocus
              onBlur={onBlur}
              error={fieldState.invalid}
            />
          )}
        />
        <Box row gap={12} w='full'>
          <Controller
            control={control}
            name='expiry'
            rules={{ minLength: inputMasks.expired_card_date.length, required: true, }}
            render={({ field: { onBlur }, fieldState }) => (
              <Input
                {...cardExpMaskedInputProps}
                placeholder="мм/гг"
                keyboardType='decimal-pad'
                textContentType='creditCardExpiration'
                returnKeyType='done'
                wrapperStyle={{ flex: 1 }}
                onBlur={onBlur}
                error={fieldState.invalid}

              />
            )}
          />
          <Controller
            control={control}
            name='cvc'
            rules={{ minLength: 3, required: true }}
            render={({ field: { value, onBlur, onChange }, fieldState }) => (
              <Input
                placeholder="cvc"
                keyboardType='decimal-pad'
                textContentType='creditCardSecurityCode'
                returnKeyType='done'
                wrapperStyle={{ flex: 1 }}
                maxLength={3}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldState.invalid}
              />
            )}
          />
        </Box>
      </Box>
      <Box gap={12}>
        <Button 
        children="Добавить и оплатить 20 BYN"
        disabled={!formState.isValid || loading}
        loading={loading}
        onPress={handleSubmit(submitCardData)}
        />
        <Text children="Ваши данные для оплаты всегда зашифрованы" />
      </Box>
      <FakeView additionalOffset={-insets.bottom / 2} />
      <Gap y={insets.bottom || 16} />
    </Box>
  )
}

export default AddingCardAndPaymentScreen;