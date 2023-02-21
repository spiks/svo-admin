import { Rule } from 'rc-field-form/es/interface';

export const type: Rule = {
  type: 'string',
  max: 2,
  pattern: /^[A-Z]{1,2}$/,
  message: 'Введите корректное значение (A/AA)',
};
