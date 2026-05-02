const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmailValid = (email: string): boolean => EMAIL_REGEX.test(String(email || '').trim());

export const isGmailAddress = (email: string): boolean => /@gmail\.com$/i.test(String(email || '').trim());

export const isGmailPlusAlias = (email: string): boolean => /^[^\s@+]+\+[^\s@]+@gmail\.com$/i.test(String(email || '').trim());

export const toGmailPlusAlias = (baseEmail: string, suffix?: string): string => {
  const normalizedBase = String(baseEmail || '').trim().toLowerCase();
  if (!isGmailAddress(normalizedBase)) {
    throw new Error(`Base email must be gmail.com to create plus alias: ${baseEmail}`);
  }

  const [localPart] = normalizedBase.split('@');
  const cleanLocal = localPart.split('+')[0];
  const aliasSuffix = suffix || `${Date.now()}`;
  return `${cleanLocal}+${aliasSuffix}@gmail.com`;
};

export const getPreferredGmailBase = (testUserEmail?: string): string => {
  const configured = (process.env.GMAIL_TEST_BASE_EMAIL || '').trim().toLowerCase();
  if (configured && isGmailAddress(configured)) {
    return configured;
  }

  const fromTestUser = String(testUserEmail || '').trim().toLowerCase();
  if (fromTestUser && isGmailAddress(fromTestUser)) {
    return fromTestUser;
  }

  return 'tchallengevasyalex@gmail.com';
};

export const resolveWildcardEmail = (template: string, testUserEmail?: string): string => {
  const normalized = String(template || '').trim();
  if (!normalized.includes('*')) {
    return normalized;
  }

  const suffix = `${Date.now()}`;

  if (isGmailAddress(normalized)) {
    return toGmailPlusAlias(normalized, suffix);
  }

  const gmailBase = getPreferredGmailBase(testUserEmail);
  if (/example\.com$/i.test(normalized) || /@gmail\.com$/i.test(gmailBase)) {
    return toGmailPlusAlias(gmailBase, suffix);
  }

  return normalized.replace('*', suffix);
};
