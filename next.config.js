const withAntdLess = require('next-plugin-antd-less');

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  lessVarsFilePath: './styles/ant.less',
  lessVarsFilePathAppendToEndOfContent: false,

  webpack(config) {
    return config;
  },
  swcMinify: false,
};

module.exports = withAntdLess(nextConfig);
