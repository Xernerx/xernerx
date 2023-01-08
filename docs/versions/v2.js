export default {
	info: {
		deprecated: true,
		description: "The second version of Xernerx (still in CommonJS)",
		versions: [
			"2.7.5",
			"2.7.4",
			"2.7.3",
			"2.7.2",
			"2.7.1",
			"2.7.0",
			"2.6.9",
			"2.6.8",
			"2.6.7",
			"2.6.6",
			"2.6.5",
			"2.6.4",
			"2.6.3",
			"2.6.2",
			"2.6.1",
			"2.6.0",
			"2.5.0",
			"2.4.5",
			"2.4.4",
			"2.4.3",
			"2.4.2",
			"2.4.1",
			"2.4.0",
			"2.3.0",
			"2.2.0",
			"2.1.8",
			"2.1.7",
			"2.1.6",
			"2.1.5",
			"2.1.4",
			"2.1.3",
			"2.1.2",
			"2.1.1",
			"2.1.0",
			"2.0.7",
			"2.0.6",
			"2.0.5",
			"2.0.4",
			"2.0.3",
			"2.0.2",
			"2.0.1",
			"2.0.0"
		]
	},
	Client: {
		XernerxClient: {
			description: "Client extender for building the client.",
			example: `const Xernerx = require('xernerx');

			new Xernerx.Client(options);`,
			properties: [],
			parameters: [
				{
					name: "guildId",
					type: "string",
					default: "undefined",
					required: false,
					description: "The guild ID used to globally load commands."
				},
				{
					name: "global",
					type: "boolean",
					default: "false",
					required: false,
					description: "Whether to load commands globally or locally."
				},
				{
					name: "prefix",
					type: "string[]",
					default: "[]",
					required: false,
					description: "An array of prefixes used for message commands."
				},
				{
					name: "mentionPrefix",
					type: "boolean",
					default: "false",
					required: false,
					description: "Whether the bot should listen to messages containing a client mention."
				},
				{
					name: "ownerId",
					type: "string[]",
					default: "[]",
					required: false,
					description: "An array of user IDs that are considered owner."
				},
				{
					name: "ignoreOwner",
					type: "boolean",
					default: "false",
					required: false,
					description: "Whether the bot should ignore owner privileges."
				},
				{
					name: "defaultCooldown",
					type: "number",
					default: "0",
					required: false,
					description: "A number of milliseconds each command cooldown should be."
				},
				{
					name: "cacheTime",
					type: "number",
					default: "300000",
					required: false,
					description: "A number of seconds for message cache to be deleted."
				},
				{
					name: "userPermissions",
					type: "string[]",
					default: "[]",
					required: false,
					description: "An array of permissions the user needs to use the commands."
				},
				{
					name: "clientPermissions",
					type: "string[]",
					default: "[]",
					required: false,
					description: "An array of permissions the client needs to use the commands."
				},
				{
					name: "logging",
					type: "boolean || string[]",
					default: "false",
					required: false,
					description: "True or array with names for logging in the console on login."
				}
			]
		}
	},
	Handlers: {
		CommandHandler: {},
		EventHandler: {},
		InhibitorHandler: {},
		WebhookHandler: {}
	},
	Builds: {
		ContextCommand: {},
		Event: {},
		Inhibitor: {},
		MessageCommand: {},
		SlashCommand: {}
	},
	Events: {
		CommandRun: {},
		CommandBlock: {},
		CommandError: {}
	},
	Exports: {
		Discord: {},
		DumFunctions: {}
	}
}
