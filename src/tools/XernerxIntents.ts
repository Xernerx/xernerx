/** @format */

export const XernerxIntents = {
	Default: [
		'Guilds',
		'GuildModeration',
		'GuildBans',
		'GuildEmojisAndStickers',
		'GuildIntegrations',
		'GuildWebhooks',
		'GuildInvites',
		'GuildVoiceStates',
		'GuildMessages',
		'GuildMessageReactions',
		'GuildMessageTyping',
		'DirectMessages',
		'DirectMessageReactions',
		'DirectMessageTyping',
		'GuildScheduledEvents',
		'AutoModerationConfiguration',
		'AutoModerationExecution',
	],
	All: [''],
};

XernerxIntents.All = [...XernerxIntents.Default, 'GuildMembers', 'GuildPresences', 'MessageContent'];
