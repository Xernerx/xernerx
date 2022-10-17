import { ChannelType, ContextMenuCommandType } from "discord.js";

export interface MessageCommandOptions {
	name: string;
	regex?: string;
	aliases?: string[];
	description?: string;
	prefix?: string | string[];
	info?: string;
	category?: string;
	owner?: boolean;
	channelType?: ChannelType | ChannelType[];
	separator?: string;
	cooldown?: number;
	ignoreOwner?: boolean;
	channels?: string[];
	guilds?: string[];
	userPermissions?: bigint[];
	clientPermissions?: bigint[];
	commandType?: string;
	args: object[];
}

export interface ContextCommandOptions {
	name: string;
	type: ContextMenuCommandType | number;
	description?: string;
	info?: string;
	category?: string;
	owner?: boolean;
	channelType?: ChannelType;
	separator?: string;
	cooldown?: number;
	ignoreOwner?: boolean;
	channels?: string[];
	guilds?: string[];
	userPermissions?: bigint[];
	clientPermissions?: bigint[];
	defaultMemberPermissions?: bigint | number | bigint | null | undefined;
	DMPermission?: undefined | null | boolean;
	nameLocalization?: {
		locale:
			| "en-US"
			| "en-GB"
			| "bg"
			| "zh-CN"
			| "zh-TW"
			| "hr"
			| "cs"
			| "da"
			| "nl"
			| "fi"
			| "fr"
			| "de"
			| "el"
			| "hi"
			| "hu"
			| "it"
			| "ja"
			| "ko"
			| "lt"
			| "no"
			| "pl"
			| "pt-BR"
			| "ro"
			| "ru"
			| "es-ES"
			| "sv-SE"
			| "th"
			| "tr"
			| "uk"
			| "vi";
		localizedName: null | string;
	};
	nameLocalizations?: null | Partial<
		Record<
			| "en-US"
			| "en-GB"
			| "bg"
			| "zh-CN"
			| "zh-TW"
			| "hr"
			| "cs"
			| "da"
			| "nl"
			| "fi"
			| "fr"
			| "de"
			| "el"
			| "hi"
			| "hu"
			| "it"
			| "ja"
			| "ko"
			| "lt"
			| "no"
			| "pl"
			| "pt-BR"
			| "ro"
			| "ru"
			| "es-ES"
			| "sv-SE"
			| "th"
			| "tr"
			| "uk"
			| "vi",
			null | string
		>
	>;
	commandType?: string;
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};
}

export interface SlashArgs {
	type: string;
	name: string;
	choices: object[];
	required: boolean;
	description: string;
}

export interface SlashCommandOptions {
	name: string;
	description: string;
	info?: string;
	category?: string;
	owner?: boolean;
	channelType?: ChannelType;
	separator?: string;
	cooldown?: number;
	ignoreOwner?: boolean;
	channels?: string[];
	guilds?: string[];
	userPermissions?: bigint[];
	clientPermissions?: bigint[];
	args?: Array<SlashArgs>;
	subcommands?: object[];
	groups?: object[];
	commandType?: string;
	defer?: {
		reply?: boolean;
		ephemeral?: boolean;
		fetchReply?: boolean;
	};
}
