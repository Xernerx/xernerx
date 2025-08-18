/** @format */

import { ClientEvents } from 'discord.js';

export interface XernerxEventBuilderOptions {
	name: ClientEvents | keyof ClientEvents | (string & {});
	emitter?: string;
	once?: boolean;
}
