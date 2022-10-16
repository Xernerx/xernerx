import { CommandType } from "../main.js";

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
	} else if (command.channelType !== action.channel.type) {
		res = true;

		emit(client, action, "Not the correct channel", command.channelType);
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
	const cooldown =
		command.cooldown ||
		handlerCooldown(client, command.commandType) ||
		client.settings?.cooldown?.default;

	if (client.cache.cooldowns.has(user.id)) {
		const { deleteAt } = client.cache.cooldowns.get(user.id);

		client.emit(
			"commandCooldown",
			action,
			command,
			user,
			deleteAt - Number(Date.now())
		);

		return true;
	} else {
		user.setAt = Number(Date.now());
		user.deleteAt = Number(Date.now() + cooldown);

		client.cache.cooldowns.set(user.id, user);

		setTimeout(() => {
			client.cache.cooldowns.delete(user.id);
		}, cooldown);

		return false;
	}
}

function handlerCooldown(client: any, type: CommandType) {
	if (type === CommandType.MessageCommand)
		return client.handlerOptions.message.commandCooldown;
	if (type === CommandType.ContextCommand)
		return client.handlerOptions.context.commandCooldown;
	if (type === CommandType.SlashCommand)
		return client.handlerOptions.slash.commandCooldown;
	else return 0;
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
