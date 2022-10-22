import { Interaction, Message } from "discord.js";

export class CommandArguments {
	action: any;

	constructor(action: Message | Interaction) {
		this.action = action;
	}

	group() {
		return this.action?.options?._group;
	}

	subcommand() {
		return this.action?.options?._subcommand;
	}

	arguments() {
		const options: Record<string, object> = {};

		if (this.action?.options?._hoistedOptions) {
			for (const option of this.action.options._hoistedOptions) {
				options[option.name] =
					option.channel || option.user || option.role || option.value;
			}
		}

		return options;
	}
}

export async function messageArgs(message: any, command: any) {
	let args: Record<string, object | boolean> | any = { flags: {} },
		separator = command.separator || " ",
		i = 0;

	if (!command.args) return;

	command.args
		.filter((c: { type: string }) => c.type == "flag")
		.map((flag: { content: string; name: string }) => {
			for (const flg of message.content.matchAll(flag.content)) {
				if (flag.content == flg) {
					message.content = message.content.replace(flag.content, "");

					args.flags[flag.name] = true;
				}
			}

			if (!args.flags[flag.name]) args.flags[flag.name] = false;
		});

	for (const argument of command.args) {
		let content = message.content
			.split(/ +/)
			.slice(1)
			.join(separator)
			.replace(new RegExp(`${separator}${separator}+`, "g"), separator)
			.split(separator)
			.slice(i);

		if (content.join(separator) != "" && argument.type !== "flag") {
			if (argument?.content?.includes(content[0])) {
				args[argument.name] = content[0];
			} else if (argument.type == "string") {
				args[argument.name] = content[0];
			} else if (argument.type == "number") {
				args[argument.name] = parseInt(content[0]);
			} else if (argument.type == "boolean") {
				if (
					content[0]?.toLowerCase() != "true" &&
					content[0]?.toLowerCase() != "false"
				)
					content[0] = undefined;

				args[argument.name] = content[0];
			} else if (argument.type == "user") {
				let user = message.client.users.cache.find((u: { username: string }) =>
					u?.username?.toLowerCase()?.includes(content[0])
				);

				try {
					user = await message.client.users.fetch(
						user?.id || content[0].replace(/<@!?|>/g, "")
					);
				} catch (e) {
					user = new Error("Invalid user snowflake ID");
				}

				args[argument.name] = user;
			} else if (argument.type == "role") {
				let role = message.guild.roles.cache.find((r: { name: string }) =>
					r?.name?.toLowerCase()?.includes(content[0])
				);

				try {
					role = await message.guild.roles.fetch(
						role?.id || content[0].replace(/<@&?|>/g, "")
					);
				} catch (e) {
					role = new Error("Invalid role snowflake ID");
				}

				args[argument.name] = role;
			} else if (argument.type == "member") {
				let member = message.guild.members.cache.find(
					(m: { user: { username: string }; nickname: string }) =>
						m?.nickname?.toLowerCase()?.includes(content[0]) ||
						m?.user?.username?.toLowerCase()?.includes(content[0])
				);

				try {
					member = await message.guild.members.fetch(
						member?.id || content[0].replace(/<@!?|>/g, "")
					);
				} catch (e) {
					member = new Error("Invalid member snowflake ID");
				}

				args[argument.name] = member;
			} else if (argument.type == "channel") {
				let channel = message.guild.channels.cache.find((c: { name: string }) =>
					c?.name?.toLowerCase()?.includes(content[0])
				);

				try {
					channel = await message.client.channels.fetch(
						channel?.id || content[0].replace(/<#|>/g, "")
					);
				} catch (e) {
					channel = new Error("Invalid channel snowflake ID");
				}

				args[argument.name] = channel;
			} else if (argument.type == "rest") {
				args[argument.name] = content.join(separator);
				break;
			} else if (argument.prompt) {
				if (argument.prompt.reply) return message.reply(argument.prompt.reply);
				else if (argument.prompt.send)
					return message.channel.send(argument.prompt.send);
			} else
				args[argument.name] =
					typeof argument.default == "function"
						? argument.default(message)
						: argument.default;

			i++;
		} else
			args[argument.name] =
				typeof argument.default == "function"
					? argument.default(message)
					: argument.default;
	}

	return args;
}
