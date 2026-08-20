<?php

declare(strict_types=1);

/*
 * Telegram — the published Composer package.
 *
 * GENERATED — do not edit. Fix weaver's template/ and regenerate.
 *
 * This runs against the PUBLISHED package, installed by name from the
 * registry into a project that has never seen this repo. Every other test
 * here imports from ../src and therefore cannot see the packaging.
 */

$autoload = getcwd().'/vendor/autoload.php';

if (! is_file($autoload)) {
    fwrite(STDERR, 'No vendor/autoload.php in '.getcwd().PHP_EOL);
    fwrite(STDERR, 'Run this from a project that has composer-required the published package:'.PHP_EOL);
    fwrite(STDERR, '    composer require particle-academy/telegram-php'.PHP_EOL);
    exit(2);
}

require $autoload;

use ParticleAcademy\Connectors\FakeValues;
use ParticleAcademy\Telegram\TelegramFaker;

$goldens = [
    [
        'operation' => 'get_updates',
        'config' => [
            'limit' => 100,
            'sampleText' => 'hello from the faker',
        ],
        'expected' => [
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
        ],
    ],
];

foreach ($goldens as $golden) {
    $operation = $golden['operation'];
    $config = $golden['config'];

    $fake = new FakeValues(FakeValues::seedForCall('telegram', $operation, $config));
    $faked = TelegramFaker::respond($operation, ['config' => $config, 'fake' => $fake]);

    if ($faked !== $golden['expected']) {
        fwrite(STDERR, "the PUBLISHED package produced different bytes for {$operation}\n");
        fwrite(STDERR, '  got:      '.json_encode($faked)."\n");
        fwrite(STDERR, '  expected: '.json_encode($golden['expected'])."\n");
        exit(1);
    }

    echo "  ok   {$operation}\n";
}

echo "\n  ".count($goldens)." operations verified against the published package.\n";
