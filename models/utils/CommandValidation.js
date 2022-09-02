const Discord = require('discord.js');
const { toPascalCase } = require('dumfunctions');

module.exports = new class CommandValidation {
    commandValidation(event, command, res = false) {
        function emit(reason, extra) {
            return event.client.emit('commandBlocked', event, reason, extra);
        }

        if ((command?.ignoreOwner || event?.client?.settings?.ignoreOwner) && event?.client?.settings?.ownerId?.includes((event.user || event.author).id)) return res;

        if (event.client.data.cooldowns[(event.user || event.author).id]) {
            res = true;
            return emit("command on cooldown", (event.client.data.cooldowns[(event.user || event.author).id] - (event.editedTimestamp || event.createdTimestamp)));
        }

        if (!event.client.data.cooldowns[(event.user || event.author).id]) {
            event.client.data.cooldowns[(event.user || event.author).id] = ((event.editedTimestamp || event.createdTimestamp) + (command.cooldown || event.client.settings.defaultCooldown || 0));

            setTimeout(() => {
                delete event.client.data.cooldowns[(event.user || event.author).id]
            }, command.cooldown || event?.client?.settings?.defaultCooldown || 0);
        }

        if (command?.owner && event?.client?.settings?.ownerId != undefined && !event?.client?.settings?.ownerId?.includes((event.user || event.author).id)) {
            res = true;
            return emit("missing ownership", event?.client?.settings?.ownerId)
        }

        if (command?.admin && event?.member?.permissions?.has(Discord.PermissionFlagsBits.Administrator) == false) {
            res = true;
            return emit("missing admin permission", "Administrator")
        }

        if (command?.channel == "guild" && event?.channel?.type != Discord.ChannelType.GuildText) {
            res = true
            return emit("not a guild channel");
        }

        if (command?.channel == "dm" && event?.type != null) {
            res = true;
            return emit("not a dm channel");
        }

        if (command?.inVoice && !event?.member?.voice?.channelId) {
            res = true;
            return emit("not a in a voice channel");
        }

        if (event?.guild && command?.userPermissions?.length >= 1 || event?.client?.settings?.userPermissions?.length >= 1) {
            let missingPerms = [];

            for (const permission of command.userPermissions) {
                if (!event?.member?.permissions?.has(Discord.PermissionFlagsBits[toPascalCase(permission)])) missingPerms.push(toPascalCase(permission));
            }

            for (const permission of event?.client?.settings?.userPermissions) {
                if (!event?.member?.permissions?.has(Discord.PermissionFlagsBits[toPascalCase(permission)])) missingPerms.push(toPascalCase(permission));
            }

            if (missingPerms.length >= 1) {
                res = true;
                return emit("missing user permissions", missingPerms);
            }
        }

        if (event?.guild && command?.clientPermissions.length >= 1 || event.client.settings.clientPermissions.length >= 1) {
            let missingPerms = [];

            for (const permission of command?.clientPermissions) {
                if (!event?.guild?.members?.me?.permissions?.has(Discord.PermissionFlagsBits[toPascalCase(permission)])) missingPerms.push(toPascalCase(permission));
            }

            for (const permission of event?.client?.settings?.clientPermissions) {
                if (!event?.guild?.members?.me?.permissions?.has(Discord.PermissionFlagsBits[toPascalCase(permission)])) missingPerms.push(toPascalCase(permission));
            }

            if (missingPerms.length >= 1) {
                res = true;
                return emit("missing client permissions", missingPerms);
            }
        }

        if (command?.guilds?.length >= 1 && !command?.guilds?.includes(event.guild)) {
            res = true;
            return emit('not in a specified guild', command.guilds);
        }

        if (command?.channels?.length >= 1 && !command?.channels?.includes(event.channel.id)) {
            res = true;
            return emit('not in a specified channel', command.channels);
        }

        return res;
    }
}