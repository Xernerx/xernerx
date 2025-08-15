/** @format */

// /** @format */

import { ChatInputCommandInteraction } from 'discord.js';
import { XernerxSlashCommandBuilder } from '../main.js';

// import { CommandInteraction, Interaction, SlashCommandBuilder } from 'discord.js';
// import { XernerxSlashCommandBuilder } from '../build/XernerxSlashCommandBuilder.js';

// export async function interactionArguments(interaction: CommandIn, command: XernerxSlashCommandBuilder) {
// 	if (command.filetype === 'XernerxSlashCommand') {
// 		const options: Record<string, string> = {};

// 		console.log(interaction);

// 		let args = interaction?.options?._hoistedOptions,
// 			group = interaction?.options?._group,
// 			subcommand = interaction?.options?._subcommand;

// 		// if (interaction.options._hoistedOptions) {
// 		// 	for (const option of interaction.options._hoistedOptions) {
// 		// 		options[option.name] = option.member || option.channel || option.user || option.role || option.value;
// 		// 	}

// 		// 	args = options;
// 		// }

// 		return { args, group, subcommand };
// 	}

// 	// if (command.filetype === 'ContextCommand') {
// 	// 	if (command.type === 'user') return await interaction.client.users.fetch(interaction.targetId);
// 	// 	if (command.type === 'message') return await interaction.channel.messages.fetch(interaction.targetId);
// 	// }
// }

export class XernerxInteractionArguments {
	declare private readonly interaction: ChatInputCommandInteraction;
	declare private readonly command: XernerxSlashCommandBuilder;

	constructor(interaction: ChatInputCommandInteraction, command: XernerxSlashCommandBuilder) {
		this.interaction = interaction;

		this.command = command;
	}

	options() {
		const options: { [index: string]: any } = {};

		if (this.command.groups) {
			const group = this.command.groups.find((group) => group.name === this.group());

			if (!group) return;

			const subcommand = group.subcommands.find((subcommand) => subcommand.name === this.subcommand());

			if (!subcommand) return;

			for (const option of subcommand.options) {
				options[option.name] = this.interaction.options.get(option.name);
			}
		}

		if (this.command.subcommands) {
			const subcommand = this.command.subcommands.find((subcommand) => subcommand.name === this.subcommand());

			if (!subcommand) return;

			for (const option of subcommand.options) {
				options[option.name] = this.interaction.options.get(option.name);
			}
		}

		if (this.command.options) {
			for (const option of this.command.options) {
				options[option.name] = this.interaction.options.get(option.name);
			}
		}

		console.log(options);

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
