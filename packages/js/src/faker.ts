/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/fixtures/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/fixtures/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- telegram
 */

/**
 * The Telegram faker.
 *
 * Shapes, not behaviour: the goal is that a downstream node sees the field
 * NAMES Telegram actually publishes, so an author can wire {{ $json.data.id }}
 * against a fake and have it keep working against the real thing.
 *
 * Deterministic — same inputs, same output. A faker returning a fresh uuid
 * every call cannot be asserted on, so its fixtures degrade to "it did not
 * throw", which is the assertion that catches nothing.
 */

import type { ConnectorFaker, FakeRequest } from "@particle-academy/fancy-connector-core";

function fakeGetUpdates({ config, fake }: FakeRequest): unknown {
  const boundChatId = fake.int(100000000, 999999999);

  return {
    "ok": true,
    "result": [
      {
        "update_id": fake.int(100000, 999999),
        "message": {
          "message_id": fake.int(1, 9999),
          "date": 1767225600,
          "text": (config.sampleText !== undefined && config.sampleText !== null && config.sampleText !== "" ? String(config.sampleText) : "hello from the faker"),
          "chat": {
            "id": boundChatId,
            "type": "private",
            "first_name": "Ada",
            "username": "ada_example",
          },
          "from": {
            "id": boundChatId,
            "is_bot": false,
            "first_name": "Ada",
            "username": "ada_example",
            "language_code": "en",
          },
        },
      },
    ],
  };
}

export const telegramFaker: ConnectorFaker = (operation, request) => {
  switch (operation) {
    case "get_updates":
      return fakeGetUpdates(request);

    default:
      // A faker asked for an operation it has no shape for must SAY so. Making
      // something up would produce a green run whose output silently has none
      // of the fields the author is about to reference.
      throw new Error(
        `telegram: no fake response is defined for "${operation}". ` +
          "Add a fixture under provider/fixtures/ and regenerate — a connector without a faker " +
          "cannot be developed against, tested, or demonstrated.",
      );
  }
};
