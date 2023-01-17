import { Rule } from 'rc-field-form/es/interface';

export const identificationNumber: Rule = {
  type: 'string',
  len: 14,
  pattern: /^[0-9]{7}[A-Z][0-9]{3}[A-Z]{2}[0-9]$/,
  message: 'Введите корректное значение (0000000A000AA0)',
};
