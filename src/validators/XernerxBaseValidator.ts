/** @format */

import { Interaction, Message } from 'discord.js';

import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxContextCommandBuilder } from '../build/XernerxContextCommandBuilder.js';
import { XernerxMessageCommandBuilder } from '../build/XernerxMessageCommandBuilder.js';
import { XernerxSlashCommandBuilder } from '../build/XernerxSlashCommandBuilder.js';

export class XernerxBaseValidator {
	declare public readonly client: XernerxClient;
	declare public readonly interaction: Interaction | Message;
	declare public readonly command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder | XernerxContextCommandBuilder;
	declare public satisified: boolean;

	constructor(interaction: Interaction | Message, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder | XernerxContextCommandBuilder) {
		this.client = interaction.client;

		this.interaction = interaction;

		this.command = command;

		this.satisified = true;
	}

	/**
	 * Checks if the command requires a premium subscription and validates the user's premium status.
	 * If the user does not have a premium subscription, it emits an error and sets the validation status to false.
	 *
	 * @returns A promise that resolves when the premium check is complete.
	 */
	public async premium() {
		if (!this.command.premium) return;

		const premium = await this.interaction.user.premium('');

		if (!premium) {
			this.emit({ type: 'premiumCommand', message: 'This command requires a premium subscription.', data: [] });

			this.satisified = false;
		}
	}

	/**
	 * Checks if the command is globally available or restricted to specific guilds.
	 * If the command is not available in the current guild, it emits an error and sets the validation status to false.
	 */
	public global() {
		if (!this.interaction.guild) return;

		if (!this.client.settings.global && !this.client.settings.guildId?.includes(this.interaction.guild?.id)) {
			this.emit({ type: 'localCommand', message: 'This command is not available in this server.', data: this.client.settings.guildId as Array<string> });

			this.satisified = false;
		}
	}

	/**
	 * Emits an error event related to command execution.
	 *
	 * @param error - An object containing details about the error.
	 * @param error.type - The type of error that occurred.
	 * @param error.message - A descriptive message about the error.
	 * @param error.data - Optional additional data related to the error.
	 * @returns A promise that resolves when the error event has been emitted.
	 */
	async emit(error: { type: string; message: string; data?: Array<string> }) {
		return await this.client.emit('commandBlock', this.interaction, this.command, error);
	}

	/**
	 * Validates the command by checking its global availability and premium status.
	 *
	 * @returns A promise that resolves to a boolean indicating whether all validation checks are satisfied.
	 */
	async validate() {
		await this.global();

		await this.premium();

		return this.satisified;
	}
}
