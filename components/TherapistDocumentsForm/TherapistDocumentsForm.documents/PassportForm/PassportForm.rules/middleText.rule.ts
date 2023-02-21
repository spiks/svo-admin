import { Rule } from 'rc-field-form/es/interface';

export const middleText: Rule = {
  // (API) `name, surname, patronymic` : maxLength = 100 )
  max: 100,
  type: 'string',
  message: 'Максимальная длина 100 символов',
};
