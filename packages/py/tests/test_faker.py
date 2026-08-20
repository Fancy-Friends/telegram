# GENERATED FILE — do not edit.
#
# Emitted from provider/fixtures/ by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/fixtures/ (or weaver's template/) and regenerate:
#
# npm run provider -- telegram

"""The golden fixtures — the SAME values the TypeScript and PHP packages
assert.

Bit-for-bit identical is the claim, and this is what checks it for Python.
Cross-runtime drift does not fail loudly on its own: it completes, down one
path, with no error.
"""

import pytest

from fancy_telegram._fake import FakeValues, seed_for_call
from fancy_telegram.faker import respond


def test_get_updates_fakes_the_published_shape() -> None:
    config = {
        "limit": 100,
        "sampleText": "hello from the faker",
    }
    fake = FakeValues(seed_for_call("telegram", "get_updates", config))

    faked = respond("get_updates", {"config": config, "fake": fake})

    assert faked == {
        "ok": True,
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
                        "username": "ada_example",
                    },
                    "from": {
                        "id": 771587507,
                        "is_bot": False,
                        "first_name": "Ada",
                        "username": "ada_example",
                        "language_code": "en",
                    },
                },
            },
        ],
    }


def test_an_operation_with_no_fixture_raises_rather_than_inventing_a_shape() -> None:
    fake = FakeValues(seed_for_call("telegram", "no_such_operation", {}))

    with pytest.raises(ValueError, match="no fake response"):
        respond("no_such_operation", {"config": {}, "fake": fake})
