import { createErrorResponseInterceptor } from '../api/interceptors/createErrorResponseInterceptor';

require('../styles/ant.less');
require('react-draft-wysiwyg/dist/react-draft-wysiwyg.css');

import type { AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ClientStorage } from '../clientStorage';
import AuthProvider from '../components/AuthProvider/AuthProvider.component';

createErrorResponseInterceptor();

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 2, refetchOnWindowFocus: false } } });

function MyApp({ Component, pageProps }: AppProps) {
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
