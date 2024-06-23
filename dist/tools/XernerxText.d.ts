/** @format */
import { Emoji, Role } from 'discord.js';
import { XernerxGuildChannel, XernerxMember, XernerxUser } from '../types/extenders.js';
export default class XernerxText {
	user(user: string | XernerxUser): string;
	channel(channel: string | XernerxGuildChannel): string;
	role(role: string | Role): string;
	emoji(emoji: string | Emoji, animated?: boolean): string;
	member(member: string | XernerxMember): string;
	command(id: string, name: string): string | null;
	timestamp(timestamp?: number | Date, format?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R'): string;
	codeBlock(code: string, language: string): string;
	iCodeBlock(code: string): string;
	bold(text: string): string;
	italic(text: string): string;
	underline(text: string): string;
	strike(text: string): string;
	spoiler(text: string): string;
	quote(text: string): string;
	blockQuote(text: string): string;
	hyperlink(text: string, url: string): string;
	Progressbar(min: number, max: number, cur: number, options?: ProgressBarOptions): string;
}
interface ProgressBarOptions {
	fill?: string;
	fade?: string;
	empty?: string;
	percentage?: boolean;
	length?: number;
}
export {};
