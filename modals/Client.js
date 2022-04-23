const Discord = require('discord.js');
const { s } = require('@sapphire/shapeshift');

/**
 * @param {Array} ownerId - All Id's of the bot owners. 
 * @returns discord client ready to login.
 */
class Client extends Discord.Client {
    constructor(options = {}) {
        super(options)

        s.object({
            prefix: s.array(s.string).optional,
            ownerId: s.array(s.string).optional,
        }).parse(options)

        return this.client = new Discord.Client({ intents: [this.options.intents] })
    }
}

module.exports = { Client };