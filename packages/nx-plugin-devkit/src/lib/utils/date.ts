// Forked from https://github.com/xxczaki/light-date

export const format = (date: Date, exp: string): string =>
  exp.replace(/\\?{.*?}/g, (key) => {
    if (key.startsWith('\\')) {
      return key.slice(1);
    }

    switch (key) {
      case '{yyyy}':
        return `${date.getFullYear()}`;
      case '{yy}':
        return `${date.getFullYear()}`.slice(-2);
      case '{MM}':
        return `${date.getMonth() + 1}`.padStart(2, '0');
      case '{dd}':
        return `${date.getDate()}`.padStart(2, '0');
      case '{HH}':
        return `${date.getHours()}`.padStart(2, '0');
      case '{mm}':
        return `${date.getMinutes()}`.padStart(2, '0');
      case '{ss}':
        return `${date.getSeconds()}`.padStart(2, '0');
      case '{SSS}':
        return `${date.getMilliseconds()}`.padStart(3, '0');
      default:
        return '';
    }
  });

export const locale = (
  date: Date,
  exp: string,
  locale: string | string[] = 'en-US'
): string =>
  exp.replace(/\\?{.*?}/g, (key) => {
    if (key.startsWith('\\')) {
      return key.slice(1);
    }

    switch (key) {
      case '{MMMMM}':
        return new Intl.DateTimeFormat(locale, { month: 'narrow' }).format(
          date
        );
      case '{MMMM}':
        return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
      case '{MMM}':
        return new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
      case '{EEEEE}':
        return new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(
          date
        );
      case '{EEEE}':
        return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(
          date
        );
      case '{EEE}':
      case '{EE}':
      case '{E}':
        return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
          date
        );
      default:
        return '';
    }
  });
