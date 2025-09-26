import * as Sentry from 'npm:@sentry/node';

Sentry.init({
  dsn: 'ttps://983ed48d3b600d5948380eb765b3daa7@o496406.ingest.us.sentry.io/4510080614203392',
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
  enableLogs: true,
});

function main() {
  try {
    throw new Error('Test error for Sentry');
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error captured by Sentry:', error);
  }
}


main();