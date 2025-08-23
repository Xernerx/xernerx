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

	/**
	 * Retrieves the options for the current interaction command.
	 *
	 * This method aggregates options from the command's groups, subcommands, and direct options,
	 * based on the current interaction context.
	 *
	 * @returns {Record<string, any>} An object containing the options for the command,
	 * where each key is the option name and the value is the option value from the interaction.
	 */
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

	/**
	 * Retrieves the name of the subcommand from the current interaction.
	 *
	 * This method attempts to extract the subcommand name from the interaction options.
	 * If no subcommand is present or an error occurs, it returns null.
	 *
	 * @returns {string | null} The name of the subcommand if available, otherwise null.
	 */
	subcommand() {
		try {
			return this.interaction.options.getSubcommand();
		} catch {
			return null;
		}
	}

	/**
	 * Retrieves the name of the subcommand group from the current interaction.
	 *
	 * This method attempts to extract the subcommand group name from the interaction options.
	 * If no subcommand group is present or an error occurs, it returns null.
	 *
	 * @returns {string | null} The name of the subcommand group if available, otherwise null.
	 */
	group() {
		try {
			return this.interaction.options.getSubcommandGroup();
		} catch {
			return null;
		}
	}
}
