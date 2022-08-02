const fs = require('fs');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes, GatewayVersion } = require('discord-api-types/v10');
const { delay, logStyle } = require('dumfunctions')
const paths = require("path")

/**
 * @param {object} client - The client.
 * @returns a command handler.
 */
class CommandHandler {
    constructor({ client: client }) {

        this.client = client;

        this.commands = [];

        client.messageCommands = new Discord.Collection();

        client.interactionCommands = new Discord.Collection();

        client.contextMenuCommands = new Discord.Collection();
    }

    loadAllInteractionCommands(path, logging = false) {
        let commands = [];

        const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            let filepath = `${require("path").resolve(path)}/${file}`

            let command = require(filepath);

            command = new command;

            command.filepath = filepath;

            this.commands.push(command.data.toJSON());

            commands.push(command.data.name);

            this.client.interactionCommands.set(command.data.name, command);
        }

        this.#deployCommands("interaction commands", logging);

        if (logging || this.client.settings.logging) console.info(logStyle(`Loading interaction commands: ${commands.join(', ')}`, "text", "yellow"));
    }

    loadAllContextMenuCommands(path, logging = false) {
        let commands = [];

        const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            let filepath = `${require("path").resolve(path)}/${file}`

            let command = require(filepath);

            command = new command;

            command.filepath = filepath;

            this.commands.push(command.data.toJSON());

            commands.push(command.data.name);

            this.client.contextMenuCommands.set(command.data.name, command);
        }

        this.#deployCommands("context menu commands", logging);

        if (logging || this.client.settings.logging) console.info(logStyle(`Loading context menu commands: ${commands.join(', ')}`, 'text', 'yellow'));
    }

    loadAllMessageCommands(path, logging = false) {
        let commands = [];

        const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            let filepath = `${require("path").resolve(path)}/${file}`

            let command = require(filepath);

            command = new command;

            command.filepath = filepath;

            command.aliases.forEach((alias) => {
                if (this.client.messageCommands.has(alias)) throw new Error('Cannot have duplicated aliases.');

                this.client.messageCommands.set(alias, command);
            });

            commands.push(command.name || command.id);
        }

        if (logging || this.client.settings.logging) console.info(logStyle(`Loaded message commands: ${commands.join(', ')}`, 'text', 'purple'));
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
}

module.exports = { CommandHandler };