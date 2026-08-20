# Changelog

All notable changes to `@particle-academy/telegram-ui`,
`@particle-academy/telegram-js`, `particle-academy/telegram-php` and
`fancy-telegram`.

The four packages share one version, because they are generated from one
`provider/` definition and a version that meant something different in each
would be a version nobody could reason about.

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
