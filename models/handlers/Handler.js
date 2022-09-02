const fs = require('fs');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes, GatewayVersion } = require('discord-api-types/v10');
const { logStyle } = require('dumfunctions');
const { importCommands, reimportCommands } = require('../utils/CommandsUtil.js');
const { importInhibitors } = require('../utils/InhibitorsUtil.js');

module.exports = class Handler {
    constructor(client) {
        this.client = client;

        this.commands = [];
    }

    loadAllInteractionCommands(path, logging = false) {
        const files = this.#readdir(path);

        importCommands(this.client, path, files, this.commands, 'interaction');

        this.#deployCommands("interaction commands", logging);
    }

    reloadAllInteractionCommands() {
        reimportCommands(this.client, this.commands, "interaction");

        return this.#redeployCommands()
    }

    loadAllContextMenuCommands(path, logging = false) {
        const files = this.#readdir(path);

        importCommands(this.client, path, files, this.commands, 'contextMenu');

        this.#deployCommands("context menu commands", logging);
    }

    reloadAllContextMenuCommands() {
        reimportCommands(this.client, this.commands, "contextMenu");

        return this.#redeployCommands()
    }

    loadAllMessageCommands(path) {
        const files = this.#readdir(path);

        importCommands(this.client, path, files, this.commands, 'message');
    }

    reloadAllMessageCommands() {
        return reimportCommands(this.client, this.commands, "message");
    }

    loadAllInhibitors(path) {
        const files = this.#readdir(path);

        importInhibitors(this.client, path, files);
    }

    #deployCommands(type, logging = false) {
        this.client.once('ready', async client => {
            const rest = new REST({ version: GatewayVersion }).setToken(client.token);

            try {
                if (client.settings.global == true) {
                    if (logging || this.client.settings.logging) console.info(logStyle(`Loaded ${type} in ${(await client.guilds.fetch()).size} server(s) globally.`, 'text', 'purple'));
                    rest.put(Routes.applicationCommands(client.user.id), {
                        body: this.commands
                    })
                }
                else {
                    if (logging || this.client.settings.logging) console.info(logStyle(`Loaded ${type} locally.`, 'text', 'purple'));
                    rest.put(Routes.applicationGuildCommands(client.user.id, client.settings.guildId), {
                        body: this.commands
                    })
                }
            }
            catch (e) {
                throw new Error(e)
            }
        })
    }

    #redeployCommands() {
        const rest = new REST({ version: GatewayVersion }).setToken(this.client.token);

        (async () => {
            try {
                if (this.client.settings.global == true) {
                    rest.put(Routes.applicationCommands(this.client.user.id), {
                        body: this.commands
                    })
                }
                else {
                    rest.put(Routes.applicationGuildCommands(this.client.user.id, this.client.settings.guildId), {
                        body: this.commands
                    })
                }
            }
            catch (e) {
                throw new Error(e)
            }
        })();

        return this.commands;
    }

    #readdir(path) {
        return fs.readdirSync(path).filter(file => file.endsWith('.js'));
    }
}