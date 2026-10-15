import { summarizeDeliveries } from '../functions/_lib/delivery-summary.js';
import assert from 'node:assert/strict';
import { buildPushPayload } from '../functions/_lib/push-payload.js';
import { readFileSync } from 'node:fs';
import { hkdfSync } from 'node:crypto';
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

// Exercise real multilingual drafts and maximum permitted multibyte input.
// Independently decrypt with the synthetic receiver to check framing and keys.
const draft = validateMessage(JSON.parse(readFileSync(new URL('../public/data/push-message.json', import.meta.url), 'utf8')));
const cases = [...Object.values(draft.messages).map((item) => ({ ...item, eventId: draft.eventId })),
  { title: '界'.repeat(80), body: '界'.repeat(180), path: '/zh-TW/history/', eventId: 'x'.repeat(64) }];
for (const data of cases) {
  for (const host of ['fcm.googleapis.com', 'updates.push.services.mozilla.com']) {
    const result = await buildPushPayload({ data, options: { ttl: 300, urgency: 'high', topic: 'crw-test' } }, {
      endpoint: `https://${host}/synthetic-offline-test`,
      keys: { p256dh: base64url(receiverPublicKey), auth: base64url(auth) },
    }, { subject: 'https://crw.warpnav.com', publicKey: base64url(vapidPublicKey), privateKey: vapidPrivateKey.d });
    const bytes = result.body;
    assert.equal(bytes.byteLength, new TextEncoder().encode(JSON.stringify(data)).byteLength + 103);
    assert.ok(bytes.byteLength <= 2744);
    assert.equal(bytes[20], 65);
    const serverPublic = bytes.slice(21, 86);
    const serverKey = await crypto.subtle.importKey('raw', serverPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
    const shared = await crypto.subtle.deriveBits({ name: 'ECDH', public: serverKey }, receiverKeyPair.privateKey, 256);
    const info = Buffer.concat([Buffer.from('WebPush: info\0'), Buffer.from(receiverPublicKey), serverPublic]);
    const ikm = hkdfSync('sha256', Buffer.from(shared), auth, info, 32);
    const key = hkdfSync('sha256', Buffer.from(ikm), bytes.slice(0, 16), Buffer.from('Content-Encoding: aes128gcm\0'), 16);
    const nonce = hkdfSync('sha256', Buffer.from(ikm), bytes.slice(0, 16), Buffer.from('Content-Encoding: nonce\0'), 12);
    const aes = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['decrypt']);
    const decoded = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, aes, bytes.slice(86)));
    assert.equal(decoded.at(-1), 2);
    assert.deepEqual(JSON.parse(new TextDecoder().decode(decoded.slice(0, -1))), data);
    console.log(`Offline round trip OK: ${host}, ${bytes.byteLength} bytes`);
  }
}

// Historical expiry, real failures, in-flight rows, and missing diagnostics stay distinct.
const summary = summarizeDeliveries([
  { status: 'delivered', response_status: 201, total: 14 },
  { status: 'failed', response_status: 410, total: 1 },
  { status: 'failed', response_status: 404, total: 2 },
  { status: 'failed', response_status: 403, total: 1 },
  { status: 'failed', response_status: 598, total: 1 },
  { status: 'failed', response_status: null, total: 1 },
  { status: 'sending', response_status: null, total: 1 },
  { status: 'pending', response_status: null, total: 2 },
]);
assert.deepEqual([summary.delivered, summary.expired, summary.failed, summary.pending], [14, 3, 3, 3]);
assert.equal(summary.reasons.length, 5);
assert.match(summary.reasons.find(r => r.code === 410).message, /无需重试/);
assert.match(summary.reasons.find(r => r.code === 598).message, /TypeError/);
assert.match(summary.reasons.find(r => r.code === null).message, /无法确定/);
assert.deepEqual(summarizeDeliveries([]), { delivered: 0, expired: 0, failed: 0, pending: 0, reasons: [] });
console.log('Delivery summary classification passed.');
