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
  await ensureAppReady();
  return expressHandler(event, context);
};
