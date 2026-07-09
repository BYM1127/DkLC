import { app, ensureAppReady } from '../src/app';

let lastError: any = null;
process.on('uncaughtException', (err) => { lastError = err; console.error('FATAL:', err); });
process.on('unhandledRejection', (err) => { lastError = err; console.error('FATAL:', err); });

export default async function handler(req: any, res: any) {
  if (lastError) return res.status(500).send(`Fatal Error: ${lastError.stack || lastError}`);
  console.log(`[Vercel] Handling request: ${req.method} ${req.url}`);
  try {
    const readyTimeoutMs = Math.min(Number(process.env.APP_READY_TIMEOUT_MS || 9000), 25000);
    await ensureAppReady(readyTimeoutMs);
    return app(req, res);
  } catch (error: any) {
    console.error('Failed to prepare app:', error);
    res.status(503).json({ message: error.message || 'Server failed to start', stack: error.stack });
  }
}
