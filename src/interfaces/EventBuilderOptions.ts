/** @format */

import { ClientEvents } from 'discord.js';

export interface EventBuilderOptions {
	name: ClientEvents | keyof ClientEvents | (string & {});
	emitter?: string;
	once?: boolean;
}
