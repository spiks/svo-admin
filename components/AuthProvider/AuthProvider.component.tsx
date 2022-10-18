import { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { getEmail } from '../../api/auth/getEmail';
import { createRefreshTokenInterceptor } from '../../api/interceptors/createRefreshTokenInterceptor';
import { TokenStorage } from '../../utility/clientStorage';
import { AccountEmail } from '../../generated';
import { useRouter } from 'next/router';

export type CredentialsType = {
  token: string | null;
  email: AccountEmail | null;
};

export type AuthContextValue = {
  credentials: CredentialsType;
};

export const AuthContext = createContext<AuthContextValue>({
  credentials: {
    token: null,
    email: null,
  },
});

const AuthProvider: FC = ({ children }) => {
  const [credentials, setCredentials] = useState<CredentialsType>({
    token: null,
    email: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();



  const isUserLoggedIn = useCallback(async () => {
    const storageToken = TokenStorage.getTokens()?.accessToken;
    if (storageToken) {
      const email = await getEmail();
      setCredentials({
        token: storageToken,
        email: email.data,
      });
    } else {
      TokenStorage.clearTokens();
      push('/login', undefined, { shallow: true });
    }
    // если передать router, то будет бесконечный цикл
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      await createRefreshTokenInterceptor(isUserLoggedIn);
      await isUserLoggedIn();
    })();
  }, [isUserLoggedIn]);

  const contextValue = useMemo(() => {
    return {
      credentials,
    };
  }, [credentials]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
