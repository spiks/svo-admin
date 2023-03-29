import { Rule } from 'rc-field-form/es/interface';

export const kzNumber: Rule = {
  type: 'string',
  min: 8,
  pattern: /^[A-Z]{1}[0-9]{8}$/,
  message: 'Введите корректное значение (A00000000)',
};
