import { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { getEmail } from '../../api/auth/getEmail';
import { createRefreshTokenInterceptor } from '../../api/interceptors/createRefreshTokenInterceptor';
import { ClientStorage } from '../../utility/clientStorage';
import { AccountEmail } from '../../generated';

export type CredentialsType = {
  token: string | null;
  email: AccountEmail | null;
};

export type AuthContextValue = {
  credentials: CredentialsType;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextValue>({
  credentials: {
    token: null,
    email: null,
  },
  loading: true,
});

const AuthProvider: FC = ({ children }) => {
  const [credentials, setCredentials] = useState<CredentialsType>({
    token: null,
    email: null,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const isUserLoggedIn = useCallback(async () => {
    const storageToken = ClientStorage.getTokens()?.accessToken;
    if (storageToken) {
      const email = await getEmail();
      setCredentials({
        token: storageToken,
        email: email.data,
      });
    } else {
      ClientStorage.clearTokens();
    }
    setLoading(false);
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
      loading,
    };
  }, [credentials, loading]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
