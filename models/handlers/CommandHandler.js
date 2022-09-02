const Discord = require('discord.js');
const Handler = require('./Handler.js');

/**
 * @param {object} client - The client.
 * @returns a command handler.
 */
class CommandHandler {
    constructor({ client: client }) {

        this.client = client;

        client.commands = {
            message: new Discord.Collection(),

            interaction: new Discord.Collection(),

            contextMenu: new Discord.Collection()
        }

        this.load = new Handler(client);
    }

    loadAllInteractionCommands(path, logging = false) {
        this.load.loadAllInteractionCommands(path, logging);
    }

    loadAllContextMenuCommands(path, logging = false) {
        this.load.loadAllContextMenuCommands(path, logging);
    }

    loadAllMessageCommands(path, logging = false) {
        this.load.loadAllMessageCommands(path, logging);
    }
}

module.exports = { CommandHandler };