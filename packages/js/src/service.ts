/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/manifest.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/manifest.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- telegram
 */

/**
 * Telegram, as one service descriptor shared by every Telegram operation.
 *
 * @particle-academy/fancy-connector-core carries what is true of ALL
 * connectors. This carries what is true of Telegram: its base URL, its auth
 * scheme, its idempotency header, and its faker.
 *
 * ## The sandbox trap, written down where it is used
 *
 * Telegram's test environment is a genuinely SEPARATE ACCOUNT: you create a
 * new account inside it and register a new bot there, so the sandbox
 * credential is a different token rather than the same one pointed elsewhere.
 * The `/test` path segment is how you reach it; the account is what makes it
 * separate. Flood limits are NOT relaxed there, so it is a place to test, not
 * a place to hammer.
 */

import type { ConnectorMode, PreparedRequest, ServiceDescriptor } from "@particle-academy/fancy-connector-core";

import { telegramFaker } from "./faker.js";

/**
 * The connector API version this package was GENERATED against.
 *
 * A literal, never imported. An imported constant lets an upgrade rewrite the
 * very claim it exists to detect, after which the copy agrees with itself
 * forever.
 */
export const CONNECTOR_API_VERSION = 1;

export const TELEGRAM_BASE_URLS = {
  "live": "https://api.telegram.org",
  "sandbox": "https://api.telegram.org"
} as const;

/** Credential keys a remote call cannot proceed without. */
export const TELEGRAM_REQUIRES = [
  "botToken"
] as const;

/**
 * Apply Telegram's auth scheme to an outgoing request.
 *
 * The bot token is a PATH SEGMENT, not a header --
 * https://api.telegram.org/bot<token>/getUpdates -- and the test environment
 * is a further `/test` AFTER the token. So this is the first provider whose
 * auth and whose estate are the same decision expressed in the URL, which is
 * why `authorize` has always been handed the resolved mode. The token
 * therefore ends up in the request URL, where access logs and error reporters
 * will record it. That is Telegram's design, not ours; a host should keep its
 * own logging away from it.
 *
 * The mode is USED here: for this provider auth and estate are the same
 * decision expressed in the URL, which is what this parameter has always been
 * for.
 */
export function telegramAuthorize(
  credentials: Record<string, string | undefined>,
  request: PreparedRequest,
  mode: ConnectorMode,
): void {
  const url = new URL(request.url);

  // The estate is the SAME decision as the credential here, and it lives in
  // a further segment AFTER the token. A token pointed at a node marked
  // "sandbox" would otherwise reach the live bot, and succeed.
  const segment = mode === "sandbox"
    ? `/bot${credentials.botToken ?? ""}/test`
    : `/bot${credentials.botToken ?? ""}`;

  url.pathname = `${segment}${url.pathname}`;
  request.url = url.toString();
}

/** The Telegram service, for the TypeScript runtime. */
export const TELEGRAM: ServiceDescriptor = {
  service: "telegram",
  title: "Telegram",
  sandbox: "separate-account",
  baseUrls: { ...TELEGRAM_BASE_URLS },
  requires: [...TELEGRAM_REQUIRES],
  authorize: telegramAuthorize,
  faker: telegramFaker,
};
