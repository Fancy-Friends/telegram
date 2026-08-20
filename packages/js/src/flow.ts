/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/ + triggers/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/ + triggers/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- telegram
 */

/**
 * Telegram's node kinds with their TypeScript executors attached — for hosts
 * that EXECUTE on TS.
 *
 * The authoring surface in @particle-academy/telegram-ui carries no executor:
 * the editor is React on every host, so a PHP or Python project installs the
 * ui package and never this one.
 */

import type { NodeExecutor, NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import {
  idempotencyKeyFor,
  NO_IDEMPOTENCY_KEY_WARNING,
  resolveConnection,
  triggerEvent,
  type RequestedMode,
} from "@particle-academy/fancy-connector-core";
import { TELEGRAM } from "./service.js";

import {
  telegramUpdatesTriggerKind,
} from "@particle-academy/telegram-ui";

import { TELEGRAM_GET_UPDATES, telegramGetUpdates } from "./triggers/get-updates.js";

export const telegramUpdatesTriggerExecutor: NodeExecutor = async (ctx) => {
  const config = ((ctx.node.data as { config?: Record<string, unknown> })?.config ?? {});

  const result = await telegramGetUpdates({ config });
  const data = result.data as Record<string, unknown> | undefined;

  // Telegram answers HTTP 200 with `{ok: false}` for an application-level
  // failure. A status check alone reads that as success and publishes an
  // empty batch — a poll that silently finds nothing, forever, which is
  // indistinguishable from a quiet channel. The connector core cannot know
  // this; it is exactly the per-provider knowledge a definition exists to
  // hold.
  if (data?.ok === false) {
    throw new Error(
      `get_updates: getUpdates was rejected — ` +
        String(data.description ?? "no reason given"),
    );
  }

  const items = Array.isArray(data?.result) ? (data.result as unknown[]) : [];

  // `offset` means "the first one I have NOT handled", so the next cursor
  // is the highest id seen plus one. Off by one in either direction is a
  // real bug with no error attached: too low replays every item forever,
  // too high drops one silently. The HOST persists this and passes it back
  // in — nothing else will.
  const seen = items
    .map((item) => (item as { update_id?: unknown })?.update_id)
    .filter((id): id is number => typeof id === "number");
  const previous = config.offset === undefined || config.offset === null || config.offset === ""
    ? undefined
    : Number(config.offset);
  const cursor = seen.length === 0 ? previous : Math.max(...seen) + 1;

  const value = {
    mode: result.mode,
    connection: result.connection,
    cursor,
    count: items.length,
    updates: items,
    update: items[0] ?? null,
  };

  // A poll that found nothing is the NORMAL case, not a failure. Routing
  // it to its own port keeps the main path meaning "something happened",
  // and still gives the host somewhere to hang its cursor bookkeeping.
  if (items.length === 0) {
    return { __port: "empty", value };
  }

  ctx.emit({
    type: "log",
    level: "info",
    nodeId: ctx.node.id,
    message: `telegram: ${items.length} item(s), next cursor ${cursor} (${result.mode})`,
  });

  return { __port: "out", value };
};

/** The kinds a TypeScript host registers. */
export const TELEGRAM_RUNNABLE_KINDS: NodeKindDefinition[] = [
  { ...telegramUpdatesTriggerKind, executor: telegramUpdatesTriggerExecutor },
];
