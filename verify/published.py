"""
Telegram — the published PyPI wheel.

GENERATED — do not edit. Fix weaver's template/ and regenerate.

Runs against the PUBLISHED wheel, installed by name into a fresh venv.
Every other test here imports from ../src and cannot see the packaging —
a missing py.typed or an unshipped module passes there and breaks for
every user.
"""

from importlib.metadata import requires

from fancy_telegram._fake import FakeValues, seed_for_call
from fancy_telegram.faker import respond

GOLDENS = [
    {
        "operation": "get_updates",
        "config": {
            "limit": 100,
            "sampleText": "hello from the faker",
        },
        "expected": {
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
        },
    },
]


def main() -> None:
    # Zero runtime dependencies is a design constraint, checked on the
    # INSTALLED distribution rather than on the pyproject that claimed it.
    declared = requires("fancy-telegram")
    assert not declared, f"expected no runtime dependencies, got {declared}"
    print("  ok   zero runtime dependencies on the installed distribution")

    for golden in GOLDENS:
        operation, config = golden["operation"], golden["config"]
        fake = FakeValues(seed_for_call("telegram", operation, config))
        faked = respond(operation, {"config": config, "fake": fake})

        assert faked == golden["expected"], (
            f"the PUBLISHED wheel produced different bytes for {operation} than the repo does"
        )
        print(f"  ok   {operation}")

    print(f"\n  {len(GOLDENS)} operations verified against the published wheel.")


if __name__ == "__main__":
    main()
