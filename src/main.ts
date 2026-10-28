/** @format */

/**
 * Official all-in-one Xernerx meta-package, re-exporting all `@xernerx/*` packages
 * and providing unified telemetry, command synchronization, and CLI helpers.
 *
 * @module xernerx
 */

export * from '@xernerx/extension-builder';
export * from '@xernerx/framework';
export * from '@xernerx/terminal';
export * from '@xernerx/websocket';
export * from '@xernerx/stats';
export * from '@xernerx/commands';
export * from '@xernerx/hooks';
export { XernerxCLI, type CreateAppOptions, type LifecycleOptions, type PackageManager, type ProjectLanguage, type XernerxIntegration } from './cli.js';

import { BaseClient, type BaseClientOptions, post as postStats, type StatsPayload } from '@xernerx/stats';
import { post as postCommands, type CommandsPayload } from '@xernerx/commands';

export { BaseClient, type BaseClientOptions, postStats, postCommands };

/**
 * Posts either bot telemetry statistics ({@link StatsPayload}) or application commands ({@link CommandsPayload})
 * to the Xernerx Suite API (`https://api.xernerx.com`).
 *
 * Automatically dispatches to {@link postCommands} when a `commands` array is present on `data`,
 * or to {@link postStats} otherwise.
 *
 * @param data - Bot telemetry payload (`StatsPayload`) or application commands payload (`CommandsPayload`).
 * @param token - Xernerx Suite API bearer token (`Bearer <token>`).
 * @param baseUrl - Optional custom Xernerx Suite API base URL (defaults to `'https://api.xernerx.com'`).
 * @returns A promise resolving to the parsed JSON response from the Xernerx Suite API.
 * @throws {Error} When `data.id` is missing or the Xernerx Suite API responds with a non-2xx HTTP status.
 *
 * @example
 * ```ts
 * import { post, Terminal } from 'xernerx';
 *
 * export class TelemetrySync extends Terminal {
 * 	constructor() {
 * 		super({ scope: 'XS' });
 * 	}
 *
 * 	async run() {
 * 		await post({ id: 'YOUR_BOT_ID', guildCount: 150, userCount: 25000 }, process.env.XERNERX_TOKEN!);
 * 		this.info('Synced bot telemetry to Xernerx!');
 * 	}
 * }
 *
 * new TelemetrySync().run();
 * ```
 */
export async function post(data: StatsPayload | CommandsPayload, token: string, baseUrl?: string): Promise<any> {
	if (data && typeof data === 'object' && 'commands' in data) {
		return postCommands(data, token, baseUrl);
	}
	return postStats(data as StatsPayload, token, baseUrl);
}
