import { issueToken } from '../auth/issueTokenByEmailAndPassword';
import { TokenStorage } from '../../utility/tokenStorage';
import { useRouter } from 'next/router';

export const useLogin = () => {
  const { push } = useRouter();

  return async (email: string, password: string) => {
    try {
      const tokenResp = await issueToken(email, password);
      if (tokenResp.status === 'success') {
        TokenStorage.setTokens(tokenResp.data);
        push('/users/therapists');
      }
      return { status: tokenResp.status };
    } catch (error) {
      return { status: error, error };
    }
  };
};
