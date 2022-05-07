const fs = require('fs');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { delay } = require('dumfunctions')
const paths = require("path")

/**
 * @param {object} client - The client.
 * @returns a commmandhandler.
 */
class CommandHandler {
    constructor({ client: client }) {

        this.client = client;

        this.commands = []

        client.messageCommands = new Discord.Collection()
        client.interactionCommands = new Discord.Collection()
    }

    loadInteractionCommands(path) {
        const commandFiles = fs.readdirSync(`.${path}`).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            // ! ../../../../
            let command = require(`../../../${path}/${file}`)
            command = new command;
            this.commands.push(command.data.toJSON());
            this.client.interactionCommands.set(command.data.name, command)
        }

        this.client.once('ready', client => {
            const rest = new REST({ version: '9' }).setToken(client.token);

            (async () => {
                await delay(1000)
                if (client.global == true) {
                    rest.put(Routes.applicationCommands(client.user.id), {
                        body: this.commands
                    })
                }
                else {
                    rest.put(Routes.applicationGuildCommands(client.user.id, client.guildId), {
                        body: this.commands
                    })
                }
            })();
        })
    }

    loadMessageCommands(path) {
        const commandFiles = fs.readdirSync(`.${path}`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            // ! ../../../../
            let command = require(`../../../${path}/${file}`);
            command = new command;
            command.aliases.forEach((alias) => {
                if (this.client.messageCommands.has(alias)) throw new Error('Cannot have duplicated aliases.');
                this.client.messageCommands.set(alias, command);
            });
        }
    }
}

module.exports = { CommandHandler };