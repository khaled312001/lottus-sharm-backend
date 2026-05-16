import { EventEmitter } from 'events';

/**
 * Process-wide event bus for real-time admin notifications.
 * Routes call `bus.emit('notify', payload)` after a successful write;
 * the SSE endpoint forwards every payload to connected admin clients.
 *
 * Survives multiple subscribers (one per open admin tab). Bounded to 100
 * listeners so a leak surfaces in the logs.
 */
export const bus = new EventEmitter();
bus.setMaxListeners(100);

export type AdminNotification = {
  id: string;
  type: 'booking' | 'review' | 'comment' | 'contact';
  title: string;
  body?: string;
  link?: string;
  createdAt: string;
};

export function emitNotification(n: Omit<AdminNotification, 'id' | 'createdAt'>) {
  const payload: AdminNotification = {
    ...n,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  bus.emit('notify', payload);
}
