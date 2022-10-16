import { CommandType } from "../types/Types.js";

export default function commandValidation(
	action: any,
	command: any,
	client: any,
	res: boolean = false
) {
	if (
		(command.ignoreOwner || client.settings.ignoreOwner) &&
		client.util.isOwner((action.user || action.author).id)
	)
		return res;
	else if (inCooldown(action.user || action.author, client, command, action))
		return true;
	else if (
		command.owner &&
		!client.util.isOwner((action.user || action.author).id)
	) {
		res = true;

		emit(client, action, "Not an owner", client.settings.ownerId);
	} else if (command.channelType?.length > 0 || command.channelType) {
		if (!Array.isArray(command.channelType))
			command.channelType = [command.channelType];

		if (!command.channelType.includes(action.channel.type)) {
			res = true;

			emit(client, action, "Not the correct channel", command.channelType);
		}
	} else if (
		command.channels.length > 0 &&
		!command.channels.includes(action.channel.id)
	) {
		res = true;

		emit(client, action, "Not a whitelisted channel", command.channels);
	} else if (
		command.guilds.length > 0 &&
		!command.guilds.includes(action.guild.id)
	) {
		res = true;

		emit(client, action, "Not a whitelisted guild", command.guilds);
	} else if (
		action?.guild &&
		(command.userPermissions || client.settings.userPermissions)
	) {
		const permissions =
				command.userPermissions ||
				client.settings.userPermissions.push(
					...handlerPermissions(client, command.commandType, "user")
				),
			missing: bigint[] = [];

		permissions.map((permission: bigint) => {
			if (!action.member.permissions.has(permission)) {
				missing.push(permission);
			}
		});

		if (missing.length > 0) {
			res = true;

			emit(client, action, "Missing User Permissions", missing);
		}
	} else if (
		action?.guild &&
		(command.clientPermissions || client.settings.clientPermissions)
	) {
		const permissions =
				command.clientPermissions ||
				client.settings.clientPermissions.push(
					...handlerPermissions(client, command.commandType, "client")
				),
			missing: bigint[] = [];

		permissions.map((permission: bigint) => {
			if (!action.member.permissions.has(permission)) {
				missing.push(permission);
			}
		});

		if (missing.length > 0) {
			res = true;

			emit(client, action, "Missing Client Permissions", missing);
		}
	}

	return res;
}

function emit(client: any, action: any, reason: any, extra: any) {
	return client.emit("commandBlock", action, reason, extra);
}

function inCooldown(user: any, client: any, command: any, action: any) {
	let res = false,
		downs: any = {};

	const {
		cooldowns,
		messageCommands,
		slashCommands,
		contextCommands,
		commands,
	} = client.cache;

	if (
		command.commandType === CommandType.MessageCommand &&
		client.handlerOptions.message.cooldown
	) {
		if (messageCommands.has(user.id)) {
			const usr = messageCommands.get(user.id);

			usr.timeRemaining = usr.endsAt - Date.now();

			downs.message = usr;

			res = true;
		}

		if (!messageCommands.has(user.id)) {
			messageCommands.set(
				user.id,
				toCooldown(
					action,
					command,
					client.handlerOptions.message.cooldown,
					user.id
				)
			);

			setInterval(() => {
				messageCommands.delete(user.id);
			}, client.handlerOptions.message.cooldown);
		}
	}

	if (
		command.commandType === CommandType.SlashCommand &&
		client.handlerOptions.slash.cooldown
	) {
		if (slashCommands.has(user.id)) {
			const usr = slashCommands.get(user.id);

			usr.timeRemaining = usr.endsAt - Date.now();

			downs.slash = usr;

			res = true;
		}

		if (!slashCommands.has(user.id)) {
			slashCommands.set(
				user.id,
				toCooldown(
					action,
					command,
					client.handlerOptions.slash.cooldown,
					user.id
				)
			);

			setInterval(() => {
				slashCommands.delete(user.id);
			}, client.handlerOptions.slash.cooldown);
		}
	}

	if (
		command.commandType === CommandType.ContextCommand &&
		client.handlerOptions.context.cooldown
	) {
		if (contextCommands.has(user.id)) {
			const usr = contextCommands.get(user.id);

			usr.timeRemaining = usr.endsAt - Date.now();

			downs.context = usr;

			res = true;
		}

		if (!contextCommands.has(user.id)) {
			contextCommands.set(
				user.id,
				toCooldown(
					action,
					command,
					client.handlerOptions.context.cooldown,
					user.id
				)
			);

			setInterval(() => {
				contextCommands.delete(user.id);
			}, client.handlerOptions.context.cooldown);
		}
	}

	if (client.settings.cooldown.default) {
		if (cooldowns.has(user.id)) {
			const usr = cooldowns.get(user.id);

			usr.timeRemaining = usr.endsAt - Date.now();

			downs.default = usr;

			res = true;
		}

		if (!cooldowns.has(user.id)) {
			cooldowns.set(
				user.id,
				toCooldown(action, command, client.settings.cooldown.default, user.id)
			);

			setInterval(() => {
				cooldowns.delete(user.id);
			}, client.settings.cooldown.default);
		}
	}

	if (command.cooldown) {
		const name =
			user.id +
			"-" +
			(command.data?.name || command?.name) +
			"-" +
			command.commandType;

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

	if (Object.keys(downs).length > 0)
		client.emit("commandCooldown", action, command, downs);

	return res;
}

function toCooldown(action: any, command: any, cooldown: number, name: string) {
	return {
		name,
		id: (action.user || action.author).id,
		tag: (action.user || action.author).tag,
		commandType: command.commandType,
		commandName: command?.data?.name || command?.name,
		guildId: action?.guild?.id,
		channelId: action?.channel?.id,
		startsAt: Number(Date.now()),
		endsAt: Number(Date.now()) + cooldown,
	};
}

function handlerPermissions(
	client: any,
	commandType: CommandType,
	type: string
) {
	if (commandType === CommandType.MessageCommand) {
		if (type === "user") return client.handlerOptions.message.userPermissions;
		if (type === "client")
			return client.handlerOptions.message.clientPermissions;
	}
	if (commandType === CommandType.SlashCommand) {
		if (type === "user") return client.handlerOptions.slash.userPermissions;
		if (type === "client") return client.handlerOptions.slash.clientPermissions;
	}
	if (commandType === CommandType.ContextCommand) {
		if (type === "user") return client.handlerOptions.context.userPermissions;
		if (type === "client")
			return client.handlerOptions.context.clientPermissions;
	}
}
