import {
	CacheFactory,
	Collection,
	MessageMentionOptions,
	Partials,
	PresenceData,
	RESTOptions,
	SweeperOptions,
	WebSocketOptions,
} from "discord.js";
import CommandHandler from "../handlers/CommandHandler.js";
import EventHandler from "../handlers/EventHandler.js";
import InhibitorHandler from "../handlers/InhibitorHandler.js";
import {
	ContextCommandOptions,
	MessageCommandOptions,
	SlashCommandOptions,
	EventLoadOptions,
	InhibitorLoadOptions,
} from "./HandlerInterfaces.js";
import { MessageCommand } from "../build/MessageCommand.js";
import WebhookHandler from "../handlers/WebhookHandler.js";

export interface DiscordOptions {
	shards?: number | number[] | "auto";
	closeTimeout?: number;
	shardCount?: number;
	makeCache?: CacheFactory;
	allowedMentions?: MessageMentionOptions;
	partials?: Array<Partials>;
	failIfNotExists?: boolean;
	presence?: PresenceData;
	intents: number[];
	waitGuildTimeout?: number;
	sweepers?: SweeperOptions;
	ws?: WebSocketOptions;
	rest?: RESTOptions;
	jsonTransformer?: (obj: unknown) => unknown;
}

export interface ClientOptions {
	ownerId?: string | string[];
	clientPermissions?: bigint[];
	userPermissions?: bigint[];
	ignoreOwner?: boolean;
	logging?: boolean;
	cooldown?: {
		default?: number;
		cache?: number;
	};
}

export interface DBLOptions {
	token?: string;
	webhook?: string;
	logging?: boolean;
}
export interface HandlerOptions {
	message?: MessageCommandOptions;
	slash?: SlashCommandOptions;
	context?: ContextCommandOptions;
	events?: EventLoadOptions;
	inhibitors?: InhibitorLoadOptions;
}

export interface Commands {
	message: Collection<string, MessageCommand>;
	slash: Collection<string, object>;
	context: Collection<string, object>;
}

export interface Cache {
	messages: Collection<string, object>;
	cooldowns: Collection<string, object>;
	messageCommands: Collection<string, object>;
	slashCommands: Collection<string, object>;
	contextCommands: Collection<string, object>;
	commands: Collection<string, object>;
}

export interface Modules {
	commandHandler: CommandHandler;
	eventHandler: EventHandler;
	inhibitorHandler: InhibitorHandler;
	webhookHandler: WebhookHandler;
}
