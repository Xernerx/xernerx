/** @format */

import { Attachment, AutocompleteFocusedOption, AutocompleteInteraction, Channel, ChatInputCommandInteraction, Role, User } from 'discord.js';

import { SlashCommandBuilder } from '../build/SlashCommandBuilder.js';

export type SlashCommandOption = { name: string; value: string } & (
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

export interface SlashCommandOptions {
	interaction: ChatInputCommandInteraction;
	options: Record<string, SlashCommandOption>;
	subcommand: string | null;
	group: string | null;
	command: SlashCommandBuilder;
}

export interface SlashCommandError extends SlashCommandOptions {
	error: Error;
}

export interface SlashCommandAutocomplete {
	interaction: AutocompleteInteraction;
	focused: AutocompleteFocusedOption;
	options: any;
}
