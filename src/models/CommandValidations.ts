import { CommandType } from "../main.js";

export default function commandValidation(
	action: any,
	command: any,
	client: any,
	res: boolean = false
) {
	res = inCooldown(action.user || action.author, client, command, action);

	if (res === true) return res;

	if (
		command.owner &&
		!client.util.isOwner((action.user || action.author).id)
	) {
		res = true;

		emit(client, action, "Not an owner", client.settings.ownerId);
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
