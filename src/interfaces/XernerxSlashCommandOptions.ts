/** @format */

import { Attachment, AutocompleteFocusedOption, AutocompleteInteraction, Channel, ChatInputCommandInteraction, Role, User } from 'discord.js';

import { XernerxSlashCommandBuilder } from '../main.js';

export type XernerxSlashCommandOption = { name: string; value: string } & (
	| { type: 'string' }
	| { type: 'number'; value: number }
	| { type: 'boolean'; value: boolean }
	| { type: 'user'; user: User }
	| { type: 'channel'; channel: Channel }
	| { type: 'role'; role: Role }
	| { type: 'mentionable'; role?: Role; user?: User }
	| { type: 'integer'; value: number }
	| { type: 'attachment'; attachment: Attachment }
);

export interface XernerxSlashCommandOptions {
	interaction: ChatInputCommandInteraction;
	options: Record<string, XernerxSlashCommandOption>;
	subcommand: string | null;
	group: string | null;
	command: XernerxSlashCommandBuilder;
}

export interface XernerxSlashCommandAutocomplete {
	interaction: AutocompleteInteraction;
	focused: AutocompleteFocusedOption;
	options: any;
}
