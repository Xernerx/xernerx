/** @format */

import { Client, Interaction, Message, MessagePayload, Webhook, WebhookMessageCreateOptions } from 'discord.js';
import { XernerxClient } from '../client/XernerxClient.js';

export class XernerxBaseUtil {
	declare public readonly client: XernerxClient & Client<true>;
	declare public readonly parsed: {
		command: string | null;
		alias: string | null;
		mention: boolean | null;
		prefix: string | null;
	};
	declare public interaction: Interaction | Message;

	constructor(client: XernerxClient & Client<true>, interaction: Interaction | Message) {
		this.client = client;

		this.parsed = { command: null, alias: null, mention: null, prefix: null };

		this.interaction = interaction;
	}

	/**
	 * Sends a message using a webhook in the current interaction's channel.
	 *
	 * @param options - The message content or options to send via the webhook. This can be a string, MessagePayload, or WebhookMessageCreateOptions.
	 * @returns A promise that resolves to the message sent by the webhook.
	 */
	public async webhook(options: string | MessagePayload | WebhookMessageCreateOptions) {
		if (!this.interaction.channel) return;

		// @ts-expect-error
		const webhooks = await this.interaction.channel.fetchWebhooks();
		let webhook = (await webhooks.find((wh: Webhook) => wh.token)) as Webhook;

		if (!webhook)
			// @ts-expect-error
			webhook = this.interaction.channel.createWebhook({
				name: this.client.user.username,
				avatar: this.client.user.displayAvatarURL(),
			});

		return await webhook.send(options);
	}
}
