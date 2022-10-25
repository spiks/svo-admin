import { createErrorResponseInterceptor } from '../api/interceptors/createErrorResponseInterceptor';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider, { AuthContext } from '../components/AuthProvider/AuthProvider.component';
import { useContext } from 'react';
import { OpenAPI } from '../generated';
import getConfig from 'next/config';
import SplashScreenLoader from '../components/SplashScreenLoader/SplashScreenLoader.component';

require('../styles/ant.less');
require('react-draft-wysiwyg/dist/react-draft-wysiwyg.css');

createErrorResponseInterceptor();

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 2, refetchOnWindowFocus: false } } });

function MyApp({ Component, pageProps }: AppProps) {
  const { isLoading } = useContext(AuthContext);

  return (
    <QueryClientProvider client={queryClient}>
      {isLoading ? <SplashScreenLoader /> : <Component {...pageProps} />}
    </QueryClientProvider>
  );
}

const MyAppView = (props: AppProps & { API_BASE_URL: string }) => {
  OpenAPI.BASE = props.API_BASE_URL;
  return (
    <AuthProvider>
      <MyApp {...props} />
    </AuthProvider>
  );
};

MyAppView.getInitialProps = () => {
  return getConfig().publicRuntimeConfig;
};

export default MyAppView;
