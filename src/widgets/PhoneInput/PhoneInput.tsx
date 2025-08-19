import React, { FC, memo, useCallback, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FlatList, Keyboard, LayoutAnimation, TextInput } from 'react-native'
import SearchIcon from '@assets/svg/phone.svg'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { CountryCode, getCountries, getExampleNumber } from 'libphonenumber-js'
import examples from 'libphonenumber-js/examples.mobile.json'
import { AsYouType, parsePhoneNumberWithError } from 'libphonenumber-js/max'

import { useAppTheme } from '@src/theme/theme'
import { BottomSlideModal, Box, Input, Text } from '@src/ui'
import { animate } from '@src/utils/animate'

import { countryCallingCode, countryCodeEmoji, countryName, validatePhone } from './utils'
import { useTranslation } from 'react-i18next'

export type EnterPhoneT = { phone: string; countryIso: CountryCode }

type IPhoneInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  validateCallback?: (phone: string) => void
  onPressSuffixIcon?: () => void
}

const allCountries = getCountries().slice(1)

export const PhoneInput: FC<IPhoneInputProps> = ({ validateCallback }) => {
  const { colors, insets } = useAppTheme()
  const { t } = useTranslation()
  const { setValue, control, getValues, resetField } = useFormContext<EnterPhoneT>()
  const modal = useRef<BottomSheetModal>(null)
  const phoneInput = useRef<TextInput>(null)

  const modalClose = () => modal?.current?.forceClose()

  const modalOpen = () => {
    Keyboard.dismiss()
    modal?.current?.present()
  }

  const [filterdDefaultCountries, setFilterdDefaultCountries] = useState(allCountries)

  const handleSelectCountry = useCallback(
    (countryIso: CountryCode) => () => {
      resetField('phone')
      const code = countryCallingCode(countryIso)
      setValue('phone', code)
      setValue('countryIso', countryIso, { shouldValidate: true })
      setFilterdDefaultCountries(allCountries)
      modalClose()
      setTimeout(() => phoneInput.current?.focus(), 1000)
    },
    [resetField, setValue],
  )

  const handleFilterCounties = (val: string) => {
    const searchInput = val.toLocaleLowerCase()
    const filtered = allCountries.filter(
      (el) =>
        countryCallingCode(el).includes(searchInput.replace('+', '')) ||
        countryName(el)?.toLocaleLowerCase().includes(searchInput),
    )

    setFilterdDefaultCountries(filtered)
  }

  const renderItem = useCallback(
    ({ item }: { item: CountryCode }) => <CountryItem item={item} handleSelectCountry={handleSelectCountry} />,
    [handleSelectCountry],
  )

  return (
    <>
      <Controller
        name="phone"
        control={control}
        rules={{
          required: true,
          validate: (val) => {
            const { isValid, phone } = validatePhone(val)
            if (isValid) {
              animate(LayoutAnimation.Presets.easeInEaseOut)
              validateCallback?.(phone)
            }
            return isValid
          },
        }}
        render={({ field: { onBlur, value, onChange } }) => {
          const asYouType = new AsYouType()
          const inputValue = asYouType.input(`+${value}`)
          const cIso = getValues('countryIso')
          let maxLength
          if (cIso) {
            const examplePhone = getExampleNumber(cIso, examples)
            if (examplePhone) {
              maxLength = examplePhone.formatInternational().length
            }
          }

          return (
            <Input
              ref={phoneInput}
              maxLength={maxLength}
              icon={
                <Box row gap={10} alignItems="center" onPress={modalOpen}>
                  <Box row gap={5} alignItems="center" justifyContent="center">
                    <Text children={countryCodeEmoji(getValues()?.countryIso)} />
                  </Box>
                  <Box w={1} h={30} backgroundColor={colors.border} />
                </Box>
              }
              value={inputValue}
              onChangeText={(text: string) => {
                let countryIso
                try {
                  countryIso = parsePhoneNumberWithError(text).country
                } catch { }
                if (countryIso) {
                  setValue('countryIso', countryIso)
                } else {
                  setValue('countryIso', undefined)
                }
                text = text.replace('+', '')
                onChange(text)
              }}
              placeholder="Phone number"
              keyboardType="number-pad"
              onBlur={onBlur}
              autoComplete="off"
              importantForAutofill="no"
              autoFocus
              prompting={t('phone-number-support-promting')}
            />
          )
        }}
      />
      <BottomSlideModal keyboardBehavior="fillParent" ref={modal} enableContentPanningGesture={false}>
        <Box pl={20} pr={20} flex={1} mb={insets.bottom} gap={20}>
          <Input
            icon={<SearchIcon width={20} height={20} color={colors.grey_600} />}
            onChangeText={handleFilterCounties}
            placeholder={t('search')}
          />
          <FlatList
            data={filterdDefaultCountries}
            keyExtractor={(i) => i.toString()}
            contentContainerStyle={{ gap: 15 }}
            renderItem={renderItem}
          />
        </Box>
      </BottomSlideModal>
    </>
  )
}

const CountryItem = memo(
  ({ item, handleSelectCountry }: { item: CountryCode; handleSelectCountry: (country: CountryCode) => () => void }) => {
    const { colors } = useAppTheme()
    const { t } = useTranslation('countries');


    return countryName(item) && (
      <Box alignItems='center' row gap={15} key={item} onPress={handleSelectCountry(item)}>
        <Box borderRadius={20} p={10} backgroundColor={colors.grey_50} >
          <Text children={countryCodeEmoji(item)} />
        </Box>
        <Box gap={5} row w='full' flex={1}>
          <Text children={`(+${countryCallingCode(item)})`} />
          <Text style={{ flexShrink: 1 }} children={t(countryName(item) as const)} />
        </Box>
      </Box>
    )
  },
)
