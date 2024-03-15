/** @format */

export default {
	Builders: [
		{
			name: 'XernerxMessageCommand',
			description: `The builder used to render message commands.`,
			options: [
				{ name: 'name', description: 'The name of the command', required: true, type: 'String', default: 'null' },
				{ name: 'aliases', description: 'An array of aliases', required: false, type: 'Array<string>', default: '[]' },
				{ name: 'description', description: 'The short description of the command', required: false, type: 'String', default: 'null' },
				{ name: 'usage', description: 'A string of the command use (example)', required: false, type: 'String', default: 'null' },
				{ name: 'separator', description: 'The string used to split message arguments', required: false, type: 'String', default: "' '" },
				{ name: 'info', description: 'The long descriptiopn of the command', required: false, type: 'String', default: 'null' },
				{ name: 'category', description: 'The category of the command', required: false, type: 'String', default: 'null' },
				{ name: 'cooldown', description: 'The cooldown that is set between running this command again', required: false, type: 'Number', default: 'null' },
				{ name: 'global', description: 'Whether this command should be deployed globally or not (only overwrites when bot is set to global)', required: false, type: 'Boolean', default: 'true' },
				{ name: 'channel', description: 'An array of channel types to exclusively work in', required: false, type: 'Array<string | ChannelType>', default: 'null' },
				{ name: 'prefix', description: 'An a string or array of prefixes', required: false, type: 'Array<string> | String', default: '[]' },
				{ name: 'ignore', description: 'The settings to ignore validations of the client', required: false, type: 'Object', default: '{}' },
				{ name: 'strict', description: 'The settings to strictly follow validations of the client', required: false, type: 'Object', default: '{}' },
				{ name: 'permissions', description: 'The client, user and dm permission settings', required: false, type: 'Object', default: '{}' },
				{ name: 'regex', description: 'A regex string to use as command trigger (from root, no prefix)', required: false, type: 'RegExp', default: 'null' },
				{ name: 'args', description: 'An array of arguement builders', required: false, type: 'Array<Object>', default: 'null' },
				{ name: 'flags', description: 'An array of flag builders', required: false, type: 'Array<Object>', default: 'null' },
			],
			methods: [
				{
					name: 'conditions',
					description: 'Conditions are ran before the exec rule, this can be used to define args & prohibit any further actions under certain circomstances when returning a truthy value.',
					parameters: [
						{
							name: 'message',
							type: 'XernerxMessage',
						},
						{
							name: 'options',
							type: 'MessageCommandOptions',
							default: ['args', 'flags'],
						},
					],
				},
				{
					name: 'exec',
					description: 'The exec rule is required to execute the command code, ',
					parameters: [
						{
							name: 'message',
							type: 'XernerxMessage',
						},
						{
							name: 'options',
							type: 'MessageCommandOptions',
							default: ['args', 'flags'],
						},
					],
				},
			],
			properties: [
				{
					name: 'client',
					description: `XernerxClient`,
				},
			],
			example: `import { XernerxMessageCommand } from 'xernerx'

export default class PingCommand extends XernerxMessageCommand {
    constructor() {
        super('ping', {
			name: 'ping',
			description: 'PONG!',
			category: 'Info'
		})

		async exec(message) {
			return await message.util.reply({ content: \`My ping: \${this.client.ws.ping}ms.\` })
		}
    }
}`,
		},
		{
			name: 'XernerxSlashCommand',
			description: `The builder used to render slash commands.`,
			options: [
				{ name: 'name', description: 'The name of the command', required: true, type: 'String', default: 'null' },
				{ name: 'description', description: 'The short description of the command', required: false, type: 'String', default: 'null' },
				{ name: 'usage', description: 'A string of the command use (example)', required: false, type: 'String', default: 'null' },
				{ name: 'separator', description: 'The string used to split message arguments', required: false, type: 'String', default: "' '" },
				{ name: 'info', description: 'The long descriptiopn of the command', required: false, type: 'String', default: 'null' },
				{ name: 'category', description: 'The category of the command', required: false, type: 'String', default: 'null' },
				{ name: 'number', description: 'I have no idea what this but I did put it in', required: false, type: 'Number', default: 'null' },
				{ name: 'cooldown', description: 'The cooldown that is set between running this command again', required: false, type: 'Number', default: 'null' },
				{ name: 'global', description: 'Whether this command should be deployed globally or not (only overwrites when bot is set to global)', required: false, type: 'Boolean', default: 'true' },
				{ name: 'channel', description: 'An array of channel types to exclusively work in', required: false, type: 'Array<string | ChannelType>', default: 'null' },
				{ name: 'prefix', description: 'An a string or array of prefixes', required: false, type: 'Array<string> | String', default: '[]' },
				{ name: 'ignore', description: 'The settings to ignore validations of the client', required: false, type: 'Object', default: '{}' },
				{ name: 'strict', description: 'The settings to strictly follow validations of the client', required: false, type: 'Object', default: '{}' },
				{ name: 'permissions', description: 'The client, user and dm permission settings', required: false, type: 'Object', default: '{}' },
				{ name: 'defer', description: 'Settings to set reply, ephemeral and fetchReply', required: false, type: 'Object', default: 'null' },
				{ name: 'args', description: 'An array of arguement builders', required: false, type: 'Array<Object>', default: '{}' },
				{ name: 'subcommands', description: 'An array of subcommand builders', required: false, type: 'Array<Object>', default: 'null' },
				{ name: 'groups', description: 'An array of group builders', required: false, type: 'Array<Object>', default: 'null' },
			],
			methods: [
				{
					name: 'conditions',
					description: 'Conditions are ran before the exec rule, this can be used to define args & prohibit any further actions under certain circomstances when returning a truthy value.',
					parameters: [
						{
							name: 'interaction',
							type: 'XernerxInteraction',
						},
						{
							name: 'options',
							type: 'InteractionCommandOptions',
							default: ['args', 'group', 'subcommand'],
						},
					],
				},
				{
					name: 'autocomplete',
					description: 'Autocomplete is used when you want to suggest options based on user input.',
					parameters: [
						{
							name: 'interaction',
							type: 'XernerxInteraction',
						},
						{
							name: 'focused',
						},
						{
							name: 'options',
						},
					],
				},
				{
					name: 'exec',
					description: 'The exec rule is required to execute the command code, ',
					parameters: [
						{
							name: 'interaction',
							type: 'XernerxInteraction',
						},
						{
							name: 'options',
							type: 'InteractionCommandOptions',
							default: ['args', 'group', 'subcommand'],
						},
					],
				},
			],
			properties: [
				{
					name: 'client',
					description: `XernerxClient`,
				},
			],
			example: `import { XernerxSlashCommand } from 'xernerx'

export default class PingCommand extends XernerxSlashCommand {
    constructor() {
        super('ping', {
			name: 'ping',
			description: 'PONG!',
			category: 'Info'
		})

		async exec(interaction) {
			return await interaction.util.reply({ content: \`My ping: \${this.client.ws.ping}ms.\` })
		}
    }
}`,
		},
		{
			name: 'XernerxContextCommand',
			description: `The builder used to render context commands.`,
			options: [],
			methods: [
				{
					name: 'conditions',
					description: 'Conditions are ran before the exec rule, this can be used to define args & prohibit any further actions under certain circomstances when returning a truthy value.',
					parameters: [
						{
							name: 'interaction',
							type: 'XernerxInteraction',
						},
						{
							name: 'args',
							type: 'XernerxUser | XernerxMessage',
						},
					],
				},
				{
					name: 'exec',
					description: 'The exec rule is required to execute the command code, ',
					parameters: [
						{
							name: 'interaction',
							type: 'XernerxInteraction',
						},
						{
							name: 'args',
							type: 'XernerxUser | XernerxMessage',
						},
					],
				},
			],
			properties: [
				{
					name: 'client',
					description: `XernerxClient`,
				},
			],
			example: `import { XernerxContextCommand } from 'xernerx'

export default class UserCommand extends XernerxContextCommand {
    constructor() {
        super('user', {
			name: 'user',
			type: 'user'
			description: 'Select a user to mention.',
			category: 'Info'
		})

		async exec(interaction, user) {
			return await interaction.util.reply({ content: \`You selected user: \${user}\` })
		}
    }
}`,
		},
		{
			name: 'XernerxEvent',
			description: `The builder used to run events`,
			options: [],
			methods: [
				{
					name: 'run',
					description: 'The exec rule is required to execute the command code, ',
					parameters: [
						{
							name: 'interaction',
							type: 'XernerxInteraction',
						},
						{
							name: 'args',
							type: 'XernerxUser | XernerxMessage',
						},
					],
				},
			],
			properties: [
				{
					name: 'client',
					description: `XernerxClient`,
				},
			],
			example: `import { XernerxEvent, ActivityType } from 'xernerx'

export default class ReadyEvent extends XernerxEvent {
    constructor() {
        super('ready', {
			name: 'ready',
			emitter: 'client'
			once: false
		})

		async run(client) {
			return await this.client.util.setPresence({
				text: 'examples',
				type: 'Custom',
				status: 'idle',
				interval: 360000
			})
		}
    }
}`,
		},
		{
			name: 'XernerxInhibitor',
			description: `The builder used to check inhibits. Inhibitors will only inhibit on returning a truthy value.`,
			options: [],
			methods: [
				{
					name: 'pre',
					description: 'The pre rule will run at any interaction, regardless of type and/or command found.',
					parameters: [
						{
							name: 'interaction',
							type: 'XernerxInteraction',
						},
						{
							name: 'options',
							type: 'XernerxUser | XernerxMessage | MessageCommandOptions | SlashCommandOptions | ContextCommandOptions',
						},
					],
				},
				{
					name: 'check',
					description: 'The check rule will run before a command trigger (at commandStart ).',
					parameters: [
						{
							name: 'interaction',
							type: 'XernerxInteraction',
						},
						{
							name: 'options',
							type: 'XernerxUser | XernerxMessage | MessageCommandOptions | SlashCommandOptions | ContextCommandOptions',
						},
					],
				},
				{
					name: 'post',
					description: 'The post rule will run after a command trigger (at commandFinish).',
					parameters: [
						{
							name: 'interaction',
							type: 'XernerxInteraction',
						},
						{
							name: 'options',
							type: 'XernerxUser | XernerxMessage | MessageCommandOptions | SlashCommandOptions | ContextCommandOptions',
						},
					],
				},
			],
			properties: [
				{
					name: 'client',
					description: `XernerxClient`,
				},
			],
			example: `import { XernerxInhibitor } from 'xernerx'

export default class CommandInhibitor extends XernerxInhibitor {
    constructor() {
        super('command', {
			name: 'command',
			type: 'command'
		})

		check(interaction) {
			if (interaction.user.id == interaction.user.id) return true
		}
    }
}`,
		},
		{
			name: 'XernerxExtension',
			description: `The builder used to build extensions, this can be imported from the framework or seperetaly installed with npm i xernerx-extension-builder.`,
			note: "This can be installed in a standalone package in case you'd like to make an npm package. This example is not the same as the package!",
			methods: [
				{ name: 'main', description: 'A function ran on bot start.', parameters: [{ name: 'client', type: 'XernerxClient' }] },
				{ name: 'pre', description: 'A function ran after bot start.', parameters: [{ name: 'client', type: 'XernerxClient' }] },
			],
			example: `import { XernerxExtensionBuilder } from 'xernerx'
			
export default class YourExtensionName extends XernerxExtensionBuilder {
	constructor(/* any */) {
		super('YourExtensionName', {options});

		/* any */

	}

/* any */
}`,
		},
	],
	Clients: [
		{
			name: 'XernerxClient',
			description: 'The client used to initiate the process.',
			parameters: [
				{
					name: 'DiscordOptions',
					description: 'Go to the discord.js docs to find these options!',
				},
				{
					name: 'XernerxOptions',
					options: [
						{ name: 'local', description: 'The local guild ID that is used for development', required: true, type: 'String', default: 'null' },
						{ name: 'global', description: 'Whether the bot should deploy globally or locally', required: false, type: 'Boolean', default: 'false' },
						{ name: 'ownerId', description: 'A string or array of user IDs that are considered owner of the bot', required: false, type: 'Array<String> | String', default: '[]' },
						{ name: 'ceaseless', description: 'Whether the client should handle all uncaught errors', required: false, type: 'Boolean', default: 'false' },
						{ name: 'log', description: 'Whether to use internal logging and if so what type of logging and the format', required: false, type: 'Boolean | Object', default: 'null' },
						{ name: 'cooldown', description: 'The global cooldown settings', required: false, type: 'Object', default: 'undefined' },
						{ name: 'ignore', description: 'The global settings to ignore validations of the client', required: false, type: 'Object', default: '{}' },
						{ name: 'permissions', description: 'The global client, user and dm permission settings', required: false, type: 'Object', default: '{}' },
					],
				},
				{ name: 'config', description: 'Any kind of thing you want to attach to the bot can be done in here, usually an object will get passed but it can be literally anything.' },
			],
			example: `import XernerxClient from 'xernerx'

new class Client extends XernerxClient {
    constructor() {
        super(DiscordOptions, XernerxOptions, config?)

        this.connect('token')
    }
}`,
			methods: [
				{
					name: 'connect',
					description: 'Used to connect the client to the discord API and deploy interaction commands.',
					parameters: [
						{
							name: 'token',
							type: 'string',
							default: 'undefined',
							required: true,
						},
					],
				},
			],
			properties: [
				{
					name: 'modules',
					description: `soon™️`,
				},
				{
					name: 'stats',
					description: `soon™️`,
				},
				{
					name: 'settings',
					description: `soon™️`,
				},
			],
			events: [
				{
					name: 'commandError',
					description: `soon™️`,
				},
				{
					name: 'commandBlock',
					description: `soon™️`,
				},
				{
					name: 'commandStart',
					description: `soon™️`,
				},
				{
					name: 'commandFinish',
					description: `soon™️`,
				},
				{
					name: 'commandNotFound',
					description: `soon™️`,
				},
			],
		},
		{
			name: 'XernerxShardClient',
			description: `A sharding client for managing multiple shards.`,
			options: [],
			example: `import { XernerxShardClient } from 'xernerx';
import config from './data/config/config.js';

new XernerxShardClient('./main.js', { token: config.token }, { log: { info: true } });`,
			methods: [],
			properties: [],
		},
	],
	Handlers: [
		{ name: 'CommandHandler', description: 'The handler used to handle commands' },
		{ name: 'EventHandler', description: 'The handler used to handle events' },
		{ name: 'InhibitorHandler', description: 'The handler used to handle inhibitors' },
		{ name: 'ExtensionHandler', description: 'The handler used to handle extensions' },
		{ name: 'WebhookHandler', description: 'The handler used to handle webhooks' },
	],
	Util: [{ name: 'clientUtil' }, { name: 'messageUtil' }, { name: 'interactionUtil' }],
	Tools: [
		{
			name: 'XernerxLog',
			description: `soon™️`,
		},
		{
			name: 'XernerxIntents',
			description: `soon™️`,
		},
	],
};
