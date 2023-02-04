import XernerxClient from '../client/XernerxClient.js';
import { Handler } from './Handler.js';
import { CommandsDeploy, ContextCommandEvents, MessageCommandEvents, SlashCommandEvents } from '../models/Events.js';
import {
	ContextCommandHandlerOptions,
	MessageCommandHandlerOptions,
	SlashCommandHandlerOptions,
} from '../types/options.js';

/**
 * @description - The command handler.
 * @param {XernerxClient} client - The XernerxClient.
 */
export default class CommandHandler {
	client: XernerxClient;
	handler: Handler;

	constructor(client: XernerxClient) {
		this.client = client;

		this.handler = new Handler(client);

		new CommandsDeploy(this.client).deploy();
	}

	/**
	 * @description - The message command loader.
	 * @param {MessageCommandOptions} options - message command loader options.
	 */
	public loadAllMessageCommands(options: MessageCommandHandlerOptions) {
		this.handler.loadAllMessageCommands(options);

		const events = new MessageCommandEvents(this.client);

		events.messageCreate();

		events.messageUpdate();

		events.messageDelete();
	}

	/**
	 * @description - The slash command loader.
	 * @param {SlashCommandOptions} options - slash command loader options.
	 */
	public loadAllSlashCommands(options: SlashCommandHandlerOptions) {
		this.handler.loadAllSlashCommands(options);

		new SlashCommandEvents(this.client).slashCreate();
	}

	/**
	 * @description - The context command loader.
	 * @param {ContextCommandOptions} options - context command loader options.
	 */
	public loadAllContextCommands(options: ContextCommandHandlerOptions) {
		this.handler.loadAllContextCommands(options);

		new ContextCommandEvents(this.client).contextCreate();
	}
}
