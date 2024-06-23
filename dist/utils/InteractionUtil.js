/** @format */
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType, StringSelectMenuBuilder } from 'discord.js';
import Util from './Util.js';
import XernerxError from '../tools/XernerxError.js';
import { Style } from 'dumfunctions';
export default class InteractionUtil extends Util {
	constructor(client, interaction) {
		super(client);
		this.interaction = interaction;
		this.parsed = {
			alias: null,
			args: null,
		};
	}
	async send(content) {
		if (!content) throw new XernerxError(`Can't send a message without content.`);
		return await this.interaction.channel?.send(content);
	}
	async reply(content) {
		if (!content) throw new XernerxError(`Can't send a message without content.`);
		return await (this.interaction.replied || this.interaction.deferred ? this.interaction.editReply(content) : this.interaction.reply(content));
	}
	async mimic(user, interaction, options) {
		user = typeof user == 'string' ? await this.client.users.fetch(user) : user;
		const webhooks = await this.interaction.channel.fetchWebhooks();
		const webhook =
			webhooks.find((wh) => wh.token) ||
			(await this.interaction.channel.createWebhook({
				name: `${this.client.user?.username}'s mimic webhook.`,
				avatar: user.displayAvatarURL() || this.client.user?.displayAvatarURL(),
			}));
		await webhook.send({
			content: interaction.content,
			username: user.username,
			avatarURL: user.displayAvatarURL(),
		});
		setTimeout(() => {
			webhook.delete().catch(() => true);
		}, options.timeout);
	}
	async paginator(embeds, options = {}) {
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
					.setPlaceholder(options.placeholder)
					.addOptions(...embeds.map((embed, i) => ({ label: embed.data.title || 'No Title', description: (options.description ? embed.data.description : undefined) || undefined, value: `${i}` })))
			);
		}
		let index = options.index || 0;
		return options.send
			? await this.interaction.util.send({
					embeds: [embeds[index]],
					components: [options.type == 'combined' || options.type == 'button' ? buttonRow : null, options.type == 'combined' || options.type == 'select-menu' ? menuRow : null].filter((x) => x),
			  })
			: await this.interaction.util
					.reply({
						embeds: [embeds[index]],
						components: [options.type == 'combined' || options.type == 'button' ? buttonRow : null, options.type == 'combined' || options.type == 'select-menu' ? menuRow : null].filter((x) => x),
					})
					.then(async (msg) => {
						const collector = this.interaction.channel
							?.createMessageComponentCollector({ time: options.time })
							.on('collect', (collect) => {
								if (!collect.customId.startsWith(this.interaction.id)) return;
								if (collect.customId.endsWith('select-menu')) {
									index = Number(collect.values[0]);
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
	commands() {
		if (this.interaction.type == InteractionType.ApplicationCommand) return this.client.commands.slash;
		else return this.client.commands.context;
	}
	permissionCheck(type, permissions, emit = true) {
		const missing = [];
		for (const permission of permissions) {
			if (type == 'user') {
				this.interaction.memberPermissions?.has(Style.pascalCase(permission, true)) ? null : missing.push(permission);
			}
			if (type == 'client') {
				this.interaction.guild?.members.me?.permissionsIn(this.interaction.channel?.id).has(Style.pascalCase(permission, true)) ? null : missing.push(permission);
			}
		}
		const command = this.commands()
			.toJSON()
			.find((cmd) => cmd.name == this.parsed.alias?.split(/ +/)[0]);
		if (missing.length && emit) {
			this.client.emit(
				`commandBlock`,
				this.interaction,
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
