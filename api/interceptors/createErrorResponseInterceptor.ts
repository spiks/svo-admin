import axios from 'axios';

export function createErrorResponseInterceptor() {
  axios.interceptors.response.use((response) => {
    if (response.data.status !== 'success') {
      throw response;
    }
    return response;
  });
}
