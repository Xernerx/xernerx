/** @format */

import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageCreateOptions,
	MessageEditOptions,
	MessagePayload,
	MessageReplyOptions,
	PermissionResolvable,
	StringSelectMenuBuilder,
	TextChannel,
} from 'discord.js';

import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage, XernerxUser } from '../types/extenders.js';
import Util from './Util.js';
import XernerxError from '../tools/XernerxError.js';
import { PaginatorOptions } from '../types/interfaces.js';
import { PermissionNames } from '../main.js';
import { Style } from 'dumfunctions';

type MimicOptions = { timeout: number };

export default class MessageUtil extends Util {
	private declare readonly message;
	public declare parsed: {
		alias: string | null;
		prefix: string | null;
		args: Record<string, unknown> | null;
	};

	constructor(client: XernerxClient, message: XernerxMessage) {
		super(client);

		this.message = ((message as any)?.message as XernerxMessage) || message;

		this.parsed = {
			alias: null,
			prefix: null,
			args: null,
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

		const msg = await (this.message.channel as any).send(content as MessageReplyOptions);

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

	public async mimic(user: XernerxUser | string, message: MessageCreateOptions, options: MimicOptions) {
		user = (typeof user == 'string' ? ((await this.client.users.fetch(user)) as XernerxUser) : user) as XernerxUser;

		const webhooks = await (this.message.channel as TextChannel).fetchWebhooks();

		const webhook =
			webhooks.find((wh) => wh.token) ||
			(await (this.message.channel as TextChannel).createWebhook({
				name: `${this.client.user?.username}'s mimic webhook.`,
				avatar: user.displayAvatarURL() || this.client.user?.displayAvatarURL(),
			}));

		await webhook.send({
			content: message.content as string,
			username: user.username,
			avatarURL: user.displayAvatarURL(),
		});

		setTimeout(() => {
			webhook.delete().catch(() => true);
		}, options.timeout);
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
						const collector = (this.message.channel as any)
							?.createMessageComponentCollector({ time: options.time })

							.on('collect', (collect: any) => {
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

	public commands() {
		return this.client.commands.message;
	}

	public permissionCheck(type: 'user' | 'client', permissions: Array<PermissionNames>, emit: boolean = true) {
		const missing = [];
		for (const permission of permissions) {
			if (type == 'user') {
				this.message.member?.permissionsIn(this.message.channel.id).has(Style.pascalCase(permission, true) as PermissionResolvable) ? null : missing.push(permission);
			}
			if (type == 'client') {
				this.message.guild?.members.me?.permissionsIn(this.message.channel.id).has(Style.pascalCase(permission, true) as PermissionResolvable) ? null : missing.push(permission);
			}
		}

		const command = this.commands().find((cmd) => cmd.name == this.parsed.alias || cmd.aliases?.includes(this.parsed.alias as string));

		if (missing.length && emit) {
			this.client.emit(
				`commandBlock`,
				this.message,
				{
					reason: `missing${Style.pascalCase(type)}Permissions`,
					message: `${type == 'user' ? 'You are' : 'I am'} missing the following permissions to run \`${command?.name}\`:\n${missing.map((permission) => `> - ${permission}`).join('\n')}`,
					required: permissions,
					missing,
				},
				command || null
			);

			return false;
		} else if (missing.length && !emit) return missing;
		else return true;
	}
}
