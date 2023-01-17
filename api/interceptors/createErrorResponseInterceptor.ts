import axios, { AxiosResponse } from 'axios';
import { ApiRegularError, ApiValidationError } from '../errorClasses';

export const createErrorResponseInterceptor = () => {
  axios.interceptors.response.use((response) => {
    if (response.data.status === 'error') {
      const type = response.data.error.type;
      if (type === 'validation_error') {
        throw new ApiValidationError(response.data.error.detail, response.data.error.violations);
      }
      throw new ApiRegularError(response.data.error, response.config);
    }

    return response;
  });
};
