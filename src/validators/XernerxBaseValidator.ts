/** @format */

import { Interaction, Message } from 'discord.js';
import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxMessageCommandBuilder, XernerxSlashCommandBuilder } from '../main.js';

export class XernerxBaseValidator {
	declare public readonly client: XernerxClient;
	declare public readonly interaction: Interaction | Message;
	declare public readonly command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder;
	declare public satisified: boolean;

	constructor(interaction: Interaction | Message, command: XernerxSlashCommandBuilder | XernerxMessageCommandBuilder) {
		this.client = interaction.client;

		this.interaction = interaction;

		this.command = command;

		this.global();

		this.satisified = true;
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
	 * Validates the current command execution context.
	 *
	 * @returns {boolean} - Returns true if the command execution context is valid and satisfies all conditions; otherwise, false.
	 */
	validate() {
		return this.satisified;
	}
}
