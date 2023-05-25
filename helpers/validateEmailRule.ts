import { validateEmail } from '../utility/validateEmail';
import { ValidatorRule } from 'rc-field-form/es/interface';

/**
 * Правило для валидации email адреса
 * @param allowEmpty - необязательный парметр, отвечает за то, допускается ли к вводу пустая строка
 */
export const validateEmailRule = (allowEmpty?: boolean): ValidatorRule => ({
  validator: async (_, value: string) => {
    // Если стоит флаг на разрешение пустых значений - не валидируем на корректность email
    if (allowEmpty && (value === null || value === '')) return;
    if (!validateEmail(value)) throw new Error('Некорректный email');
  },
});
