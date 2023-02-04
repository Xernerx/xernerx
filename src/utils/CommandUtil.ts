import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	Interaction,
	Message,
	MessagePayload,
	StringSelectMenuBuilder,
} from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
import XernerxError from '../tools/XernerxError.js';
import { XernerxMessage } from '../types/types.js';
interface SelectMenuOptions {
	index?: EmbedBuilder;
	row?: ActionRowBuilder;
	component?: StringSelectMenuBuilder;
	components?: object[];
	reply?: boolean;
	id?: string;
	filter?: Function;
	time?: number;
	ephemeral?: boolean;
}

interface ButtonOptions {
	index?: number;
	buttons?: Array<string>;
	reply?: boolean;
	row?: ActionRowBuilder;
	component?: ButtonBuilder;
	components?: object[];
	id?: string;
	filter?: any;
	time?: number;
	ephemeral?: boolean;
}

export class MessageCommandUtil {
	client: XernerxClient;
	message: XernerxMessage;

	constructor(client: XernerxClient, message: Message & XernerxMessage) {
		this.client = client;

		this.message = message;
	}

	async reply(content: MessagePayload | string) {
		if (this.client.cache.messages.has(this.message.id))
			var existingMessage: any = this.client.cache.messages.get(this.message.id);

		if (!existingMessage) {
			const msg = await this.message.reply(content);

			this.message.response = msg.id;

			if (this.client.handlerOptions.message?.handleEdits || this.client.handlerOptions.message?.handleDeletes) {
				this.client.cache.messages.set(this.message.id, this.message);

				setInterval(() => {
					this.client.cache.messages.delete(this.message.id);
				}, this.client.settings.cooldown?.cache || 300000);
			}

			return msg;
		}

		if (existingMessage && this.client.handlerOptions.message?.handleEdits) {
			try {
				const msg = await this.message.channel.messages.fetch(existingMessage.response);

				msg.edit(content);

				return msg;
			} catch {
				const msg = await this.message.reply(content);

				this.message.response = msg.id;

				if (this.client.handlerOptions.message?.handleEdits || this.client.handlerOptions.message?.handleDeletes) {
					this.client.cache.messages.set(this.message.id, this.message);

					setInterval(() => {
						this.client.cache.messages.delete(this.message.id);
					}, this.client.settings.cooldown?.cache || 300000);
				}
			}
		}
	}

	async send(content: MessagePayload | string) {
		if (this.client.cache.messages.has(this.message.id))
			var existingMessage: any = this.client.cache.messages.get(this.message.id);

		if (!existingMessage) {
			const msg = await this.message.channel.send(content);

			this.message.response = msg.id;

			if (this.client.handlerOptions.message?.handleEdits || this.client.handlerOptions.message?.handleDeletes) {
				this.client.cache.messages.set(this.message.id, this.message);

				setInterval(() => {
					this.client.cache.messages.delete(this.message.id);
				}, this.client.settings.cooldown?.cache || 300000);
			}

			return msg;
		}

		if (existingMessage && this.client.handlerOptions.message?.handleEdits) {
			try {
				const msg = await this.message.channel.messages.fetch(existingMessage.response);

				msg.edit(content);

				return msg;
			} catch {
				const msg = await this.message.channel.send(content);

				this.message.response = msg.id;

				if (this.client.handlerOptions.message?.handleEdits || this.client.handlerOptions.message?.handleDeletes) {
					this.client.cache.messages.set(this.message.id, this.message);

					setInterval(() => {
						this.client.cache.messages.delete(this.message.id);
					}, this.client.settings.cooldown?.cache || 300000);
				}
			}
		}
	}

	async defer(time: number) {
		return new Promise((resolve: Function) => setTimeout(resolve, time));
	}

	getCommands() {
		return this.client.commands.message;
	}

	getCommandName() {}

	selectMenuPaginator(embeds: Array<EmbedBuilder>, options?: SelectMenuOptions) {}

	buttonPaginator(embeds: Array<EmbedBuilder>, options: ButtonOptions) {}

	buttonMenuPaginator(embeds: Array<EmbedBuilder>, options: ButtonOptions & SelectMenuOptions) {}

	isOwner() {
		return this.client.util.isOwner(this.message.author.id);
	}

	createModal() {}
}

export class InteractionCommandUtil {
	client: XernerxClient;
	interaction: any;

	constructor(client: XernerxClient, interaction: Interaction) {
		this.client = client;

		this.interaction = interaction;
	}

	reply(content: MessagePayload | string) {
		return this.interaction.replied || this.interaction.deferred
			? this.interaction.editReply(content)
			: this.interaction.reply(content);
	}

	async defer(time: number) {
		return new Promise((resolve: Function) => setTimeout(resolve, time));
	}

	getCommands() {
		if (this.interaction.commandType === 1) return this.client.commands.slash;
		else return this.client.commands.context;
	}

	getCommandName() {}

