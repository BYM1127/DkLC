const serverless = require('serverless-http');
const { app, ensureAppReady } = require('../../dist/app');

const expressHandler = serverless(app, {
  request: (request) => {
    const functionPrefix = '/.netlify/functions/api';

    if (request.url.startsWith(functionPrefix)) {
      request.url = request.url.slice(functionPrefix.length) || '/';
    }

    if (!request.url.startsWith('/api')) {
      request.url = `/api${request.url === '/' ? '' : request.url}`;
    }
  },
});

exports.handler = async (event, context) => {
  try {
    await ensureAppReady();
    return expressHandler(event, context);
  } catch (error) {
    console.error('Failed to prepare app:', error);

    return {
      statusCode: 503,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: error && error.message ? error.message : 'Server failed to start',
      }),
    };
  }
};
