import { Rule } from 'rc-field-form/es/interface';

export const byNumber: Rule = {
  type: 'string',
  len: 9,
  pattern: /^[A-Z]{2}[0-9]{7}$/,
  message: 'Введите корректное значение (AZ0000000)',
};
