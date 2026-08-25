# Changelog

All notable changes to `@particle-academy/telegram-ui`,
`@particle-academy/telegram-js`, `particle-academy/telegram-php` and
`fancy-telegram`.

The four packages share one version, because they are generated from one
`provider/` definition and a version that meant something different in each
would be a version nobody could reason about.

## [0.3.0] — 2026-08-24

### Added

- **The README now says how to SET THIS CONNECTOR UP**, in the package itself.

Until now it explained what the four packages are, what they cost and why the
repo is generated — and said nothing about credentials, scopes, sandboxes or
operations. Somebody who installed it could not learn from it which credentials
a connection needs, where a human GETS them, which scopes to request, or what
the connector can actually do. All of that was already in the definition; the
one document a consumer reads was the one that omitted everything actionable.

The new **Setting it up** section carries:

- every credential, with the text saying where the value comes from, whether it
  is **per installation** or **per connected account**, and whether it is secret;
- the OAuth authorize and token URLs and the exact scopes, verbatim;
- the access-token lifetime, and where refresh tokens ROTATE, the two things a
  host must not do — retry a failed refresh, or refresh concurrently — because a
  replay revokes the entire grant and nothing in the failure says why;
- the estate in this provider's own terms, including the cases where a
  successful-looking run reaches nobody, or reaches the real one;
- every action and trigger with its method, path, inputs, and whether it is safe
  to replay;
- a trigger's provider-side setup, which nobody can derive from anything else.

It is **generated from `provider/manifest.json`**, so it cannot drift from what
the packages do — which is the point at a few hundred providers, where a
hand-written setup section is a few hundred documents going quietly stale.

No code changed. This release exists because a registry and an installing agent
read the PUBLISHED artifact, and the artifact carried the old README.

## [0.2.0] — 2026-08-24

### Changed

- **`@particle-academy/telegram-ui` is now an OPTIONAL PEER dependency of `@particle-academy/telegram-js`, not a hard one.**

`./flow` needs it; nothing else does. It was a hard dependency, and because
`@particle-academy/telegram-ui` itself peer-depends on `fancy-flow` — which npm 7+ installs
automatically — `npm install @particle-academy/telegram-js` pulled the **entire flow engine**
onto disk for a consumer who only wanted to call the API. Roughly **18 MB
became 874 KB**, and the package works exactly as before:

```js
import { telegram… } from "@particle-academy/telegram-js";
// an injected transport, no flow engine anywhere
```

**This is breaking if you use `@particle-academy/telegram-js/flow`.** Add `@particle-academy/telegram-ui` to your own
dependencies — it was always being installed for you, and now it is declared.
Everything importing only the main entry point is unaffected.

The fix is on this edge rather than on `@particle-academy/telegram-ui` → `fancy-flow`: the ui package
genuinely requires fancy-flow, since it calls `defineConnectorKind`, and marking
that peer optional would be a lie about what it needs.

## [0.1.0] — 2026-08-20

First release. Ported from the vendored connector at
`px-ui-sandbox/resources/flow-nodes/_telegram`.

### Added

- `get_updates` — start a run when a bot receives an update. A **poll**
  trigger, not a webhook: `GET /getUpdates` with a persisted `offset` cursor.
- A faker for it, so the node runs on a canvas before any bot exists.

### The reason this provider exists in the set

**It breaks three assumptions Stripe never tested.**

1. **The trigger is not a webhook.** Telegram offers `getUpdates` long polling
   OR `setWebhook`, never both for one bot. So the host's obligation here is a
   schedule and a persisted cursor rather than a route and a signature — and a
   poll trigger *calls* the provider, where a webhook trigger only republishes
   what the host already verified. `delivery` was a declaration rather than an
   assumption for exactly this case.

2. **The credential is a path segment.** `https://api.telegram.org/bot<token>/getUpdates`
   — and the test environment is a further `/test` after the token. Auth and
   estate are the same decision expressed in the URL, which is why `authorize`
   has always been handed the resolved mode even though Stripe never used it.

3. **A rejection arrives as HTTP 200.** Telegram answers `200` with
   `{"ok": false, "description": "..."}`. A status check alone reads that as
   success and publishes an empty batch — a poll that silently finds nothing,
   forever.

### The cursor is the part that bites

`offset` means "the first update id I have NOT handled", so the next cursor is
the highest `update_id` seen plus one. Off by one in either direction is a real
bug with no error attached: **too low replays updates forever, too high drops
one silently**. The trigger computes it and publishes it as `cursor`; the host
must persist it, because nothing else will.

An empty poll is the NORMAL case and gets its own `empty` port, so the main
path keeps meaning "something happened" while the host still has somewhere to
hang cursor bookkeeping.

### On not taking a dependency

There is no official Telegram SDK in any language. Calling the REST API
directly is therefore the correct choice here rather than a shortcut — the
alternative is a community wrapper, which is exactly the dependency the kit's
rules say not to take on a consumer's behalf.

[0.1.0]: https://github.com/Fancy-Friends/telegram/releases/tag/v0.1.0
[0.2.0]: https://github.com/Fancy-Friends/telegram/releases/tag/v0.2.0
[0.3.0]: https://github.com/Fancy-Friends/telegram/releases/tag/v0.3.0
