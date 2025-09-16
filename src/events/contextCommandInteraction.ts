/** @format */

import { MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from 'discord.js';
import { XernerxEventBuilder } from '../build/XernerxEventBuilder.js';
import { XernerxContextCommandOptions } from '../interfaces/XernerxContextCommandOptions.js';
import { XernerxUser } from '../model/XernerxUser.js';
import { XernerxContextCommandValidator } from '../validators/XernerxContextCommandValidator.js';

export class XernerxContextCommandInteractionEvent extends XernerxEventBuilder {
	constructor() {
		super('xernerxContextCommandInteraction', {
			name: 'contextCommandInteraction',
			emitter: 'client',
			once: false,
		});
	}

	override async run(interaction: UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction) {
		const command = this.client.commands.context.get(interaction.commandName);

		if (!command) return;

		let options = { interaction } as XernerxContextCommandOptions<'user'> | XernerxContextCommandOptions<'message'>;

		if (interaction.isUserContextMenuCommand()) {
			(options as XernerxContextCommandOptions<'user'>).user = new XernerxUser(this.client, interaction.targetUser);
		}

		if (interaction.isMessageContextMenuCommand()) {
			(options as XernerxContextCommandOptions<'message'>).message = interaction.targetMessage;
		}

		try {
			await this.client.emit('commandStart', interaction, options, command);

			const validation = new XernerxContextCommandValidator(interaction, command);

			if (!(await validation.validate())) return;

			if (command.defer) await interaction.deferReply();

			if (await command.conditions(options)) return;

			await command.exec(options);

			await this.client.emit('commandFinish', interaction, options, command);
		} catch (error) {
			await this.client.emit('commandError', interaction, options, command, error as Error);
		}
	}
}
