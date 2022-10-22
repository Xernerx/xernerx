import {
	ActionRowBuilder,
	EmbedBuilder,
	Interaction,
	Message,
	SelectMenuBuilder,
} from "discord.js";
import XernerxClient from "../client/XernerxClient.js";

interface SelectMenuOptions {
	index?: EmbedBuilder;
	row?: ActionRowBuilder;
	component?: SelectMenuBuilder;
	components?: any;
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
}

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

			return msg;
		}

		if (existingMessage && this.client.handlerOptions.message?.handleEdits) {
			try {
				const msg = await this.message.channel.messages.fetch(
					existingMessage.response
				);

				msg.edit(content);

				return msg;
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

			return msg;
		}

		if (existingMessage && this.client.handlerOptions.message?.handleEdits) {
			try {
				const msg = await this.message.channel.messages.fetch(
					existingMessage.response
				);

				msg.edit(content);

				return msg;
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

	async defer(time: number) {
		return new Promise((resolve: any) => setTimeout(resolve, time));
	}

	getCommands() {
		return this.client.commands.message;
	}

	#getCommandName() {}

	#selectMenuPaginator(
		embeds: Array<EmbedBuilder>,
		options?: SelectMenuOptions
	) {}

	#buttonPaginator(embeds: Array<EmbedBuilder>, options: ButtonOptions) {}

	#buttonMenuPaginator(
		embeds: Array<EmbedBuilder>,
		options: ButtonOptions & SelectMenuOptions
	) {}

	isOwner() {
		return this.client.util.isOwner(this.message.author.id);
	}

	#createModal() {}
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

	getCommands() {
		if (this.interaction.commandType === 1) return this.client.commands.slash;
		else return this.client.commands.context;
	}

	#getCommandName() {}

	#selectMenuPaginator(
		embeds: Array<EmbedBuilder>,
		options?: SelectMenuOptions
	) {
		if (!Array.isArray(embeds))
			throw new Error(
				`Expected embeds to be of type array, received ${typeof embeds} instead.`
			);

		if (embeds.length > 25) throw new Error(`Max select menu length is 25.`);

		if (typeof options !== "object") options = {};

		if (!Array.isArray(options.components)) options.components = [];

		if (!options.index) {
			options.index = new EmbedBuilder().setTitle("Index").setColor("Random");

			for (const embed of embeds) {
				options.index.addFields([
					{
						name: embed.data.title || "No Name",
						value: embed.data.description || "Page",
						inline: embeds.length > 25 / 2 ? true : false,
					},
				]);
			}
		}

		if (!options.row) {
			options.row = new ActionRowBuilder();

			if (!options.id) options.id = `${this.interaction.id}-menu`;

			options.component = new SelectMenuBuilder()
				.setCustomId(options.id)
				.setMaxValues(1)
				.setMinValues(1)
				.setPlaceholder("Select a page.")
				.addOptions({ label: "index", value: "index" });

			embeds.map((embed, i = 0) => {});

			options.row.addComponents(options.component);
		}

		const content = {
			embeds: [options.index],
			components: [options.component, ...options.components],
			ephemeral: !!options.ephemeral,
		};

		options.reply === undefined || options.reply === true
			? this.interaction.util.reply(content)
			: this.interaction.channel.send(content);
	}

	#buttonPaginator(embeds: Array<EmbedBuilder>, options: ButtonOptions) {}

	#buttonMenuPaginator(
		embeds: Array<EmbedBuilder>,
		options: ButtonOptions & SelectMenuOptions
	) {}

	isOwner() {
		return this.client.util.isOwner(this.interaction.user.id);
	}

	#createModal() {}
}
