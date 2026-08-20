# GENERATED FILE — do not edit.
#
# Emitted from provider/triggers/get-updates.json by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/triggers/get-updates.json (or weaver's template/) and regenerate:
#
# npm run provider -- telegram

"""Telegram's poll trigger — the delivery contract.

Kept beside the service descriptor rather than inside a node, because a
signature scheme is a fact about TELEGRAM.
"""

from __future__ import annotations

import json
from typing import Any

from .._runtime import ConnectorConfigError
from ..faker import respond
from ..service import SERVICE

OPERATION = "get_updates"
DELIVERY = "poll"
SETUP = (
    "The host polls getUpdates on a schedule and persists the `offset` cursor between calls, "
    "passing the last `cursor` back in — Telegram queues nothing once an offset has "
    "acknowledged it, so a lost cursor is lost updates. getUpdates and setWebhook are "
    "MUTUALLY EXCLUSIVE for one bot: a host running both gets neither."
)
MIN_POLL_SECONDS = 1

METHOD = "GET"
PATH = "/getUpdates"


def query(config: dict[str, Any]) -> dict[str, Any]:
    """Build the query string for one poll, failing loudly and specifically."""
    offset = config.get("offset")
    if offset is not None and offset != "":
        try:
            _n = float(offset)
        except (TypeError, ValueError):
            _n = None
        if _n is None or _n != int(_n):
            raise ConnectorConfigError(
                "get_updates: \"offset\" must be a integer, got "
                f"{offset!r}."
            )

    limit = config.get("limit")
    if limit is not None and limit != "":
        try:
            _n = float(limit)
        except (TypeError, ValueError):
            _n = None
        if _n is None or _n != int(_n) or _n < 1 or _n > 100:
            raise ConnectorConfigError(
                "get_updates: \"limit\" must be a integer, got "
                f"{limit!r}."
            )

    out: dict[str, Any] = {}
    _value = config.get("offset")
    if _value is not None and _value != "":
        out["offset"] = int(float(_value))
    _value = config.get("limit")
    out["limit"] = int(float(_value)) if _value is not None and _value != "" else 100
    _value = config.get("allowedUpdates")
    if _value is not None and _value != "":
        out["allowed_updates"] = json.dumps(
            _allowed_updates_list(config.get("allowedUpdates")), separators=(",", ":")
        )

    return out


def check(data: dict[str, Any]) -> None:
    """Refuse a response that says no while answering 200.

    Telegram answers HTTP 200 with `{ok: false}` for an application-level
    failure. A status check alone reads that as success and publishes an empty
    batch — a poll that silently finds nothing, forever, which is
    indistinguishable from a quiet channel.
    """
    if data.get("ok") is False:
        raise ConnectorConfigError(
            "get_updates: getUpdates was rejected — "
            + str(data.get("description") or "no reason given")
        )


def cursor(items: list[Any], previous: int | None = None) -> int | None:
    """The next cursor, given the batch just received.

    `offset` means "the first one I have NOT handled", so it is the highest id
    seen plus one. Off by one in either direction is a real bug with no error
    attached: too low replays every item forever, too high drops one silently.
    The HOST persists this and passes it back in — nothing else will.
    """
    seen = [
        item["update_id"]
        for item in items
        if isinstance(item, dict) and isinstance(item.get("update_id"), int)
    ]

    return previous if not seen else max(seen) + 1


def items(data: Any) -> list[Any]:
    """The batch, or an empty list when the response carried none."""
    found = data.get("result") if isinstance(data, dict) else None

    return list(found) if isinstance(found, list) else []

def _allowed_updates_list(value: Any) -> list[str]:
    """One value, a ","-separated string, or a list — all end up a list."""
    if isinstance(value, list):
        items = [str(item) for item in value]
    elif isinstance(value, str):
        items = value.split(",")
    else:
        return []

    return [item.strip() for item in items if item.strip()]


def sample_event(config: dict[str, Any] | None = None) -> Any:
    """A faked sample event, so the trigger is runnable before any of the setup
    above.
    
    An author can see the real field names and wire the downstream nodes against
    them before the provider has ever been contacted.
    """
    from .._fake import FakeValues, seed_for_call

    resolved = config or {}
    fake = FakeValues(seed_for_call(SERVICE, OPERATION, resolved))

    return respond(OPERATION, {"config": resolved, "fake": fake})
