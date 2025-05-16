import moment from 'moment';

type DatePatterns =
  | 'yyyy-MM-DD'
  | 'DD.MM.yyyy'
  | 'LL'
  | 'LLL'
  | 'HH:mm'
  | 'DD MMMM'
  | 'DD.MM.yyyy HH:mm'
  | 'YYYY'
  | 'DD.MM.yyyy, HH:mm';

export const dateFormat = (pattern: DatePatterns, date?: Date | string) => {
  if (!date) {
    return moment().format(pattern);
  }

  const toDate = typeof date === 'string' ? new Date(date) : date;

  return moment(toDate).format(pattern);
};
