const fs = require('fs');
const Discord = require('discord.js');

/**
 * @param {object} client - Client object.
 */
class EventHandler {
    constructor({ client: client }) {
        this.client = client;

        client.events = new Discord.Collection()
    }

    loadAllEvents(path, logging) {
        const eventFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'))

        for (const file of eventFiles) {
            let event = require(`${require("path").resolve(path)}/${file}`);

            event = new event;

            event.client = this.client;

            this.client.events.set(event.name, event);

            if (event.once) {
                this.emitter(event.type).once(event.name, (...args) => {
                    event.run(...args)
                })
            }
            else {
                this.emitter(event.type).on(event.name, (...args) => {
                    event.run(...args)
                })
            }
        }

        const builderFiles = fs.readdirSync(`${__dirname}/../events`).filter(file => file.endsWith('.js'))

        for (const file of builderFiles) {
            let event = require(`../events/${file}`);

            event = new event;

            if (event.once) {
                this.emitter(event.type).once(event.name, (...args) => {
                    event.run(...args)
                })
            }
            else {
                this.emitter(event.type).on(event.name, (...args) => {
                    event.run(...args)
                })
            }
        }
    }

    emitter(type) {
        const client = this.client;

        if (type == 'client') return client;
        if (type == 'rest') return client.rest;
        else return eval(type);
    }
}

module.exports = { EventHandler };