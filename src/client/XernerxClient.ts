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
import boxen from 'boxen';

import { XernerxOptions } from '../types/interfaces.js';
import { init } from '../function/init.js';
import { XernerxOptionsSchema } from '../schema/XernerxOptions.js';
import { XernerxLog } from '../tools/XernerxLog.js';
import { ClientUtil } from '../util/ClientUtil.js';
import { XernerxError } from '../components/XernerxErrors.js';
import { EventHandler } from '../handler/EventHandler.js';
import { XernerxEventBuilder } from '../main.js';
import { CommandHandler } from '../handler/CommandHandler.js';
import DashboardHandler from '../handler/DashboardHandler.js';

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
	declare public readonly settings;

	/**
	 * Customizable configuration for the XernerxClient instance.
	 * @type {T}
	 */
	declare protected readonly config;
	declare public readonly util;
	declare public readonly modules;
	declare public readonly collections;

	declare public store: Array<Discord.SKU>;

	/**
	 * Initializes the XernerxClient class with customizable settings, configuration, and logs a connection message.
	 * @param {DiscordClientOptions} DiscordOptions - Options for the Discord.Client class.
	 * @param {XernerxOptions} XernerxOptions - Customizable settings for the XernerxClient instance.
	 * @param {T} [config] - A place to store your config file contents. This will automatically merge with your settings, no need to define data in your config to then import it individually, just add the config to it instead.
	 */
	constructor(DiscordOptions: Discord.ClientOptions, XernerxOptions: XernerxOptions, config?: T) {
		super(DiscordOptions);

		// properties

		this.config = (config || {}) as T;

		this.settings = z.object(XernerxOptionsSchema).parse({ ...this.config, ...XernerxOptions } as const);

		// setup

		init(this);

		this.connect();

		// class appenders

		this.util = new ClientUtil(this);

		// handlers

		this.modules = {
			eventHandler: new EventHandler(this),

			commandHandler: new CommandHandler(this),

			dashboardHandler: new DashboardHandler(this),
		};

		this.collections = {
			events: new Discord.Collection<string, XernerxEventBuilder>(),
			inhibitors: new Discord.Collection<string, string>(),
			commands: {
				slash: new Discord.Collection<string, string>(),
				message: new Discord.Collection<string, string>(),
				conmtext: new Discord.Collection<string, string>(),
			},
		};
	}

	/**
	 * Asynchronously connects to Discord using the provided token and logs a connection message.
	 */
	async connect() {
		XernerxLog.debug('Connecting to Discord with token: ' + sharpyy(this.settings.token || 'none', 'txRed'), this.settings.debug && this.settings.log.levels.debug);

		await this.login(this.settings.token || undefined);

		this.deploy();
	}

	private deploy() {
		XernerxLog.debug(`Deploying Commands and Events.`, this.settings.debug && this.settings.log.levels.debug);

		this.once('ready', (client) => {
			XernerxLog.debug(`Checking for local guilds.`);

			if (!this.settings.guilds.length) throw new XernerxError('There are no guilds where commands can be deplyed locally, this is required.');

			if (this.options.intents.missing('Guilds')) XernerxLog.warn(`${client.user.tag} is missing the intent: Guilds, All guild information will be undefined.`);

			this.settings.guilds.map(async (id) => {
				XernerxLog.debug(`Checking if ${id} is reachable...`);

				const guild = await client.guilds.fetch(id);

				XernerxLog.debug(`${guild.name} validated, deploying commands...`);

				console.info(
					boxen('TODO - Add commands (only deployed)', {
						padding: 1,
						margin: 1,
						borderStyle: 'round',
						title: guild.name,
						borderColor: this.settings.global ? 'green' : 'red',
						height: 3,
						align: 'left',
						fullscreen: (width, height) => [width - 3, height],
					})
				);
			});
		});
	}
}
