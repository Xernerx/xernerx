const { Collection } = require('discord.js');
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

            if (event.process) {
                process.on(event.name, (...args) => {
                    event.run(...args);
                })
            }

            else if (event.once) {
                this.client.once(event.name, (...args) => {
                    event.run(...args);
                })
            }

            else {
                this.client.on(event.name, (...args) => {
                    event.run(...args)
                })
            }
        }

        if (logging || this.client.logging) console.info(logStyle(`Loaded events: ${events.join(', ')}`, 'text', 'purple'));

        const builderFiles = fs.readdirSync(`${__dirname}/../events`).filter(file => file.endsWith('.js'))

        for (const file of builderFiles) {
            let event = require(`../events/${file}`);

            event = new event;

            event.messages = new Collection();

            if (event.process) {
                process.on(event.name, (...args) => {
                    event.run(...args);
                })
            }

            else if (event.once) {
                this.client.once(event.name, (...args) => {
                    event.run(...args);
                })
            }

            else {
                this.client.on(event.name, (...args) => {
                    event.run(...args);
                })
            }
        }
    }
}

module.exports = { EventHandler };