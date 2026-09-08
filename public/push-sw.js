self.addEventListener('push', (event) => {
  let message = {};
  try { message = event.data?.json() ?? {}; } catch { message = {}; }
  const path = /^\/(en|zh-CN|zh-TW)\/(history\/)?$/.test(message.path ?? '') ? message.path : '/';
  event.waitUntil(self.registration.showNotification(message.title || 'Codex Reset Watch', {
    body: message.body || '', icon: '/icon-192.png', badge: '/favicon-32.png',
    tag: message.eventId || 'crw-update', data: { path }, renotify: true,
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.path || '/', self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((client) => new URL(client.url).origin === self.location.origin);
    if (existing) return existing.navigate(target).then(() => existing.focus());
    return clients.openWindow(target);
  }));
});
