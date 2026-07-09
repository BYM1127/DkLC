import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import * as path from 'path';
import { initializeDatabase } from './database';
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import { setupSwagger } from './swagger';

export const app: Express = express();

app.use(cors());

// Vercel serverless functions already parse the body.
// If we run express.json() when Vercel already parsed it, it will hang the request forever!
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return next();
  }
  express.json()(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ extended: true })(req, res, next);
  });
});

const wwwrootPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(wwwrootPath));

app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

setupSwagger(app);

app.get('/', (_req, res) => {
  res.sendFile(path.join(wwwrootPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend not built. Please run "npm run build" in the frontend directory.');
    }
  });
});


app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Route not found' });
  }

  res.sendFile(path.join(wwwrootPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Route not found');
    }
  });
});

let databaseReady: Promise<void> | null = null;

const getAppReadyTimeoutMs = (timeoutMs?: number): number => {
  const configuredTimeout = timeoutMs ?? Number(process.env.APP_READY_TIMEOUT_MS || 9000);
  return Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 9000;
};

export const ensureAppReady = async (timeoutMs?: number): Promise<void> => {
  const readyTimeoutMs = getAppReadyTimeoutMs(timeoutMs);

  if (!databaseReady) {
    databaseReady = initializeDatabase().catch(error => {
      databaseReady = null;
      throw error;
    });
  }

  await Promise.race([
    databaseReady,
    new Promise<never>((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`Database startup timed out after ${readyTimeoutMs}ms. Check MONGODB_URI and MongoDB Atlas Network Access.`));
      }, readyTimeoutMs);
    }),
  ]);
};
