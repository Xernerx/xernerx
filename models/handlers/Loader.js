const fs = require('fs');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes, GatewayVersion } = require('discord-api-types/v10');
const { logStyle } = require('dumfunctions');

class Loader {
    constructor(client) {
        this.client = client;

        this.commands = [];

        client.commands = {
            message: new Discord.Collection(),

            interaction: new Discord.Collection(),

            contextMenu: new Discord.Collection()
        }
    }

    loadAllInteractionCommands(path, logging = false) {
        const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            let filepath = `${require("path").resolve(path)}/${file}`

            let command = require(filepath);

            command = new command;

            command.filepath = filepath;

            this.commands.push(command.data.toJSON());

            this.client.commands.interaction.set(command.data.name, command);
        }

        this.#deployCommands("interaction commands", logging);
    }

    reloadAllInteractionCommands() {
        let commands = this.client.commands.interaction.map(command => command.filepath);

        this.commands = [];

        this.client.commands.interaction.sweep(() => true);

        commands.map(path => {
            delete require.cache[require.resolve(path)];

            let command = require(path);

            command = new command;

            command.filepath = path;

            this.commands.push(command.data.toJSON());

            this.client.commands.interaction.set(command.data.name, command);
        })

        return this.#redeployCommands()
    }

    loadAllContextMenuCommands(path, logging = false) {
        const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            let filepath = `${require("path").resolve(path)}/${file}`

            let command = require(filepath);

            command = new command;

            command.filepath = filepath;

            this.commands.push(command.data.toJSON());

            this.client.commands.contextMenu.set(command.data.name, command);
        }

        this.#deployCommands("context menu commands", logging);
    }

    reloadAllContextMenuCommands() {
        let commands = this.client.commands.contextMenu.map(command => command.filepath);

        this.commands = [];

        this.client.commands.contextMenu.sweep(() => true);

        commands.map(path => {
            delete require.cache[require.resolve(path)];

            let command = require(path);

            command = new command;

            command.filepath = path;

            this.commands.push(command.data.toJSON());

            this.client.commands.contextMenu.set(command.data.name, command);
        })

        return this.#redeployCommands()
    }

    loadAllMessageCommands(path, logging = false) {
        const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            let filepath = `${require("path").resolve(path)}/${file}`

            let command = require(filepath);

            command = new command;

            command.filepath = filepath;

            command.aliases.forEach((alias) => {
                if (this.client.commands.message.has(alias)) throw new Error('Cannot have duplicated aliases.');

                this.client.commands.message.set(alias, command);
            });
        }
    }

    reloadAllMessageCommands() {
        let commands = this.client.commands.message.map(command => command.filepath);

        this.commands = [];

        this.client.commands.message.sweep(() => true);

        commands.map(path => {
            delete require.cache[require.resolve(path)];

            let command = require(path);

            command = new command;

            command.filepath = path;

            this.client.commands.message.set(command.id, command);
        })

        return this.#redeployCommands()
    }

    #deployCommands(type, logging = false) {
        this.client.once('ready', client => {
            const rest = new REST({ version: GatewayVersion }).setToken(client.token);

            (async () => {
                if (type === "interaction commands" && client.settings.logging) console.log(logStyle(`${client.user.tag} is online in ${(await client.guilds.fetch()).size} servers.`, "text", "cyan"));

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
            })();
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
}

module.exports = Loader;