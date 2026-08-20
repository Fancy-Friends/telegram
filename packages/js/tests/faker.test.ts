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
 * The golden fixtures.
 *
 * Deterministic on purpose: the same seed produces the same bytes in
 * TypeScript, PHP and Python, so this file and its twins in the other packages
 * assert the SAME values. That turns the faker into a parity test rather than
 * a convenience — which matters, because cross-runtime drift does not fail
 * loudly. It completes, down one path, with no error.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { fakeRequest } from "@particle-academy/fancy-connector-core";

import { telegramFaker } from "../src/faker.js";

test("get_updates fakes the shape Telegram publishes", () => {
  const config = {
    "limit": 100,
    "sampleText": "hello from the faker"
  };

  const faked = telegramFaker("get_updates", fakeRequest("telegram", "get_updates", config));

  assert.deepEqual(faked, {
    "ok": true,
    "result": [
      {
        "update_id": 847027,
        "message": {
          "message_id": 7730,
          "date": 1767225600,
          "text": "hello from the faker",
          "chat": {
            "id": 771587507,
            "type": "private",
            "first_name": "Ada",
            "username": "ada_example"
          },
          "from": {
            "id": 771587507,
            "is_bot": false,
            "first_name": "Ada",
            "username": "ada_example",
            "language_code": "en"
          }
        }
      }
    ]
  });
});

test("an operation with no fixture throws rather than inventing a shape", () => {
  assert.throws(() => telegramFaker("no_such_operation", fakeRequest("telegram", "no_such_operation", {})), /no fake response/);
});
