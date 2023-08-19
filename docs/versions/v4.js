/** @format */

export default {
	Builders: [
		{ name: 'XernerxMessageCommand', description: `soon™️` },
		{ name: 'XernerxSlashCommand', description: `soon™️` },
		{ name: 'XernerxContextCommand', description: `soon™️` },
		{ name: 'XernerxEvent', description: `soon™️` },
		{ name: 'XernerxInhibitor', description: `soon™️` },
		{ name: 'XernerxExtension', description: `soon™️` },
	],
	Client: [
		{
			name: 'XernerxClient',
			description: 'The client used to initiate the process.',
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
				},
			],
			properties: [
				{
					name: 'modules',
					description: `soon™️`,
				},
			],
			events: [
				{
					name: 'commandError',
					description: `soon™️`,
				},
			],
		},
		{
			name: 'XernerxShardClient',
			description: `soon™️`,
			example: '',
			methods: [],
			properties: [],
			events: [],
		},
	],
	Handlers: [],
	Util: [],
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
