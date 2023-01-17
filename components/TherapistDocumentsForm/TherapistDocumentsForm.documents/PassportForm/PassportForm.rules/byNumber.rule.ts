import { Rule } from 'rc-field-form/es/interface';

export const byNumber: Rule = {
  type: 'string',
  len: 8,
  pattern: /^[A-Z]{2}[0-9]{6}$/,
  message: 'Введите корректное значение (AZ000000)',
};
