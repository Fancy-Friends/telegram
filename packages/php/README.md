# Telegram

Telegram for [fancy-flow][flow] — as **four imported, versioned packages**, one
per runtime. Not vendored source: a copy cannot be upgraded, and third-party APIs
change.

[flow]: https://github.com/Particle-Academy/fancy-flow

| Runtime | Package | Install |
|---|---|---|
| Authoring surface (every host) | `@particle-academy/telegram-ui` | `npm install @particle-academy/telegram-ui` |
| Node | `@particle-academy/telegram-js` | `npm install @particle-academy/telegram-js` |
| PHP 8.4+ | `particle-academy/telegram-php` | `composer require particle-academy/telegram-php` |
| Python 3.11+ | `fancy-telegram` | `pip install fancy-telegram` |

The `ui` package is the editor surface and is React on every host — a PHP or
Python project installs it *and* its own runtime package, and never the `js` one.

## What it costs you

One dependency: `@particle-academy/fancy-connector-core` (or
`particle-academy/fancy-connector-core` on Composer), which the `js` and `php`
packages pull in themselves. The Python package has **zero** runtime
dependencies.

**No Telegram SDK.** Plain HTTP, deliberately: a vendor SDK is third-party code
subject to the kit's full approval bar, and one per provider is hundreds of
dependencies nobody is tracking.

## Setting it up

Everything below is generated from `provider/manifest.json`, so it cannot disagree with what the packages do.

### Credentials

A Telegram connection holds 1 value.

Every value here is `account` scope: one per connected account, not one per installation.

| Field | Scope | Secret | Where it comes from |
|---|---|---|---|
| **Bot token** | per connected account | **secret** | From @BotFather — 123456:ABC-DEF… . A bot registered in the test environment is a DIFFERENT bot with a different token; the same token does not reach both. |

### The estate

Telegram has a test estate on the same host, reached with credentials from a SEPARATE test account you register. Selecting sandbox mode uses those credentials.

> Telegram's test environment is a genuinely SEPARATE ACCOUNT: you create a new account inside it and register a new bot there, so the sandbox credential is a different token rather than the same one pointed elsewhere. The `/test` path segment is how you reach it; the account is what makes it separate. Flood limits are NOT relaxed there, so it is a place to test, not a place to hammer.

## What it can do

### Triggers

#### `get_updates` — Telegram message

Start a run when a Telegram bot receives an update (long polling, not a webhook).

Polls Telegram, no more often than every 1 seconds.

**You have to set this up with the provider first:**

The host polls getUpdates on a schedule and persists the `offset` cursor between calls, passing the last `cursor` back in — Telegram queues nothing once an offset has acknowledged it, so a lost cursor is lost updates. getUpdates and setWebhook are MUTUALLY EXCLUSIVE for one bot: a host running both gets neither.

## Run it before you have credentials

Every operation ships a **faker**, whether or not Telegram has a sandbox. Set a
node's mode to `fake` and it returns the shape Telegram actually publishes — the
same field names, deterministically — so you can wire the downstream nodes before
touching an account, a key, or a network.

## This repository is generated

`provider/` is the source. Everything under `packages/` is emitted from it and
**must not be hand-edited** — CI regenerates and diffs on every push, and the
next protocol sync destroys anything it finds. See [`AGENTS.md`](AGENTS.md).

## Two namespaces, which do not match on purpose

The repo is `github.com/Fancy-Friends/telegram`; the packages publish under
`particle-academy`. Nothing derives one from the other — the names come from
weaver's `friends.json` and nowhere else.

## Licence

MIT.
