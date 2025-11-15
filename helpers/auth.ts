import { Page } from '@playwright/test';

export function applyMockAuth(page: Page, opts?: { email?: string; name?: string; id?: number }) {
  const user = {
    id: opts?.id ?? 1,
    name: opts?.name ?? 'Test User',
    email: opts?.email ?? 'test@example.com',
  };

  // Stub the NextAuth session endpoint used by the frontend to indicate an authenticated user
  // Tests may call this helper in their beforeEach to opt-in to authenticated state.
  void page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user,
        expires: '2099-12-31T23:59:59.000Z'
      }),
    });
  });
}

export default applyMockAuth;
