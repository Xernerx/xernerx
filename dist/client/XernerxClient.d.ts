/** @format */
import { Client, ClientOptions, Collection } from 'discord.js';
import { XernerxOptions, ModuleOptions, XernerxCommands, XernerxCache } from '../types/interfaces.js';
import { XernerxClientEvents } from '../types/extenders.js';
import ClientUtil from '../utils/ClientUtil.js';
import XernerxInhibitor from '../build/XernerxInhibitor.js';
import XernerxEvent from '../build/XernerxEvent.js';
import Cooldowns from '../models/Cooldowns.js';
export default class XernerxClient<T = unknown> extends Client {
	readonly settings: {
		ownerId: (string | string[]) & (string | string[] | undefined);
		local: string;
		ceaseless: boolean;
		global?: boolean | undefined;
		permissions?:
			| {
					user: string[] | null;
					client: string[] | null;
					dm: boolean;
			  }
			| undefined;
		ignore?:
			| {
					system: boolean;
					users: string[];
					owner: boolean;
					self: boolean;
					bots: boolean;
					channels: string[];
					guilds: string[];
			  }
			| undefined;
		log?:
			| boolean
			| {
					warn: boolean;
					error: boolean;
					ready: boolean;
					info: boolean;
					table: string[] | null;
					format: string[] | null;
			  }
			| undefined;
		cooldown?:
			| {
					command: number;
					cache: number;
					collections: string[];
			  }
			| undefined;
	};
	readonly config: T;
	readonly commands: XernerxCommands;
	readonly events: Collection<string, XernerxEvent<keyof XernerxClientEvents>>;
	readonly inhibitors: Collection<string, XernerxInhibitor>;
	readonly modules: ModuleOptions;
	readonly util: ClientUtil;
	readonly stats: Record<string, number>;
	readonly cache: XernerxCache;
	readonly cooldowns: Cooldowns;
	readonly dbl: any;
	readonly [index: string]: unknown;
	constructor(discordOptions: ClientOptions, xernerxOptions: XernerxOptions, config?: T);
	connect(token: string): Promise<string>;
}
