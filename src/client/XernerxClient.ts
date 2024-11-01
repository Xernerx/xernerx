/** @format */

import * as Discord from 'discord.js';
import { z } from 'zod';

import { XernerxOptions } from '../types/interfaces.js';
import { init } from '../function/init.js';
import { XernerxOptionsSchema } from '../schema/XernerxOptions.js';

export class XernerxClient<T = {}> extends Discord.Client {
	public declare readonly settings;

	constructor(DiscordOptions: Discord.ClientOptions, XernerxOptions: XernerxOptions, config?: T) {
		super(DiscordOptions);

		this.settings = z.object(XernerxOptionsSchema).parse({ ...XernerxOptions, ...config } as const);

		init(this);

		this.connect();
	}

	async connect() {
		await this.login(this.settings.token || undefined);
	}
}
