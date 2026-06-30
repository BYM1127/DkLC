import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import * as path from 'path';
import { initializeDatabase } from './database';
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';

export const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const wwwrootPath = path.join(__dirname, '..', 'DimphoKeLesegoCateringBackend', 'wwwroot');
app.use(express.static(wwwrootPath));

app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (_req, res) => {
  res.sendFile(path.join(wwwrootPath, 'index.html'));
});

app.get('/quote.html', (_req, res) => {
  res.sendFile(path.join(wwwrootPath, 'quote.html'));
});

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Route not found' });
  }

  return res.sendFile(path.join(wwwrootPath, 'index.html'));
});

let databaseReady: Promise<void> | null = null;

export const ensureAppReady = async (): Promise<void> => {
  if (!databaseReady) {
    databaseReady = initializeDatabase();
  }

  await databaseReady;
};
