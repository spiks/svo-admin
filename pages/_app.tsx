import { createErrorResponseInterceptor } from '../api/interceptors/createErrorResponseInterceptor';

require('../styles/ant.less');
require('react-draft-wysiwyg/dist/react-draft-wysiwyg.css');

import type { AppProps } from 'next/app';

createErrorResponseInterceptor();

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
