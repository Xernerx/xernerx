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

    loadInteractionCommands(path, logging = false) {
        let commands = [];

        const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            let command = require(`${require("path").resolve(path)}/${file}`);

            command = new command;

            this.commands.push(command.data.toJSON());

            commands.push(command.data.name);

            this.client.interactionCommands.set(command.data.name, command);
        }

        this.#deployCommands("interaction commands", logging);

        if (logging || this.client.logging) console.info(logStyle(`Loading interaction commands: ${commands.join(', ')}`, "text", "yellow"));
    }

    loadContextMenuCommands(path, logging = false) {
        let commands = [];

        const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            let command = require(`${require("path").resolve(path)}/${file}`);

            command = new command;

            this.commands.push(command.data.toJSON());

            commands.push(command.data.name);

            this.client.contextMenuCommands.set(command.data.name, command);
        }

        this.#deployCommands("context menu commands", logging);

        if (logging || this.client.logging) console.info(logStyle(`Loading context menu commands: ${commands.join(', ')}`, 'text', 'yellow'));
    }

    loadMessageCommands(path, logging = false) {
        let commands = [];

        const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            let command = require(`${require("path").resolve(path)}/${file}`);

            command = new command;

            command.aliases.forEach((alias) => {
                if (this.client.messageCommands.has(alias)) throw new Error('Cannot have duplicated aliases.');

                this.client.messageCommands.set(alias, command);
            });

            commands.push(command.name || command.id);
        }

        if (logging || this.client.logging) console.info(logStyle(`Loaded message commands: ${commands.join(', ')}`, 'text', 'purple'));
    }

    #deployCommands(type, logging = false) {
        this.client.once('ready', client => {
            const rest = new REST({ version: GatewayVersion }).setToken(client.token);

            (async () => {
                try {
                    if (client.global == true) {
                        if (logging || this.client.logging) console.info(logStyle(`Loaded ${type} in ${(await client.guilds.fetch()).size} server(s) globally.`, 'text', 'purple'));
                        rest.put(Routes.applicationCommands(client.user.id), {
                            body: this.commands
                        })
                    }
                    else {
                        if (logging || this.client.logging) console.info(logStyle(`Loaded ${type} locally.`, 'text', 'purple'));
                        rest.put(Routes.applicationGuildCommands(client.user.id, client.guildId), {
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