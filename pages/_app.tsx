import { createErrorResponseInterceptor } from '../api/interceptors/createErrorResponseInterceptor';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider, { AuthContext } from '../components/AuthProvider/AuthProvider.component';
import { useContext } from 'react';
import { OpenAPI } from '../generated';
import getConfig from 'next/config';
import SplashScreenLoader from '../components/SplashScreenLoader/SplashScreenLoader.component';
import { ConfigProvider as CountryPhoneConfigProvider } from 'antd-country-phone-input-upgraded';
import ru from 'world_countries_lists/data/countries/ru/world.json';
import 'antd-country-phone-input-upgraded/dist/index.css';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import ru_RU from 'antd/lib/locale/ru_RU';
import { ConfigProvider } from 'antd';
import 'moment/locale/ru';

require('../styles/ant.less');
require('react-draft-wysiwyg/dist/react-draft-wysiwyg.css');
createErrorResponseInterceptor();

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 2, refetchOnWindowFocus: false } } });

function MyApp({ Component, pageProps }: AppProps) {
  const { isLoading } = useContext(AuthContext);
  return (
    <ConfigProvider locale={ru_RU}>
      <CountryPhoneConfigProvider
        areaMapper={(area) => {
          // Обновляем коды стран из более свежей библиотеки
          const code = getCountryCallingCode(area.short as CountryCode);

          return {
            ...area,
            phoneCode: Number(code),
          };
        }}
        locale={ru}
      >
        <QueryClientProvider client={queryClient}>
          {isLoading ? <SplashScreenLoader /> : <Component {...pageProps} />}
        </QueryClientProvider>
      </CountryPhoneConfigProvider>
    </ConfigProvider>
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
