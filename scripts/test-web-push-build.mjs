import assert from 'node:assert/strict';
import { buildPushPayload } from '@block65/webcrypto-web-push';
import { validateMessage } from '../functions/_lib/push.js';

const message = (paths) => ({
  eventId: 'route-test',
  messages: {
    en: { title: 'English', body: 'English body', path: paths.en },
    'zh-CN': { title: '简体中文', body: '简体中文正文', path: paths['zh-CN'] },
    'zh-TW': { title: '繁體中文', body: '繁體中文正文', path: paths['zh-TW'] },
  },
});

assert.doesNotThrow(() => validateMessage(message({ en: '/', 'zh-CN': '/zh-CN/', 'zh-TW': '/zh-TW/' })));
assert.doesNotThrow(() => validateMessage(message({ en: '/history/', 'zh-CN': '/zh-CN/history/', 'zh-TW': '/zh-TW/history/' })));
assert.throws(() => validateMessage(message({ en: '/en/', 'zh-CN': '/zh-CN/', 'zh-TW': '/zh-TW/' })), /invalid message path/);

const base64url = (value) => Buffer.from(value).toString('base64url');
const vapidKeyPair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const vapidPublicKey = await crypto.subtle.exportKey('raw', vapidKeyPair.publicKey);
const vapidPrivateKey = await crypto.subtle.exportKey('jwk', vapidKeyPair.privateKey);
const receiverKeyPair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
const receiverPublicKey = await crypto.subtle.exportKey('raw', receiverKeyPair.publicKey);
const auth = crypto.getRandomValues(new Uint8Array(16));

const request = await buildPushPayload({
  data: { title: 'CRW test', body: 'Worker-native Web Crypto payload' },
  options: { ttl: 300, urgency: 'high', topic: 'crw-build-test' },
}, {
  endpoint: 'https://fcm.googleapis.com/fcm/send/synthetic-build-test',
  expirationTime: null,
  keys: { p256dh: base64url(receiverPublicKey), auth: base64url(auth) },
}, {
  subject: 'https://crw.warpnav.com',
  publicKey: base64url(vapidPublicKey),
  privateKey: vapidPrivateKey.d,
});

assert.equal(request.method, 'post');
assert.equal(request.headers['content-encoding'], 'aes128gcm');
assert.match(request.headers.authorization, /^vapid t=.+, k=.+$/);
assert.equal(request.headers.ttl, '300');
assert.ok(request.body.byteLength > 0 && request.body.byteLength <= 4096);
const headers = new Headers(request.headers);
headers.delete('content-length');
const outbound = new Request('https://fcm.googleapis.com/fcm/send/synthetic-build-test', {
  method: request.method.toUpperCase(),
  headers,
  body: request.body,
});
assert.equal(outbound.method, 'POST');
assert.equal(outbound.headers.get('content-length'), null);
assert.equal((await outbound.arrayBuffer()).byteLength, request.body.byteLength);
console.log('Worker-native Web Push payload generated successfully.');
