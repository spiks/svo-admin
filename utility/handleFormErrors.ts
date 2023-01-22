import { ApiRegularError, ApiValidationError } from '../api/errorClasses';
import {
  InvalidEmailOrPasswordConstraintViolation,
  MandatoryFieldMissingConstraintViolation,
  NumberIsTooBigConstraintViolation,
  NumberIsTooSmallConstraintViolation,
  StringIsTooLongConstraintViolation,
  StringIsTooShortConstraintViolation,
  ValueDoesNotMatchRegexConstraintViolation,
  ValueIsNotValidConstraintViolation,
} from '../generated';

type Handlers = {
  validation: (violations: Record<string, string>) => void;
  internalError: () => void;
};

export const numberIsTooBigType = 'number_is_too_big';
const numberIsTooSmallType = 'number_is_too_small';
const stringIsTooLong = 'string_is_too_long';
const stringIsTooShort = 'string_is_too_short';
const valueDoesNotMatchRegex = 'value_does_not_match_regex';
const valueIsNotValid = 'value_is_not_valid';
const mandatoryFieldMissing = `mandatory_field_missing`;
const invalidEmailOrPassword = `invalid_email_or_password`;

const supportedViolationTypes = [
  numberIsTooBigType,
  numberIsTooSmallType,
  stringIsTooLong,
  stringIsTooShort,
  valueDoesNotMatchRegex,
  valueIsNotValid,
  mandatoryFieldMissing,
  invalidEmailOrPassword,
];

type SupportedConstraintViolation =
  | NumberIsTooBigConstraintViolation
  | NumberIsTooSmallConstraintViolation
  | StringIsTooLongConstraintViolation
  | StringIsTooShortConstraintViolation
  | ValueDoesNotMatchRegexConstraintViolation
  | ValueIsNotValidConstraintViolation
  | MandatoryFieldMissingConstraintViolation
  | InvalidEmailOrPasswordConstraintViolation;

const getErrorMessage = (error: SupportedConstraintViolation): string => {
  switch (error.type) {
    case numberIsTooBigType:
      return `Введеное число не должно быть больше ${(error as NumberIsTooBigConstraintViolation).max}`;
    case numberIsTooSmallType:
      return `Введеное число не должно быть меньше ${(error as NumberIsTooSmallConstraintViolation).min}`;
    case stringIsTooLong:
      return `Введеная строка превышает допустимый размер поля ${
        (error as StringIsTooLongConstraintViolation).maxLength
      }`;
    case stringIsTooShort: {
      const minLength = (error as StringIsTooShortConstraintViolation).minLength;
      if (minLength === 1) {
        return 'Поле обязательно для заполнения';
      } else {
        return `Введеная строка меньше допустимого размера поля ${minLength}`;
      }
    }
    case valueDoesNotMatchRegex:
      return 'Неверный формат данных';
    case valueIsNotValid:
      return 'Невалидное значение поля';
    case invalidEmailOrPassword:
      return 'Неверный email или пароль';
    case mandatoryFieldMissing:
      return 'Поле обязательно для заполнения';
  }
};

export const handleFormErrors = (error: unknown, handlers: Handlers): void => {
  if (error instanceof ApiRegularError) {
    handlers.internalError();
  } else if (error instanceof ApiValidationError) {
    const violations: Record<string, string> = {};

    error.violations.forEach((it) => {
      if (supportedViolationTypes.includes(it.type)) {
        violations[it.pointer.substring(1)] = getErrorMessage(it as unknown as SupportedConstraintViolation);
      } else {
        throw new Error(it.description);
      }
    });

    handlers.validation(violations);
  }
};
