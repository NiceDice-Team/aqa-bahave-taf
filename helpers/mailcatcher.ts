import { APIRequestContext } from '@playwright/test';
import { config } from '../config/environment';

interface MailcatcherMessage {
  id: number;
  subject?: string;
  recipients?: string[];
  to?: string | string[];
}

const activationUrlPattern = /https?:\/\/[^\s<>"']+\/api\/users\/activate\/[^\s<>"']+/i;

const addressesFor = (message: MailcatcherMessage): string[] => {
  const to = Array.isArray(message.to) ? message.to : message.to ? [message.to] : [];
  return [...(message.recipients ?? []), ...to].map((address) => address.toLowerCase());
};

export async function activateAccountFromMailcatcher(
  request: APIRequestContext,
  email: string,
  timeoutMs: number = 15000
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const listResponse = await request.get(`${config.mailcatcherBaseUrl}/messages`);
    if (!listResponse.ok()) throw new Error(`Mailcatcher returned HTTP ${listResponse.status()}`);

    const messages = (await listResponse.json()) as MailcatcherMessage[];
    const message = messages.find((item) =>
      addressesFor(item).some((address) => address.includes(email.toLowerCase()))
    );

    if (message) {
      const bodyResponse = await request.get(`${config.mailcatcherBaseUrl}/messages/${message.id}.plain`);
      if (!bodyResponse.ok()) throw new Error(`Mailcatcher message returned HTTP ${bodyResponse.status()}`);
      const activationUrl = (await bodyResponse.text()).match(activationUrlPattern)?.[0]?.replace(/[).,]+$/, '');
      if (!activationUrl) throw new Error(`Activation URL was not found in Mailcatcher message ${message.id}`);

      const parsed = new URL(activationUrl);
      if (!['localhost', '127.0.0.1', '::1', 'backend'].includes(parsed.hostname)) {
        throw new Error(`Refusing non-local activation URL host: ${parsed.hostname}`);
      }

      const activationResponse = await request.get(activationUrl);
      if (!activationResponse.ok()) {
        throw new Error(`Activation URL returned HTTP ${activationResponse.status()}`);
      }
      const result = (await activationResponse.json()) as { message?: string };
      return /successfully activated/i.test(result.message ?? '');
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`No activation email for ${email} arrived in local Mailcatcher within ${timeoutMs}ms`);
}
