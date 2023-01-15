import { Rule } from 'rc-field-form/es/interface';

export const middleText: Rule = {
  // (API) `fullName` : maxLength = 255 (у нас 3 составляющих)
  max: 85,
  type: 'string',
  message: 'Максимальная длина 85 символов',
};
