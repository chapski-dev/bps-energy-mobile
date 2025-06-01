import { Dimensions } from 'react-native';
import dayjs from 'dayjs'
import { pickBy } from 'lodash';

export const removeUndefinedOnes = (obj: Record<string, any>): Record<string, any> => {
  return pickBy(obj, (v) => v !== undefined)
}

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce(
    (result, currentItem) => {
      const key = keyFn(currentItem)
      if (!result[key]) {
        result[key] = []
      }
      result[key].push(currentItem)
      return result
    },
    {} as Record<string, T[]>,
  )
}

export const createdAtFormat = (date: string | number): string => {
  const parsedDate = typeof date === 'number' ? dayjs.unix(date) : dayjs(date)

  const today = dayjs().startOf('day')
  const yesterday = dayjs().startOf('day').subtract(1, 'day')
  const dateFormat = parsedDate.startOf('day')

  if (dateFormat.isSame(today)) {
    return 'Today'
  } else if (dateFormat.isSame(yesterday)) {
    return 'Yesterday'
  } else {
    return parsedDate.format('dddd, DD MMMM')
  }
}
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;