import XernerxClient, { XernerxContextCommand, XernerxMessageCommand, XernerxSlashCommand } from '../main.js';
import { XernerxMessage, XernerxMessageContextInteraction, XernerxSlashInteraction, XernerxUserContextInteraction } from '../types/extenders.js';
import { InhibitorType, XernerxInteraction } from '../types/types.js';

export async function inhibitorValidation(
    event: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
    cmd?: XernerxContextCommand | XernerxMessageCommand | XernerxSlashCommand
) {
    const client = event.client as XernerxClient;

    const inhibits = [];

    for (const [name, inhibitor] of client.inhibitors) {
        if (Boolean(await inhibitor.check(event, (await inhibitorArguments(event, cmd || null, inhibitor.type)) as never))) {
            inhibits.push(name);
        }
    }

    return !!inhibits.length;
}

export function inhibitorArguments(
    event: XernerxMessage | XernerxInteraction<XernerxSlashInteraction | XernerxUserContextInteraction | XernerxMessageContextInteraction>,
    cmd: XernerxContextCommand | XernerxMessageCommand | XernerxSlashCommand | null,
    type: InhibitorType
) {
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
