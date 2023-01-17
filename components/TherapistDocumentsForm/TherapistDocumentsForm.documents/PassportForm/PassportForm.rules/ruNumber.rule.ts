import { Rule } from 'rc-field-form/es/interface';

export const ruNumber: Rule = {
  type: 'string',
  len: 11,
  pattern: /^[0-9]{4} [0-9]{6}$/,
  message: 'Введите корректное значение (0000 000000)',
};
