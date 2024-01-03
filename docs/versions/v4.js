/** @format */

export default {
	Builders: [
		{
			name: 'XernerxMessageCommand',
			description: `The builder used to render message commands.`,
			options: [],
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
				},
				{ name: 'XernerxOptions' },
				{ name: 'config' },
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
