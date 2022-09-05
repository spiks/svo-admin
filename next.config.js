const withAntdLess = require('next-plugin-antd-less');

/** @type {import('next').NextConfig} */
const nextConfig = {
  lessVarsFilePath: './styles/ant.less',
  lessVarsFilePathAppendToEndOfContent: false,
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  webpack(config) {
    return config;
  },
  swcMinify: false,
};

module.exports = withAntdLess(nextConfig);
