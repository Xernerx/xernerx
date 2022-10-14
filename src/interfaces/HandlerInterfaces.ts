import { EventEmitterType } from "../types/Types.js";

export interface MessageCommandOptions {
	directory: string;
	prefix: string[] | string;
	allowMention?: boolean;
	commandCooldown?: number;
	userPermissions?: string[];
	clientPermissions?: string[];
	handleEdits?: boolean;
	handleDeletes?: boolean;
	util?: boolean;
	logging?: boolean;
}

export interface SlashCommandOptions {
	directory: string;
	guildId: string;
	global: boolean;
	commandCooldown?: number;
	userPermissions?: string[];
	clientPermissions?: string[];
	util?: boolean;
	logging?: boolean;
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};
}

export interface ContextCommandOptions {
	directory: string;
	guildId: string;
	global: boolean;
	commandCooldown?: number;
	userPermissions?: string[];
	clientPermissions?: string[];
	util?: boolean;
	logging?: boolean;
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};
}

export interface EventLoadOptions {
	directory: string;
	logging?: boolean;
}

export interface EventOptions {
	name: string;
	emitter?: EventEmitterType;
	type?: string;
	once?: boolean;
}

export interface InhibitorLoadOptions {
	directory: string;
}

export interface InhibitorOptions {
	name: string;
	type: string;
}
