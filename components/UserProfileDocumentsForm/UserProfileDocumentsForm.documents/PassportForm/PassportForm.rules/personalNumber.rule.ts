import { Rule } from 'rc-field-form/es/interface';

export const personalNumber: Rule = {
  type: 'string',
  len: 14,
  message: 'Введите корректное значение (00000000000000)',
};
