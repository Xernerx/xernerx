const fs = require('fs');

class EventHandler {
    constructor({ client: client }) {
        this.client = client;
    }

    loadEvents(path) {
        const eventFiles = fs.readdirSync(`.${path}`).filter(file => file.endsWith('.js'))

        for (const file of eventFiles) {
            let event = require(`../../.${path}/${file}`)
            if (event.once) {
                this.client.once(event.name, (...args) => {
                    event.execute(...args)
                })
            }
            else {
                this.client.on(event.name, (...args) => {
                    event.execute(...args)
                })
            }
        }

        const builderFiles = fs.readdirSync(`../package/models/events`).filter(file => file.endsWith('.js'))

        for (const file of builderFiles) {
            let event = require(`../events/${file}`)
            if (event.once) {
                this.client.once(event.name, (...args) => {
                    event.execute(...args)
                })
            }
            else {
                this.client.on(event.name, (...args) => {
                    event.execute(...args)
                })
            }
        }
    }
}

module.exports = { EventHandler };