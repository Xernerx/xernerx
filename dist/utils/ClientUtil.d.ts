/** @format */
import { Collection } from 'discord.js';
import XernerxClient from '../client/XernerxClient.js';
import { PresenceOptions, ResolveCommandOptions } from '../types/interfaces.js';
import Util from './Util.js';
import XernerxContextCommand from '../build/XernerxContextCommand.js';
import XernerxMessageCommand from '../build/XernerxMessageCommand.js';
import XernerxSlashCommand from '../build/XernerxSlashCommand.js';
export default class ClientUtil extends Util {
	hasVoted: Function;
	constructor(client: XernerxClient);
	setPresence(options: PresenceOptions): import('discord.js').ClientPresence | undefined;
	private resolveCooldown;
	resolveCommand(
		options: ResolveCommandOptions
	): Promise<XernerxSlashCommand | XernerxContextCommand | XernerxMessageCommand | Collection<string, XernerxSlashCommand | XernerxContextCommand | XernerxMessageCommand>>;
	resolveChannel(query: string | Record<string, string>): Promise<import('discord.js').Channel | null>;
	resolveGuild(query: string | Record<string, string>): Promise<import('discord.js').Guild | null>;
	uptime(timestamp?: number | null): string;
	commands(): (XernerxSlashCommand | XernerxContextCommand | XernerxMessageCommand)[];
	commandsList(): Collection<string, object>;
}
