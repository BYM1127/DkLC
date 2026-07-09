import { app, ensureAppReady } from '../src/app';

export default async function handler(req: any, res: any) {
  try {
    const readyTimeoutMs = Math.min(Number(process.env.APP_READY_TIMEOUT_MS || 9000), 25000);
    await ensureAppReady(readyTimeoutMs);
    return app(req, res);
  } catch (error: any) {
    console.error('Failed to prepare app:', error);
    res.status(503).json({ message: error.message || 'Server failed to start' });
  }
}

