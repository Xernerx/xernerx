/** @format */

import { ChannelType, PermissionFlagsBits, PermissionsString } from 'discord.js';

import XernerxContextCommand from '../build/XernerxContextCommand.js';
import MessageCommandBuilder from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import XernerxClient from '../client/XernerxClient.js';
import { XernerxMessage, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { PermissionNames, XernerxInteraction } from '../types/types.js';

export default async function commandValidation(
	event: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxUserContextInteraction> | XernerxMessage,
	command: MessageCommandBuilder | XernerxSlashCommand | XernerxContextCommand
) {
	const client = event.client as XernerxClient;

	if (command.ignore?.owner && client.settings.ownerId.includes(event.user.id)) return false;

	if (!client.cache.cooldowns.has(`${event.user.id}-${command.name}`)) {
		client.cache.cooldowns.set(`${event.user.id}-${command.name}`, {
			id: event.user.id,
			command: command.name,
			createdTimestamp: Number(Date.now()) + (command.cooldown || 0),
		});

		setTimeout(() => {
			client.cache.cooldowns.delete(`${event.user.id}-${command.name}`);
		}, command.cooldown || 0);
	} else {
		const user = client.cache.cooldowns.get(`${event.user.id}-${command.name}`);

		const time = (user?.createdTimestamp || 0) - Number(Date.now());

		return emit(event, `Command on cooldown, ${time}`);
	}

	if (command.channel && event.channel?.type !== undefined && event.channel?.type >= 0) {
		if (!command.channel.includes(ChannelType[event.channel?.type] as keyof typeof ChannelType)) return await emit(event, `Command can only be used in ${command.channel.join(', ')} channels`);
	}

	if ((command.ignore?.channels?.length || 0) > 0 && command.ignore?.channels?.includes(event.channel?.id as string)) return true;

	if ((command.ignore?.guilds?.length || 0) > 0 && command.ignore?.guilds?.includes(event.guild?.id as string)) return true;

	if ((command.ignore?.users?.length || 0) > 0 && command.ignore?.users?.includes(event.user.id as string)) return true;

	if (command.ignore?.voice && (event.member as any)?.voice?.channel) return await emit(event, 'Command cannot be ran while in voice chat');

	if (command.strict?.owner && !client.settings.ownerId.includes(event.user.id)) return await emit(event, 'Command is a developer command');

	if ((command.strict?.channels?.length || 0) > 0 && !command.strict?.channels?.includes(event.channel?.id as string)) return await emit(event, 'Command cannot be ran in this channel');

	if ((command.strict?.guilds?.length || 0) > 0 && !command.strict?.guilds?.includes(event.guild?.id as string)) return await emit(event, 'Command cannot be ran in this guild');

	if ((command.strict?.users?.length || 0) > 0 && !command.strict?.users?.includes(event.user.id)) return await emit(event, 'Command cannot be ran by you');

	if (command.strict?.voice && !(event.member as any)?.voice?.channel) return await emit(event, 'Command cannot be ran while not in voice chat');

	if (command.permissions?.dm == false && event.channel?.type === ChannelType.DM) return await emit(event, "Can't use in a DM Channel");

	if (command.permissions?.user) {
		if (!(event.member?.permissions as Record<'has', Function>).has(toBigInt(command.permissions.user))) return await emit(event, 'Missing User Permissions');
	}

	if ((!command.global || !client.settings.global) && client.settings.local !== event.guild?.id) return await emit(event, 'Command is not globally deployed');

	return false;
}

async function emit(event: XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxUserContextInteraction> | XernerxMessage, reason: string) {
	event.client.emit('commandBlock', event, reason);
	return true;
}

function toBigInt(permissions: Array<PermissionNames> | Array<string>) {
	let bigIntPermissions = 0n;

	permissions.map((permission: string | bigint) => {
		permission =
			PermissionFlagsBits[
				(permission as string)
					.split(/ +/)
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
					.join('') as PermissionsString
			];

		if (typeof permission === 'bigint') bigIntPermissions += permission;
	});

	return bigIntPermissions;
}
