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
}

export interface EventOptions {
	directory: string;
	logging?: boolean;
}

export interface Event {
	name: string;
	emitter?: EventEmitterType;
	type?: string;
	once?: boolean;
}

export interface InhibitorOptions {
	directory: string;
}

export interface Inhibitor {
	name: string;
	type: string;
}
