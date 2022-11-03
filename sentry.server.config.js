import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampler: (samplingContext) => {
    if (
      samplingContext.request !== undefined &&
      samplingContext.request.headers !== undefined &&
      samplingContext.request.headers['user-agent'] !== undefined &&
      samplingContext.request.headers['user-agent'].toLowerCase().includes('mozilla')
    ) {
      return 1;
    }

    return 0;
  },
});
