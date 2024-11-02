/** @format */

/**
 * @fileoverview A TypeScript file for the XernerxClient class, which extends the Discord.Client class and provides customizable settings and functionality.
 * @author Dummi
 */

/**
 * @typedef {import('discord.js').ClientOptions} DiscordClientOptions
 * @typedef {import('../types/interfaces.js').XernerxOptions} XernerxOptions
 * @typedef {import('zod').ZodType<any, any, any>} ZodType
 * @typedef {import('sharpyy').default} Sharpyy
 */
import * as Discord from 'discord.js';
import { z } from 'zod';
import sharpyy from 'sharpyy';

import { XernerxOptions } from '../types/interfaces.js';
import { init } from '../function/init.js';
import { XernerxOptionsSchema } from '../schema/XernerxOptions.js';
import { XernerxLog } from '../tools/XernerxLog.js';

/**
 * @description read the super for more information.
 * @template T
 * @extends {Discord.Client}
 */
export class XernerxClient<T extends {} = {}> extends Discord.Client {
	/**
	 * Customizable settings for the XernerxClient instance.
	 * @type {XernerxOptions}
	 */
	public declare readonly settings;

	/**
	 * Customizable configuration for the XernerxClient instance.
	 * @type {T}
	 */
	public declare readonly config;

	/**
	 * Initializes the XernerxClient class with customizable settings, configuration, and logs a connection message.
	 * @param {DiscordClientOptions} DiscordOptions - Options for the Discord.Client class.
	 * @param {XernerxOptions} XernerxOptions - Customizable settings for the XernerxClient instance.
	 * @param {T} [config] - A place to store your config file contents. This will automatically merge with your settings, no need to define data in your config to then import it individually, just add the config to it instead.
	 */
	constructor(DiscordOptions: Discord.ClientOptions, XernerxOptions: XernerxOptions, config?: T) {
		super(DiscordOptions);

		this.config = (config || {}) as T;

		this.settings = z.object(XernerxOptionsSchema).parse({ ...XernerxOptions, ...this.config } as const);

		init(this);

		this.connect();
	}

	/**
	 * Asynchronously connects to Discord using the provided token and logs a connection message.
	 */
	async connect() {
		XernerxLog.debug('Connecting to Discord with token: ' + sharpyy(this.settings.token || 'none', 'txRed'), this.settings.debug && this.settings.log.levels.debug);

		await this.login(this.settings.token || undefined);
	}
}
