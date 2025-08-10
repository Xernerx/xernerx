/** @format */

import { Client } from 'discord.js';
import { XernerxClient } from '../client/XernerxClient.js';

export class XernerxBaseUtil {
	declare public readonly client: XernerxClient & Client<true>;
	declare public readonly parsed: {
		command: string | null;
		alias: string | null;
		mention: boolean | null;
		prefix: string | null;
	};

	constructor(client: XernerxClient & Client<true>) {
		this.client = client;

		this.parsed = { command: null, alias: null, mention: null, prefix: null };
	}
}
