import { encryptNotification, vapidHeaders } from '@block65/webcrypto-web-push';

// Mozilla's bridged mobile endpoints may reject a padded 4096-byte body.
// Keep RFC 8291 encryption, but omit optional padding for these public notices.
export async function buildPushPayload(message, subscription, vapid) {
  const plaintext = new TextEncoder().encode(JSON.stringify(message.data));
  const body = await encryptNotification(subscription, plaintext, { pad: false });
  if (body.byteLength > 2744) throw new Error('Encrypted push payload exceeds the bridge-safe size limit');
  const { headers } = await vapidHeaders(subscription, vapid);
  return {
    method: 'post',
    headers: {
      ...headers,
      ttl: String(message.options?.ttl ?? 60),
      ...(message.options?.urgency && { urgency: message.options.urgency }),
      ...(message.options?.topic && { topic: message.options.topic }),
      'content-encoding': 'aes128gcm',
      'content-type': 'application/octet-stream',
    },
    body,
  };
}