	selectMenuPaginator(embeds: Array<EmbedBuilder>, options?: SelectMenuOptions) {
		if (!Array.isArray(embeds))
			throw new XernerxError(`Expected embeds to be of type array, received ${typeof embeds} instead.`);

		if (embeds.length > 25) throw new XernerxError(`Max select menu length is 25.`);

		if (typeof options !== 'object') options = {};

		if (!Array.isArray(options.components)) options.components = [];

		if (!options.index) {
			options.index = new EmbedBuilder().setTitle('Index').setColor('Random');

			for (const embed of embeds) {
				options.index.addFields([
					{
						name: embed.data.title || 'No Name',
						value: embed.data.description || 'Page',
						inline: embeds.length > 25 / 2 ? true : false,
					},
				]);
			}
		}

		if (!options.row) {
			options.row = new ActionRowBuilder();

			if (!options.id) options.id = `${this.interaction.id}-menu`;

			options.component = new StringSelectMenuBuilder()
				.setCustomId(options.id)
				.setMaxValues(1)
				.setMinValues(1)
				.setPlaceholder('Select a page.')
				.addOptions({ label: 'index', value: '0' });

			embeds.map((embed, i = 0) => {
				options?.component?.addOptions({
					label: embed.data.title || 'No Name',
					description: embed.data.description || `Page ${i}`,
					value: String(i + 1),
				});
			});

			options.row.addComponents(options.component);
		}

		embeds.unshift(options.index);

		const content = {
			embeds: [options.index],
			components: [options.row, ...options.components],
			ephemeral: !!options.ephemeral,
		};

		(options.reply === undefined || options.reply === true
			? this.interaction.util.reply(content)
			: this.interaction.channel.send(content)
		).then(() => {
			const collector = this.interaction.channel
				.createMessageComponentCollector({
					filter: options?.filter,
					time: options?.time || 60000,
				})

				.on('collect', (interaction: Record<string, string | Function>) => {
					if (!(interaction.customId as string).startsWith(this.interaction.id)) return;

					(interaction.update as Function)({
						embeds: [embeds[parseInt((interaction.values as unknown as Array<string>)[0])]],
					});
				})

				.on('end', () => {
					this.interaction.editReply({ components: [] });
				});
		});
	}

	buttonPaginator(embeds: Array<EmbedBuilder>, options: ButtonOptions) {
		if (!Array.isArray(embeds))
			throw new XernerxError(`Expected embeds to be of type array, received ${typeof embeds} instead.`);

		if (embeds.length <= 0) throw new XernerxError(`The minimum embeds is 1.`);

		if (typeof options !== 'object') options = {};

		if (!Array.isArray(options.components)) options.components = [];

		if (!options.row) {
			options.row = new ActionRowBuilder();

			if (!options.id) options.id = `${this.interaction.id}-menu`;
		}

		if (!options.buttons) options.buttons = ['⏮️', '◀️', '⏹️', '▶️', '⏭️'];

		for (const button of options.buttons) {
			options.row.addComponents(
				new ButtonBuilder()
					.setCustomId(`${this.interaction.id}-${options.buttons.indexOf(button)}`)
					.setEmoji(button)
					.setStyle(ButtonStyle.Primary)
			);
		}

		let embed = embeds[options.index || 0];

		const content = {
			embeds: [embed],
			components: [options.row, ...options.components],
			ephemeral: !!options.ephemeral,
		};

		(options.reply === undefined || options.reply === true
			? this.interaction.util.reply(content)
			: this.interaction.channel.send(content)
		).then((message: XernerxMessage) => {
			const collector = message.channel
				.createMessageComponentCollector({
					filter: options.filter,
					time: options?.time || 60000,
				})

				.on('collect', (interaction: Record<string, string | Function>) => {
					let stop: boolean = false;

					if ((interaction.customId as string).startsWith(this.interaction.id)) {
						switch (Number((interaction.customId as string).split(/-/).pop())) {
							case 0: {
								embed = embeds[0];
								break;
							}
							case 1: {
								embed = embeds[embeds.indexOf(embed) >= 1 ? embeds.indexOf(embed) - 1 : 0];
								break;
							}
							case 2: {
								collector.stop();
								stop = true;
								break;
							}
							case 3: {
								embed =
									embeds[embeds.indexOf(embed) < embeds.length - 1 ? embeds.indexOf(embed) + 1 : embeds.length - 1];
								break;
							}
							case 4: {
								embed = embeds[embeds.length - 1];
								break;
							}
						}

						stop
							? (interaction as Record<string, Function>).update({
									embeds: [embed],
									components: [],
							  })
							: (interaction as Record<string, Function>).update({
									embeds: [embed],
							  });
					}
				})

				.on('end', () => {
					this.interaction.editReply({ components: [] });
				});
		});
	}

	buttonMenuPaginator(embeds: Array<EmbedBuilder>, options: ButtonOptions & SelectMenuOptions) {}

	isOwner() {
		return this.client.util.isOwner(this.interaction.user.id);
	}

	createModal() {}
}
