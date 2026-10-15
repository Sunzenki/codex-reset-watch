export type InspectedPushState = {
  state: 'unsupported' | 'on' | 'denied' | 'off' | 'unavailable' | 'error';
  publicKey?: string;
};

type PushInspection = {
  supported: boolean;
  permission: NotificationPermission;
  getSubscription: () => Promise<unknown | null>;
  loadPublicKey: () => Promise<unknown>;
};

/** Inspect local subscriptions before requesting configuration for a new one. */
export async function inspectPushState({
  supported,
  permission,
  getSubscription,
  loadPublicKey,
}: PushInspection): Promise<InspectedPushState> {
  if (!supported) return { state: 'unsupported' };

  let subscription: unknown;
  try {
    subscription = await getSubscription();
  } catch {
    return { state: 'error' };
  }
  if (subscription) return { state: 'on' };
  if (permission === 'denied') return { state: 'denied' };

  try {
    const value = await loadPublicKey();
    if (typeof value !== 'string' || !value.trim()) return { state: 'unavailable' };
    return { state: 'off', publicKey: value.trim() };
  } catch {
    return { state: 'unavailable' };
  }
}

type PushRegistration<T extends { unsubscribe(): Promise<boolean> }> = {
  getSubscription: () => Promise<T | null>;
  createSubscription: () => Promise<T>;
  registerSubscription: (subscription: T) => Promise<void>;
};

/** Roll back only a subscription created by this registration attempt. */
export async function withPushRegistration<T extends { unsubscribe(): Promise<boolean> }>({
  getSubscription,
  createSubscription,
  registerSubscription,
}: PushRegistration<T>): Promise<T> {
  const existing = await getSubscription();
  const subscription = existing ?? await createSubscription();
  try {
    await registerSubscription(subscription);
  } catch (error) {
    if (existing === null) {
      try {
        await subscription.unsubscribe();
      } catch {
        // Keep the registration error even if local cleanup also fails.
      }
    }
    throw error;
  }
  return subscription;
}
