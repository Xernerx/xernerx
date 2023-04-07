import XernerxClient, { ContextCommandBuilder, MessageCommandBuilder, SlashCommandBuilder } from '../main.js';
import { XernerxMessage } from '../types/extenders.js';
import { InhibitorType, XernerxInteraction } from '../types/types.js';

export async function inhibitorValidation(event: XernerxMessage | XernerxInteraction, cmd?: ContextCommandBuilder | MessageCommandBuilder | SlashCommandBuilder) {
    const client = event.client as XernerxClient;

    const inhibits = [];

    for (const [name, inhibitor] of client.inhibitors) {
        if (Boolean(await inhibitor.check(event, await inhibitorArguments(event, cmd || null, inhibitor.type)))) {
            inhibits.push(name);
        }
    }

    return !!inhibits.length;
}

export function inhibitorArguments(event: XernerxMessage | XernerxInteraction, cmd: ContextCommandBuilder | MessageCommandBuilder | SlashCommandBuilder | null, type: InhibitorType) {
    switch (type) {
        case 'channel':
            return event.channel || null;
        case 'command':
            return cmd;
        case 'contextCommand':
            return cmd;
        case 'guild':
            return event.guild || null;
        case 'interaction':
            return null;
        case 'member':
            return event.member || null;
        case 'message':
            return null;
        case 'messageCommand':
            return cmd;
        case 'slashCommand':
            return cmd;
        case 'user':
            return event.user;
    }
}
