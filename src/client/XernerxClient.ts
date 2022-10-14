import { Client, Collection } from "discord.js";
import { s } from "@sapphire/shapeshift";

import CommandHandler from "../handlers/CommandHandler.js";
import EventHandler from "../handlers/EventHandler.js";
import InhibitorHandler from "../handlers/InhibitorHandler.js";

import { ClientUtil } from "../utils/ClientUtil.js";
import {
	DiscordOptions,
	ClientOptions,
	Commands,
	Cache,
	Modules,
	Util,
	HandlerOptions,
} from "../interfaces/ClientInterfaces.js";

/**
 * @description - The Client.
 * @param {DiscordOptions} discordOptions - The options for discord.js.
 * @param {ClientOptions} clientOptions - The options for the Xernerx Client.
 * @extends {Client}
 */
export default class XernerxClient extends Client {
	settings: ClientOptions;
	commands: Commands;
	cache: Cache;
	modules: Modules;
	util: Util;
	handlerOptions: HandlerOptions;
	events: Collection<string, object>;
	inhibitors: Collection<string, object>;

	constructor(discordOptions: DiscordOptions, clientOptions: ClientOptions) {
		super(discordOptions);

		this.settings = s
			.object({
				ownerId: s.union(s.array(s.string).unique, s.string).default([]),
				clientPermissions: s.array(s.string).default([]),
				userPermissions: s.array(s.string).default([]),
				ignoreOwner: s.boolean.default(false),
				logging: s.boolean.optional,
				cooldown: s.object({
					default: s.number.default(0),
					cache: s.number.default(0),
				}).optional,
			})
			.parse(clientOptions);

		this.commands = {
			message: new Collection(),
			slash: new Collection(),
			context: new Collection(),
		};

		this.events = new Collection();

		this.inhibitors = new Collection();

		this.cache = {
			messages: new Collection(),
			cooldowns: new Collection(),
		};

		this.modules = {
			commandHandler: new CommandHandler(this),
			eventHandler: new EventHandler(this),
			inhibitorHandler: new InhibitorHandler(this),
		};

		this.util = new ClientUtil(this);

		this.handlerOptions = {};
	}
}
