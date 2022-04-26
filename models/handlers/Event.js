const { EventHandler } = require('./EventHandler');
const { s } = require('@sapphire/shapeshift')
class Event {
    constructor(id, options = {}) {

        s.object({
            name: s.string,
            once: s.boolean.optional
        }).parse(options)

        this.name = options.name;

        this.once = options.once || false;
    }

    run(event) {

    }
}

module.exports = { Event };