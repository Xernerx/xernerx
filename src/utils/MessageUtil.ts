/** @format */

import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	EmbedBuilder,
	ForumChannel,
	MessageEditOptions,
	MessagePayload,
	MessageReplyOptions,
	NewsChannel,
	StringSelectMenuBuilder,
	TextChannel,
	User,
} from 'discord.js';

import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage } from '../types/extenders.js';
import Util from './Util.js';
import sendWebhook from '../functions/sendWebhook.js';
import XernerxError from '../tools/XernerxError.js';
import { PaginatorOptions } from '../main.js';

export default class MessageUtil extends Util {
	private readonly message;

	public declare parsed: {
		alias: null | string;
		prefix: null | string;
	};

	constructor(client: XernerxClient, message: XernerxMessage) {
		super(client);

		this.message = message;

		this.parsed = {
			alias: null,
			prefix: null,
		};
	}

	public async send(content: any) {
		if (this.client.cache.messages.has(this.message.id) && this.client.modules.options.message?.handleEdits) {
			const id = this.client.cache.messages.get(this.message.id);

			if (!id) return null;

			const msg = await this.message.channel.messages.fetch(id);

			msg.edit(content as MessageEditOptions);

			return msg;
		}

		const msg = await this.message.channel.send(content as MessageReplyOptions);

		this.client.cache.messages.set(this.message.id, msg.id);

		return msg;
	}

	public async reply(content: string | MessagePayload | MessageReplyOptions | MessageEditOptions) {
		if (this.client.cache.messages.has(this.message.id) && this.client.modules.options.message?.handleEdits) {
			const id = this.client.cache.messages.get(this.message.id);

			if (!id) return null;

			const msg = await this.message.channel.messages.fetch(id);

			msg.edit(content as MessageEditOptions);

			return msg;
		}

		const msg = await this.message.reply(content as MessageReplyOptions);

		this.client.cache.messages.set(this.message.id, msg.id);

		return msg;
	}

	public async webhookReply(content: MessagePayload, url?: URL, user?: User) {
		if (this.message.channel.type === ChannelType.DM) throw new XernerxError(`Can't use this method in DM Channels`);

		const channel = this.message.channel as TextChannel | NewsChannel | ForumChannel;

		let webhook;

		if (!url) {
			webhook = await channel.createWebhook({
				name: user?.username || (this.client.user?.username as string),
				avatar: user?.avatarURL() || this.client.user?.avatarURL(),
			});
		}

		if (!webhook) webhook = { url };

		await sendWebhook(webhook.url as URL, content);

		if (!url) (webhook as Record<'delete', Function>).delete();

		return;
	}

	public async paginator(embeds: Array<EmbedBuilder>, options: PaginatorOptions = {}) {
		let buttonRow, menuRow;

		if (embeds.length <= 0) throw new XernerxError(`Can't make a paginator without embeds`);

		options = {
			type: options.type ?? 'combined',
			buttons: options.buttons ?? ['⏪', '◀️', '⏹️', '▶️', '⏩'],
			description: options.description ?? false,
			placeholder: options.placeholder ?? 'Change page',
			index: options.index ?? 0,
			send: options.send ?? false,
			filter: options.filter ?? (() => true),
			time: options.time ?? 300000,
		};

		if (options.type == 'button' || options.type == 'combined') {
			if (!options.buttons) throw new XernerxError(`¯\\_(ツ)_/¯ Somehow there are no buttons? ¯\\_(ツ)_/¯`);

			buttonRow = new ActionRowBuilder().addComponents(
				...options.buttons.map((button, i) => new ButtonBuilder().setCustomId(`${this.message.id}-${i}`).setEmoji(button).setStyle(ButtonStyle.Primary))
			);
		}

		if (options.type == 'select-menu' || options.type == 'combined') {
			menuRow = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId(`${this.message.id}-select-menu`)
					.setPlaceholder(options.placeholder as string)
					.addOptions(...embeds.map((embed, i) => ({ label: embed.data.title || 'No Title', description: (options.description ? embed.data.description : undefined) || undefined, value: `${i}` })))
			);
		}

		let index = options.index || 0;

		return options.send
			? await this.message.util.send({
					embeds: [embeds[index]],
					components: [options.type == 'combined' || options.type == 'button' ? buttonRow : null, options.type == 'combined' || options.type == 'select-menu' ? menuRow : null].filter((x) => x),
			  } as never)
			: await this.message.util
					.reply({
						embeds: [embeds[index]],
						components: [options.type == 'combined' || options.type == 'button' ? buttonRow : null, options.type == 'combined' || options.type == 'select-menu' ? menuRow : null].filter((x) => x),
					} as never)
					.then(async (msg) => {
						const collector = this.message.channel
							?.createMessageComponentCollector({ time: options.time })

							.on('collect', (collect) => {
								if (!collect.customId.startsWith(this.message.id)) return;

								if (collect.customId.endsWith('select-menu')) {
									index = Number((collect as unknown as Record<string, Array<string>>).values[0]);

									collect.update({ embeds: [embeds[index]] });
								} else {
									const option = Number(collect.customId.split(/-/)[1]);

									let embed = embeds[index];

									if (option == 0) {
										index = 0;
										embed = embeds[index];
										collect.update({ embeds: [embed] });
									}
									if (option == 1) {
										index = embeds.indexOf(embed) >= 1 ? embeds.indexOf(embed) - 1 : 0;
										embed = embeds[index];
										collect.update({ embeds: [embed] });
									}
									if (option == 2) {
										collect.update({ components: [] });
										collector?.stop();
									}
									if (option == 3) {
										index = embeds.indexOf(embed) < embeds.length - 1 ? embeds.indexOf(embed) + 1 : embeds.length - 1;
										embed = embeds[index];
										collect.update({ embeds: [embed] });
									}
									if (option == 4) {
										index = embeds.length - 1;
										embed = embeds[index];
										collect.update({ embeds: [embed] });
									}
								}
							})
							.on('end', async () => {
								await msg?.edit({ components: [] });
							});
					});
	}
}
