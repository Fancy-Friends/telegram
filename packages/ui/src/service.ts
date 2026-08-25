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
 * Telegram's identity on the authoring surface, shared by every Telegram node.
 *
 * This file must import nothing from the js package: a PHP or Python project
 * installs the ui package and never that one, and the import would be a
 * dangling module the moment it did.
 *
 * ## The sandbox trap
 *
 * Telegram's test environment is a genuinely SEPARATE ACCOUNT: you create a
 * new account inside it and register a new bot there, so the sandbox
 * credential is a different token rather than the same one pointed elsewhere.
 * The `/test` path segment is how you reach it; the account is what makes it
 * separate. Flood limits are NOT relaxed there, so it is a place to test, not
 * a place to hammer.
 */

import type { ConnectorDomain, ConnectorMeta } from "@particle-academy/fancy-flow/connectors";

/**
 * The connector API version this package was GENERATED against.
 *
 * A literal, never imported — an imported constant lets an upgrade rewrite the
 * very claim it exists to detect.
 */
export const CONNECTOR_API_VERSION = 1;

/** The parts of a connector's identity that belong to the SERVICE, not the node. */
export const TELEGRAM_SERVICE = {
  service: "telegram",
  serviceTitle: "Telegram",
  domain: "messaging",
  sandbox: "separate-account",
} as const satisfies Pick<ConnectorMeta, "service" | "serviceTitle" | "domain" | "sandbox">;

/**
 * Every connector domain weaver knows, pinned against fancy-flow's union.
 *
 * A closed set copied into three codebases stays correct only while something
 * MAKES it: this line fails to compile the moment weaver carries a value
 * fancy-flow does not, including the values no provider uses yet.
 */
const WEAVER_DOMAINS: readonly ConnectorDomain[] = [
  "payments",
  "commerce",
  "messaging",
  "email",
  "crm",
  "support",
  "storage",
  "calendar",
  "productivity",
  "database",
  "devtools",
  "analytics",
  "marketing",
  "ai",
  "forms",
  "hr",
  "geo"
];
void WEAVER_DOMAINS;

/** The credentials a Telegram connection holds. */
export const TELEGRAM_CREDENTIALS = [
  {
    "key": "botToken",
    "label": "Bot token",
    "scope": "account",
    "secret": true,
    "help": "From @BotFather — 123456:ABC-DEF… . A bot registered in the test environment is a DIFFERENT bot with a different token; the same token does not reach both."
  }
] as const;

/** Build a Telegram node's connector metadata from the operation it performs. */
export function telegramMeta(
  role: ConnectorMeta["role"],
  operation: string,
  docs: string,
): ConnectorMeta {
  return { ...TELEGRAM_SERVICE, role, operation, docs };
}
