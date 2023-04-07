import { MessagePayload } from 'discord.js';

export default async function sendWebhook(url: URL, body: MessagePayload) {
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
