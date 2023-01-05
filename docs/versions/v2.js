export default {
	Client: {
		XernerxClient: {
			description: "Client extender for building the client.",
			example: "const {XernerxClient} = require('xernerx');\n\nnew XernerxClient({/* options */});",
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
