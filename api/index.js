const { app, ensureAppReady } = require('../dist/app');

module.exports = async (req, res) => {
  try {
    await ensureAppReady();
    return app(req, res);
  } catch (error) {
    console.error('Failed to prepare app:', error);
    res.statusCode = 500;
    return res.end('Server failed to start');
  }
};
