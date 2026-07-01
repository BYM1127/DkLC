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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

export const ensureAppReady = async (): Promise<void> => {
  if (!databaseReady) {
    databaseReady = initializeDatabase();
  }

  await databaseReady;
};
