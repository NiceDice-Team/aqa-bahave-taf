import { APIRequestContext } from '@playwright/test';
import { config } from '../config/environment';

interface MailcatcherMessage {
  id?: number | string;
  ID?: string;
  subject?: string;
  recipients?: string[];
  to?: string | string[];
  To?: Array<{ Mailbox?: string; Domain?: string }>;
  Content?: {
    Body?: string;
    Headers?: Record<string, string[]>;
  };
}

interface MailhogMessageList {
  items?: MailcatcherMessage[];
}

const activationUrlPattern = /https?:\/\/[^\s<>"']+\/api\/users\/activate\/[^\s<>"']+/i;

const addressesFor = (message: MailcatcherMessage): string[] => {
  const to = Array.isArray(message.to) ? message.to : message.to ? [message.to] : [];
  const mailhogTo = (message.To ?? []).map(({ Mailbox = '', Domain = '' }) => `${Mailbox}@${Domain}`);
  const headerTo = message.Content?.Headers?.To ?? [];
  return [...(message.recipients ?? []), ...to, ...mailhogTo, ...headerTo].map((address) => address.toLowerCase());
};

const getMessages = async (request: APIRequestContext): Promise<MailcatcherMessage[]> => {
  const mailhogResponse = await request.get(`${config.mailcatcherBaseUrl}/api/v2/messages?limit=100`);
  if (mailhogResponse.ok()) {
    return ((await mailhogResponse.json()) as MailhogMessageList).items ?? [];
  }

  const mailcatcherResponse = await request.get(`${config.mailcatcherBaseUrl}/messages`);
  if (!mailcatcherResponse.ok()) {
    throw new Error(
      `Mail server API returned HTTP ${mailhogResponse.status()} (MailHog) and ${mailcatcherResponse.status()} (Mailcatcher)`
    );
  }
  return (await mailcatcherResponse.json()) as MailcatcherMessage[];
};

const getMessageBody = async (request: APIRequestContext, message: MailcatcherMessage): Promise<string> => {
  if (message.Content?.Body) return message.Content.Body;

  if (message.id === undefined) throw new Error('Mailcatcher message does not contain an id');
  const response = await request.get(`${config.mailcatcherBaseUrl}/messages/${message.id}.plain`);
  if (!response.ok()) throw new Error(`Mailcatcher message returned HTTP ${response.status()}`);
  return response.text();
};

export async function activateAccountFromMailcatcher(
  request: APIRequestContext,
  email: string,
  timeoutMs: number = 15000
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const messages = await getMessages(request);
    const message = messages.find((item) =>
      addressesFor(item).some((address) => address.includes(email.toLowerCase()))
    );

    if (message) {
      const activationUrl = (await getMessageBody(request, message))
        .match(activationUrlPattern)?.[0]
        ?.replace(/[).,]+$/, '');
      const messageId = message.id ?? message.ID ?? 'unknown';
      if (!activationUrl) throw new Error(`Activation URL was not found in mail message ${messageId}`);

      const parsed = new URL(activationUrl);
      const configuredApi = new URL(config.apiBaseUrl);
      const allowedHosts = ['localhost', '127.0.0.1', '::1', 'backend', configuredApi.hostname];
      if (!allowedHosts.includes(parsed.hostname)) {
        throw new Error(`Refusing activation URL host outside the configured API: ${parsed.hostname}`);
      }

      const activationTarget = new URL(parsed.pathname + parsed.search, configuredApi).toString();
      const activationResponse = await request.get(activationTarget);
      if (!activationResponse.ok()) {
        throw new Error(`Activation URL returned HTTP ${activationResponse.status()}`);
      }
      const result = (await activationResponse.json()) as { message?: string };
      return /successfully activated/i.test(result.message ?? '');
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`No activation email for ${email} arrived in the configured mail server within ${timeoutMs}ms`);
}
