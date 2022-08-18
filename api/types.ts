import {
  ArrayIsTooLongConstraintViolation,
  ArrayIsTooShortConstraintViolation,
  ArrayShouldHaveExactLengthConstraintViolation,
  CodeIsInvalidConstraintViolation,
  EnumValueIsNotAllowedConstraintViolation,
  MandatoryFieldMissingConstraintViolation,
  NumberIsTooBigConstraintViolation,
  NumberIsTooSmallConstraintViolation,
  ResourceIsNotAvailableConstraintViolation,
  StringIsTooLongConstraintViolation,
  StringIsTooShortConstraintViolation,
  ValueDoesNotMatchRegexConstraintViolation,
  ValueIsNotValidConstraintViolation,
  ValueShouldNotBeNullConstraintViolation,
  WrongDiscriminatorValueConstraintViolation,
  WrongPropertyTypeConstraintViolation,
} from '../generated';

export type ApiResponseSuccess<T> = Promise<{ status: 'success'; data: T }>;

export type ApiViolation =
  | EnumValueIsNotAllowedConstraintViolation
  | ResourceIsNotAvailableConstraintViolation
  | ValueIsNotValidConstraintViolation
  | ArrayIsTooLongConstraintViolation
  | ArrayIsTooShortConstraintViolation
  | ArrayShouldHaveExactLengthConstraintViolation
  | MandatoryFieldMissingConstraintViolation
  | NumberIsTooBigConstraintViolation
  | NumberIsTooSmallConstraintViolation
  | StringIsTooLongConstraintViolation
  | StringIsTooShortConstraintViolation
  | ValueDoesNotMatchRegexConstraintViolation
  | ValueShouldNotBeNullConstraintViolation
  | WrongDiscriminatorValueConstraintViolation
  | WrongPropertyTypeConstraintViolation
  | CodeIsInvalidConstraintViolation;
