import { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { getEmail } from '../../api/auth/getEmail';
import { createRefreshTokenInterceptor } from '../../api/interceptors/createRefreshTokenInterceptor';
import { TokenStorage } from '../../utility/tokenStorage';
import { AccountEmail } from '../../generated';
import { useRouter } from 'next/router';

export type CredentialsType = {
  token: string | null;
  email: AccountEmail | null;
};

export type AuthContextValue = {
  credentials: CredentialsType;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue>({
  credentials: {
    token: null,
    email: null,
  },
  isLoading: false,
});

const getLocationPathnameFromWindow = () => {
  if (typeof window !== 'undefined') return window.location.pathname;
};

const AuthProvider: FC = ({ children }) => {
  const [credentials, setCredentials] = useState<CredentialsType>({
    token: null,
    email: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useRouter();

  const location = getLocationPathnameFromWindow();

  const isUserLoggedIn = useCallback(async () => {
    const storageToken = TokenStorage.getTokens()?.accessToken;
    if (!storageToken) {
      TokenStorage.clearTokens();
      await push('/login', undefined, { shallow: false });
      setIsLoading(false);
      return;
    }

    let email: Awaited<ReturnType<typeof getEmail>>;
    try {
      email = await getEmail();
    } catch (err) {
      TokenStorage.clearTokens();
      await push('/login');
      return;
    }

    setCredentials({
      token: storageToken,
      email: email.data,
    });

    if (window.location.pathname.startsWith('/login')) {
      await push('/users/therapists', undefined, { shallow: false });
    }

    setIsLoading(false);

    // если передать router, то будет бесконечный цикл
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    (async () => {
      await createRefreshTokenInterceptor(isUserLoggedIn);
      await isUserLoggedIn();
    })();
  }, [isUserLoggedIn]);

  const contextValue = useMemo(() => {
    return {
      credentials,
      isLoading,
    };
  }, [credentials, isLoading]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
