import { Collection } from "discord.js";
import CommandHandler from "../handlers/CommandHandler.js";
import EventHandler from "../handlers/EventHandler.js";
import InhibitorHandler from "../handlers/InhibitorHandler.js";
import {
	ContextCommandOptions,
	MessageCommandOptions,
	SlashCommandOptions,
	EventOptions,
	InhibitorOptions,
} from "./HandlerInterfaces.js";

export interface DiscordOptions {
	intents: number[];
}

export interface ClientOptions {
	ownerId?: string | string[];
	clientPermissions?: string[];
	userPermissions?: string[];
	ignoreOwner?: boolean;
	logging?: boolean | string[];
	cooldown?: {
		default?: number;
		cache?: number;
	};
}

export interface HandlerOptions {
	message?: MessageCommandOptions;
	slash?: SlashCommandOptions;
	context?: ContextCommandOptions;
	events?: EventOptions;
	inhibitors?: InhibitorOptions;
}

export interface Commands {
	message: Collection<string, object>;
	slash: Collection<string, object>;
	context: Collection<string, object>;
}

export interface Cache {
	messages: Collection<string, object>;
	cooldowns: Collection<string, object>;
}

export interface Modules {
	commandHandler: CommandHandler;
	eventHandler: EventHandler;
	inhibitorHandler: InhibitorHandler;
}

export interface Util {
	[index: string]: any;
}
