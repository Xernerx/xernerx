import { GuildMember, Role, User } from 'discord.js';
import MessageCommandBuilder from '../build/MessageCommandBuilder.js';

import { XernerxInteraction, XernerxMessage } from '../types/types.js';

export class InteractionArguments {
	interaction: XernerxInteraction;

	constructor(interaction: XernerxInteraction) {
		this.interaction = interaction;
	}

	public group() {
		return this.interaction?.options?._group;
	}

	public subcommand() {
		return this.interaction?.options?._subcommand;
	}

	public arguments() {
		const options: Record<string, object> = {};

		if (this.interaction?.options?._hoistedOptions) {
			for (const option of this.interaction.options._hoistedOptions) {
				options[option.name] = option.channel || option.user || option.role || option.value;
			}
		}

		return options;
	}
}

interface Flag {
	flags: Record<string, string | boolean>;
}

interface Argument {
	[index: string]: string | number | null;
}

export async function messageArguments(message: XernerxMessage, command: MessageCommandBuilder) {
	let args: string | Flag | Argument = { flags: {} },
		separator = command.separator || ' ',
		i = 0;

	if (!command.args) return;

	command.args
		.filter((c) => c.type == 'flag')
		.map((flag) => {
			args = args as Flag;

			for (const flg of message.content.matchAll(flag.match as unknown as RegExp)) {
				if ((flag.match as unknown as RegExpMatchArray) == flg) {
					message.content = message.content.replace(flag.match as string, '');

					args.flags[flag.name] = true;
				}
			}

			if (!args.flags[flag.name]) args.flags[flag.name] = false;
		});

	for (const argument of command.args) {
		args = args as Argument;

		let content: Array<string | number | null> = message.content
			.split(/ +/)
			.slice(1)
			.join(separator)
			.replace(new RegExp(`${separator}${separator}+`, 'g'), separator)
			.split(separator)
			.slice(i);

		if (content.join(separator) != '' && argument.type !== 'flag') {
			if (argument?.content?.includes(content[0] as string)) {
				args[argument.name] = content[0];
			} else if (argument.type == 'string') {
				args[argument.name] = content[0];
			} else if (argument.type == 'number') {
				args[argument.name] = parseInt(content[0] as string);
			} else if (argument.type == 'boolean') {
				if ((content[0] as string)?.toLowerCase() != 'true' && (content[0] as string)?.toLowerCase() != 'false')
					content[0] = null;

				args[argument.name] = content[0];
			} else if (argument.type == 'user') {
				let user: User | null =
					message.client.users.cache.find((u) => u?.username?.toLowerCase()?.includes(content[0] as string)) || null;

				try {
					user = (await message.client.users.fetch(user?.id || (content[0] as string).replace(/<@!?|>/g, ''))) || null;
				} catch (e) {
					user = null;
				}

				(args as unknown as Record<string, User | null>)[argument.name] = user;
			} else if (argument.type == 'role') {
				let role: Role | null =
					message.guild?.roles.cache.find((r) => r?.name?.toLowerCase()?.includes(content[0] as string)) || null;

				try {
					role = (await message.guild?.roles.fetch(role?.id || (content[0] as string).replace(/<@&?|>/g, ''))) || null;
				} catch (e) {
					role = null;
				}

				(args as unknown as Record<string, Role | null>)[argument.name] = role;
			} else if (argument.type == 'member') {
				let member: GuildMember | null =
					message.guild?.members.cache.find(
						(m) =>
							m?.nickname?.toLowerCase()?.includes(content[0] as string) ||
							m?.user?.username?.toLowerCase()?.includes(content[0] as string)
					) || null;

				try {
					member =
						(await message.guild?.members.fetch(member?.id || (content[0] as string).replace(/<@!?|>/g, ''))) || null;
				} catch (e) {
					member = null;
				}

				(args as unknown as Record<string, GuildMember | null>)[argument.name] = member;
			} else if (argument.type == 'channel') {
				let channel: any = message.guild?.channels.cache.find((c: { name: string }) =>
					c?.name?.toLowerCase()?.includes(content[0] as string)
				);

				try {
					channel = await message.client.channels.fetch(channel?.id || (content[0] as string).replace(/<#|>/g, ''));
				} catch (e) {
					channel = null;
				}

				args[argument.name] = channel;
			} else if (argument.type == 'rest') {
				args[argument.name] = content.join(separator);
				break;
			} else if (argument.prompt) {
				if (argument.prompt.reply) return message.util?.reply(argument.prompt.reply);
				else if (argument.prompt.send) return message.channel.send(argument.prompt.send);
			} else args[argument.name] = typeof argument.default == 'function' ? argument.default(message) : argument.default;

			i++;
		} else args[argument.name] = typeof argument.default == 'function' ? argument.default(message) : argument.default;
	}

	return args;
}
