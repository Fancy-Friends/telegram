<?php

declare(strict_types=1);

namespace ParticleAcademy\Telegram\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\Contracts\NodeExecutor;
use FancyFlow\Runtime\ExecutionContext;
use FancyFlow\Runtime\Port;
use FancyFlow\Runtime\RunEvent;
use ParticleAcademy\Connectors\ConnectorClient;
use ParticleAcademy\Telegram\Telegram;
use ParticleAcademy\Telegram\Triggers\GetUpdates;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/triggers/get-updates.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/triggers/get-updates.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- telegram
 */
/**
 * Telegram message, run on a fancy-flow-php host.
 *
 * The PHP twin of `telegramUpdatesTriggerExecutor` in
 * @particle-academy/telegram-js. A poll trigger CALLS Telegram, once per run
 * on the host's schedule, and publishes the batch: `count`, the items, and the
 * first one on its own, with the next `cursor` — which the HOST persists and
 * passes back as `offset`. Nothing else will. A poll that found nothing goes
 * to `empty` instead of `out`.
 */
#[FlowNode(
    name: '@particle-academy/telegram_updates_trigger',
    aliases: [
        'telegram_updates_trigger',
    ],
    category: 'trigger',
    label: 'Telegram message',
    description: 'Start a run when a Telegram bot receives an update (long polling, not a webhook).',
    icon: '✈',
    inputs: [],
    outputs: [
        [
            'id' => 'out',
            'label' => 'updates',
        ],
        [
            'id' => 'empty',
            'label' => 'nothing new',
        ],
    ],
    sideEffects: 'none',
    outputShape: [
        [
            'path' => 'mode',
            'type' => 'string',
            'description' => 'Which estate this ran against: fake, sandbox or live.',
        ],
        [
            'path' => 'connection',
            'type' => 'string',
            'description' => 'The connection id that was used.',
        ],
        [
            'path' => 'cursor',
            'type' => 'number',
            'description' => 'The next `offset` to poll with. The HOST must persist it — nothing else will.',
        ],
        [
            'path' => 'count',
            'type' => 'number',
            'description' => 'How many updates this poll returned.',
        ],
        [
            'path' => 'updates',
            'type' => 'array',
            'description' => 'The raw update envelopes, newest last.',
        ],
        [
            'path' => 'update.update_id',
            'type' => 'number',
            'description' => 'Id of the first update in this batch.',
        ],
        [
            'path' => 'update.message.text',
            'type' => 'string',
            'description' => 'Message text, when the update is a message.',
        ],
        [
            'path' => 'update.message.chat.id',
            'type' => 'number',
            'description' => 'Chat to reply into.',
        ],
        [
            'path' => 'update.message.from.username',
            'type' => 'string',
            'description' => 'Who sent it.',
        ],
    ],
)]
final class UpdatesTriggerExecutor implements NodeExecutor
{
    public function __construct(private readonly ?ConnectorClient $client = null) {}

    public function execute(ExecutionContext $ctx): mixed
    {
        $config = $ctx->config();

        $result = ($this->client ?? new ConnectorClient)->call(
            Telegram::descriptor(),
            GetUpdates::OPERATION,
            $config,
            ['method' => GetUpdates::METHOD, 'path' => GetUpdates::PATH, 'query' => GetUpdates::query($config)],
        );

        // Telegram can answer HTTP 200 and still refuse. check() reads what the status did not.
        if (is_array($result->data)) {
            GetUpdates::check($result->data);
        }

        $items = GetUpdates::items($result->data);
        $previous = $config['offset'] ?? null;
        $cursor = GetUpdates::cursor($items, $previous === null || $previous === '' ? null : (int) $previous);

        $value = [
            'mode' => $result->mode->value,
            'connection' => $result->connection,
            'cursor' => $cursor,
            'count' => count($items),
            'updates' => $items,
            'update' => $items[0] ?? null,
        ];

        // Nothing new is the NORMAL case, not a failure. Its own port keeps `out`
        // meaning "something happened".
        if ($items === []) {
            return Port::only('empty', $value);
        }

        $ctx->emit(RunEvent::log(
            'info',
            'telegram: '.count($items).' item(s), next cursor '.($cursor ?? 'none').' ('.$result->mode->value.')',
            $ctx->node->id,
        ));

        return Port::only('out', $value);
    }
}
