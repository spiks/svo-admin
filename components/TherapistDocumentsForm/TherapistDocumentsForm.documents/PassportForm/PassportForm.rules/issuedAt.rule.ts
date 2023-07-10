import { Rule } from 'rc-field-form/es/interface';
import moment, { Moment } from 'moment';

export const issuedAt: Rule = {
  async validator(rule, value: Moment) {
    if (!moment.isMoment(value)) {
      return;
    }
    const today = moment();
    const isAfter = today.isSameOrBefore(value) || today.isSame(value, 'day');
    if (isAfter) {
      throw new Error('Дата выдачи паспорта должна быть в прошлом');
    }
  },
};
