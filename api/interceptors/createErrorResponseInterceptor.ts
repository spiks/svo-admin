import axios from 'axios';

export function createErrorResponseInterceptor() {
  axios.interceptors.response.use((response) => {
    if (response.data.status !== 'success' && !Object.prototype.hasOwnProperty.call(response.data, 'version')) {
      throw response;
    }
    return response;
  });
}
