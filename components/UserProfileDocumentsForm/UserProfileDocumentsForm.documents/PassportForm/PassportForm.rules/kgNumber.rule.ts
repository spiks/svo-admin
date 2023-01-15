import { Rule } from 'rc-field-form/es/interface';

export const kgNumber: Rule = {
  type: 'string',
  len: 9,
  pattern: /^[A-Z]{2}[0-9]{7}$/,
  message: 'Введите корректное значение (АZ0000000)',
};
