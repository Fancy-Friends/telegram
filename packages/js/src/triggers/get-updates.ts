/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/triggers/get-updates.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/triggers/get-updates.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- telegram
 */

/**
 * Telegram's poll trigger — the delivery contract.
 *
 * A POLL trigger, so there is no signature and no route: Telegram does not
 * push, the host asks on a schedule and persists a cursor between calls.
 * Nothing queues what a stopped poller did not collect, which is why that
 * obligation is written down rather than assumed.
 */

import {
  callConnector,
  type ConnectorResult,
  type RequestedMode,
  type Transport,
  type TriggerDescriptor,
} from "@particle-academy/fancy-connector-core";
import { telegramFaker } from "../faker.js";
import { TELEGRAM } from "../service.js";

export const TELEGRAM_GET_UPDATES: TriggerDescriptor = {
  service: "telegram",
  operation: "get_updates",
  delivery: "poll",
  setup:
    "The host polls getUpdates on a schedule and persists the `offset` cursor between calls, passing the last `cursor` back in — Telegram queues nothing once an offset has acknowledged it, so a lost cursor is lost updates. getUpdates and setWebhook are MUTUALLY EXCLUSIVE for one bot: a host running both gets neither.",
  minPollSeconds: 1,
  faker: telegramFaker,
};

/**
 * Poll Telegram once.
 *
 * GET /getUpdates — https://core.telegram.org/bots/api#getupdates
 *
 * In `fake` mode this resolves to the faker, so the node is runnable on a
 * canvas before any credential exists — with the same envelope a real poll
 * returns.
 */

export const GET_UPDATES_OPERATION = "get_updates";

export type GetUpdatesOptions = {
  /** The node's resolved config. Keys: offset, limit, allowedUpdates, sampleText. */
  config: Record<string, unknown>;
  credentials?: Record<string, string | undefined>;
  mode?: RequestedMode;
  connectionId?: string | null;
  input?: unknown;
  attempts?: number;
  /** Override the transport. The only way to exercise this without a network. */
  transport?: Transport;
};

export async function telegramGetUpdates(options: GetUpdatesOptions): Promise<ConnectorResult> {
  const config = options.config ?? {};

  {
    const n = Number(config.offset);
    const given = config.offset !== undefined && config.offset !== null && config.offset !== "";
    if (given && !(Number.isInteger(n))) {
      throw new Error(
        `get_updates: "offset" must be a integer, got ${JSON.stringify(config.offset)}.`,
      );
    }
  }

  {
    const n = Number(config.limit);
    const given = config.limit !== undefined && config.limit !== null && config.limit !== "";
    if (given && !(Number.isInteger(n) && n >= 1 && n <= 100)) {
      throw new Error(
        `get_updates: "limit" must be a integer, got ${JSON.stringify(config.limit)}.`,
      );
    }
  }

  return callConnector(TELEGRAM, {
    operation: GET_UPDATES_OPERATION,
    config,
    input: options.input,
    ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
    ...(options.mode === undefined ? {} : { mode: options.mode }),
    ...(options.connectionId === undefined ? {} : { connectionId: options.connectionId }),
    ...(options.attempts === undefined ? {} : { attempts: options.attempts }),
    ...(options.transport === undefined ? {} : { transport: options.transport }),
    request: {
      method: "GET",
      path: "/getUpdates",
      query: {
        ...(config.offset !== undefined && config.offset !== null && config.offset !== "" ? { "offset": Math.trunc(Number(config.offset)) } : {}),
        "limit": config.limit !== undefined && config.limit !== null && config.limit !== "" ? Math.trunc(Number(config.limit)) : 100,
        ...(config.allowedUpdates !== undefined && config.allowedUpdates !== null && config.allowedUpdates !== "" ? { "allowed_updates": JSON.stringify(allowedUpdatesList(config.allowedUpdates)) } : {}),
      },
    },
  });
}

/** One value, a ","-separated string, or an array — all end up a list. */
function allowedUpdatesList(value: unknown): string[] {
  const items = Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value.split(",")
      : [];

  return items.map((item) => item.trim()).filter(Boolean);
}
