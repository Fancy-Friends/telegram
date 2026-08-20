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
 * Telegram message — Start a run when a Telegram bot receives an update (long
 * polling, not a webhook).
 *
 * https://core.telegram.org/bots/api#getupdates
 *
 * Delivery: poll. The host polls getUpdates on a schedule and persists the
 * `offset` cursor between calls, passing the last `cursor` back in — Telegram
 * queues nothing once an offset has acknowledged it, so a lost cursor is lost
 * updates. getUpdates and setWebhook are MUTUALLY EXCLUSIVE for one bot: a
 * host running both gets neither.
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { telegramMeta } from "../service.js";

export const TELEGRAM_UPDATES_TRIGGER_KIND = "@particle-academy/telegram_updates_trigger";
export const TELEGRAM_UPDATES_TRIGGER_OPERATION = "get_updates";

export const TELEGRAM_UPDATES_TRIGGER_META = telegramMeta("trigger", "a new message", "https://core.telegram.org/bots/api#getupdates");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const TELEGRAM_UPDATES_TRIGGER_OUTPUT: OutputField[] = [
  {
    "path": "mode",
    "type": "string",
    "description": "Which estate this ran against: fake, sandbox or live."
  },
  {
    "path": "connection",
    "type": "string",
    "description": "The connection id that was used."
  },
  {
    "path": "cursor",
    "type": "number",
    "description": "The next `offset` to poll with. The HOST must persist it — nothing else will."
  },
  {
    "path": "count",
    "type": "number",
    "description": "How many updates this poll returned."
  },
  {
    "path": "updates",
    "type": "array",
    "description": "The raw update envelopes, newest last."
  },
  {
    "path": "update.update_id",
    "type": "number",
    "description": "Id of the first update in this batch."
  },
  {
    "path": "update.message.text",
    "type": "string",
    "description": "Message text, when the update is a message."
  },
  {
    "path": "update.message.chat.id",
    "type": "number",
    "description": "Chat to reply into."
  },
  {
    "path": "update.message.from.username",
    "type": "string",
    "description": "Who sent it."
  }
];

export const telegramUpdatesTriggerKind: NodeKindDefinition = defineConnectorKind(TELEGRAM_UPDATES_TRIGGER_META, {
  name: TELEGRAM_UPDATES_TRIGGER_KIND,
  aliases: ["telegram_updates_trigger"],
  label: "Telegram message",
  description: "Start a run when a Telegram bot receives an update (long polling, not a webhook).",
  icon: "✈",
  inputs: [],
  outputs: [{ id: "out", label: "updates" }, { id: "empty", label: "nothing new" }],
  sideEffects: "none",
  outputShape: TELEGRAM_UPDATES_TRIGGER_OUTPUT,
  configSchema: [
    {
      "type": "number",
      "key": "offset",
      "label": "Offset",
      "min": 0,
      "description": "The first update id NOT yet handled. The HOST persists this between polls and passes the last `cursor` back in — Telegram queues nothing once an offset has acknowledged it."
    },
    {
      "type": "number",
      "key": "limit",
      "label": "Limit",
      "min": 1,
      "max": 100,
      "default": 100,
      "description": "Updates per poll. Telegram's maximum is 100."
    },
    {
      "type": "text",
      "key": "allowedUpdates",
      "label": "Update types",
      "placeholder": "message, callback_query",
      "description": "Comma separated. Blank means every type except the chat_member ones, which Telegram requires you to ask for explicitly."
    },
    {
      "type": "text",
      "key": "sampleText",
      "label": "Sample message (fake mode)",
      "default": "hello from the faker",
      "description": "What the faked update says, so the downstream nodes can be wired before any bot exists."
    }
  ],
  defaultConfig: {
    "mode": "auto",
    "limit": 100,
    "sampleText": "hello from the faker"
  },
  renderBody: ({ config }) =>
    summarize(TELEGRAM_UPDATES_TRIGGER_META, config as Record<string, unknown>, "a new message"),
});
