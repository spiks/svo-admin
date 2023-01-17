import { Rule } from 'rc-field-form/es/interface';

export const kzNumber: Rule = {
  type: 'string',
  min: 8,
  pattern: /^[A-Z]{1,2}[0-9]{7}$/,
  message: 'Введите корректное значение (AZ0000000)',
};
