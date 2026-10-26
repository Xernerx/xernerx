/** @format */
// Re-exports all @xernerx/* packages

export * from '@xernerx/framework';
export * from '@xernerx/terminal';
export * from '@xernerx/websocket';
export * from '@xernerx/stats';
export * from '@xernerx/commands';

import { BaseClient, type BaseClientOptions, post as postStats, type StatsPayload } from '@xernerx/stats';
import { post as postCommands, type CommandsPayload } from '@xernerx/commands';

export { BaseClient, type BaseClientOptions, postStats, postCommands };

/**
 * Posts either bot statistics (`StatsPayload`) or bot commands (`CommandsPayload`) to the Xernerx Suite API.
 * @param data - Statistics payload or commands payload.
 * @param token - Xernerx API bearer token.
 * @param baseUrl - Optional custom API base URL.
 */
export async function post(data: StatsPayload | CommandsPayload, token: string, baseUrl?: string): Promise<any> {
	if (data && typeof data === 'object' && 'commands' in data) {
		return postCommands(data, token, baseUrl);
	}
	return postStats(data as StatsPayload, token, baseUrl);
}
