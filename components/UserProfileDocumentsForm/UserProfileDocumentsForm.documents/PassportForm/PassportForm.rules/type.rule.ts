import { Rule } from 'rc-field-form/es/interface';

export const type: Rule = {
  type: 'string',
  len: 2,
  pattern: /^[A-Z]{2}$/,
  message: 'Введите корректное значение (AA)',
};
