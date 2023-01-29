import { Interaction, Message, User, PermissionsBitField } from 'discord.js';
import { ContextCommandBuilder, MessageCommandBuilder, SlashCommandBuilder, XernerxClient } from '../main.js';
import { CommandType } from '../types/enums.js';
import { XernerxMessage, XernerxUser } from '../types/types.js';

function getUser(from: Message | Interaction): XernerxUser {
	if (from instanceof Message) return from.author as XernerxUser;
	else return from.user as XernerxUser;
}

export default function commandValidation(
	action: XernerxMessage | Interaction,
	command: SlashCommandBuilder | MessageCommandBuilder | ContextCommandBuilder | any,
	client: XernerxClient,
	res: boolean = false
) {
	let user = getUser(action);

	if ((command.ignoreOwner || client.settings.ignoreOwner) && client.util.isOwner(user.id)) return res;
	else if (inCooldown(user, client, command, action)) return true;
	else if (command.owner && !client.util.isOwner(user.id)) {
		res = true;

		emit(client, action, command, 'Not an owner', client.settings.ownerId);
	} else if (command.channelType?.length > 0 || command.channelType) {
		if (!Array.isArray(command.channelType)) command.channelType = [command.channelType];

		if (!command?.channelType?.includes(action.channel?.type)) {
			res = true;

			emit(client, action, command, 'Not the correct channel', command.channelType);
		}
	} else if (command.channels?.length > 0 && !command.channels.includes(action.channel?.id)) {
		res = true;

		emit(client, action, command, 'Not a whitelisted channel', command.channels);
	} else if (command.guilds?.length > 0 && !command.guilds.includes(action.guild?.id)) {
		res = true;

		emit(client, action, command, 'Not a whitelisted guild', command.guilds);
	} else if (command.channelType && command.channelType !== action.channel?.type) {
		res = true;

		emit(client, action, command, 'Not the correct type of channel', command.channelType);
	} else if (action?.guild && (command.userPermissions || client.settings.userPermissions)) {
		const permissions = command.userPermissions || client?.settings?.userPermissions?.push(...handlerPermissions(client, command.commandType, 'user')),
			missing: bigint[] = [];

		if (Array.isArray(permissions))
			permissions.map((permission: bigint) => {
				if (!(action.member?.permissions as PermissionsBitField).has(permission)) {
					missing.push(permission);
				}
			});

		if (missing.length > 0) {
			res = true;

			emit(client, action, command, 'Missing User Permissions', missing);
		}
	} else if (action?.guild && (command.clientPermissions || client.settings.clientPermissions)) {
		const permissions = command.clientPermissions || client?.settings?.clientPermissions?.push(...handlerPermissions(client, command.commandType, 'client')),
			missing: bigint[] = [];

		if (Array.isArray(permissions))
			permissions.map((permission: bigint) => {
				if (!(action.member?.permissions as PermissionsBitField).has(permission)) {
					missing.push(permission);
				}
			});

		if (missing.length > 0) {
			res = true;

			emit(client, action, command, 'Missing Client Permissions', missing);
		}
	}

	return res;
}

function emit(
	client: XernerxClient,
	action: Message | Interaction,
	command: MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder,
	reason: string,
	extra?: string[] | number[] | number | string | object | object[]
) {
	return client.emit('commandBlock', action, command, reason, extra);
}

