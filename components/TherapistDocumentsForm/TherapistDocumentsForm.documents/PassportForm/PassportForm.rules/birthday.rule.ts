import { Rule } from 'rc-field-form/es/interface';
import moment, { Moment } from 'moment';
import { intervalToDuration } from 'date-fns';

export const birthday: Rule = {
  async validator(rule, value: Moment) {
    if (!moment.isMoment(value)) {
      return;
    }
    const today = moment();
    const isAfter = today.isSameOrBefore(value) || today.isSame(value, 'day');
    if (isAfter) {
      throw new Error('Дата рождения не может принимать такое значение');
    }
    const yearsBetweenNowAndBirthday = intervalToDuration({
      start: value.date(),
      end: new Date(),
    })?.years;
    if (yearsBetweenNowAndBirthday! < 18) {
      throw new Error('Терапевт не может быть младше 18 лет');
    }
  },
};
