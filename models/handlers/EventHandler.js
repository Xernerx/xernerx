const { logStyle } = require('dumfunctions');
const fs = require('fs');

/**
 * @param {object} client - Client object.
 */
class EventHandler {
    constructor({ client: client }) {
        this.client = client;
    }

    loadEvents(path, logging) {
        const eventFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'))

        let events = [];

        for (const file of eventFiles) {
            let event = require(`${require("path").resolve(path)}/${file}`);

            event = new event;

            event.client = this.client;

            events.push(event.name);

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

        if (logging || this.client.logging) console.info(logStyle(`Loaded events: ${events.join(', ')}`, 'text', 'purple'));

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
        if (type == 'client') return this.client;
        if (type == 'rest') return this.client.rest;
        else return eval(type)
    }
}

module.exports = { EventHandler };