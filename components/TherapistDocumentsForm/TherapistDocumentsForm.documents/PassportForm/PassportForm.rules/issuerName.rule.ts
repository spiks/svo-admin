import { Rule } from 'rc-field-form/es/interface';

export const issuerName: Rule = {
  // (API) `issuerName` : maxLength = 255 )
  max: 255,
  type: 'string',
  message: 'Максимальная длина 255 символов',
};
