import {
	ContextCommandOptions,
	SlashCommandOptions,
	MessageCommandOptions,
} from "../interfaces/HandlerInterfaces.js";
import XernerxClient from "../client/XernerxClient.js";
import { Handler } from "./Handler.js";
import {
	CommandsDeploy,
	ContextCommandEvents,
	MessageCommandEvents,
	SlashCommandEvents,
} from "../models/Events.js";

export default class CommandHandler {
	client: XernerxClient;
	handler: Handler;

	constructor(client: XernerxClient) {
		this.client = client;

		this.handler = new Handler(client);

		new CommandsDeploy(this.client).deploy();
	}

	/**
	 *
	 * @param {object} options - message command options
	 */
	loadAllMessageCommands(options: MessageCommandOptions) {
		this.handler.loadAllMessageCommands(options);

		const events = new MessageCommandEvents(this.client);

		events.messageCreate();

		events.messageUpdate();

		events.messageDelete();
	}

	loadAllSlashCommands(options: SlashCommandOptions) {
		this.handler.loadAllSlashCommands(options);

		new SlashCommandEvents(this.client).slashCreate();
	}

	loadAllContextCommands(options: ContextCommandOptions) {
		this.handler.loadAllContextCommands(options);

		new ContextCommandEvents(this.client).contextCreate();
	}
}
