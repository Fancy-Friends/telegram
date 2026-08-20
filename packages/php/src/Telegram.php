<?php

declare(strict_types=1);

namespace ParticleAcademy\Telegram;

use ParticleAcademy\Connectors\Mode;
use ParticleAcademy\Connectors\PreparedRequest;
use ParticleAcademy\Connectors\SandboxKind;
use ParticleAcademy\Connectors\ServiceDescriptor;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/manifest.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/manifest.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- telegram
 */
/**
 * Telegram, as one service descriptor shared by every Telegram operation.
 *
 * The PHP twin of the js package's `src/service.ts`.
 *
 * ## The sandbox trap, written down where it is used
 *
 * Telegram's test environment is a genuinely SEPARATE ACCOUNT: you create a
 * new account inside it and register a new bot there, so the sandbox
 * credential is a different token rather than the same one pointed elsewhere.
 * The `/test` path segment is how you reach it; the account is what makes it
 * separate. Flood limits are NOT relaxed there, so it is a place to test, not
 * a place to hammer.
 */
final class Telegram
{
    // The connector API version this package was GENERATED against. A
    // literal, never imported: an imported constant lets an upgrade rewrite
    // the very claim it exists to detect.
    public const CONNECTOR_API_VERSION = 1;

    public const SERVICE = 'telegram';

    public const LIVE_URL = 'https://api.telegram.org';
    public const SANDBOX_URL = 'https://api.telegram.org';

    /** @var list<string> Credential keys a remote call cannot proceed without. */
    public const REQUIRES = [
        'botToken',
    ];

    public static function descriptor(): ServiceDescriptor
    {
        return new ServiceDescriptor(
            service: self::SERVICE,
            title: 'Telegram',
            sandbox: SandboxKind::SeparateAccount,
            baseUrls: [
                Mode::Live->value => self::LIVE_URL,
                Mode::Sandbox->value => self::SANDBOX_URL,
            ],
            requires: self::REQUIRES,
            authorize: self::authorize(...),
            faker: TelegramFaker::respond(...),
        );
    }

    /**
     * Apply Telegram's auth scheme to an outgoing request.
     *
     * The bot token is a PATH SEGMENT, not a header --
     * https://api.telegram.org/bot<token>/getUpdates -- and the test environment
     * is a further `/test` AFTER the token. So this is the first provider whose
     * auth and whose estate are the same decision expressed in the URL, which is
     * why `authorize` has always been handed the resolved mode. The token
     * therefore ends up in the request URL, where access logs and error reporters
     * will record it. That is Telegram's design, not ours; a host should keep its
     * own logging away from it.
     *
     * The mode is USED here: for this provider auth and estate are the same
     * decision expressed in the URL.
     *
     * @param array<string,string> $credentials
     */
    public static function authorize(array $credentials, PreparedRequest $request, Mode $mode): void
    {
        $segment = '/bot'.($credentials['botToken'] ?? '');

        // The estate is the SAME decision as the credential here, and it lives
        // in a further segment AFTER the token. A token pointed at a node
        // marked "sandbox" would otherwise reach the live bot, and succeed.
        if ($mode === Mode::Sandbox) {
            $segment .= '/test';
        }

        $parts = parse_url($request->url);
        $port = isset($parts['port']) ? ':'.$parts['port'] : '';
        $query = isset($parts['query']) ? '?'.$parts['query'] : '';

        $request->url = ($parts['scheme'] ?? 'https').'://'.($parts['host'] ?? '').$port
            .$segment.($parts['path'] ?? '').$query;
    }
}
