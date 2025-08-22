/** @format */

import { AutocompleteFocusedOption, AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { XernerxSlashCommandBuilder } from '../main.js';

export interface XernerxSlashCommand {
	interaction: ChatInputCommandInteraction;
	options?: Record<string, any>;
	subcommand: string | null;
	group: string | null;
	command: XernerxSlashCommandBuilder;
}

export interface XernerxSlashCommandAutocomplete {
	interaction: AutocompleteInteraction;
	focused: AutocompleteFocusedOption;
	options: any;
}
