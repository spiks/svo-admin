import { Rule } from 'rc-field-form/es/interface';

export const armIssuerId: Rule = {
  type: 'string',
  len: 3,
  pattern: /^[0-9]{3}$/,
  message: 'Введите корректное значение (000)',
};
