/** @format */

import { Emoji, Role } from 'discord.js';

import { XernerxGuildChannel, XernerxMember, XernerxUser } from '../types/extenders.js';

export default class XernerxText {
	public user(user: string | XernerxUser) {
		if (typeof user == 'object') user = user.id;
		return `<@${user}>`;
	}

	public channel(channel: string | XernerxGuildChannel) {
		if (typeof channel == 'object') channel = channel.id;
		return `<#${channel}>`;
	}

	public role(role: string | Role) {
		if (typeof role == 'object') role = role.id;
		return `<@&${role}>`;
	}

	public emoji(emoji: string | Emoji, animated: boolean = false) {
		if (typeof emoji == 'object') (emoji as unknown) = emoji.id;
		return `<${animated ? 'a' : ''}:${emoji}>`;
	}

	public member(member: string | XernerxMember) {
		if (typeof member == 'object') member = member.id;
		return `<@!${member}>`;
	}

	public timestamp(timestamp: number | Date = Date.now(), format: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R' = 'R') {
		if (typeof timestamp == 'string') timestamp = Number(timestamp);
		if (isNaN(timestamp as number)) return 'Invalid Date';
		return `<t:${timestamp}:${format}>`;
	}

	public codeBlock(code: string, language: string) {
		return `\`\`\`${language}
    ${code}
    \`\`\``;
	}

	public iCodeBlock(code: string) {
		return `\`${code}\``;
	}

	public bold(text: string) {
		return `**${text}**`;
	}

	public italic(text: string) {
		return `*${text}*`;
	}

	public underline(text: string) {
		return `__${text}__`;
	}

	public strike(text: string) {
		return `~~${text}~~`;
	}

	public spoiler(text: string) {
		return `||${text}||`;
	}

	public quote(text: string) {
		return `> ${text}`;
	}

	public blockQuote(text: string) {
		return `>>> ${text}`;
	}

	public hyperlink(text: string, url: string) {
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

	public Progressbar(min: number, max: number, cur: number, options: ProgressBarOptions = {}) {
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

interface ProgressBarOptions {
	fill?: string;
	fade?: string;
	empty?: string;
	percentage?: boolean;
	length?: number;
}
