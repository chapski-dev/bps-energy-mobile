import lookup from 'country-code-lookup'
import {
  AsYouType,
  CountryCode,
  getCountryCallingCode,
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'libphonenumber-js'
import examples from 'libphonenumber-js/examples.mobile.json'
import parsePhoneNumberFromString, { getCountries } from 'libphonenumber-js/mobile'
import getCountryCodeEmoji from 'node_modules/country-code-emoji/lib'

export function getInternationalMaskByCountryCode(countryCode: CountryCode, withPrefix: boolean = true) {
  try {
    const number = getExampleNumber(countryCode, examples)
    const asYouType = new AsYouType(countryCode)
    asYouType.input(number.formatInternational())
    const template = asYouType.getTemplate()
    const templateWithoutPlus = template.substr(1)
    const mask = []
    const prefix = number.countryCallingCode.split('').reverse()
    for (const char of templateWithoutPlus) {
      if (char === 'x') {
        if (withPrefix) {
          if (prefix.length) {
            mask.push(prefix.pop())
          } else {
            mask.push(/\d/)
          }
        } else {
          if (prefix.length) {
            prefix.pop()
          } else {
            mask.push(/\d/)
          }
        }
      } else {
        if (withPrefix) {
          mask.push(char)
        } else {
          if (mask.length) {
            mask.push(char)
          }
        }
      }
    }

    return withPrefix ? ['+', ...mask] : mask
  } catch (error) {
    return []
  }
}

export const countryCodeEmoji = (countryIso: CountryCode) => {
  try {
    return getCountryCodeEmoji(countryIso)
  } catch (error) {
    return '🏳️'
  }
}

export const countryCallingCode = (countryIso: CountryCode) => {
  try {
    return getCountryCallingCode(countryIso)
  } catch (error) {
    return ''
  }
}

export const countryName = (countryIso: CountryCode) => {
  try {
    return lookup.byIso(countryIso)?.country
  } catch (error) {
    return ''
  }
}

export function normalizeToInternationalPhoneNumber(input: string) {
  const cleaned = input.replace(/[^\d+]/g, '')
  const possibleRegions = getCountries()

  try {
    let phoneNumber = parsePhoneNumberFromString(cleaned)

    // If the number is not valid, try to go through the procedure in the nearest region.
    if (!phoneNumber || !phoneNumber.isValid()) {
      for (const region of possibleRegions) {
        phoneNumber = parsePhoneNumber(cleaned, region)
        if (phoneNumber && phoneNumber.isValid()) {
          break
        }
      }
    }
    if (phoneNumber && phoneNumber.isValid()) {
      return {
        countryIso: phoneNumber.country,
        fullPhoneNumber: phoneNumber.format('E.164'),
        withoutCountryCode: phoneNumber.nationalNumber,
      }
    } else {
      return {
        countryIso: null,
        fullPhoneNumber: null,
        withoutCountryCode: null,
      }
    }
  } catch {
    return {
      countryIso: null,
      fullPhoneNumber: null,
      withoutCountryCode: null,
    }
  }
}

export const validatePhone = (inputVal: string) => {
  const phone = `+${inputVal}`
  const isValid = isValidPhoneNumber(phone)
  return { isValid, phone }
}
