import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { bus, type AdminNotification } from '../utils/event-bus';

export const adminNotificationsRouter = Router();
adminNotificationsRouter.use(requireAuth);

/**
 * GET /api/admin/notifications/stream
 * Server-Sent Events endpoint. Pushes every `notify` event to the client
 * as it happens. The client uses EventSource — no polling, no websocket.
 */
adminNotificationsRouter.get('/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // disable nginx/passenger buffering
  });
  res.flushHeaders?.();

  // Initial comment so the connection is established immediately
  res.write(': connected\n\n');

  const send = (payload: AdminNotification) => {
    res.write(`event: notify\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };
  bus.on('notify', send);

  // Heartbeat every 25s so proxies don't kill the connection
  const heartbeat = setInterval(() => {
    res.write(`: ping ${Date.now()}\n\n`);
  }, 25_000);

  req.on('close', () => {
    clearInterval(heartbeat);
    bus.off('notify', send);
    res.end();
  });
});
