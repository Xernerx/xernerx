import { Interaction, Message } from "discord.js";
import XernerxClient from "../client/XernerxClient.js";

export class MessageCommandUtil {
	client: XernerxClient;
	message: any;

	constructor(client: XernerxClient, message: Message) {
		this.client = client;

		this.message = message;
	}

	async reply(content: any) {
		if (this.client.cache.messages.has(this.message.id))
			var existingMessage: any = this.client.cache.messages.get(
				this.message.id
			);

		if (!existingMessage) {
			const msg = await this.message.reply(content);

			this.message.response = msg.id;

			if (
				this.client.handlerOptions.message?.handleEdits ||
				this.client.handlerOptions.message?.handleDeletes
			) {
				this.client.cache.messages.set(this.message.id, this.message);

				setInterval(() => {
					this.client.cache.messages.delete(this.message.id);
				}, this.client.settings.cooldown?.cache || 300000);
			}
		}

		if (existingMessage && this.client.handlerOptions.message?.handleEdits) {
			try {
				const msg = await this.message.channel.messages.fetch(
					existingMessage.response
				);

				msg.edit(content);
			} catch {
				const msg = await this.message.reply(content);

				this.message.response = msg.id;

				if (
					this.client.handlerOptions.message?.handleEdits ||
					this.client.handlerOptions.message?.handleDeletes
				) {
					this.client.cache.messages.set(this.message.id, this.message);

					setInterval(() => {
						this.client.cache.messages.delete(this.message.id);
					}, this.client.settings.cooldown?.cache || 300000);
				}
			}
		}
	}

	async send(content: any) {
		if (this.client.cache.messages.has(this.message.id))
			var existingMessage: any = this.client.cache.messages.get(
				this.message.id
			);

		if (!existingMessage) {
			const msg = await this.message.channel.send(content);

			this.message.response = msg.id;

			if (
				this.client.handlerOptions.message?.handleEdits ||
				this.client.handlerOptions.message?.handleDeletes
			) {
				this.client.cache.messages.set(this.message.id, this.message);

				setInterval(() => {
					this.client.cache.messages.delete(this.message.id);
				}, this.client.settings.cooldown?.cache || 300000);
			}
		}

		if (existingMessage && this.client.handlerOptions.message?.handleEdits) {
			try {
				const msg = await this.message.channel.messages.fetch(
					existingMessage.response
				);

				msg.edit(content);
			} catch {
				const msg = await this.message.channel.send(content);

				this.message.response = msg.id;

				if (
					this.client.handlerOptions.message?.handleEdits ||
					this.client.handlerOptions.message?.handleDeletes
				) {
					this.client.cache.messages.set(this.message.id, this.message);

					setInterval(() => {
						this.client.cache.messages.delete(this.message.id);
					}, this.client.settings.cooldown?.cache || 300000);
				}
			}
		}
	}
}

export class InteractionCommandUtil {
	client: XernerxClient;
	interaction: any;

	constructor(client: XernerxClient, interaction: Interaction) {
		this.client = client;

		this.interaction = interaction;
	}

	reply(content: any) {
		return this.interaction.replied || this.interaction.deferred
			? this.interaction.editReply(content)
			: this.interaction.reply(content);
	}

	async defer(time: number) {
		return new Promise((resolve: any) => setTimeout(resolve, time));
	}
}
