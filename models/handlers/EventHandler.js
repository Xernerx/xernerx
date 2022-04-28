const fs = require('fs');

class EventHandler {
    constructor({ client: client }) {
        this.client = client;
    }

    loadEvents(path) {
        const eventFiles = fs.readdirSync(`.${path}`).filter(file => file.endsWith('.js'))

        for (const file of eventFiles) {
            let event = require(`../../../${path}/${file}`)
            event = new event
            event.client = this.client;
            if (event.once) {
                this.client.once(event.name, (...args) => {
                    event.run(...args)
                })
            }
            else {
                this.client.on(event.name, (...args) => {
                    event.run(...args)
                })
            }
        }
        // "./node_modules/xernerx/models/events"
        const builderFiles = fs.readdirSync(`../xernerx/models/events`).filter(file => file.endsWith('.js'))

        for (const file of builderFiles) {
            let event = require(`../events/${file}`);
            event = new event;
            if (event.once) {
                this.client.once(event.name, (...args) => {
                    event.run(...args)
                })
            }
            else {
                this.client.on(event.name, (...args) => {
                    event.run(...args)
                })
            }
        }
    }
}

module.exports = { EventHandler };