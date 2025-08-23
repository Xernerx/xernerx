/** @format */

import {
	Client,
	Collection,
	Interaction,
	InteractionEditReplyOptions,
	InteractionReplyOptions,
	MessageCreateOptions,
	MessageFlags,
	MessagePayload,
	RepliableInteraction,
	TextChannel,
} from 'discord.js';
import { XernerxBaseUtil } from '../util/XernerxUtil.js';
import { XernerxClient } from '../client/XernerxClient.js';
import { XernerxError } from '../tools/XernerxError.js';

export class XernerxInteractionUtil extends XernerxBaseUtil {
	declare public readonly interaction: RepliableInteraction;
	declare public readonly cache: Collection<string, string>;
	declare public args: string[];

	constructor(client: XernerxClient & Client<true>, interaction: Interaction) {
		super(client, interaction);

		this.interaction = interaction as RepliableInteraction;

		this.cache = this.client.cache.slash;
	}

	/**
	 * Sends a message to the channel associated with the interaction.
	 *
	 * @param options - The content or options for the message to be sent. It can be a string, MessagePayload, or MessageCreateOptions.
	 * @returns A promise that resolves to the sent message.
	 * @throws {XernerxError} Throws an error if the options parameter is not provided.
	 */
	public async send(options: string | MessagePayload | MessageCreateOptions) {
		if (!options) throw new XernerxError(`Can't send a message without content.`);

		return await (this.interaction.channel as TextChannel).send(options);
	}

	/**
	 * Replies to the interaction with the provided options.
	 *
	 * @param options - The content or options for the reply. It can be a string, MessagePayload, or InteractionEditReplyOptions.
	 * @returns A promise that resolves to the sent message or the edited reply.
	 * @throws {XernerxError} Throws an error if the options parameter is not provided.
	 */
	public async reply(options: string | MessagePayload | InteractionEditReplyOptions) {
		if (!options) throw new XernerxError(`Can't send a message without options.`);

		return await (this.interaction.replied || this.interaction.deferred ? this.interaction.editReply(options) : this.interaction.reply(options as InteractionReplyOptions));
	}

	/**
	 * Sends a message to the channel associated with the interaction with componentsV2 flag.
	 *
	 * @param options - The options for the message to be sent, including content and other message properties.
	 * @returns A promise that resolves to the sent message.
	 */
	public async send2(options: MessageCreateOptions) {
		options.flags = MessageFlags.IsComponentsV2;

		return await this.send(options);
	}

	/**
	 * Replies to the interaction with the provided options, using the componentsV2 flag.
	 *
	 * @param options - The options for the reply, including content and other message properties.
	 * @returns A promise that resolves to the sent message or the edited reply.
	 */
	public async reply2(options: InteractionEditReplyOptions) {
		options.flags = MessageFlags.IsComponentsV2;

		return await this.reply(options);
	}
}
