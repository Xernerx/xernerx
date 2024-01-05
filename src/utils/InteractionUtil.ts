/** @format */

import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	InteractionEditReplyOptions,
	InteractionReplyOptions,
	MessageCreateOptions,
	MessagePayload,
	StringSelectMenuBuilder,
	TextChannel,
} from 'discord.js';

import XernerxClient from '../client/XernerxClient.js';
import { ContextCommandArguments, PaginatorOptions, SlashCommandArguments } from '../types/interfaces.js';
import { XernerxInteraction } from '../types/types.js';
import Util from './Util.js';
import XernerxError from '../tools/XernerxError.js';
import { XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUser, XernerxUserContextInteraction } from '../types/extenders.js';

type MimicOptions = { timeout: number };
export default class InteractionUtil extends Util {
	private declare readonly interaction;
	public declare parsed: { alias: string | null; args: (SlashCommandArguments | ContextCommandArguments<'message' | 'user'>) | null };

	constructor(client: XernerxClient, interaction: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>) {
		super(client);

		this.interaction = interaction;

		this.parsed = {
			alias: null,
			args: null,
		};
	}

	public async send(content: any) {
		if (!content) throw new XernerxError(`Can't send a message without content.`);

		return await this.interaction.channel?.send(content);
	}

	public async reply(content: string | MessagePayload | InteractionReplyOptions | InteractionEditReplyOptions) {
		if (!content) throw new XernerxError(`Can't send a message without content.`);

		return await (this.interaction.replied || this.interaction.deferred ? this.interaction.editReply(content) : this.interaction.reply(content as InteractionReplyOptions));
	}

	public async mimic(user: XernerxUser | string, interaction: MessageCreateOptions, options: MimicOptions) {
		user = (typeof user == 'string' ? ((await this.client.users.fetch(user)) as XernerxUser) : user) as XernerxUser;

		const webhooks = await (this.interaction.channel as TextChannel).fetchWebhooks();

		const webhook =
			webhooks.find((wh) => wh.token) ||
			(await (this.interaction.channel as TextChannel).createWebhook({
				name: `${this.client.user?.username}'s mimic webhook.`,
				avatar: user.displayAvatarURL() || this.client.user?.displayAvatarURL(),
			}));

		await webhook.send({
			content: interaction.content as string,
			username: user.username,
			avatarURL: user.displayAvatarURL(),
		});

		setTimeout(() => {
			webhook.delete().catch(() => true);
		}, options.timeout);
	}

	// @ts-ignore
	private commandName() {}

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
				...options.buttons.map((button, i) => new ButtonBuilder().setCustomId(`${this.interaction.id}-${i}`).setEmoji(button).setStyle(ButtonStyle.Primary))
			);
		}

		if (options.type == 'select-menu' || options.type == 'combined') {
			menuRow = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId(`${this.interaction.id}-select-menu`)
					.setPlaceholder(options.placeholder as string)
					.addOptions(...embeds.map((embed, i) => ({ label: embed.data.title || 'No Title', description: (options.description ? embed.data.description : undefined) || undefined, value: `${i}` })))
			);
		}

		let index = options.index || 0;

		return options.send
			? await this.interaction.util.send({
					embeds: [embeds[index]],
					components: [options.type == 'combined' || options.type == 'button' ? buttonRow : null, options.type == 'combined' || options.type == 'select-menu' ? menuRow : null].filter((x) => x),
			  } as never)
			: await this.interaction.util
					.reply({
						embeds: [embeds[index]],
						components: [options.type == 'combined' || options.type == 'button' ? buttonRow : null, options.type == 'combined' || options.type == 'select-menu' ? menuRow : null].filter((x) => x),
					} as never)
					.then(async (msg) => {
						const collector = this.interaction.channel
							?.createMessageComponentCollector({ time: options.time })

							.on('collect', (collect) => {
								if (!collect.customId.startsWith(this.interaction.id)) return;

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
								this.interaction.editReply({ components: [] });
							});
					});
	}
}
