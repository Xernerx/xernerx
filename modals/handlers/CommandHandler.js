const fs = require('fs');
const { time, delay } = require('../funcs');
const Discord = require('discord.js');

/**
 * ! This is all still work in progress!
 */

class CommandHandler {
    constructor(client) {
        client.commands = new Discord.Collection()
    }

    load(client, type, path, logging, global) {
        // if (type == 'interaction' && global == false && (!client.options.guildId || !client.options.clientId)) throw new Error(`Expected guildId and clientId to be strings, got ${typeof client.guildId || typeof client.clientId} instead.`)
        if (type != 'interaction' && type != 'message') throw new Error(`Expected type to be interaction or message, got ${type} instead.`)
        if (type == 'interaction') {
            const interactionCommandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'))

            for (const file of interactionCommandFiles) {
                let command = require(`../../.${path}/${file}`)
                command.data.toJSON();
                client.commands.set(command.data.name, command)
            }

            if (logging == true) console.log(`${time(new Date())} | Loaded interaction commands: ${Array.from(interactionCommandFiles).join(', ') || 'No commands found'}.`.replace(/.js/g, ""))
        }

        if (type == 'message') {
            const messageCommandFiles = fs.readdirSync(`${path}`).filter(file => file.endsWith('.js'))

            for (const file of messageCommandFiles) {
                let command = require(`../../.${path}/${file}`)
                client.commands.set(command.name, command)
            }

            if (logging == true) console.log(`${time(new Date())} | Loaded message commands: ${messageCommandFiles ? Array.from(messageCommandFiles).join(', ') : 'No commands found'}.`.replace(/.js/g, ""));
        }
    }
}

module.exports = { CommandHandler };