import axios, { AxiosResponse } from 'axios';

export function createErrorResponseInterceptor() {
  axios.interceptors.response.use((response: AxiosResponse) => {
    if (response.data.status !== 'success' && !Object.prototype.hasOwnProperty.call(response.data, 'version')) {
      throw response;
    }
    return response;
  });
}
