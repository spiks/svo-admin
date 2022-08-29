import { AxiosRequestConfig } from 'axios';
import { ApiErrorData, ApiViolation } from './types';

export class ApiRegularError {
  constructor(public error: ApiErrorData, public config: AxiosRequestConfig, public status: 'error' = 'error') {}
}

export class ApiValidationError {
  constructor(
    public detail: string,
    public violations: ApiViolation[],
    public type: 'validation_error' = 'validation_error',
  ) {}
}
