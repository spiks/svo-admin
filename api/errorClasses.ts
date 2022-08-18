import { ApiViolation } from './types';

export class ApiValidationError {
  constructor(
    public detail: string,
    public violations: ApiViolation[],
    public type: 'validation_error' = 'validation_error',
  ) {}
}