function inCooldown(user: XernerxUser, client: XernerxClient | any, command: MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder | any, action: Message | Interaction) {
	let res = false,
		downs: Record<string, number> = {};

	const { cooldowns, messageCommands, slashCommands, contextCommands, commands } = client.cache;

	if (command.commandType === CommandType.MessageCommand && client.handlerOptions.message.cooldown) {
		if (messageCommands.has(user.id)) {
			const usr = messageCommands.get(user.id);

			usr.timeRemaining = usr.endsAt - Date.now();

			downs.message = usr;

			res = true;
		}

		if (!messageCommands.has(user.id)) {
			messageCommands.set(user.id, toCooldown(action, command, client.handlerOptions.message.cooldown, user.id));

			setInterval(() => {
				messageCommands.delete(user.id);
			}, client.handlerOptions.message.cooldown);
		}
	}

	if (command.commandType === CommandType.SlashCommand && client.handlerOptions.slash.cooldown) {
		if (slashCommands.has(user.id)) {
			const usr = slashCommands.get(user.id);

			usr.timeRemaining = usr.endsAt - Date.now();

			downs.slash = usr;

			res = true;
		}

		if (!slashCommands.has(user.id)) {
			slashCommands.set(user.id, toCooldown(action, command, client.handlerOptions.slash.cooldown, user.id));

			setInterval(() => {
				slashCommands.delete(user.id);
			}, client.handlerOptions.slash.cooldown);
		}
	}

	if (command.commandType === CommandType.ContextCommand && client.handlerOptions.context.cooldown) {
		if (contextCommands.has(user.id)) {
			const usr = contextCommands.get(user.id);

			usr.timeRemaining = usr.endsAt - Date.now();

			downs.context = usr;

			res = true;
		}

		if (!contextCommands.has(user.id)) {
			contextCommands.set(user.id, toCooldown(action, command, client.handlerOptions.context.cooldown, user.id));

			setInterval(() => {
				contextCommands.delete(user.id);
			}, client.handlerOptions.context.cooldown);
		}
	}

	if (client.settings?.cooldown?.default) {
		if (cooldowns.has(user.id)) {
			const usr = cooldowns.get(user.id);

			usr.timeRemaining = usr.endsAt - Date.now();

			downs.default = usr;

			res = true;
		}

		if (!cooldowns.has(user.id)) {
			cooldowns.set(user.id, toCooldown(action, command, client.settings.cooldown.default, user.id));

			setInterval(() => {
				cooldowns.delete(user.id);
			}, client.settings.cooldown.default);
		}
	}

	if (command.cooldown) {
		const name = user.id + '-' + (command.data?.name || command?.name) + '-' + command.commandType;

		if (commands.has(name)) {
			const usr = commands.get(name);

			usr.timeRemaining = usr.endsAt - Date.now();

			downs.command = usr;

			res = true;
		}

		if (!commands.has(name)) {
			commands.set(name, toCooldown(action, command, command.cooldown, name));

			setInterval(() => {
				commands.delete(name);
			}, command.cooldown);
		}
	}

	if (Object.keys(downs).length > 0) client.emit('commandCooldown', action, command, downs);

	return res;
}

function toCooldown(action: Message | Interaction, command: MessageCommandBuilder | ContextCommandBuilder | SlashCommandBuilder | any, cooldown: number, name: string) {
	let user = getUser(action);
	return {
		name,
		id: user.id,
		tag: user.tag,
		commandType: command.commandType,
		commandName: command?.data?.name || command?.name,
		guildId: action?.guild?.id,
		channelId: action?.channel?.id,
		startsAt: Number(Date.now()),
		endsAt: Number(Date.now()) + cooldown,
	};
}

function handlerPermissions(client: XernerxClient, commandType: CommandType, type: string) {
	let permissions: bigint[] = [];

	if (commandType === CommandType.MessageCommand) {
		if (type === 'user') permissions = client.handlerOptions.message?.userPermissions || [];
		else if (type === 'client') permissions = client.handlerOptions.message?.clientPermissions || [];
	} else if (commandType === CommandType.SlashCommand) {
		if (type === 'user') permissions = client.handlerOptions.slash?.userPermissions || [];
		else if (type === 'client') permissions = client.handlerOptions.slash?.clientPermissions || [];
	} else if (commandType === CommandType.ContextCommand) {
		if (type === 'user') permissions = client.handlerOptions.context?.userPermissions || [];
		else if (type === 'client') permissions = client.handlerOptions.context?.clientPermissions || [];
	}

	return permissions;
}
