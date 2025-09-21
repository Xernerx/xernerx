/** @format */

import { ChatInputCommandInteraction } from 'discord.js';
import { XernerxSlashCommandBuilder } from '../build/XernerxSlashCommandBuilder.js';

export class XernerxInteractionArguments {
	declare private readonly interaction: ChatInputCommandInteraction;
	declare private readonly command: XernerxSlashCommandBuilder;

	constructor(interaction: ChatInputCommandInteraction, command: XernerxSlashCommandBuilder) {
		this.interaction = interaction;

		this.command = command;
	}

	/**
	 * Retrieves the options from the current interaction based on the command structure.
	 *
	 * This method processes the command's groups, subcommands, and options to extract
	 * the relevant options from the interaction. It returns a record of option names
	 * and their corresponding values from the interaction.
	 *
	 * @returns {Record<string, any> | null} A record of option names and values if available, otherwise null.
	 */
	options() {
		const options: Record<string, any> = {};

		if (this.command.groups) {
			const group = this.command.groups.find((group) => group.name === this.group());

			if (!group) return null;

			const subcommand = group.subcommands.find((subcommand) => subcommand.name === this.subcommand());

			if (!subcommand) return null;

			for (const option of subcommand.options || []) {
				options[option.name] = this.interaction.options.get(option.name);
			}
		}

		if (this.command.subcommands) {
			const subcommand = this.command.subcommands.find((subcommand) => subcommand.name === this.subcommand());

			if (!subcommand) return null;

			for (const option of subcommand?.options || []) {
				options[option.name] = this.interaction.options.get(option.name);
			}
		}

		if (this.command.options) {
			for (const option of this.command.options) {
				const o = this.interaction.options.get(option.name);

				if (!o) return (options[option.name] = null);

				const optionName = { 3: 'string', 4: 'number', 5: 'boolean', 6: 'user', 7: 'channel', 8: 'role', 9: 'mentionable', 10: 'integer', 11: 'attachment' } as const;

				options[option.name] = {
					name: o.name,
					type: optionName[o.type as keyof typeof optionName],
					value: o.value,
				};

				if (o.user) options[option.name].user = o.user;
				if (o.channel) options[option.name].channel = o.channel;
				if (o.role) options[option.name].role = o.role;
				if (o.attachment) options[option.name].attachment = o.attachment;
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
