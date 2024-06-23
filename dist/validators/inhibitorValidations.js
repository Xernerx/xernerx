/** @format */
export async function inhibitorValidation(event, args, cmd, type) {
	const client = event.client;
	const inhibits = [];
	for (const [name, inhibitor] of client.inhibitors) {
		if (type == 'pre')
			if (Boolean(await inhibitor.pre(event, await inhibitorArguments(event, cmd || null, inhibitor.type)))) {
				inhibits.push(name);
			}
		if (type == 'check')
			if (Boolean(await inhibitor.check(event, args || null, await inhibitorArguments(event, cmd || null, inhibitor.type)))) {
				inhibits.push(name);
			}
		if (type == 'post')
			if (Boolean(await inhibitor.post(event, args || null, await inhibitorArguments(event, cmd || null, inhibitor.type)))) {
				inhibits.push(name);
			}
	}
	return !!inhibits.length;
}
export function inhibitorArguments(event, cmd, type) {
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
