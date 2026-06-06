/**
 * Returns true when the Gmail API is fully configured via OAuth2 refresh token.
 * Falls back to accepting a raw GMAIL_ACCESS_TOKEN for backward compatibility.
 */
export const canUseGmailApi = (): boolean =>
  Boolean(
    (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) ||
    process.env.GMAIL_ACCESS_TOKEN
  );

type WaitForGmailMessageParams = {
  toEmail: string;
  subjectContains?: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory cache so we only refresh the access token once per process run
let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Returns a valid OAuth2 access token.
 * Uses the refresh token flow when GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN are set.
 * Falls back to the raw GMAIL_ACCESS_TOKEN env var for backward compatibility.
 */
const getAccessToken = async (): Promise<string> => {
  const rawToken = process.env.GMAIL_ACCESS_TOKEN;
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  // Prefer OAuth2 refresh flow
  if (clientId && clientSecret && refreshToken) {
    if (cachedAccessToken && Date.now() < tokenExpiresAt - 60_000) {
      return cachedAccessToken;
    }

    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Gmail token refresh failed (${response.status}): ${text}`);
    }

    const json = (await response.json()) as { access_token: string; expires_in: number };
    cachedAccessToken = json.access_token;
    tokenExpiresAt = Date.now() + json.expires_in * 1000;
    return cachedAccessToken;
  }

  // Legacy: raw access token
  if (rawToken) {
    return rawToken;
  }

  throw new Error(
    'Gmail API is not configured. Set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN in your .env file.'
  );
};

const listMessages = async (query: string): Promise<unknown[]> => {
  const token = await getAccessToken();

  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=5`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Gmail API list request failed: ${response.status} ${body}`);
  }

  const json = (await response.json()) as { messages?: unknown[] };
  return Array.isArray(json.messages) ? json.messages : [];
};

export const waitForGmailMessage = async ({
  toEmail,
  subjectContains = 'activation',
  timeoutMs = 60000,
  pollIntervalMs = 5000,
}: WaitForGmailMessageParams): Promise<boolean> => {
  const deadline = Date.now() + timeoutMs;
  const query = `to:${toEmail} newer_than:1d subject:${subjectContains}`;

  while (Date.now() < deadline) {
    const messages = await listMessages(query);
    if (messages.length > 0) {
      return true;
    }
    await sleep(pollIntervalMs);
  }

  return false;
};
