# GENERATED FILE — do not edit.
#
# Emitted from provider/fixtures/ by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/fixtures/ (or weaver's template/) and regenerate:
#
# npm run provider -- telegram

"""The Telegram faker.

Bit-for-bit identical to the TypeScript and PHP fakers: the same FNV-1a seed
and the same xorshift32 sequence, so a golden fixture asserts the exact
faked payload and ALL THREE runtimes have to produce it. That turns the
faker into a parity test rather than a convenience — which matters, because
cross-runtime drift does not fail loudly. It completes, down one path, with
no error.
"""

from __future__ import annotations

from typing import Any

from ._fake import FakeValues


def _get_updates(config: dict[str, Any], fake: FakeValues) -> Any:
    bound_chat_id = fake.int(100000000, 999999999)

    return {
        "ok": True,
        "result": [
            {
                "update_id": fake.int(100000, 999999),
                "message": {
                    "message_id": fake.int(1, 9999),
                    "date": 1767225600,
                    "text": (
                        str(_v)
                        if (_v := config.get("sampleText")) is not None and _v != ""
                        else "hello from the faker"
                    ),
                    "chat": {
                        "id": bound_chat_id,
                        "type": "private",
                        "first_name": "Ada",
                        "username": "ada_example",
                    },
                    "from": {
                        "id": bound_chat_id,
                        "is_bot": False,
                        "first_name": "Ada",
                        "username": "ada_example",
                        "language_code": "en",
                    },
                },
            },
        ],
    }


def respond(operation: str, request: dict[str, Any]) -> Any:
    """Dispatch to the fixture for one operation."""
    config: dict[str, Any] = request.get("config") or {}
    fake: FakeValues = request["fake"]

    if operation == "get_updates":
        return _get_updates(config, fake)

    # A faker asked for an operation it has no shape for must SAY so. Making
    # something up would produce a green run whose output silently has none of
    # the fields the author is about to reference.
    raise ValueError(
        f'telegram: no fake response is defined for "{operation}". '
        "Add a fixture under provider/fixtures/ and regenerate — a connector without a faker "
        "cannot be developed against, tested, or demonstrated."
    )
