/** @format */

export default {
	Builders: [
		{
			name: 'MessageCommand',
			description: 'The MessageCommand builder.',
			options: [
				{
					name: 'name',
					type: 'string',
					required: true,
					description: 'The name of the MessageCommand.',
				},
				{
					name: 'aliases',
					type: 'Array<string>',
					required: false,
					description: 'An array of aliases the command can also be ran with.',
				},
				{
					name: 'description',
					type: 'string',
					required: false,
					description: 'The description of the command.',
				},
				{
					name: 'info',
					type: 'string',
					required: false,
					description: 'The detailed description of the command',
				},
				{
					name: 'owner',
					type: 'boolean',
					required: false,
					description: 'Whether this command should only be ran by the bot owners.',
				},
				{
					name: 'admin',
					type: 'boolean',
					required: false,
					description: 'Whether this command should only be ran by admin users.',
				},
				{
					name: 'channel',
					type: 'guild | dm',
					required: false,
					description: 'Whether the command can be ran in a dm, guild channel or both.',
				},
				{
					name: 'category',
					type: 'string',
					required: false,
					description: 'The category of the command.',
				},
				{
					name: 'cooldown',
					type: 'number',
					required: false,
					description: 'The cooldown that is needed in between running this command.',
				},
				{
					name: 'ignoreOwner',
					type: 'boolean',
					required: false,
					description: 'Whether this command should ignore owner privileges on validation or not.',
				},
				{
					name: 'inVoice',
					type: 'boolean',
					required: false,
					description: 'Whether this command can only be ran when in voice chat or not.',
				},
			],
			methods: [
				{
					name: 'exec',
					description: 'The execution script that should run when a command is ran.',
				},
			],
		},
		{
			name: 'InteractionCommand',
			description: 'The InteractionCommand builder.',
			options: [
				{
					name: 'name',
					type: 'string',
					required: true,
					description: 'The name of the InteractionCommand.',
				},
				{
					name: 'description',
					type: 'string',
					required: true,
					description: 'The description of the command.',
				},
				{
					name: 'info',
					type: 'string',
					required: false,
					description: 'The detailed description of the command',
				},
				{
					name: 'owner',
					type: 'boolean',
					required: false,
					description: 'Whether this command should only be ran by the bot owners.',
				},
				{
					name: 'admin',
					type: 'boolean',
					required: false,
					description: 'Whether this command should only be ran by admin users.',
				},
				{
					name: 'channel',
					type: 'guild | dm',
					required: false,
					description: 'Whether the command can be ran in a dm, guild channel or both.',
				},
				{
					name: 'separator',
					type: 'string',
					required: false,
					description: 'The separator of the command arguments.',
				},
				{
					name: 'category',
					type: 'string',
					required: false,
					description: 'The category of the command.',
				},
				{
					name: 'cooldown',
					type: 'number',
					required: false,
					description: 'The cooldown that is needed in between running this command.',
				},
				{
					name: 'ignoreOwner',
					type: 'boolean',
					required: false,
					description: 'Whether this command should ignore owner privileges on validation or not.',
				},
				{
					name: 'inVoice',
					type: 'boolean',
					required: false,
					description: 'Whether this command can only be ran when in voice chat or not.',
				},
			],
			methods: [
				{
					name: 'exec',
					description: 'The execution script that should run when a command is ran.',
				},
			],
		},
		{
			name: 'ContextMenuCommand',
			description: 'The ContextMenuCommand builder.',
			options: [
				{
					name: 'name',
					type: 'string',
					required: true,
					description: 'The name of the InteractionCommand.',
				},
				{
					name: 'type',
					type: 'USER | MESSAGE | 2 | 3',
					required: true,
					description: 'The type of ContextMenuCommand this should be.',
				},
				{
					name: 'owner',
					type: 'boolean',
					required: false,
					description: 'Whether this command should only be ran by the bot owners.',
				},
				{
					name: 'admin',
					type: 'boolean',
					required: false,
					description: 'Whether this command should only be ran by admin users.',
				},
				{
					name: 'category',
					type: 'string',
					required: false,
					description: 'The category of the command.',
				},
			],
			methods: [
				{
					name: 'exec',
					description: 'The execution script that should run when a command is ran.',
				},
			],
		},
		{
			name: 'Event',
			options: [
				{
					name: 'name',
					type: 'DiscordEvent | XernerxEvent | NodeEvent',
					default: '',
					required: true,
					description: 'The name of the event',
				},
				{
					name: 'once',
					type: 'boolean',
					default: false,
					required: false,
					description: 'Whether to run this command once or on every trigger.',
				},
				{
					name: 'process',
					type: 'boolean',
					default: false,
					required: false,
					description: 'Whether this event is a node process or not.',
				},
			],
			methods: [
				{
					name: 'run',
					description: 'The execution script that should run when a command is ran.',
				},
			],
			properties: [
				{
					name: 'name',
					description: 'The name of the event',
				},
				{
					name: 'once',
					description: 'Whether to run this command once or on every trigger.',
				},
				{
					name: 'process',
					description: 'Whether this event is a node process or not.',
				},
				{
					name: 'config',
					description: 'An object of self configured options.',
				},
			],
		},
	],
	Clients: [
		{
			name: 'Client',
			description: `soon™️`,
		},
	],
	Handlers: [
		{
			name: 'CommandHandler',
			description: `soon™️`,
		},
		{
			name: 'EventHandler',
			description: `soon™️`,
		},
		{
			name: 'LanguageHandler',
			description: `soon™️`,
		},
	],
	Util: [
		{
			name: 'reply',
			description: `soon™️`,
		},
		{
			name: 'selectMenuPaginator',
			description: `soon™️`,
		},
		{
			name: 'buttonPaginator',
			description: `soon™️`,
		},
		{
			name: 'commandName',
			description: `soon™️`,
		},
	],
};
