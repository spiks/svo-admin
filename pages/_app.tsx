import { createErrorResponseInterceptor } from '../api/interceptors/createErrorResponseInterceptor';

require('../styles/ant.less');
require('react-draft-wysiwyg/dist/react-draft-wysiwyg.css');

import type { AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import AuthProvider, { AuthContext } from '../components/AuthProvider/AuthProvider.component';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NAVIGATION } from '../constants/navigation';

createErrorResponseInterceptor();

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 2, refetchOnWindowFocus: false } } });

function MyApp({ Component, pageProps }: AppProps) {
  const { credentials, loading } = useContext(AuthContext);
  const [isAppReady, setIsAppReady] = useState<boolean>(false);
  const { pathname } = useRouter();

  const { token } = credentials;

  useEffect(() => {
    if (loading) {
      isAppReady && setIsAppReady(false);
      return;
    }

    if (!token) {
      // Страница не публичная и пользователь не авторизован
      const isLoginPage = pathname === '/login';
      if (!isLoginPage) {
        window.location.href = '/login';
        return;
      }

      // Страница публичная, пускаем в компонент
      setIsAppReady(true);
      return;
    }

    setIsAppReady(true);
    return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAppReady, loading, token]);

  if (!isAppReady) {
    return <p>Загрузка</p>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

const MyAppView = (props: AppProps) => {
  return (
    <AuthProvider>
      <MyApp {...props} />
    </AuthProvider>
  );
};

export default MyAppView;
