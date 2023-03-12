import { Embed } from 'discord.js';
export default function sendWebhook(url: URL, body: Body): Promise<any>;
type Body = {
    content: string;
    avatar_url?: URL;
    username?: string;
    embeds?: Array<Embed>;
};
export {};
