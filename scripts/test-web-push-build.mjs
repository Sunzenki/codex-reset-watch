import assert from 'node:assert/strict';
import { buildPushPayload } from '@block65/webcrypto-web-push';

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
console.log('Worker-native Web Push payload generated successfully.');
