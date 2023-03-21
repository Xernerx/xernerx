import { ChannelType, ContextCommandBuilder, MessageCommandBuilder, PermissionFlags, PermissionFlagsBits, PermissionsString, SlashCommandBuilder } from '../main.js';
import { XernerxMessage } from '../types/extenders.js';
import { PermissionNames, XernerxInteraction } from '../types/types.js';

export default async function commandValidation(event: XernerxInteraction | XernerxMessage, command: MessageCommandBuilder | SlashCommandBuilder | ContextCommandBuilder) {
    if (command.permissions?.dm == false && event.channel?.type === ChannelType.DM) return await emit(event, "Can't use in a DM Channel");
    if (command.permissions?.user) {
        if (!(event.member?.permissions as Record<'has', Function>).has(toBigInt(command.permissions.user))) return await emit(event, 'Missing User Permissions');
    }

    return true;
}

async function emit(event: XernerxInteraction | XernerxMessage, reason: string) {
    return await event.client.emit('commandBlock', event, reason);
}

function toBigInt(permissions: Array<PermissionNames> | Array<string>) {
    let bigIntPermissions = 0n;

    permissions.map((permission: string | bigint) => {
        permission =
            PermissionFlagsBits[
                (permission as string)
                    .split(/ +/)
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join('') as PermissionsString
            ];

        if (typeof permission === 'bigint') bigIntPermissions += permission;
    });

    return bigIntPermissions;
}
