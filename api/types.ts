import {
  AccessTokenExpiredApiProblem,
  ArrayIsTooLongConstraintViolation,
  ArrayIsTooShortConstraintViolation,
  ArrayShouldHaveExactLengthConstraintViolation,
  CodeIsInvalidConstraintViolation,
  EnumValueIsNotAllowedConstraintViolation,
  InternalServerErrorApiProblem,
  InvalidAccessTokenApiProblem,
  MandatoryFieldMissingConstraintViolation,
  NumberIsTooBigConstraintViolation,
  NumberIsTooSmallConstraintViolation,
  ResourceIsNotAvailableConstraintViolation,
  StringIsTooLongConstraintViolation,
  StringIsTooShortConstraintViolation,
  ValidationErrorApiProblem,
  ValueDoesNotMatchRegexConstraintViolation,
  ValueIsNotValidConstraintViolation,
  ValueShouldNotBeNullConstraintViolation,
  WrongDiscriminatorValueConstraintViolation,
  WrongPropertyTypeConstraintViolation,
} from '../generated';

export type ApiResponseSuccess<T> = Promise<{ status: 'success'; data: T }>;

export type ApiErrorData =
  | InternalServerErrorApiProblem
  | ValidationErrorApiProblem
  | AccessTokenExpiredApiProblem
  | InvalidAccessTokenApiProblem;

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
