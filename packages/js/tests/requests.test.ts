/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- telegram
 */

/**
 * What Telegram actually receives.
 *
 * Every assertion below is about the request rather than the response, and
 * none of it touches the network: the transport is a stub that records what it
 * was handed.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { PreparedRequest } from "@particle-academy/fancy-connector-core";

import { telegramGetUpdates } from "../src/triggers/get-updates.js";

/** Capture the prepared request instead of sending it. */
function capture() {
  const seen: PreparedRequest[] = [];

  return {
    seen,
    transport: async (request: PreparedRequest) => {
      seen.push(request);

      return { status: 200, body: JSON.stringify({ id: "captured" }), headers: {} };
    },
  };
}

const CREDENTIALS = {
  "botToken": "test_botToken"
};

test("get_updates sends GET /getUpdates", async () => {
  const { seen, transport } = capture();

  await telegramGetUpdates({
    config: {
      "offset": 1000,
      "limit": 100,
      "allowedUpdates": "allowedUpdates-one, allowedUpdates-two"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.equal(seen.length, 1);
  assert.equal(seen[0]!.method, "GET");
  assert.ok(new URL(seen[0]!.url).pathname.endsWith("/getUpdates"), seen[0]!.url);

  assert.deepEqual(
    Object.fromEntries(new URL(seen[0]!.url).searchParams),
    {
      "offset": "1000",
      "limit": "100",
      "allowed_updates": "[\"allowedUpdates-one\",\"allowedUpdates-two\"]"
    },
  );
});

test("the credential is placed the way the provider wants it", async () => {
  const { seen, transport } = capture();

  await telegramGetUpdates({
    config: {
      "offset": 1000,
      "limit": 100,
      "allowedUpdates": "allowedUpdates-one, allowedUpdates-two"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.match(new URL(seen[0]!.url).pathname, new RegExp("^/bottest_botToken"));
  assert.equal(seen[0]!.headers.Authorization, undefined, "the token must not also be a header");
});

test("the sandbox estate is a further \"/test\" segment, and the mode decides it", async () => {
  const { seen, transport } = capture();

  await telegramGetUpdates({
    config: {
      "offset": 1000,
      "limit": 100,
      "allowedUpdates": "allowedUpdates-one, allowedUpdates-two"
    },
    credentials: CREDENTIALS,
    mode: "sandbox",
    transport,
  });

  assert.equal(
    new URL(seen[0]!.url).pathname,
    "/bottest_botToken/test/getUpdates",
  );
});

test("live mode does NOT carry the sandbox segment", async () => {
  // Asserted from the other side too, because a segment appended
  // unconditionally would pass the test above and send every real poll to
  // a test bot that has none of the chats.
  const { seen, transport } = capture();

  await telegramGetUpdates({
    config: {
      "offset": 1000,
      "limit": 100,
      "allowedUpdates": "allowedUpdates-one, allowedUpdates-two"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.doesNotMatch(new URL(seen[0]!.url).pathname, /\/test/);
});
