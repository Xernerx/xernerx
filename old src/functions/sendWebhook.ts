import { Embed } from 'discord.js';

export default async function sendWebhook(url: URL, body: Body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (response.status === 204) return true;

    const data = await response.json();

    return data;
}

type Body = {
    content: string;
    avatar_url?: URL;
    username?: string;
    embeds?: Array<Embed>;
};
