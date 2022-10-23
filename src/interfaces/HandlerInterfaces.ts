import { Attachment, Component, Embed, Message, User } from "discord.js";
import { EventEmitterType } from "../types/Types.js";
import { MessageCommandUtil } from "../utils/CommandUtil.js";

export interface MessageCommandOptions {
	directory: string;
	prefix: string[] | string;
	allowMention?: boolean;
	cooldown?: number;
	userPermissions?: bigint[];
	clientPermissions?: bigint[];
	handleEdits?: boolean;
	handleDeletes?: boolean;
	util?: boolean;
	logging?: boolean;
}

export interface SlashCommandOptions {
	directory: string;
	guildId: string;
	global: boolean;
	cooldown?: number;
	userPermissions?: bigint[];
	clientPermissions?: bigint[];
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
	cooldown?: number;
	userPermissions?: bigint[];
	clientPermissions?: bigint[];
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
	logging?: boolean;
}

export interface InhibitorOptions {
	name: string;
	type: string;
}

export interface XernerxMessage extends Message {
	util?: MessageCommandUtil;
	response?: string;
}

export interface XernerxUser extends User {
	isOwner: boolean;
}
