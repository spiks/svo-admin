import { withSentryConfig } from '@sentry/nextjs';
import withAntdLess from 'next-plugin-antd-less';

/** @type {import('next').NextConfig} */
const nextConfig = {
  lessVarsFilePath: './styles/ant.less',
  lessVarsFilePathAppendToEndOfContent: false,
  images: {
    domains: ['img.dev.most.spiks.dev', 'img.stage.most.spiks.dev', 'storage.yandexcloud.net', 'img.lk.mostme.ru'],
  },
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  webpack(config) {
    return config;
  },
  swcMinify: false,
};

let config = withAntdLess(nextConfig);
// Подключаем Sentry только в production'е и игнорируем создание нового релиза для Sentry в CI
config =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN ? withSentryConfig(config) : config;

export default config;
