import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectPushState, withPushRegistration } from '../src/push-state.ts';

const base = {
  supported: true,
  permission: 'default',
  getSubscription: async () => null,
  loadPublicKey: async () => 'public-key',
};

test('an existing subscription remains on without requesting unavailable configuration', async () => {
  let configCalls = 0;
  const result = await inspectPushState({
    ...base,
    getSubscription: async () => ({ endpoint: 'https://push.example.test/existing' }),
    loadPublicKey: async () => {
      configCalls += 1;
      throw new Error('configuration is unavailable');
    },
  });
  assert.deepEqual(result, { state: 'on' });
  assert.equal(configCalls, 0);
});

test('a new subscription can be offered when configuration returns a key', async () => {
  assert.deepEqual(await inspectPushState(base), { state: 'off', publicKey: 'public-key' });
});

test('denied permission is reported after inspecting subscriptions without requesting configuration', async () => {
  const calls = [];
  const result = await inspectPushState({
    ...base,
    permission: 'denied',
    getSubscription: async () => {
      calls.push('subscription');
      return null;
    },
    loadPublicKey: async () => {
      calls.push('configuration');
      return 'public-key';
    },
  });
  assert.deepEqual(result, { state: 'denied' });
  assert.deepEqual(calls, ['subscription']);
});

test('missing browser APIs are unsupported without requesting subscriptions or configuration', async () => {
  const calls = [];
  const result = await inspectPushState({
    ...base,
    supported: false,
    getSubscription: async () => {
      calls.push('subscription');
      return null;
    },
    loadPublicKey: async () => {
      calls.push('configuration');
      return 'public-key';
    },
  });
  assert.deepEqual(result, { state: 'unsupported' });
  assert.deepEqual(calls, []);
});

test('subscription lookup errors are reported as errors without requesting configuration', async () => {
  let configCalls = 0;
  const result = await inspectPushState({
    ...base,
    getSubscription: async () => { throw new Error('service worker lookup failed'); },
    loadPublicKey: async () => {
      configCalls += 1;
      return 'public-key';
    },
  });
  assert.deepEqual(result, { state: 'error' });
  assert.equal(configCalls, 0);
});

test('configuration request failures are unavailable rather than unsupported', async () => {
  const result = await inspectPushState({
    ...base,
    loadPublicKey: async () => { throw new Error('HTTP 503'); },
  });
  assert.deepEqual(result, { state: 'unavailable' });
});

for (const [label, value] of [
  ['empty key', ''],
  ['whitespace-only key', ' \n\t '],
  ['missing key', undefined],
  ['null key', null],
  ['numeric key', 123],
  ['object instead of key', { publicKey: 'public-key' }],
  ['array instead of key', ['public-key']],
]) {
  test(`${label} makes configuration unavailable`, async () => {
    assert.deepEqual(await inspectPushState({ ...base, loadPublicKey: async () => value }), { state: 'unavailable' });
  });
}

test('a usable key is trimmed before being offered to the browser', async () => {
  assert.deepEqual(await inspectPushState({ ...base, loadPublicKey: async () => ' public-key\n' }), {
    state: 'off', publicKey: 'public-key',
  });
});

test('successful registration keeps a newly created subscription', async () => {
  const calls = [];
  const subscription = { unsubscribe: async () => { calls.push('rollback'); return true; } };
  const result = await withPushRegistration({
    getSubscription: async () => { calls.push('lookup'); return null; },
    createSubscription: async () => { calls.push('create'); return subscription; },
    registerSubscription: async (value) => {
      calls.push('register');
      assert.equal(value, subscription);
    },
  });
  assert.equal(result, subscription);
  assert.deepEqual(calls, ['lookup', 'create', 'register']);
});

test('failed registration rolls back the subscription created by this attempt', async () => {
  const calls = [];
  const registrationError = new Error('server registration failed');
  const subscription = { unsubscribe: async () => { calls.push('rollback'); return true; } };
  await assert.rejects(withPushRegistration({
    getSubscription: async () => { calls.push('lookup'); return null; },
    createSubscription: async () => { calls.push('create'); return subscription; },
    registerSubscription: async () => { calls.push('register'); throw registrationError; },
  }), (error) => error === registrationError);
  assert.deepEqual(calls, ['lookup', 'create', 'register', 'rollback']);
});

test('failed registration never cancels an existing subscription', async () => {
  const calls = [];
  const registrationError = new Error('server registration failed');
  const subscription = { unsubscribe: async () => { calls.push('rollback'); return true; } };
  await assert.rejects(withPushRegistration({
    getSubscription: async () => { calls.push('lookup'); return subscription; },
    createSubscription: async () => { calls.push('create'); return subscription; },
    registerSubscription: async (value) => {
      calls.push('register');
      assert.equal(value, subscription);
      throw registrationError;
    },
  }), (error) => error === registrationError);
  assert.deepEqual(calls, ['lookup', 'register']);
});

test('subscription creation failure does not register or attempt a rollback', async () => {
  const calls = [];
  const creationError = new Error('browser subscription failed');
  await assert.rejects(withPushRegistration({
    getSubscription: async () => { calls.push('lookup'); return null; },
    createSubscription: async () => { calls.push('create'); throw creationError; },
    registerSubscription: async () => { calls.push('register'); },
  }), (error) => error === creationError);
  assert.deepEqual(calls, ['lookup', 'create']);
});
