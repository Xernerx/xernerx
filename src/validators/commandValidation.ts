/** @format */

import { ChannelType, PermissionResolvable } from 'discord.js';

import XernerxContextCommand from '../build/XernerxContextCommand.js';
import MessageCommandBuilder from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';

import { XernerxClientType, XernerxMessage, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { XernerxInteraction } from '../types/types.js';
import XernerxMessageCommand from '../build/XernerxMessageCommand.js';
import { Style } from 'dumfunctions';

enum CommandTypes {
	SlashCommand = 'slash',
	MessageCommand = 'message',
	ContextCommand = 'context',
}

export default async function commandValidation(
	event: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxUserContextInteraction> | XernerxMessage,
	command: MessageCommandBuilder | XernerxSlashCommand | XernerxContextCommand
) {
	const client = event.client as XernerxClientType;

	if (command.ignore?.owner && client.settings.ownerId?.includes(event.user.id)) return false;

	const cooldownTime = command.cooldown || client.modules.options?.[CommandTypes[command.filetype]]?.cooldown || client.cooldown?.default || 0;

	const cooldown = {
		id: event.user.id,
		command: command.name,
		createdTimestamp: Number(Date.now()) + cooldownTime,
	};

	const clientPermissions = command.permissions?.client || client.modules.options?.[CommandTypes[command.filetype]]?.permissions?.client || client.settings.permissions?.client || [];
	const userPermissions = command.permissions?.user || client.modules.options?.[CommandTypes[command.filetype]]?.permissions?.user || client.settings.permissions?.user || [];

	if (!client.cooldowns.collections.commands.has(`${event.user.id}-${command.name}`)) {
		client.cooldowns.collections.commands.set(`${event.user.id}-${command.name}`, cooldown);

		setTimeout(() => {
			client.cooldowns.collections.commands.delete(`${event.user.id}-${command.name}`);
		}, cooldownTime);
	} else {
		const user = client.cooldowns.collections.commands.get(`${event.user.id}-${command.name}`) as typeof cooldown;

		const time = (user?.createdTimestamp || 0) - Number(Date.now());

		return emit(
			event,
			{
				reason: 'cooldown',
				message: `You are on cooldown for \`${command.name}\`, wait another \`${Math.round(time / 10) / 100}s\``,
				startedAt: user.createdTimestamp,
				endsAt: user.createdTimestamp + time,
				time,
			},
			command
		);
	}

	if (command.channel && event.channel?.type !== undefined && event.channel?.type >= 0) {
		if (!command.channel.includes(ChannelType[event.channel?.type] as keyof typeof ChannelType))
			return await emit(
				event,
				{
					reason: 'invalidChannel',
					message: `\`${command.name}\` can only be used in ${command.channel.join(', ')} channels`,
					channels: command.channel,
				},
				command
			);
	}

	if ((command.ignore?.channels?.length || 0) > 0 && command.ignore?.channels?.includes(event.channel?.id as string)) return true;

	if ((command.ignore?.guilds?.length || 0) > 0 && command.ignore?.guilds?.includes(event.guild?.id as string)) return true;

	if ((command.ignore?.users?.length || 0) > 0 && command.ignore?.users?.includes(event.user.id as string)) return true;

	if (command.ignore?.voice && (event.member as any)?.voice?.channel)
		return await emit(
			event,
			{
				reason: 'inVoice',
				message: `\`${command.name}\` cannot be ran while in voice chat`,
			},
			command
		);

	if (command.strict?.owner && !client.settings.ownerId.includes(event.user.id))
		return await emit(
			event,
			{
				reason: 'notADeveloper',
				message: `\`${command.name}\` is a developer command`,
				owners: client.settings.ownerId,
			},
			command
		);

	if ((command.strict?.channels?.length || 0) > 0 && !command.strict?.channels?.includes(event.channel?.id as string))
		return await emit(
			event,
			{
				reason: 'channelRestricted',
				message: `\`${command.name}\` cannot be ran in this channel`,
				channels: command.strict?.channels,
			},
			command
		);

	if ((command.strict?.guilds?.length || 0) > 0 && !command.strict?.guilds?.includes(event.guild?.id as string))
		return await emit(
			event,
			{
				reason: 'guildRestricted',
				message: `\`${command.name}\` cannot be ran in this guild`,
				guilds: command.strict?.guilds,
			},
			command
		);

	if ((command.strict?.users?.length || 0) > 0 && !command.strict?.users?.includes(event.user.id))
		return await emit(
			event,
			{
				reason: 'userRestricted',
				message: `\`${command.name}\` cannot be ran by you`,
				users: command.strict?.users,
			},
			command
		);

	if (command.strict?.voice && !(event.member as any)?.voice?.channel)
		return await emit(
			event,
			{
				reason: 'voiceRestricted',
				message: `\`${command.name}\` cannot be ran while not in voice chat`,
			},
			command
		);

	if (command.permissions?.dm == false && event.channel?.type === ChannelType.DM)
		return await emit(
			event,
			{
				reason: 'DMRestricted',
				message: `\`${command.name}\` can't be used in a DM Channel`,
			},
			command
		);

	if (userPermissions.length) {
		const missing: Array<string> = [];

		userPermissions.map((permission) =>
			event.guild?.members.me?.permissionsIn(event.channel?.id as string).has(Style.pascalCase(permission, true) as PermissionResolvable) ? null : missing.push(permission)
		);

		if (missing.length)
			return await emit(
				event,
				{
					reason: 'missingUserPermissions',
					message: `You are missing the following permissions to run \`${command.name}\`:\n${missing.map((permission) => `> - ${permission}`).join('\n')}`,
					required: userPermissions,
					missing,
				},
				command
			);
	}

	if (clientPermissions.length) {
		const missing: Array<string> = [];

		clientPermissions.map((permission) =>
			event.guild?.members.me?.permissionsIn(event.channel?.id as string).has(Style.pascalCase(permission, true) as PermissionResolvable) ? null : missing.push(permission)
		);

		if (missing.length)
			return await emit(
				event,
				{
					reason: 'missingClientPermissions',
					message: `I am missing the following permissions to run \`${command.name}\`:\n${missing.map((permission) => `> - ${permission}`).join('\n')}`,
					required: clientPermissions,
					missing,
				},
				command
			);
	}

	if ((!command.global || !client.settings.global) && client.settings.local !== event.guild?.id)
		return await emit(
			event,
			{
				reason: 'local',
				message: `\`${command.name}\` is not globally deployed`,
			},
			command
		);

	return false;
}

async function emit(
	event: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxUserContextInteraction> | XernerxMessage,
	info: object,
	command: XernerxMessageCommand | XernerxSlashCommand | XernerxContextCommand
) {
	event.client.emit('commandBlock', event, info, command);
	return true;
}
