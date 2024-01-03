/** @format */

import XernerxClient from '../client/XernerxClient.js';
import { ContextCommandArguments, MessageCommandArguments, SlashCommandArguments } from '../types/interfaces.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import XernerxMessageCommand from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
import { XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { InhibitorType, XernerxInteraction } from '../types/types.js';

export async function inhibitorValidation(
	event: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
	args?: SlashCommandArguments | MessageCommandArguments | ContextCommandArguments<'user' | 'message'> | null,
	cmd?: XernerxContextCommand | XernerxMessageCommand | XernerxSlashCommand,
	type?: 'pre' | 'check' | 'post'
) {
	const client = event.client as XernerxClient;

	const inhibits = [];

	for (const [name, inhibitor] of client.inhibitors) {
		if (type == 'pre')
			if (Boolean(await inhibitor.pre(event, (await inhibitorArguments(event, cmd || null, inhibitor.type)) as never))) {
				inhibits.push(name);
			}

		if (type == 'check')
			if (Boolean(await inhibitor.check(event, args || null, (await inhibitorArguments(event, cmd || null, inhibitor.type)) as never))) {
				inhibits.push(name);
			}

		if (type == 'post')
			if (Boolean(await inhibitor.post(event, args || null, (await inhibitorArguments(event, cmd || null, inhibitor.type)) as never))) {
				inhibits.push(name);
			}
	}

	return !!inhibits.length;
}

export function inhibitorArguments(
	event: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
	cmd: XernerxContextCommand | XernerxMessageCommand | XernerxSlashCommand | null,
	type: InhibitorType
) {
	switch (type) {
		case 'channel':
			return event.channel || null;
		case 'command':
			return cmd || null;
		case 'contextCommand':
			return cmd || null;
		case 'guild':
			return event.guild || null;
		case 'interaction':
			return null;
		case 'member':
			return event.member || null;
		case 'message':
			return null;
		case 'messageCommand':
			return cmd || null;
		case 'slashCommand':
			return cmd || null;
		case 'user':
			return event.user || null;
	}
}
