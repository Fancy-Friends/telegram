/*
 * Telegram — the published npm packages.
 *
 * GENERATED — do not edit. Fix weaver's template/ and regenerate.
 *
 * This runs against the PUBLISHED package, installed by name from the
 * registry into a project that has never seen this repo. Every other test
 * here imports from ../src and therefore cannot see the packaging.
 */

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { telegramFaker } from "@particle-academy/telegram-js";
import { TELEGRAM_KINDS } from "@particle-academy/telegram-ui";
import { fakeRequest } from "@particle-academy/fancy-connector-core";

/*
 * WHERE did that come from?
 *
 * Node resolves a bare specifier from the importing MODULE's directory, not
 * the working directory. So running this script across from a checkout
 * resolves out of the REPO's node_modules and silently tests the source
 * again — which it did, and passed, before CI caught it.
 *
 * Two things are checked, because neither is enough alone: that the package
 * came from an INSTALL rather than from source, and that this script is not
 * sitting inside the provider repo it is supposed to be testing.
 */
const resolved = import.meta.resolve("@particle-academy/telegram-js");
const here = dirname(fileURLToPath(import.meta.url));

assert.ok(
  !existsSync(join(here, "..", "packages", "js", "package.json")),
  `${here} is inside the provider repo, so a bare import resolves the repo's ` +
    "own node_modules. Copy this script into a project that installed the " +
    "published package and run it there.",
);
assert.match(resolved, /node_modules/, `resolved ${resolved}, which is not an installed package`);
console.log(`  ok   resolved from ${resolved}`);

const GOLDENS = [
  {
    "operation": "get_updates",
    "config": {
      "limit": 100,
      "sampleText": "hello from the faker"
    },
    "expected": {
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
    }
  }
];

for (const { operation, config, expected } of GOLDENS) {
  const faked = telegramFaker(operation, fakeRequest("telegram", operation, config));

  assert.deepEqual(
    faked,
    expected,
    `the PUBLISHED package produced different bytes for ${operation} than the repo does`,
  );
  console.log(`  ok   ${operation}`);
}

// The ui package is a separate tarball, and js depends on it by its
// published name — so this also proves that dependency resolves.
assert.equal(TELEGRAM_KINDS.length, 1);
for (const kind of TELEGRAM_KINDS) {
  const keys = kind.configSchema.map((field) => field.key);
  assert.equal(keys[0], "connection");
  assert.equal(keys[1], "mode");
  assert.ok(kind.outputShape.length > 0, `${kind.name} declares no output shape`);
}
console.log(`  ok   ui kinds resolve from ${"@particle-academy/telegram-ui"}`);

console.log(`\n  ${GOLDENS.length} operations verified against the published packages.`);
