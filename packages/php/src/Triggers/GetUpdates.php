<?php

declare(strict_types=1);

namespace ParticleAcademy\Telegram\Triggers;

use ParticleAcademy\Connectors\DeliveryMechanism;
use ParticleAcademy\Connectors\ConnectorConfigException;

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
 * Telegram's poll trigger — the delivery contract.
 *
 * Kept beside the service descriptor rather than inside a node, because a
 * signature scheme is a fact about TELEGRAM. The twin of the js package's
 * trigger module.
 */
final class GetUpdates
{
    public const OPERATION = 'get_updates';
    public const DELIVERY = DeliveryMechanism::Poll;

    public const SETUP = 'The host polls getUpdates on a schedule and persists the `offset` cursor between calls, passing the last `cursor` back in — Telegram queues nothing once an offset has acknowledged it, so a lost cursor is lost updates. getUpdates and setWebhook are MUTUALLY EXCLUSIVE for one bot: a host running both gets neither.';

    public const METHOD = 'GET';
    public const PATH = '/getUpdates';

    public const MIN_POLL_SECONDS = 1;

    /**
     * Build the query string for one poll.
     *
     * @param array<string,mixed> $config
     * @return array<string,mixed>|\stdClass
     */
    public static function query(array $config): array|\stdClass
    {
        $offset = $config['offset'] ?? null;
        if (($offset !== null && $offset !== '') && ! (is_numeric($offset) && (float) $offset === floor((float) $offset))) {
            throw new ConnectorConfigException(
                'get_updates: "offset" must be a integer, got '.json_encode($offset).'.'
            );
        }

        $limit = $config['limit'] ?? null;
        if (($limit !== null && $limit !== '') && ! (is_numeric($limit) && (float) $limit === floor((float) $limit) && (float) $limit >= 1 && (float) $limit <= 100)) {
            throw new ConnectorConfigException(
                'get_updates: "limit" must be a integer, got '.json_encode($limit).'.'
            );
        }

        $body = [];

        $value = $config['offset'] ?? null;
        if ($value !== null && $value !== '') {
            $body['offset'] = (int) $value;
        }

        $value = $config['limit'] ?? null;
        $body['limit'] = ($value !== null && $value !== '') ? (int) $value : 100;

        $value = $config['allowedUpdates'] ?? null;
        if ($value !== null && $value !== '') {
            $body['allowed_updates'] = json_encode(self::allowedUpdatesList($config['allowedUpdates'] ?? null)) ?: '[]';
        }

        $body = $body === [] ? new \stdClass() : $body;
        return $body;
    }

    /**
     * Refuse a response that says no while answering 200.
     *
     * Telegram answers HTTP 200 with `{ok: false}` for an application-level
     * failure. A status check alone reads that as success and publishes an empty
     * batch — a poll that silently finds nothing, forever, which is
     * indistinguishable from a quiet channel.
     *
     * @param array<string,mixed> $data
     */
    public static function check(array $data): void
    {
        if (($data['ok'] ?? null) === false) {
            throw new ConnectorConfigException(
                'get_updates: getUpdates was rejected — '
                .(string) ($data['description'] ?? 'no reason given')
            );
        }
    }

    /**
     * The next cursor, given the batch just received.
     *
     * `offset` means "the first one I have NOT handled", so it is the highest id
     * seen plus one. Off by one in either direction is a real bug with no error
     * attached: too low replays every item forever, too high drops one silently.
     *
     * The HOST persists this and passes it back in. Nothing else will.
     *
     * @param list<array<string,mixed>> $items
     */
    public static function cursor(array $items, ?int $previous = null): ?int
    {
        $seen = [];

        foreach ($items as $item) {
            $id = $item['update_id'] ?? null;
            if (is_int($id)) {
                $seen[] = $id;
            }
        }

        return $seen === [] ? $previous : max($seen) + 1;
    }

    /** The batch, or an empty list when the response carried none. @return list<mixed> */
    public static function items(mixed $data): array
    {
        $items = is_array($data) ? ($data['result'] ?? null) : null;

        return is_array($items) ? array_values($items) : [];
    }

    /** One value, a ,-separated string, or an array — all end up a list. @return list<string> */
    private static function allowedUpdatesList(mixed $value): array
    {
        if (is_array($value)) {
            $items = array_map(static fn (mixed $item): string => (string) $item, $value);
        } elseif (is_string($value)) {
            $items = explode(',', $value);
        } else {
            return [];
        }

        $items = array_map(trim(...), $items);

        return array_values(array_filter($items, static fn (string $item): bool => $item !== ''));
    }
}
