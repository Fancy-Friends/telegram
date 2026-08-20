<?php

declare(strict_types=1);

use ParticleAcademy\Telegram\TelegramFaker;
use ParticleAcademy\Connectors\FakeValues;

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
 * The golden fixtures — the SAME values the TypeScript and Python packages
 * assert.
 *
 * Bit-for-bit identical is the claim, and this is what checks it.
 * Cross-runtime drift does not fail loudly on its own: it completes, down one
 * path, with no error.
 */

it('get_updates fakes the shape Telegram publishes', function () {
    $config = [
        'limit' => 100,
        'sampleText' => 'hello from the faker',
    ];
    $fake = new FakeValues(FakeValues::seedForCall('telegram', 'get_updates', $config));

    $faked = TelegramFaker::respond('get_updates', ['config' => $config, 'fake' => $fake]);

    expect($faked)->toBe([
        'ok' => true,
        'result' => [
            [
                'update_id' => 847027,
                'message' => [
                    'message_id' => 7730,
                    'date' => 1767225600,
                    'text' => 'hello from the faker',
                    'chat' => [
                        'id' => 771587507,
                        'type' => 'private',
                        'first_name' => 'Ada',
                        'username' => 'ada_example',
                    ],
                    'from' => [
                        'id' => 771587507,
                        'is_bot' => false,
                        'first_name' => 'Ada',
                        'username' => 'ada_example',
                        'language_code' => 'en',
                    ],
                ],
            ],
        ],
    ]);
});

it('throws for an operation with no fixture rather than inventing a shape', function () {
    $fake = new FakeValues(FakeValues::seedForCall('telegram', 'no_such_operation', []));

    expect(fn () => TelegramFaker::respond('no_such_operation', ['config' => [], 'fake' => $fake]))
        ->toThrow(InvalidArgumentException::class);
});
