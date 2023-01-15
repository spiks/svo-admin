import { Rule } from 'rc-field-form/es/interface';

export const ruIssuerId: Rule = {
  type: 'string',
  len: 7,
  pattern: /^[0-9]{3}-[0-9]{3}$/,
  message: 'Введите корректное значение (000-000)',
};
