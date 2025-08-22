/** @format */

import { ChatInputCommandInteraction } from 'discord.js';
import { XernerxSlashCommandBuilder } from '../main.js';

export class XernerxInteractionArguments {
	declare private readonly interaction: ChatInputCommandInteraction;
	declare private readonly command: XernerxSlashCommandBuilder;

	constructor(interaction: ChatInputCommandInteraction, command: XernerxSlashCommandBuilder) {
		this.interaction = interaction;

		this.command = command;
	}

	options() {
		const options: Record<string, any> = {};

		if (this.command.groups) {
			const group = this.command.groups.find((group) => group.name === this.group());

			if (!group) return;

			const subcommand = group.subcommands.find((subcommand) => subcommand.name === this.subcommand());

			if (!subcommand) return;

			for (const option of subcommand.options || []) {
				options[option.name] = this.interaction.options.get(option.name);
			}
		}

		if (this.command.subcommands) {
			const subcommand = this.command.subcommands.find((subcommand) => subcommand.name === this.subcommand());

			if (!subcommand) return;

			for (const option of subcommand?.options || []) {
				options[option.name] = this.interaction.options.get(option.name);
			}
		}

		if (this.command.options) {
			for (const option of this.command.options) {
				options[option.name] = this.interaction.options.get(option.name);
			}
		}

		return options;
	}

	subcommand() {
		try {
			return this.interaction.options.getSubcommand();
		} catch {
			return null;
		}
	}

	group() {
		try {
			return this.interaction.options.getSubcommandGroup();
		} catch {
			return null;
		}
	}
}
