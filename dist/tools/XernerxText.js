/** @format */
export default class XernerxText {
	user(user) {
		if (typeof user == 'object') user = user.id;
		return `<@${user}>`;
	}
	channel(channel) {
		if (typeof channel == 'object') channel = channel.id;
		return `<#${channel}>`;
	}
	role(role) {
		if (typeof role == 'object') role = role.id;
		return `<@&${role}>`;
	}
	emoji(emoji, animated = false) {
		if (typeof emoji == 'object') emoji = emoji.id;
		return `<${animated ? 'a' : ''}:${emoji}>`;
	}
	member(member) {
		if (typeof member == 'object') member = member.id;
		return `<@!${member}>`;
	}
	command(id, name) {
		if (typeof id !== 'string') return null;
		return `</${name}:${id}>`;
	}
	timestamp(timestamp = Date.now(), format = 'R') {
		if (typeof timestamp == 'string') timestamp = Number(timestamp);
		if (isNaN(timestamp)) return 'Invalid Date';
		return `<t:${timestamp}:${format}>`;
	}
	codeBlock(code, language) {
		return `\`\`\`${language}
    ${code}
    \`\`\``;
	}
	iCodeBlock(code) {
		return `\`${code}\``;
	}
	bold(text) {
		return `**${text}**`;
	}
	italic(text) {
		return `*${text}*`;
	}
	underline(text) {
		return `__${text}__`;
	}
	strike(text) {
		return `~~${text}~~`;
	}
	spoiler(text) {
		return `||${text}||`;
	}
	quote(text) {
		return `> ${text}`;
	}
	blockQuote(text) {
		return `>>> ${text}`;
	}
	hyperlink(text, url) {
		return `[${text}](${url})`;
	}
	// public static HyperlinkWithTooltip(text: string, url: string, tooltip: string) {
	// 	return `[${text}](${url} "${tooltip}")`;
	// }
	// public static HyperlinkWithTooltipAndImage(text: string, url: string, tooltip: string, imageUrl: string) {
	// 	return `[${text}](${url} "${tooltip}":${imageUrl})`;
	// }
	// public static HyperlinkWithImage(text: string, url: string, imageUrl: string) {
	// 	return `[${text}](${url}:${imageUrl})`;
	// }
	Progressbar(min, max, cur, options = {}) {
		if (!options.fill) options.fill = '█';
		if (!options.fade) options.fade = '▓▒';
		if (!options.empty) options.empty = '░';
		const length = options.length || 20,
			percentage = cur / max,
			filledLength = Math.round(length * percentage),
			emptyLength = length - filledLength;
		if (!options.percentage) return '`' + options.fill.repeat(filledLength) + options.empty.repeat(emptyLength) + '`';
		else return '`' + options.fill.repeat(filledLength) + options.empty.repeat(emptyLength) + '` ' + `\`${percentage * 100}%\``;
	}
}
