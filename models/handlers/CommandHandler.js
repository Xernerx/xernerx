const fs = require('fs');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes, GatewayVersion } = require('discord-api-types/v10');
const { delay, logStyle } = require('dumfunctions')
const paths = require("path");
const Loader = require('./Loader.js');

/**
 * @param {object} client - The client.
 * @returns a command handler.
 */
class CommandHandler {
    constructor({ client: client }) {

        this.client = client;

        this.commands = [];

        client.commands = {
            message: new Discord.Collection(),

            interaction: new Discord.Collection(),

            contextMenu: new Discord.Collection()
        }

        this.load = new Loader(client);
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