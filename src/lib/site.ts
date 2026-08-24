// Central place for launch-day values. Swap these when real links exist.
export const CONTACT_EMAIL = "kalexkalab@gmail.com";
export const PLAY_STORE_URL = ""; // TODO: paste Google Play link when live
export const APP_STORE_URL = ""; // TODO: paste App Store link when live

export function mailtoUrl(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

export function contactMailto(message: string, name: string, email: string): string {
  const subject = `Tirat AI website inquiry — ${name}`;
  const body = `${message}\n\n—\n${name}\n${email}`;
  return mailtoUrl(subject, body);
}

export const NAV_ANCHORS = [
  "problem",
  "how",
  "features",
  "download",
  "faq",
  "contact",
] as const;
