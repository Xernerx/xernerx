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

	public async send(options: string | MessagePayload | MessageCreateOptions) {
		if (!options) throw new XernerxError(`Can't send a message without content.`);

		return await (this.interaction.channel as TextChannel).send(options);
	}

	public async reply(options: string | MessagePayload | InteractionEditReplyOptions) {
		if (!options) throw new XernerxError(`Can't send a message without options.`);

		return await (this.interaction.replied || this.interaction.deferred ? this.interaction.editReply(options) : this.interaction.reply(options as InteractionReplyOptions));
	}

	public async send2(options: MessageCreateOptions) {
		options.flags = MessageFlags.IsComponentsV2;

		return await this.send(options);
	}

	public async reply2(options: InteractionEditReplyOptions) {
		options.flags = MessageFlags.IsComponentsV2;

		return await this.reply(options);
	}
}
