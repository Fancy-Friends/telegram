<?php

declare(strict_types=1);

namespace ParticleAcademy\Telegram;

use ParticleAcademy\Connectors\FakeRequest;

/*
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
 * The Telegram faker — the PHP twin of the js package's `src/faker.ts`.
 *
 * Bit-for-bit identical: the same FNV-1a seed and the same xorshift32
 * sequence, so a golden fixture asserts the exact faked payload and BOTH
 * runtimes have to produce it. That turns the faker into a parity test rather
 * than a convenience.
 */
final class TelegramFaker
{
    /** @param array<string,mixed> $request */
    public static function respond(string $operation, array $request): mixed
    {
        /** @var array<string,mixed> $config */
        $config = $request['config'] ?? [];
        /** @var FakeValuesLike $fake */
        $fake = $request['fake'];

        return match ($operation) {
            'get_updates' => self::GetUpdates($config, $fake),
            default => throw new \InvalidArgumentException(
                // A faker asked for an operation it has no shape for must SAY so.
                // Making something up would produce a green run whose output
                // silently has none of the fields the author is about to reference.
                'telegram: no fake response is defined for "'.$operation.'". '
                    .'Add a fixture under provider/fixtures/ and regenerate — a connector without a faker '
                    .'cannot be developed against, tested, or demonstrated.'
            ),
        };
    }

    /** @param array<string,mixed> $config */
    private static function GetUpdates(array $config, mixed $fake): array
    {
        $boundChatId = $fake->int(100000000, 999999999);

        return [
        'ok' => true,
        'result' => [
            [
                'update_id' => $fake->int(100000, 999999),
                'message' => [
                    'message_id' => $fake->int(1, 9999),
                    'date' => 1767225600,
                    'text' => ((($v = $config['sampleText'] ?? null) !== null && $v !== '') ? (string) $v : 'hello from the faker'),
                    'chat' => [
                        'id' => $boundChatId,
                        'type' => 'private',
                        'first_name' => 'Ada',
                        'username' => 'ada_example',
                    ],
                    'from' => [
                        'id' => $boundChatId,
                        'is_bot' => false,
                        'first_name' => 'Ada',
                        'username' => 'ada_example',
                        'language_code' => 'en',
                    ],
                ],
            ],
        ],
    ];
    }
}
