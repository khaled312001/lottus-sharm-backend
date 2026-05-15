import { buildApp } from './app';
import { env } from './config/env';
import { disconnectDb } from './config/db';

const app = buildApp();

const server = app.listen(env.PORT, () => {
  console.log(`[lotus-backend] 🚀 listening on :${env.PORT} (${env.NODE_ENV})`);
});

const shutdown = async () => {
  console.log('[lotus-backend] shutting down...');
  server.close(async () => {
    await disconnectDb();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
