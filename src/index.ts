import { app, ensureAppReady } from './app';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    for (let attempt = 1; attempt <= 10; attempt++) {
      try {
        await ensureAppReady();
        break;
      } catch (error) {
        if (attempt === 10) {
          throw error;
        }
        console.log(`Database not ready yet (attempt ${attempt}/10). Retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Using PORT=${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
